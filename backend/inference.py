"""
Dual-Stream Ensemble Inference (v10 Model Pipeline)
Loads Ben Graham fold models (Stream A) + Colour fold models (Stream B).
Runs test-time augmentation (TTA) on both stream images, averages folds per stream,
and performs configurable soft polling meta-fusion with IQA and Non-Fundus Image Validation.
"""
import json
import os
from pathlib import Path
from typing import Any, Dict, List, Optional
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications.efficientnet import preprocess_input

from preprocessing import (
    prep_bengraham_uint8,
    prep_colour_uint8,
    validate_fundus_image,
    generate_stream_previews,
    IMG_SIZE,
)
import models_manager

MODELS_DIR = Path(__file__).parent / "models"
BENGRAHAM_DIR = MODELS_DIR / "bengraham_models"
COLOUR_DIR = MODELS_DIR / "colour_models"

_config: Dict[str, Any] = models_manager.load_config()
DISEASES: List[str] = _config.get("diseases", [
    "DR", "ARMD", "DN", "MYA", "BRVO",
    "TSLN", "ODC", "Cataract", "Glaucoma", "Normal"
])
THRESHOLDS: Dict[str, float] = _config.get("thresholds", {})
WEIGHTS: Dict[str, float] = _config.get("weights", {"bengraham": 0.5, "colour": 0.5})

_bengraham_models: List[tf.keras.Model] = []
_colour_models: List[tf.keras.Model] = []
_loaded_bg_names: List[str] = []
_loaded_col_names: List[str] = []


def resolve_model_path(path_str: str, default_dir: Path) -> Path:
    p = Path(path_str)
    if p.is_absolute() and p.exists():
        return p
    # Try relative to default_dir
    cand = default_dir / p.name
    if cand.exists():
        return cand
    # Try relative to models dir
    cand2 = MODELS_DIR / path_str
    if cand2.exists():
        return cand2
    return p


def load_models() -> None:
    global _bengraham_models, _colour_models, _loaded_bg_names, _loaded_col_names, _config, DISEASES, THRESHOLDS, WEIGHTS
    if _bengraham_models or _colour_models:
        return

    _config = models_manager.load_config()
    DISEASES = _config.get("diseases", DISEASES)
    THRESHOLDS = _config.get("thresholds", THRESHOLDS)
    WEIGHTS = _config.get("weights", {"bengraham": 0.5, "colour": 0.5})

    _bengraham_models = []
    _colour_models = []
    _loaded_bg_names = []
    _loaded_col_names = []

    print("Loading Ben Graham stream models...")
    for p_str in _config.get("bengraham_models", []):
        p = resolve_model_path(p_str, BENGRAHAM_DIR)
        if p.exists():
            print(f"  Loading Ben Graham model: {p.name} ...")
            try:
                m = tf.keras.models.load_model(str(p), compile=False)
                _bengraham_models.append(m)
                _loaded_bg_names.append(p.name)
            except Exception as e:
                print(f"  ⚠️ Error loading {p}: {e}")

    print("Loading Colour-enhanced stream models...")
    for p_str in _config.get("colour_models", []):
        p = resolve_model_path(p_str, COLOUR_DIR)
        if p.exists():
            print(f"  Loading Colour model: {p.name} ...")
            try:
                m = tf.keras.models.load_model(str(p), compile=False)
                _colour_models.append(m)
                _loaded_col_names.append(p.name)
            except Exception as e:
                print(f"  ⚠️ Error loading {p}: {e}")

    print(f"✅ Loaded {len(_bengraham_models)} Ben Graham models and {len(_colour_models)} Colour models.")


def reload_models() -> Dict[str, Any]:
    global _bengraham_models, _colour_models
    _bengraham_models = []
    _colour_models = []
    load_models()
    return {
        "status": "reloaded",
        "bengraham_count": len(_bengraham_models),
        "colour_count": len(_colour_models),
        "bengraham_names": _loaded_bg_names,
        "colour_names": _loaded_col_names,
    }


def _predict_tta(models: List[tf.keras.Model], img_uint8: np.ndarray) -> Optional[np.ndarray]:
    if not models:
        return None
    batch = img_uint8[None, ...]
    b = preprocess_input(batch.astype("float32"))
    
    # 3-view TTA: original + horizontal flip + vertical flip
    views = [
        b,
        b[:, :, ::-1, :],
        b[:, ::-1, :, :]
    ]
    
    model_preds = []
    for m in models:
        try:
            view_preds = [m.predict(v, verbose=0)[0] for v in views]
            model_preds.append(np.mean(view_preds, axis=0))
        except Exception as e:
            print(f"Prediction error on model: {e}")
            
    if not model_preds:
        return None
    return np.mean(model_preds, axis=0)


