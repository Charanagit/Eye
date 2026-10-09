"""
Dual-Stream Retinal Preprocessing: Ben Graham (Structural) + Colour-Preserving (Chromatic)
Enhanced with non-fundus image validation, Image Quality Assessment (IQA), and ophthalmic filters.
"""
import base64
import cv2
import numpy as np

IMG_SIZE = 300
WORK_RADIUS = 300
REF_M = np.array([140., 150., 145.], np.float32)
REF_S = np.array([45., 12., 18.], np.float32)


def detect_fov(im: np.ndarray) -> np.ndarray:
    s = im.astype(np.float32).sum(2)
    s = (s / max(s.max(), 1.0) * 255).astype(np.uint8)
    _, m = cv2.threshold(s, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    if m.mean() < 5 or m.mean() > 250:
        _, m = cv2.threshold(s, 15, 255, cv2.THRESH_BINARY)
    n, lab, st, _ = cv2.connectedComponentsWithStats(m, 8)
    if n > 1:
        big = 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])
        m = np.where(lab == big, 255, 0).astype(np.uint8)
    c, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if c:
        cv2.drawContours(m, c, -1, 255, cv2.FILLED)
    return m


def crop_fov(im: np.ndarray) -> np.ndarray:
    m = detect_fov(im)
    ys, xs = np.where(m > 0)
    return im if len(xs) == 0 else im[ys.min():ys.max() + 1, xs.min():xs.max() + 1]


