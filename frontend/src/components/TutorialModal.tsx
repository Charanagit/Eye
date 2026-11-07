"use client";

import React, { useState, useEffect } from "react";

export interface TutorialStep {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  badge: string;
  instructions: {
    title: string;
    description: string;
    actionHighlight: string;
  }[];
  tipText?: string;
  screenshotSrc: string;
  screenshotAlt: string;
  hotspot: {
    top: string;
    left: string;
    width?: string;
    height?: string;
    label: string;
    pointerDirection?: "top" | "bottom" | "left" | "right";
  };
  sampleAction?: {
    label: string;
    fileName: string;
    patientName: string;
    patientAge: string;
    patientGender: string;
    eyeLaterality: "OD (Right Eye)" | "OS (Left Eye)";
  };
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: "welcome-overview",
    stepNumber: 1,
    title: "Welcome to RetinaScreen Clinical AI",
    subtitle: "Automated Dual-Stream Multi-Label Retinal Triage & Decision Support",
    badge: "1. Overview & Workspace Layout",
    instructions: [
      {
        title: "Clinical Decision Support System",
        description:
          "RetinaScreen simultaneously evaluates retinal photographs across 10 ocular pathologies (Diabetic Retinopathy, Glaucoma, Cataract, Macular Degeneration, and more) using dual-stream deep learning.",
        actionHighlight: "Take a 60-second tour to learn where to click and how to get instant results.",
      },
      {
        title: "Two-Column Clinical Layout",
        description:
          "The left workspace handles patient metadata, image uploads, and multi-modal filter visualization. The right workspace displays calibrated findings, triage urgency protocols, and clinical reports.",
        actionHighlight: "Click 'Next Step' below to learn how to test with sample images if you do not have your own scans.",
      },
    ],
    tipText:
      "Compliant with WHO ophthalmic screening guidelines and calibrated against 50,000+ clinical fundus photographs.",
    screenshotSrc: "/tutorial/step1_overview.png",
    screenshotAlt: "RetinaScreen full dual-column clinical interface",
    hotspot: {
      top: "16%",
      left: "50%",
      label: "Dual-Column Clinical Workstation",
      pointerDirection: "bottom",
    },
  },
  {
    id: "sample-images",
    stepNumber: 2,
    title: "Don't Have Fundus Images? Use Pre-Loaded Test Scans",
    subtitle: "We included ready-to-test fundus photographs so anyone can try the system instantly",
    badge: "2. Sample Fundus Images",
    instructions: [
      {
        title: "Where to Click: 1-Click Samples Bar",
        description:
          "Look at the top bar right below the navigation header. You will find instant 1-click test buttons for Diabetic Retinopathy, Glaucoma, and Cataract.",
        actionHighlight: "Click any pill in the '⚡ 1-Click Clinical Samples' bar to instantly load the photograph and patient data.",
      },
      {
        title: "Explore the Full Test Images Library",
        description:
          "Click '📁 Fundus Images' in the top header or 'Browse All Test Images' to open the gallery, view disease descriptions, or download the JPG images to practice manual uploading.",
        actionHighlight: "You can test right now by clicking one of the sample buttons below!",
      },
    ],
    tipText:
      "Includes real scans from our test folder (eye dr.jpg, glaucoma 1.jpg, cataract 1.jpg) and hospital benchmark datasets.",
    screenshotSrc: "/tutorial/step2_samples.png",
    screenshotAlt: "1-Click clinical test cases bar with Diabetic Retinopathy, Glaucoma, Cataract",
    hotspot: {
      top: "11%",
      left: "28%",
      label: "CLICK HERE: 1-Click Clinical Samples Bar",
      pointerDirection: "bottom",
    },
    sampleAction: {
      label: "⚡ Try Loading Test Diabetic Retinopathy (eye dr.jpg)",
      fileName: "eye_dr.jpg",
      patientName: "Marcus Thorne (PT-701)",
      patientAge: "58",
      patientGender: "Male",
      eyeLaterality: "OD (Right Eye)",
    },
  },
  {
    id: "patient-upload",
    stepNumber: 3,
    title: "Patient Details & Fundus Photo Upload",
    subtitle: "Enter clinical record information and upload high-resolution retinal images",
    badge: "3. Patient Record & Upload",
    instructions: [
      {
        title: "Patient & Clinician Record Form",
        description:
          "Fill in optional patient identifier, age, gender, and Eye Laterality (OD for Right Eye, OS for Left Eye). These details are automatically embedded into the exported medical report.",
        actionHighlight: "Click into any field in the 'Patient & Clinician Record' card on the left.",
      },
      {
        title: "Drag & Drop or Click to Browse",
        description:
          "Drag any JPEG or PNG fundus scan into the dashed viewport box, or click anywhere inside the box to open your computer's file browser.",
        actionHighlight: "Compatible with Topcon, Canon, Zeiss, and Eyer handheld retinal cameras.",
      },
    ],
    tipText:
      "Optical Guardrail: If you accidentally upload a non-fundus picture (like a selfie or landscape), our AI automatically rejects it to ensure clinical safety.",
    screenshotSrc: "/tutorial/step3_upload.png",
    screenshotAlt: "Patient information inputs and drag & drop fundus upload viewport",
    hotspot: {
      top: "42%",
      left: "28%",
      label: "CLICK HERE: Drag & Drop or Browse Fundus Photo",
      pointerDirection: "top",
    },
  },
  {
    id: "run-inference",
    stepNumber: 4,
    title: "Executing Dual-Stream AI Diagnostic Inference",
    subtitle: "Analyze retinal vasculature, optic disc cupping, and macular drusen in seconds",
    badge: "4. Run AI Inference",
    instructions: [
      {
        title: "Where to Click: 'Run Diagnostic Inference'",
        description:
          "Once an image is selected, a prominent black button labelled '⚡ Run Diagnostic Inference' appears directly below the image viewport.",
        actionHighlight: "Click '⚡ Run Diagnostic Inference' to execute 6 ensemble neural networks across two parallel preprocessing streams.",
      },
      {
        title: "Dual-Stream Processing Explained",
        description:
          "Stream A (Ben Graham high-pass filter) isolates microaneurysms and vessel tortuosity. Stream B (CIELAB color enhancement) normalizes illumination to detect soft drusen and cataracts.",
        actionHighlight: "Takes under 1 second on modern hardware, returning calibrated multi-label probabilities.",
      },
    ],
    tipText:
      "Dual-stream analysis prevents diagnostic oversights by combining structural vessel geometry with standardized retinal coloration.",
    screenshotSrc: "/tutorial/step4_inference.png",
    screenshotAlt: "Loaded fundus image with 'Run Diagnostic Inference' button highlighted",
    hotspot: {
      top: "86%",
      left: "52%",
      label: "CLICK HERE: ⚡ Run Diagnostic Inference Button",
      pointerDirection: "top",
    },
  },
  {
    id: "multi-modal-views",
    stepNumber: 5,
    title: "Multi-Modal Inspection Deck & Zoom Controls",
    subtitle: "Inspect retinal structures with specialized ophthalmic filters",
    badge: "5. Filter Modalities & Zoom",
    instructions: [
      {
        title: "Specialized Ophthalmic Filter Tabs",
        description:
          "Above the image, click through the modality tabs: Natural Color (original RGB), Stream A (vasculature high-pass), Stream B (color standardized), Red-Free (green filter simulation for hemorrhages), and Invert (optic margin tracing).",
        actionHighlight: "Click '🟢 Red-Free' to emphasize intraretinal microvascular abnormalities and optic disc margins.",
      },
      {
        title: "Interactive Zoom Slider",
        description:
          "Use the magnification slider (1.0x to 2.5x) to zoom in on the optic disc cup or foveal avascular zone to inspect fine pathology.",
        actionHighlight: "Drag the zoom slider or click 'Reset' to return to full field of view.",
      },
    ],
    tipText:
      "Simulates clinical slit-lamp filters used by ophthalmologists during fundoscopic examination.",
    screenshotSrc: "/tutorial/step5_filters.png",
    screenshotAlt: "Modality switcher tabs (Ben Graham, Colour, Red-Free, Invert) and zoom slider",
    hotspot: {
      top: "33%",
      left: "26%",
      label: "CLICK HERE: Switch Modality Filters (Natural, Ben Graham, Red-Free)",
      pointerDirection: "bottom",
    },
  },
  {
    id: "results-reports",
    stepNumber: 6,
    title: "Clinical Triage Protocol & Medical Reports",
    subtitle: "Interpret triage urgency levels, calibrated probabilities, and export PDFs",
    badge: "6. Triage & PDF Medical Reports",
    instructions: [
      {
        title: "Automated Urgency Triage Protocol",
        description:
          "The top banner in the right column displays an immediate triage action: 🚨 Urgent Referral (< 48 Hours), ⚠️ Priority Clinic Review (< 14 Days), or ✅ Routine Annual Screening.",
        actionHighlight: "Provides evidence-based clinical next-steps tailored to detected disease severity.",
      },
      {
        title: "Calibrated Disease Findings & Medical PDF",
        description:
          "Review calibrated independent probabilities for all 10 retinal conditions. Click '📄 View Report' to generate a formal, printable clinical summary with hospital header and clinician signature line.",
        actionHighlight: "Click '📄 View Report' to preview or print the official EHR diagnostic report.",
      },
    ],
    tipText:
      "Automated Image Quality Assessment (IQA) calculates Focus Sharpness, Uniformity, and Retinal Contrast to guarantee diagnostic reliability.",
    screenshotSrc: "/tutorial/step6_results.png",
    screenshotAlt: "Triage urgency banner, image quality scores, and multi-label findings",
    hotspot: {
      top: "35%",
      left: "87%",
      label: "CLICK HERE: 📄 View Clinical Medical Report",
      pointerDirection: "left",
    },
  },
];

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (dontShowAgain: boolean) => void;
  onLoadSample?: (
    fileName: string,
    patientName: string,
    patientAge: string,
    patientGender: string,
    eyeLaterality: "OD (Right Eye)" | "OS (Left Eye)"
  ) => void;
}

