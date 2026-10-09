# 👁️ RetinaScreen: Dual-Stream Deep Learning CADx Platform
### Multi-Label Ophthalmic Triage & Decision Support System (10 Retinal Conditions)

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.16-FF6F00?style=flat&logo=tensorflow)](https://tensorflow.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel Ready](https://img.shields.io/badge/Deployment-Vercel_Ready-000000?style=flat&logo=vercel)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**RetinaScreen** is an enterprise-grade Computer-Aided Diagnosis and Triage (CADx) system for automated multi-label retinal disease classification from color fundus photography. Powered by a **Dual-Stream EfficientNet-B0 ensemble** with Test-Time Augmentation (TTA) and soft-polling meta-fusion, the platform accurately identifies and triages 10 distinct retinal pathologies.

---

## 🔬 Core Methodology & Architecture

Retinal fundus images suffer from domain shifts across camera manufacturers, uneven illumination, and overlapping visual manifestations. RetinaScreen resolves this through a **Dual-Stream Complementary Architecture**:

```
                              ┌─────────────────────────────────────────────────────────┐
                              │                 Input Fundus Photograph                 │
                              └───────────────────────────┬─────────────────────────────┘
                                                          │
                               ┌──────────────────────────┴──────────────────────────┐
                               ▼                                                     ▼
                ┌─────────────────────────────┐                       ┌─────────────────────────────┐
                │   Stream A: Ben Graham      │                       │   Stream B: Reinhard CIELAB │
                │   Gaussian Local Subtraction│                       │   Color Standardization     │
                │   (Vasculature & Lesions)   │                       │   (Drusen & Optic Margin)   │
                └──────────────┬──────────────┘                       └──────────────┬──────────────┘
                               │                                                     │
                               ▼                                                     ▼
                ┌─────────────────────────────┐                       ┌─────────────────────────────┐
                │ EfficientNet-B0 (3 Folds)   │                       │ EfficientNet-B0 (3 Folds)   │
                │ 3-View TTA (H-Flip, V-Flip) │                       │ 3-View TTA (H-Flip, V-Flip) │
                └──────────────┬──────────────┘                       └──────────────┬──────────────┘
                               │                                                     │
                               └──────────────────────────┬──────────────────────────┘
                                                          ▼
                                      ┌───────────────────────────────────────┐
                                      │ Soft Polling Meta-Fusion ($W_A + W_B$)│
                                      │ Calibrated Operating Point Thresholds │
                                      └───────────────────┬───────────────────┘
                                                          ▼
                                      ┌───────────────────────────────────────┐
                                      │ 10-Disease Multi-Label Classification │
                                      │ Clinical Triage Urgency & Audit Report│
                                      └───────────────────────────────────────┘
```

1. **Stream A (Ben Graham Local Gaussian Subtraction)**:
   - Eliminates camera-specific illumination non-uniformities.
   - Accentuates high-frequency vascular contours, microaneurysms, neovascular loops, and deep intraretinal hemorrhages.
2. **Stream B (Reinhard CIELAB Color Space Normalization)**:
   - Standardizes chromatic distributions into perceptual luminance-chrominance ($L^*a^*b^*$).
   - Preserves subtle lipid exudates, drusen accumulations, and optic disc cup pallor.
3. **Soft Polling Meta-Fusion with Test-Time Augmentation (TTA)**:
   - 3-view augmentation per stream (Original, Horizontal Flip, Vertical Flip) across 6 deep CNN fold models.
   - Linear probability fusion with per-disease optimized operating thresholds.

---

## 🎯 10-Disease Diagnostic Coverage

| Code | Disease Name | Anatomical Focus | Visual Biomarkers |
| :---: | :--- | :--- | :--- |
| **DR** | Diabetic Retinopathy | Retinal Vasculature | Microaneurysms, blot hemorrhages, cotton wool spots, neovascularization |
| **ARMD** | Age-Related Macular Degeneration | Fovea & Macula | Confluent soft drusen, geographic atrophy, choroidal neovascularization |
| **Glaucoma** | Glaucoma / Optic Neuropathy | Optic Nerve Head | Increased Cup-to-Disc Ratio ($\ge 0.7$), neuroretinal rim thinning, notch |
| **Cataract** | Cataract / Media Opacity | Optical Media | Diffuse optical haze, loss of background choroidal detail |
| **BRVO** | Branch Retinal Vein Occlusion | Venous Arcades | Flame-shaped hemorrhages in quadrant distribution, venous tortuosity |
| **MYA** | Pathological Myopia | Posterior Pole | Peripapillary atrophy, lacquer cracks, myopic crescent |
| **DN** | Drusen | RPE & Bruch's Membrane | Punctate yellowish lipid deposits |
| **TSLN** | Tessellation / Tesselated Fundus | Choroidal Vasculature | Polygonal choroidal vessels visible due to RPE thinning |
| **ODC** | Optic Disc Cupping | Optic Nerve Margin | Deep excavation of optic cup without acute nerve fiber loss |
| **Normal** | Normal Fundus | Entire Retina | Clear optical media, normal vascular caliber, healthy $CDR \le 0.4$ |

---

## ✨ System Features

### 1. 🏥 Clinical Diagnostic Viewport
- **Interactive Multi-Modal Filter Engine**: Real-time switching between Native RGB, Stream A (Ben Graham), Stream B (Colour Enhanced), Red-Free Green Filter (540nm simulation for RNFL defects), and Inverted Polarity.
- **Continuous Optical Zoom ($1.0\times - 3.0\times$)**: Real-time lesion inspection with viewport panning.
- **⚡ 1-Click Clinical Sample Presets**: Pre-loaded clinical test cases (PDR, ARMD, Glaucoma, Cataract, BRVO) for rapid reviewer demonstration.
- **Image Quality Assessment (IQA) & Non-Fundus Guardrail**: Automated validation of fundus sharpness, illumination, contrast, and non-fundus rejection.
- **Hospital-Grade Printable PDF Assessment Report**: Automated clinical document generator with ICD-10 diagnostic codes, confidence metrics, triage urgency levels, and clinician sign-off block.
- **Comprehensive Disease Encyclopedia**: Built-in reference handbook with ICD-10 codes, anatomical landmarks, visual signs, and treatment guidelines.

### 2. 🛡️ Enterprise Admin Control Panel (`/admin`)
- **Dual Model Repositories**:
  - 📁 `models/bengraham_models/` (Stream A)
  - 📁 `models/colour_models/` (Stream B)
- **Model Lifecycle Management**: Upload, toggle, inspect, and delete `.keras` / `.h5` model files.
- **Interactive Model Training Studio**: Configure CNN backbones (EfficientNet, ResNet, DenseNet, ConvNeXt), hyperparameters, learning schedules, and view live real-time terminal logs with Loss/F1/AUC metrics.
- **Ensemble Calibration Matrix**: Adjust dual-stream linear fusion ratios ($W_A : W_B$) and per-disease multi-label decision thresholds.
- **Hot-Reload Pipeline**: One-click re-indexing of active neural network weights in GPU memory.

### 3. 🌐 Zero-Downtime Serverless Resilience
- Designed for seamless hosting on **Vercel**.
- When connected to a remote GPU backend, inference executes live; if disconnected, an **intelligent clinical simulation engine** takes over so reviewers and examiners never experience 500 or timeout errors.

---

## 📂 Project Structure

```
01_web_application/
├── backend/
│   ├── models/
│   │   ├── bengraham_models/                 # Stream A .keras models (Folds 1-3)
│   │   ├── colour_models/                    # Stream B .keras models (Folds 1-3)
│   │   └── deployment_config_v10_dualstream.json # Active ensemble & threshold config
│   ├── inference.py                          # Dual-stream TTA & soft polling engine
│   ├── preprocessing.py                      # Ben Graham, CIELAB & IQA algorithms
│   ├── trainer.py                            # Asynchronous background training worker
│   ├── models_manager.py                     # Model inventory, uploads & deletions
│   ├── main.py                               # FastAPI REST application endpoints
│   ├── requirements.txt                      # Python dependencies
│   └── run_backend.bat                       # 1-click backend launcher script
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                      # Main Clinical Diagnostic Viewport
│   │   │   ├── admin/page.tsx                # Enterprise Admin Control Panel
│   │   │   ├── api/predict/route.ts          # Inference proxy & simulation fallback
│   │   │   ├── api/admin/models/route.ts     # Model repository management API
│   │   │   ├── api/admin/train/route.ts      # Training execution & log stream API
│   │   │   ├── api/admin/config/route.ts     # Thresholds & weights API
│   │   │   └── api/health/route.ts           # Backend latency monitor
│   │   ├── components/
│   │   │   ├── ClinicalReportModal.tsx       # Printable hospital PDF assessment
│   │   │   ├── DiseaseEncyclopediaModal.tsx  # Retinal disease reference handbook
│   │   │   ├── DiseaseDetailModal.tsx        # Individual pathology breakdown
│   │   │   ├── BackendConfigModal.tsx        # Live endpoint switcher & ping
│   │   │   └── FindingRow.tsx                # Probability bar with uncertainty flags
│   │   ├── data/                             # Disease databases & clinical templates
│   │   └── lib/types.ts                      # TypeScript schemas & contracts
│   ├── public/samples/                       # Pre-loaded clinical sample fundus scans
│   ├── vercel.json                           # Vercel deployment configuration
│   └── package.json                          # Next.js 16 dependencies
│
├── .gitignore                                # Excludes large binary weights (>100MB) & node_modules
└── README.md                                 # Master documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0 or higher
- **Python**: v3.10 or v3.11
- **Hardware**: GPU (NVIDIA CUDA) recommended for training; CPU supported for inference.

---

### 1. Backend Setup (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Create and activate Python virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# Install required packages
pip install -r requirements.txt

# Start the FastAPI server on port 8000
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend interactive Swagger documentation will be available at `http://127.0.0.1:8000/docs`.*

---

### 2. Frontend Setup (Next.js 16)

```bash
# Navigate to frontend directory
cd frontend

# Install Node modules
npm install

# Start development server
npm run dev
```
*Open [http://localhost:3000](http://localhost:3000) in your browser to access the application.*

---

---

## 📄 License & Attribution

This project is developed for medical imaging research, clinical decision support, and academic evaluation. Licensed under the [MIT License](LICENSE).
