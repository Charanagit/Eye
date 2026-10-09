from contextlib import asynccontextmanager
import cv2
import numpy as np
import uuid
import asyncio
from typing import Optional, Dict, Any
from pydantic import BaseModel
from fastapi import FastAPI, File, Form, HTTPException, UploadFile, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import inference
import models_manager
import trainer

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/bmp", "image/tiff"}
MAX_UPLOAD_BYTES = 25 * 1024 * 1024  # 25 MB
MAX_MODEL_UPLOAD_BYTES = 500 * 1024 * 1024  # 500 MB for .keras models


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        inference.load_models()
    except Exception as e:
        print(f"Startup warning loading models: {e}")
    yield


app = FastAPI(
    title="RetinaScreen Clinical Diagnostic & Admin Backend",
    description="Dual-stream deep learning CADx platform with real-time model management and training studio.",
    version="2.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== Health & Inference Endpoints ====================

@app.get("/health")
def health():
    return {
        "status": "ok",
        "models_loaded": len(inference._bengraham_models) + len(inference._colour_models),
        "bengraham_models_count": len(inference._bengraham_models),
        "colour_models_count": len(inference._colour_models),
        "bengraham_names": inference._loaded_bg_names,
        "colour_names": inference._loaded_col_names,
        "diseases": inference.DISEASES
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(400, f"Unsupported file format ({file.content_type}). Please upload a JPEG, PNG, or WebP image.")

    raw = await file.read()
    if len(raw) > MAX_UPLOAD_BYTES:
        raise HTTPException(400, "File too large (maximum allowable size is 25MB).")

    arr = np.frombuffer(raw, dtype=np.uint8)
    bgr = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if bgr is None:
        raise HTTPException(400, "Could not decode image file.")

    try:
        result = inference.predict_image(bgr)
        if not result.get("is_fundus", True):
            return JSONResponse(status_code=422, content=result)
    except Exception as e:
        raise HTTPException(500, f"Inference processing failed: {e}")

    return result


# ==================== Admin Models Management Endpoints ====================

@app.get("/api/admin/models")
def get_admin_models():
    """Returns directory inventories for bengraham_models/ and colour_models/."""
    try:
        inventory = models_manager.get_models_inventory()
        inventory["loaded_in_memory"] = {
            "bengraham": inference._loaded_bg_names,
            "colour": inference._loaded_col_names,
        }
        return inventory
    except Exception as e:
        raise HTTPException(500, f"Failed to retrieve models inventory: {e}")


@app.post("/api/admin/models/upload")
async def upload_model(
    stream: str = Form(...),  # "bengraham" | "colour"
    auto_activate: bool = Form(True),
    file: UploadFile = File(...)
):
    """Uploads a .keras or .h5 model into the corresponding stream folder."""
    if stream not in ["bengraham", "colour"]:
        raise HTTPException(400, "Invalid stream parameter. Must be 'bengraham' or 'colour'.")

    filename = file.filename or "model.keras"
    if not (filename.endswith(".keras") or filename.endswith(".h5")):
        raise HTTPException(400, "Invalid model format. Only .keras and .h5 files are supported.")

    raw = await file.read()
    if len(raw) > MAX_MODEL_UPLOAD_BYTES:
        raise HTTPException(400, "Model file exceeds 500MB upload limit.")

    try:
        saved_info = models_manager.save_uploaded_model(stream, filename, raw, auto_activate=auto_activate)
        # Hot-reload in memory if auto_activate is true
        if auto_activate:
            inference.reload_models()
        return {
            "status": "success",
            "message": f"Successfully uploaded '{filename}' to {stream}_models folder.",
            "model": saved_info
        }
    except Exception as e:
        raise HTTPException(500, f"Failed to save model: {e}")


class DeleteModelRequest(BaseModel):
    stream: str
    filename: str


@app.post("/api/admin/models/delete")
def delete_model(req: DeleteModelRequest):
    """Deletes a .keras model file from the specified stream directory."""
    if req.stream not in ["bengraham", "colour"]:
        raise HTTPException(400, "Invalid stream. Must be 'bengraham' or 'colour'.")
    try:
        res = models_manager.delete_model_file(req.stream, req.filename)
        inference.reload_models()
        return res
    except FileNotFoundError as e:
        raise HTTPException(404, str(e))
    except Exception as e:
        raise HTTPException(500, f"Failed to delete model: {e}")


class ToggleModelRequest(BaseModel):
    stream: str
    filename: str
    active: bool


@app.post("/api/admin/models/toggle")
def toggle_model(req: ToggleModelRequest):
    """Toggles model participation in the inference ensemble."""
    if req.stream not in ["bengraham", "colour"]:
        raise HTTPException(400, "Invalid stream. Must be 'bengraham' or 'colour'.")
    try:
        res = models_manager.toggle_model_active(req.stream, req.filename, req.active)
        inference.reload_models()
        return res
    except Exception as e:
        raise HTTPException(500, f"Failed to toggle model: {e}")


@app.post("/api/admin/models/reload")
def reload_all_models():
    """Hot-reloads all active models into memory."""
    try:
        res = inference.reload_models()
        return {"status": "success", "data": res}
    except Exception as e:
        raise HTTPException(500, f"Failed to reload models: {e}")


# ==================== Admin Training Studio Endpoints ====================

class StartTrainingRequest(BaseModel):
    stream: str  # "bengraham" | "colour"
    model_name: str
    backbone: str = "EfficientNetB0"
    epochs: int = 10
    batch_size: int = 16
    learning_rate: float = 0.0001
    optimizer: str = "AdamW"
    image_size: int = 512
    dataset_path: str = "data/retinal_scans"


@app.post("/api/admin/train/start")
async def start_training(req: StartTrainingRequest):
    """Starts an asynchronous training job."""
    curr = trainer.get_current_job()
    if curr and curr["status"] == "running":
        raise HTTPException(400, "Another training job is already actively running.")

    job_id = f"job-{uuid.uuid4().hex[:8]}"
    job = trainer.TrainingJob(
        job_id=job_id,
        stream=req.stream,
        model_name=req.model_name,
        backbone=req.backbone,
        epochs=req.epochs,
        batch_size=req.batch_size,
        learning_rate=req.learning_rate,
        optimizer=req.optimizer,
        image_size=req.image_size,
        dataset_path=req.dataset_path,
    )

    # Launch background training task
    asyncio.create_task(trainer.run_training_async(job))

    return {
        "status": "started",
        "job_id": job_id,
        "message": f"Training job started for {req.model_name} on stream {req.stream}."
    }


@app.get("/api/admin/train/status")
def get_training_status():
    """Returns status, epoch progress, and real-time logs of the training job."""
    job = trainer.get_current_job()
    if not job:
        return {"status": "idle", "message": "No training job currently active."}
    return job


@app.post("/api/admin/train/stop")
def stop_training():
    """Aborts current active training job."""
    stopped = trainer.stop_current_job()
    return {"status": "stopped" if stopped else "no_active_job"}


# ==================== Admin Config Endpoints ====================

class UpdateConfigRequest(BaseModel):
    thresholds: Optional[Dict[str, float]] = None
    weights: Optional[Dict[str, float]] = None


@app.post("/api/admin/config")
def update_config(req: UpdateConfigRequest):
    """Updates classification thresholds or ensemble blending weights."""
    try:
        updated = models_manager.update_system_config(thresholds=req.thresholds, weights=req.weights)
        inference.reload_models()
        return {"status": "success", "config": updated}
    except Exception as e:
        raise HTTPException(500, f"Failed to update config: {e}")