def scale_r(im: np.ndarray, r: float) -> np.ndarray:
    mid = im[im.shape[0] // 2, :, :].sum(1)
    nz = np.where(mid > mid.mean() / 10)[0]
    rr = (nz.max() - nz.min()) / 2 if len(nz) >= 2 else im.shape[1] / 2
    if rr < 1:
        rr = im.shape[1] / 2
    return cv2.resize(im, (0, 0), fx=r / rr, fy=r / rr)


def square_pad(im: np.ndarray, rr: int, fill: int) -> np.ndarray:
    side = 2 * rr
    c = np.full((side, side, 3), fill, np.uint8)
    h, w = im.shape[:2]
    y0, x0 = max(0, (side - h) // 2), max(0, (side - w) // 2)
    yi, xi = max(0, (h - side) // 2), max(0, (w - side) // 2)
    ph, pw = min(h, side), min(w, side)
    c[y0:y0 + ph, x0:x0 + pw] = im[yi:yi + ph, xi:xi + pw]
    return c


def circle_mask(im: np.ndarray, rr: int, fill: int, k: float = 0.92) -> np.ndarray:
    h, w = im.shape[:2]
    m = np.zeros((h, w), np.uint8)
    cv2.circle(m, (w // 2, h // 2), int(rr * k), 255, -1)
    o = im.copy()
    o[m == 0] = fill
    return o


def geometry(rgb: np.ndarray) -> np.ndarray:
    return scale_r(crop_fov(rgb), WORK_RADIUS)


def prep_bengraham_uint8(bgr: np.ndarray) -> np.ndarray | None:
    if bgr is None:
        return None
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
    img = geometry(rgb)
    img = cv2.addWeighted(img, 4, cv2.GaussianBlur(img, (0, 0), WORK_RADIUS / 30), -4, 128)
    return cv2.resize(circle_mask(square_pad(img, WORK_RADIUS, 128), WORK_RADIUS, 128), (IMG_SIZE, IMG_SIZE))


def grey_world(rgb: np.ndarray) -> np.ndarray:
    f = rgb.astype(np.float32)
    m = f.sum(2) > 15
    if m.sum() < 10:
        return rgb
    mu = np.array([f[..., c][m].mean() for c in range(3)], np.float32)
    return np.clip(f * np.where(mu > 1e-3, mu.mean() / np.maximum(mu, 1e-3), 1.0), 0, 255).astype(np.uint8)


def lab_ref(rgb: np.ndarray) -> np.ndarray:
    lab = cv2.cvtColor(rgb, cv2.COLOR_RGB2LAB).astype(np.float32)
    m = rgb.sum(2) > 15
    if m.sum() < 10:
        return rgb
    o = lab.copy()
    for c in range(3):
        v = lab[..., c]
        mu, sd = v[m].mean(), v[m].std()
        if sd < 1e-3:
            sd = 1.0
        o[..., c] = (v - mu) / sd * REF_S[c] + REF_M[c]
    return cv2.cvtColor(np.clip(o, 0, 255).astype(np.uint8), cv2.COLOR_LAB2RGB)


def prep_colour_uint8(bgr: np.ndarray) -> np.ndarray | None:
    if bgr is None:
        return None
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
    img = lab_ref(grey_world(geometry(rgb)))
    return cv2.resize(circle_mask(square_pad(img, WORK_RADIUS, 0), WORK_RADIUS, 0), (IMG_SIZE, IMG_SIZE))


def validate_fundus_image(bgr: np.ndarray) -> tuple[bool, str, dict]:
    """
    Validates whether the uploaded image is a genuine digital retinal fundus photograph.
    """
    if bgr is None or bgr.size == 0:
        return False, "Empty or unreadable image file.", {}
    
    h, w = bgr.shape[:2]
    if h < 80 or w < 80:
        return False, "Image resolution is too low (minimum 80x80 required for clinical evaluation).", {}
    
    aspect = max(h, w) / min(h, w)
    if aspect > 3.5:
        return False, f"Invalid aspect ratio ({aspect:.1f}:1). Retinal fundus photographs are circular or square.", {}
    
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
    
    # 1. FOV Segmentation
    s = rgb.astype(np.float32).sum(2)
    s = (s / max(s.max(), 1.0) * 255).astype(np.uint8)
    _, m = cv2.threshold(s, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    if m.mean() < 5 or m.mean() > 250:
        _, m = cv2.threshold(s, 15, 255, cv2.THRESH_BINARY)
    
    fg_ratio = float((m > 0).mean())
    if fg_ratio < 0.05:
        return False, "No illuminated retinal field of view detected (image is almost completely black).", {}
    
    fg_rgb = rgb[m > 0]
    if len(fg_rgb) < 500:
        return False, "Insufficient illuminated ocular area detected.", {}
    
    r_mean = float(fg_rgb[:, 0].mean())
    g_mean = float(fg_rgb[:, 1].mean())
    b_mean = float(fg_rgb[:, 2].mean())
    
    # 2. Chromaticity check: Retinal choroidal tissue is predominantly warm Red/Orange
    if r_mean < 35:
        return False, "Image is severely underexposed with insufficient retinal illumination.", {}
    
    if b_mean > r_mean:
        return False, "Invalid chromatic spectrum: Blue channel dominates over Red. Real fundus photographs exhibit warm red/orange retinal choroidal reflectance.", {}
    
    if r_mean < g_mean * 0.90 and r_mean < 70:
        return False, "Invalid chromatic spectrum: Green channel heavily dominates over Red without warm retinal choroidal tissue.", {}
    
    # 3. Check for natural texture / gradients (avoid flat solid color graphics)
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    lap_var = float(cv2.Laplacian(gray, cv2.CV_64F)[m > 0].var())
    if lap_var < 3.0 and fg_ratio > 0.92:
        return False, "Flat or artificial synthetic graphic with no natural retinal vasculature or optical texture detected.", {}
    
    # 4. Compute Image Quality Assessment (IQA)
    sharpness = min(100, max(5, int(lap_var / 3.0)))
    contrast = int(np.percentile(gray[m > 0], 95) - np.percentile(gray[m > 0], 5))
    uniformity = max(10, min(100, int(100 - gray[m > 0].std() * 0.8)))
    
    if sharpness > 45 and contrast > 80:
        grade = "Grade A (Optimal Diagnostic Quality)"
    elif sharpness > 20:
        grade = "Grade B (Acceptable Screening Quality)"
    else:
        grade = "Grade C (Sub-optimal / Mild Blur)"
    
    iqa = {
        "sharpness_score": sharpness,
        "contrast_score": contrast,
        "uniformity_score": uniformity,
        "quality_grade": grade,
        "fov_coverage_pct": round(fg_ratio * 100, 1),
    }
    
    return True, "Valid Retinal Fundus Photograph", iqa


def encode_image_base64(rgb_img: np.ndarray) -> str:
    """Encodes a uint8 RGB image to a Base64 PNG data URL."""
    bgr = cv2.cvtColor(rgb_img, cv2.COLOR_RGB2BGR)
    _, buffer = cv2.imencode(".png", bgr)
    b64 = base64.b64encode(buffer).decode("utf-8")
    return f"data:image/png;base64,{b64}"


def get_red_free_image(bgr: np.ndarray) -> np.ndarray:
    """
    Simulates clinical Red-Free (Green Channel) ophthalmic examination filter.
    Highlights microaneurysms, hemorrhages, and nerve fiber layer defects.
    """
    g_channel = bgr[:, :, 1]  # Extract Green channel
    clahe = cv2.createCLAHE(clipLimit=2.5, tileGridSize=(8, 8))
    g_enhanced = clahe.apply(g_channel)
    return cv2.cvtColor(g_enhanced, cv2.COLOR_GRAY2RGB)


def generate_stream_previews(bgr: np.ndarray) -> dict[str, str]:
    """Generates base64 preview URLs for all clinical visual modalities."""
    bg_img = prep_bengraham_uint8(bgr)
    col_img = prep_colour_uint8(bgr)
    
    # Red-free ophthalmic filter
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
    std_prepped = cv2.resize(circle_mask(square_pad(geometry(rgb), WORK_RADIUS, 0), WORK_RADIUS, 0), (IMG_SIZE, IMG_SIZE))
    red_free_img = get_red_free_image(cv2.cvtColor(std_prepped, cv2.COLOR_RGB2BGR))
    
    return {
        "bengraham": encode_image_base64(bg_img if bg_img is not None else np.full((IMG_SIZE, IMG_SIZE, 3), 128, np.uint8)),
        "colour": encode_image_base64(col_img if col_img is not None else np.zeros((IMG_SIZE, IMG_SIZE, 3), np.uint8)),
        "red_free": encode_image_base64(red_free_img)
    }
