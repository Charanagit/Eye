"use client";

import React, { useState, useEffect } from "react";

export interface TutorialStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  keyPoints: string[];
  screenshotSrc: string;
  screenshotAlt: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: "welcome-overview",
    stepNumber: 1,
    title: "RetinaScreen Overview",
    description:
      "A clinical decision-support tool that analyzes retinal fundus photographs for signs of common eye diseases using deep learning.",
    keyPoints: [
      "Left workspace: Patient details, image upload, and specialized ophthalmic filters.",
      "Right workspace: AI triage urgency, quality check, and multi-label findings.",
    ],
    screenshotSrc: "/tutorial/step1_overview.png",
    screenshotAlt: "RetinaScreen clean workspace overview",
  },
  {
    id: "sample-images",
    stepNumber: 2,
    title: "Sample Fundus Images",
    description:
      "If you do not have retinal scans on hand, you can use our pre-loaded test images to explore the system.",
    keyPoints: [
      "Click 'Sample Images' in the top bar to open the gallery.",
      "Includes real scans for Diabetic Retinopathy (eye dr.jpg), Glaucoma (glaucoma 1.jpg), and Cataract (cataract 1.jpg).",
      "Click 'Load Scan' on any image to start testing immediately.",
    ],
    screenshotSrc: "/tutorial/step2_samples.png",
    screenshotAlt: "Sample fundus images dialog",
  },
  {
    id: "upload-scan",
    stepNumber: 3,
    title: "Uploading a Retinal Scan",
    description:
      "Upload high-resolution fundus images from any standard ophthalmic camera.",
    keyPoints: [
      "Drag and drop a JPEG or PNG image directly into the viewport box.",
      "Or click inside the box to browse your computer.",
      "Optionally enter patient identifier and age for clinical recordkeeping.",
    ],
    screenshotSrc: "/tutorial/step3_upload.png",
    screenshotAlt: "Patient information and upload viewport",
  },
  {
    id: "run-analysis",
    stepNumber: 4,
    title: "Running AI Analysis",
    description:
      "Once an image is loaded, run the dual-stream neural network models in one click.",
    keyPoints: [
      "Click the black 'Run Diagnostic Inference' button below the image.",
      "Analyzes both retinal vasculature and standardized color patterns.",
      "Takes approximately one second to complete.",
    ],
    screenshotSrc: "/tutorial/step4_inference.png",
    screenshotAlt: "Run diagnostic inference button highlighted",
  },
  {
    id: "modality-filters",
    stepNumber: 5,
    title: "Viewing Filter Modalities & Zoom",
    description:
      "Inspect fine retinal details using specialized ophthalmic filters.",
    keyPoints: [
      "Stream A (Ben Graham): Emphasizes blood vessels and microaneurysms.",
      "Red-Free: Simulates green filter to highlight hemorrhages.",
      "Use the zoom slider (up to 2.5x) to examine the optic cup and macula.",
    ],
    screenshotSrc: "/tutorial/step5_filters.png",
    screenshotAlt: "Modality filter tabs and zoom slider highlighted",
  },
  {
    id: "results-report",
    stepNumber: 6,
    title: "Clinical Results & PDF Report",
    description:
      "Review calibrated disease probabilities and export formal medical summaries.",
    keyPoints: [
      "Urgency Protocol: Recommends referral timing (Urgent, Priority, or Routine).",
      "Calibrated Findings: Individual probabilities for 10 eye conditions.",
      "Click 'View Report' to preview and print a clean diagnostic PDF summary.",
    ],
    screenshotSrc: "/tutorial/step6_results.png",
    screenshotAlt: "Clinical results, triage protocol, and report button highlighted",
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
}: TutorialModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(true);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative flex flex-col max-h-[92vh] w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1">
          <div
            className="h-full bg-slate-900 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-3.5 bg-white">
          <div className="flex items-center gap-2.5">
            <span className="text-base font-bold text-slate-900">
              Quick Guide
            </span>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
              {step.stepNumber} of {TUTORIAL_STEPS.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onComplete(dontShowAgain)}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 px-2.5 py-1 rounded transition-colors"
            >
              Skip
            </button>
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors text-xs font-semibold"
              aria-label="Close tutorial"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Step Navigation Dots */}
        <div className="flex items-center justify-center gap-1.5 border-b border-slate-100 bg-slate-50 py-2">
          {TUTORIAL_STEPS.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentStepIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentStepIndex
                  ? "w-6 bg-slate-900"
                  : idx < currentStepIndex
                  ? "w-2 bg-slate-400"
                  : "w-2 bg-slate-200"
              }`}
              title={s.title}
            />
          ))}
        </div>

        {/* Main Content Area */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-4 flex-1">
          {/* Step Title & Description */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {step.title}
            </h2>
            <p className="mt-0.5 text-xs text-slate-600">
              {step.description}
            </p>
          </div>

          {/* Screenshot Display with In-Image Section Highlight */}
          <div className="relative rounded-xl border border-slate-200 bg-slate-950 overflow-hidden shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={step.screenshotSrc}
              alt={step.screenshotAlt}
              className="w-full h-auto object-contain max-h-[380px]"
            />
          </div>

          {/* Key Bullet Instructions */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-1.5">
            {step.keyPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                <span className="text-slate-400 mt-0.5">•</span>
                <span className="leading-relaxed">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="border-t border-slate-200 bg-white px-6 py-3.5 flex items-center justify-between">
          {/* Don't show again toggle */}
          <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 accent-slate-900"
            />
            <span>Do not open on startup</span>
          </label>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={isFirstStep}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-2xs"
            >
              Back
            </button>

            {!isLastStep ? (
              <button
                onClick={handleNext}
                className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-colors shadow-2xs"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={() => onComplete(dontShowAgain)}
                className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-colors shadow-2xs"
              >
                Enter Workspace
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