export default function TutorialModal({
  isOpen,
  onClose,
  onComplete,
  onLoadSample,
}: TutorialModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(true);
  const [loadedSampleNotice, setLoadedSampleNotice] = useState<string | null>(null);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        if (currentStepIndex < TUTORIAL_STEPS.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        }
      } else if (e.key === "ArrowLeft") {
        if (currentStepIndex > 0) {
          setCurrentStepIndex((prev) => prev - 1);
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentStepIndex, onClose]);

  if (!isOpen) return null;

  const step = TUTORIAL_STEPS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === TUTORIAL_STEPS.length - 1;
  const progressPct = ((currentStepIndex + 1) / TUTORIAL_STEPS.length) * 100;

  const handleNext = () => {
    if (isLastStep) {
      onComplete(dontShowAgain);
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleLoadSampleFromStep = (action: TutorialStep["sampleAction"]) => {
    if (!action || !onLoadSample) return;
    onLoadSample(
      action.fileName,
      action.patientName,
      action.patientAge,
      action.patientGender,
      action.eyeLaterality
    );
    setLoadedSampleNotice(`Loaded "${action.fileName}" into scanner!`);
    setTimeout(() => setLoadedSampleNotice(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative flex flex-col max-h-[95vh] w-full max-w-5xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-3.5 bg-slate-50/90">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm font-bold text-lg">
              👁️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-tight text-slate-900">
                  RetinaScreen Guided Tutorial
                </span>
                <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold text-indigo-800 border border-indigo-200">
                  Step {step.stepNumber} of {TUTORIAL_STEPS.length}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Interactive walk-through for new users &amp; clinicians
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onComplete(dontShowAgain)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              Skip Tour &amp; Enter Workspace →
            </button>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors text-xs font-bold"
              aria-label="Close tutorial"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Step Navigation Tabs / Breadcrumbs */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-100 bg-white px-6 py-2 scrollbar-none text-xs">
          {TUTORIAL_STEPS.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentStepIndex(idx)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                idx === currentStepIndex
                  ? "bg-slate-900 text-white shadow-sm"
                  : idx < currentStepIndex
                  ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span>{idx < currentStepIndex ? "✓" : idx + 1}</span>
              <span className="hidden sm:inline">
                {idx === 0
                  ? "Overview"
                  : idx === 1
                  ? "Test Images"
                  : idx === 2
                  ? "Upload"
                  : idx === 3
                  ? "Inference"
                  : idx === 4
                  ? "Filters"
                  : "Results"}
              </span>
            </button>
          ))}
        </div>

        {/* Main Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1">
          {/* Step Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-900 border border-blue-200 uppercase tracking-wider">
                {step.badge}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {step.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {step.subtitle}
            </p>
          </div>

          {/* Interactive Screenshot Mockup with Animated Hotspot */}
          <div className="relative rounded-2xl border-2 border-slate-200 bg-slate-900 shadow-lg overflow-hidden group">
            {/* Mockup Browser Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 inline-block" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80 inline-block" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/80 inline-block" />
                <span className="ml-2 font-mono text-[10px] text-slate-400">
                  https://retinascreen.ai/ophthalmic-triage
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Live Interactive UI Guide
              </span>
            </div>

            {/* Screenshot Display */}
            <div className="relative flex items-center justify-center bg-slate-950 min-h-[260px] sm:min-h-[340px] max-h-[460px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={step.screenshotSrc}
                alt={step.screenshotAlt}
                className="w-full h-auto object-cover max-h-[460px] opacity-95 transition-opacity"
              />

              {/* Animated Interactive Pulsing Target / Hotspot */}
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300"
                style={{
                  top: step.hotspot.top,
                  left: step.hotspot.left,
                }}
              >
                {/* Ping rings */}
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-red-500 opacity-75" />
                  <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white font-black text-sm shadow-xl border-2 border-white">
                    👆
                  </span>
                </div>

                {/* Hotspot Floating Tooltip Callout */}
                <div
                  className={`absolute whitespace-nowrap rounded-xl bg-slate-950/95 border-2 border-amber-400 px-3 py-1.5 text-xs font-bold text-white shadow-2xl backdrop-blur-md flex items-center gap-1.5 z-20 ${
                    step.hotspot.pointerDirection === "top"
                      ? "top-10 left-1/2 -translate-x-1/2"
                      : step.hotspot.pointerDirection === "bottom"
                      ? "-top-12 left-1/2 -translate-x-1/2"
                      : step.hotspot.pointerDirection === "left"
                      ? "right-12 top-1/2 -translate-y-1/2"
                      : "left-12 top-1/2 -translate-y-1/2"
                  }`}
                >
                  <span className="text-amber-400 animate-pulse text-sm">✦</span>
                  <span className="tracking-wide">{step.hotspot.label}</span>
                </div>
              </div>
            </div>

            {/* Hotspot banner under screenshot */}
            <div className="bg-slate-950/90 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">🎯 Pointer:</span>
                <span className="font-semibold text-white">{step.hotspot.label}</span>
              </div>
              <span className="text-[11px] text-slate-400">
                Follow the pulsing radar 👆 on the screenshot above
              </span>
            </div>
          </div>

          {/* Action Instructions Grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            {step.instructions.map((inst, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-800">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-white text-[10px]">
                    {i + 1}
                  </span>
                  <span>{inst.title}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {inst.description}
                </p>
                <div className="rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-900">
                  👉 {inst.actionHighlight}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Test Action for Sample Images (Step 2) */}
          {step.sampleAction && (
            <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/70 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white text-xl">
                  ⚡
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                    Interactive Sample Test Shortcut
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Click to load <strong>eye dr.jpg</strong> into your workspace right now:
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleLoadSampleFromStep(step.sampleAction)}
                  className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-800 transition-colors whitespace-nowrap"
                >
                  {step.sampleAction.label}
                </button>
              </div>
            </div>
          )}

          {/* Success notice when sample loaded */}
          {loadedSampleNotice && (
            <div className="rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 px-4 py-2 text-xs font-bold animate-in fade-in">
              ✓ {loadedSampleNotice} (You can see it active once you enter the workspace!)
            </div>
          )}

          {/* Clinical Tip Box */}
          {step.tipText && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3.5 flex items-start gap-2.5 text-xs text-blue-950">
              <span className="text-base">💡</span>
              <div className="leading-relaxed font-medium">
                <strong>Clinical Note:</strong> {step.tipText}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Don't show again toggle */}
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 accent-slate-900"
            />
            <span>Do not open tutorial automatically on future visits</span>
          </label>

          {/* Back & Next Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrev}
              disabled={isFirstStep}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors shadow-sm"
            >
              ← Previous
            </button>

            {!isLastStep ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition-all"
              >
                <span>Next Step</span>
                <span>→</span>
              </button>
            ) : (
              <button
                onClick={() => onComplete(dontShowAgain)}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-emerald-700 transition-all text-sm"
              >
                <span>🚀 Complete Tour &amp; Enter RetinaScreen</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
