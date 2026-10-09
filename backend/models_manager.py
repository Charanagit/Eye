"""
RetinaScreen Models Manager
Manages the two model repositories:
1. bengraham_models/ (Stream A)
2. colour_models/ (Stream B)
Handles dynamic model discovery, uploads, deletions, active ensemble config, and hot reloading.
"""
import json
import os
import shutil
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Tuple

MODELS_DIR = Path(__file__).parent / "models"
BENGRAHAM_DIR = MODELS_DIR / "bengraham_models"
COLOUR_DIR = MODELS_DIR / "colour_models"
CONFIG_PATH = MODELS_DIR / "deployment_config_v10_dualstream.json"


def ensure_directories():
    BENGRAHAM_DIR.mkdir(parents=True, exist_ok=True)
    COLOUR_DIR.mkdir(parents=True, exist_ok=True)


def load_config() -> Dict[str, Any]:
    ensure_directories()
    if not CONFIG_PATH.exists():
        default_config = {
            "diseases": [
                "DR", "ARMD", "DN", "MYA", "BRVO",
                "TSLN", "ODC", "Cataract", "Glaucoma", "Normal"
            ],
            "bengraham_models": [],
            "colour_models": [],
            "weights": {"bengraham": 0.5, "colour": 0.5},
            "thresholds": {
                "DR": 0.65,
                "ARMD": 0.65,
                "DN": 0.65,
                "MYA": 0.65,
                "BRVO": 0.65,
                "TSLN": 0.65,
                "ODC": 0.70,
                "Cataract": 0.90,
                "Glaucoma": 0.70,
                "Normal": 0.75
            }
        }
        save_config(default_config)
        return default_config

    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def save_config(config: Dict[str, Any]) -> None:
    CONFIG_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(CONFIG_PATH, "w", encoding="utf-8") as f:
        json.dump(config, f, indent=2)


def get_models_inventory() -> Dict[str, Any]:
    ensure_directories()
    config = load_config()

    active_bg_paths = set(os.path.normpath(p) for p in config.get("bengraham_models", []))
    active_col_paths = set(os.path.normpath(p) for p in config.get("colour_models", []))

    def scan_folder(folder: Path, active_set: set) -> List[Dict[str, Any]]:
        models = []
        if not folder.exists():
            return models
        for item in sorted(folder.glob("*")):
            if item.is_file() and item.suffix.lower() in [".keras", ".h5"]:
                stat = item.stat()
                norm = os.path.normpath(str(item))
                is_active = (norm in active_set) or (item.name in [os.path.basename(p) for p in active_set])
                models.append({
                    "filename": item.name,
                    "path": str(item),
                    "size_bytes": stat.st_size,
                    "size_mb": round(stat.st_size / (1024 * 1024), 2),
                    "modified": datetime.fromtimestamp(stat.st_mtime).strftime("%Y-%m-%d %H:%M:%S"),
                    "is_active": is_active,
                    "format": item.suffix.lower()
                })
        return models

    bg_models = scan_folder(BENGRAHAM_DIR, active_bg_paths)
    col_models = scan_folder(COLOUR_DIR, active_col_paths)

    return {
        "bengraham_models": bg_models,
        "colour_models": col_models,
        "active_config": config,
        "counts": {
            "bengraham_total": len(bg_models),
            "bengraham_active": sum(1 for m in bg_models if m["is_active"]),
            "colour_total": len(col_models),
            "colour_active": sum(1 for m in col_models if m["is_active"]),
        }
    }


def save_uploaded_model(stream: str, filename: str, content_bytes: bytes, auto_activate: bool = True) -> Dict[str, Any]:
    ensure_directories()
    target_dir = BENGRAHAM_DIR if stream.lower() == "bengraham" else COLOUR_DIR
    target_path = target_dir / filename

    with open(target_path, "wb") as f:
        f.write(content_bytes)

    config = load_config()
    key = "bengraham_models" if stream.lower() == "bengraham" else "colour_models"
    
    # Store clean relative path or absolute path
    abs_path = str(target_path)
    if auto_activate:
        if abs_path not in config[key] and filename not in [os.path.basename(p) for p in config[key]]:
            config[key].append(abs_path)
            save_config(config)

    return {
        "filename": filename,
        "stream": stream,
        "size_mb": round(len(content_bytes) / (1024 * 1024), 2),
        "path": abs_path,
        "is_active": auto_activate
    }


def delete_model_file(stream: str, filename: str) -> Dict[str, Any]:
    target_dir = BENGRAHAM_DIR if stream.lower() == "bengraham" else COLOUR_DIR
    target_path = target_dir / filename

    if not target_path.exists():
        raise FileNotFoundError(f"Model file '{filename}' not found in {stream} folder.")

    target_path.unlink()

    # Remove from config if present
    config = load_config()
    key = "bengraham_models" if stream.lower() == "bengraham" else "colour_models"
    config[key] = [p for p in config.get(key, []) if os.path.basename(p) != filename and os.path.normpath(p) != os.path.normpath(str(target_path))]
    save_config(config)

    return {"status": "success", "message": f"Model '{filename}' deleted successfully."}


def toggle_model_active(stream: str, filename: str, active: bool) -> Dict[str, Any]:
    target_dir = BENGRAHAM_DIR if stream.lower() == "bengraham" else COLOUR_DIR
    target_path = target_dir / filename
    abs_path = str(target_path)

    config = load_config()
    key = "bengraham_models" if stream.lower() == "bengraham" else "colour_models"

    existing_matches = [p for p in config.get(key, []) if os.path.basename(p) == filename or os.path.normpath(p) == os.path.normpath(abs_path)]

    if active:
        if not existing_matches:
            config[key].append(abs_path)
    else:
        config[key] = [p for p in config.get(key, []) if os.path.basename(p) != filename and os.path.normpath(p) != os.path.normpath(abs_path)]

    save_config(config)
    return {"status": "success", "filename": filename, "is_active": active}


def update_system_config(thresholds: Dict[str, float] = None, weights: Dict[str, float] = None) -> Dict[str, Any]:
    config = load_config()
    if thresholds:
        config["thresholds"].update(thresholds)
    if weights:
        config["weights"] = weights
    save_config(config)
    return config