def predict_image(bgr: np.ndarray) -> Dict[str, Any]:
    if not _bengraham_models and not _colour_models:
        load_models()

    # 1. Non-Fundus Validation & Image Quality Assessment
    is_valid, validation_msg, iqa_stats = validate_fundus_image(bgr)
    if not is_valid:
        return {
            "error": f"Invalid Image: The uploaded file does not appear to be a valid retinal fundus photograph ({validation_msg}).",
            "is_fundus": False,
            "validation_message": validation_msg,
            "findings": [],
            "flagged_diseases": []
        }

    # 2. Dual-Stream Preprocessing
    bg_prepped = prep_bengraham_uint8(bgr)
    col_prepped = prep_colour_uint8(bgr)

    if bg_prepped is None or col_prepped is None:
        raise ValueError("Could not decode or preprocess fundus photograph.")

    # 3. Dual-Stream TTA Inference
    bg_probs = _predict_tta(_bengraham_models, bg_prepped) if _bengraham_models else None
    col_probs = _predict_tta(_colour_models, col_prepped) if _colour_models else None

    # Apply Configured Blending Weights
    w_bg = WEIGHTS.get("bengraham", 0.5)
    w_col = WEIGHTS.get("colour", 0.5)
    total_w = (w_bg if bg_probs is not None else 0.0) + (w_col if col_probs is not None else 0.0)
    if total_w == 0:
        total_w = 1.0

    if bg_probs is not None and col_probs is not None:
        soft_probs = (w_bg * bg_probs + w_col * col_probs) / total_w
    elif bg_probs is not None:
        soft_probs = bg_probs
        col_probs = bg_probs
    elif col_probs is not None:
        soft_probs = col_probs
        bg_probs = col_probs
    else:
        # Fallback uniform
        soft_probs = np.full(len(DISEASES), 0.1)
        bg_probs = soft_probs
        col_probs = soft_probs

    findings = []
    uncertain_count = 0

    for i, disease in enumerate(DISEASES):
        p_soft = float(soft_probs[i]) if i < len(soft_probs) else 0.0
        p_bg = float(bg_probs[i]) if bg_probs is not None and i < len(bg_probs) else 0.0
        p_col = float(col_probs[i]) if col_probs is not None and i < len(col_probs) else 0.0
        thr = THRESHOLDS.get(disease, 0.65)
        
        flagged = p_soft >= thr
        uncertain = abs(p_soft - thr) <= 0.08
        if uncertain:
            uncertain_count += 1

        findings.append({
            "disease": disease,
            "probability": round(p_soft, 4),
            "bengraham_probability": round(p_bg, 4),
            "colour_probability": round(p_col, 4),
            "threshold": thr,
            "flagged": flagged,
            "uncertain": uncertain
        })

    flagged_diseases = [f["disease"] for f in findings if f["flagged"] and f["disease"] != "Normal"]

    # Determine Clinical Triage Urgency Level
    high_urgency = {"DR", "BRVO", "Glaucoma"}
    medium_urgency = {"ARMD", "Cataract", "MYA", "ODC", "DN", "TSLN"}
    
    has_high = any(d in high_urgency for d in flagged_diseases)
    has_med = any(d in medium_urgency for d in flagged_diseases)
    is_normal_flagged = any(f["disease"] == "Normal" and f["flagged"] for f in findings)

    if has_high:
        urgency = {
            "level": "Urgent Referral (< 48 Hours)",
            "color": "red",
            "action": "Immediate comprehensive ophthalmic examination recommended due to high risk of vision loss."
        }
    elif has_med:
        urgency = {
            "level": "Priority Clinic Review (< 14 Days)",
            "color": "amber",
            "action": "Schedule specialist clinical evaluation and secondary diagnostic confirmation."
        }
    elif is_normal_flagged:
        urgency = {
            "level": "Routine Screening (Annual Review)",
            "color": "emerald",
            "action": "No acute retinal pathology detected. Maintain standard annual diabetic/ocular screening."
        }
    else:
        urgency = {
            "level": "Clinical Review Recommended",
            "color": "slate",
            "action": "Equivocal findings. Recommend standard clinical slit-lamp and biomicroscopic examination."
        }

    # Generate Base64 Previews
    previews = generate_stream_previews(bgr)

    return {
        "is_fundus": True,
        "findings": sorted(findings, key=lambda f: f["probability"], reverse=True),
        "flagged_diseases": flagged_diseases,
        "triage_urgency": urgency,
        "iqa": iqa_stats,
        "previews": previews,
        "pipeline": f"Dual-Stream Ensemble ({len(_bengraham_models)} Ben Graham + {len(_colour_models)} Colour Models)",
        "num_bg_models": len(_bengraham_models),
        "num_colour_models": len(_colour_models),
        "loaded_bg_names": _loaded_bg_names,
        "loaded_col_names": _loaded_col_names,
        "img_size": IMG_SIZE
    }
