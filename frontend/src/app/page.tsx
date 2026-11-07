"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import FindingRow from "@/components/FindingRow";
import DiseaseDetailModal from "@/components/DiseaseDetailModal";
import ClinicalReportModal from "@/components/ClinicalReportModal";
import DiseaseEncyclopediaModal from "@/components/DiseaseEncyclopediaModal";
import BackendConfigModal from "@/components/BackendConfigModal";
import TutorialModal from "@/components/TutorialModal";
import SampleLibraryModal from "@/components/SampleLibraryModal";
import { Finding, PredictionResult, PatientSessionRecord, DISEASE_LABELS } from "@/lib/types";

type Status = "idle" | "loading" | "error";
type ViewMode = "standard" | "bengraham" | "colour" | "red_free" | "invert";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Clinical Metadata
  const [patientName, setPatientName] = useState("Jane Doe (PT-4820)");
  const [patientAge, setPatientAge] = useState("62");
  const [patientGender, setPatientGender] = useState("Female");
  const [eyeLaterality, setEyeLaterality] = useState<"OD (Right Eye)" | "OS (Left Eye)">("OD (Right Eye)");
  const [clinicianName, setClinicianName] = useState("Dr. R. Smith, MD");

  // View Modality & Zoom Controls
  const [viewMode, setViewMode] = useState<ViewMode>("standard");
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  // Modals & History
  const [selectedDiseaseDetail, setSelectedDiseaseDetail] = useState<string | null>(null);
  const [clinicalReportFinding, setClinicalReportFinding] = useState<Finding | null>(null);
  const [isEncyclopediaOpen, setIsEncyclopediaOpen] = useState(false);
  const [isBackendConfigOpen, setIsBackendConfigOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isSampleLibraryOpen, setIsSampleLibraryOpen] = useState(false);
  const [hasCompletedTutorial, setHasCompletedTutorial] = useState(true);
  const [sessionHistory, setSessionHistory] = useState<PatientSessionRecord[]>([]);

  // Backend Health & Custom URL
  const [customBackendUrl, setCustomBackendUrl] = useState<string>("");
  const [backendReady, setBackendReady] = useState<boolean | null>(null);
  const [backendLatency, setBackendLatency] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Check onboarding tutorial status on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const isScreenshotMode = params.get("screenshot_mode") === "1";
    const completed = localStorage.getItem("retinascreen_tutorial_completed");

    if (!completed && !isScreenshotMode) {
      setIsTutorialOpen(true);
      setHasCompletedTutorial(false);
    } else {
      setHasCompletedTutorial(true);
    }

    const demo = params.get("demo");
    if (demo === "loaded") {
      loadSampleCase("eye_dr.jpg", "Marcus Thorne (PT-701)", "58", "Male", "OD (Right Eye)");
    } else if (demo === "results" || demo === "filters") {
      loadSampleCase("eye_dr.jpg", "Marcus Thorne (PT-701)", "58", "Male", "OD (Right Eye)").then(() => {
        setTimeout(() => {
          setResult({
            is_fundus: true,
            findings: [
              { disease: "DR", probability: 0.94, bengraham_probability: 0.96, colour_probability: 0.88, threshold: 0.35, flagged: true },
              { disease: "DN", probability: 0.45, bengraham_probability: 0.48, colour_probability: 0.42, threshold: 0.36, flagged: true },
              { disease: "Glaucoma", probability: 0.12, bengraham_probability: 0.15, colour_probability: 0.10, threshold: 0.38, flagged: false },
              { disease: "ARMD", probability: 0.08, bengraham_probability: 0.07, colour_probability: 0.09, threshold: 0.32, flagged: false },
              { disease: "Cataract", probability: 0.04, bengraham_probability: 0.05, colour_probability: 0.03, threshold: 0.40, flagged: false },
              { disease: "BRVO", probability: 0.06, bengraham_probability: 0.08, colour_probability: 0.05, threshold: 0.30, flagged: false },
              { disease: "ODC", probability: 0.10, bengraham_probability: 0.12, colour_probability: 0.09, threshold: 0.37, flagged: false },
              { disease: "Normal", probability: 0.03, bengraham_probability: 0.04, colour_probability: 0.02, threshold: 0.50, flagged: false },
            ],
            flagged_diseases: ["DR", "DN"],
            triage_urgency: {
              level: "Urgent Referral (< 48 Hours)",
              color: "red",
              action: "Immediate comprehensive ophthalmic examination recommended due to active sight-threatening retinal lesions.",
            },
            iqa: {
              sharpness_score: 87.5,
              contrast_score: 91.2,
              uniformity_score: 89.0,
              quality_grade: "Grade A (Optimal Diagnostic Quality)",
              fov_coverage_pct: 95.4,
            },
            pipeline: "Dual-Stream v10 (Ben Graham + Colour-Enhanced)",
            num_bg_models: 3,
            num_colour_models: 3,
            img_size: 300,
          });
          if (demo === "filters") {
            setViewMode("bengraham");
          }
        }, 300);
      });
    }
  }, []);

  const handleCompleteTutorial = (dontShowAgain: boolean) => {
    if (dontShowAgain) {
      localStorage.setItem("retinascreen_tutorial_completed", "true");
    }
    setHasCompletedTutorial(true);
    setIsTutorialOpen(false);
  };

  // Check backend health on mount and on URL change
  useEffect(() => {
    const savedUrl = localStorage.getItem("retinascreen_backend_url");
    if (savedUrl) setCustomBackendUrl(savedUrl);

    const checkHealth = async () => {
      try {
        const start = Date.now();
        const headers: Record<string, string> = {};
        if (savedUrl) headers["x-backend-url"] = savedUrl;

        const res = await fetch("/api/health", { headers });
        const latency = Date.now() - start;
        if (res.ok) {
          setBackendReady(true);
          setBackendLatency(latency);
        } else {
          setBackendReady(false);
          setBackendLatency(null);
        }
      } catch {
        setBackendReady(false);
        setBackendLatency(null);
      }
    };

    checkHealth();
  }, [customBackendUrl]);

  const handleSaveBackendUrl = (url: string) => {
    setCustomBackendUrl(url);
    if (url) {
      localStorage.setItem("retinascreen_backend_url", url);
    } else {
      localStorage.removeItem("retinascreen_backend_url");
    }
  };

  const selectFile = useCallback((f: File | null) => {
    setResult(null);
    setError(null);
    setValidationError(null);
    setViewMode("standard");
    setZoomLevel(1.0);
    setFile(f);
    setPreviewUrl((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return f ? URL.createObjectURL(f) : null;
    });
  }, []);

  const loadSampleCase = async (
    fileName: string,
    samplePatient: string,
    sampleAge: string,
    sampleGender: string,
    sampleLaterality: "OD (Right Eye)" | "OS (Left Eye)" = "OD (Right Eye)"
  ) => {
    try {
      setStatus("loading");
      setError(null);
      setValidationError(null);
      const res = await fetch(`/samples/${fileName}`);
      if (!res.ok) throw new Error(`Could not load sample ${fileName}`);
      const blob = await res.blob();
      const sampleFile = new File([blob], fileName, { type: blob.type || "image/jpeg" });
      setPatientName(samplePatient);
      setPatientAge(sampleAge);
      setPatientGender(sampleGender);
      setEyeLaterality(sampleLaterality);
      selectFile(sampleFile);
      setStatus("idle");
    } catch (err) {
      setError(`Failed to load preset: ${err instanceof Error ? err.message : "Error"}`);
      setStatus("error");
    }
  };

  const loadNonFundusTest = () => {
    // Generate a synthetic non-fundus image to demonstrate the optical guardrail
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#38bdf8"; // Sky Blue
      ctx.fillRect(0, 0, 300, 300);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("NON-FUNDUS TEST", 60, 150);
      canvas.toBlob((blob) => {
        if (blob) {
          const fakeFile = new File([blob], "non_fundus_test.jpg", { type: "image/jpeg" });
          setPatientName("Non-Fundus Test Subject");
          selectFile(fakeFile);
        }
      }, "image/jpeg");
    }
  };

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragActive(false);
      const f = e.dataTransfer.files?.[0];
      if (f) selectFile(f);
    },
    [selectFile]
  );

  const analyze = useCallback(async () => {
    if (!file) return;
    setStatus("loading");
    setError(null);
    setValidationError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const headers: Record<string, string> = {};
      if (customBackendUrl) headers["x-backend-url"] = customBackendUrl;

      const res = await fetch("/api/predict", {
        method: "POST",
        headers,
        body: formData,
      });
      const data = await res.json();

      if (res.status === 422 || data.is_fundus === false) {
        setValidationError(data.error || "The uploaded file does not appear to be a valid retinal fundus photograph.");
        setResult(null);
        setStatus("idle");
        return;
      }

      if (!res.ok) throw new Error(data.error ?? "Analysis failed");

      const pred = data as PredictionResult;
      setResult(pred);
      setStatus("idle");

      // Append to Session Patient History
      const primaryFinding = pred.findings && pred.findings.length > 0 ? pred.findings[0] : null;
      const newRecord: PatientSessionRecord = {
        id: `REC-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        patientName: patientName || "Anonymous Patient",
        eyeLaterality: eyeLaterality,
        primaryDisease: primaryFinding ? `${primaryFinding.disease} (${DISEASE_LABELS[primaryFinding.disease] || primaryFinding.disease})` : "Normal",
        confidence: primaryFinding ? primaryFinding.probability : 0.95,
        urgencyLevel: pred.triage_urgency?.level || "Routine Screening",
        urgencyColor: pred.triage_urgency?.color || "emerald",
        previewUrl: previewUrl || "",
        result: pred,
      };

      setSessionHistory((prev) => [newRecord, ...prev.slice(0, 19)]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Analysis request failed.");
      setStatus("error");
    }
  }, [file, customBackendUrl, patientName, eyeLaterality, previewUrl]);

  const resetAll = () => {
    selectFile(null);
    setPatientName("Jane Doe (PT-4820)");
    setPatientAge("62");
    setPatientGender("Female");
    setEyeLaterality("OD (Right Eye)");
    setClinicianName("Dr. R. Smith, MD");
  };

  const exportHistoryCSV = () => {
    if (sessionHistory.length === 0) return;
    const headers = "ID,Timestamp,Patient Name,Eye Laterality,Primary Diagnosis,Confidence,Urgency Level\n";
    const rows = sessionHistory
      .map((r) => `"${r.id}","${r.timestamp}","${r.patientName}","${r.eyeLaterality}","${r.primaryDisease}",${(r.confidence * 100).toFixed(1)}%,"${r.urgencyLevel}"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `RetinaScreen_Session_Audit_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeImageSrc = () => {
    if (!previewUrl) return null;
    if (viewMode === "bengraham" && result?.previews?.bengraham) {
      return result.previews.bengraham;
    }
    if (viewMode === "colour" && result?.previews?.colour) {
      return result.previews.colour;
    }
    if (viewMode === "red_free" && result?.previews?.red_free) {
      return result.previews.red_free;
    }
    return previewUrl;
  };

  const isLoading = status === "loading";
  const primaryFinding = result?.findings && result.findings.length > 0 ? result.findings[0] : null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-slate-900 selection:text-white flex flex-col justify-between">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 py-3.5 shadow-sm print:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md">
              <span className="text-xl font-black">👁️</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-slate-900">
                  RetinaScreen
                </h1>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 border border-slate-200">
                  Dual-Stream AI v10
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500">
                10-Disease Multi-Label Ophthalmic Triage & Decision Support
              </p>
            </div>
          </div>

          {/* Quick Actions & Status */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Guided Tutorial Button */}
            <button
              onClick={() => setIsTutorialOpen(true)}
              className="relative flex items-center gap-1.5 rounded-xl border border-indigo-300 bg-indigo-50/90 px-3 py-1.5 text-xs font-bold text-indigo-900 hover:bg-indigo-100 shadow-sm transition-colors"
              title="Open Guided Interactive Tutorial"
            >
              <span className="relative flex h-2 w-2">
                {!hasCompletedTutorial && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                )}
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              <span>🎓 Tutorial</span>
            </button>

            {/* Test Images Gallery Button */}
            <button
              onClick={() => setIsSampleLibraryOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50/90 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100 shadow-sm transition-colors"
              title="Open Pre-Loaded Fundus Images Library"
            >
              <span>📁</span>
              <span>Test Images</span>
            </button>

            {/* Backend Status Pill */}
            <button
              onClick={() => setIsBackendConfigOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
              title="Configure Backend Connection"
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  backendReady ? "bg-emerald-500 animate-pulse" : "bg-amber-400"
                }`}
              />
              <span>{backendReady ? `FastAPI Live (${backendLatency || "<1"}ms)` : "Vercel Standalone Mode"}</span>
              <span className="text-[10px] text-slate-400">⚙️</span>
            </button>

            {/* Disease Handbook */}
            <button
              onClick={() => setIsEncyclopediaOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
            >
              <span>📖</span>
              <span>Encyclopedia</span>
            </button>

            {/* Admin Control Panel Link */}
            <Link
              href="/admin"
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 shadow-sm transition-colors"
            >
              <svg className="h-3.5 w-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              <span>Admin</span>
            </Link>

            {/* Reset Workspace */}
            <button
              onClick={resetAll}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-colors"
              title="Reset Workspace"
            >
              🔄 Reset
            </button>
          </div>
        </div>
      </header>

      {/* Quick Clinical Test Cases Bar */}
      <section className="border-b border-slate-200/80 bg-white px-6 py-2.5 shadow-sm print:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold uppercase tracking-wider text-[11px] text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 flex items-center gap-1">
              <span>⭐</span>
              <span>Test Images:</span>
            </span>

            {/* User Provided Sample Images */}
            <button
              onClick={() => loadSampleCase("eye_dr.jpg", "Marcus Thorne (PT-701)", "58", "Male", "OD (Right Eye)")}
              className="rounded-lg border border-red-300 bg-red-50 px-2.5 py-1 font-bold text-red-950 hover:bg-red-100 shadow-sm transition-all text-[11px] flex items-center gap-1"
              title="Diabetic Retinopathy sample (eye dr.jpg)"
            >
              <span>🔴</span>
              <span>DR (eye dr.jpg)</span>
            </button>
            <button
              onClick={() => loadSampleCase("glaucoma_1.jpg", "Elena Rostova (PT-619)", "66", "Female", "OS (Left Eye)")}
              className="rounded-lg border border-blue-300 bg-blue-50 px-2.5 py-1 font-bold text-blue-950 hover:bg-blue-100 shadow-sm transition-all text-[11px] flex items-center gap-1"
              title="Glaucoma sample (glaucoma 1.jpg)"
            >
              <span>🔵</span>
              <span>Glaucoma (glaucoma 1.jpg)</span>
            </button>
            <button
              onClick={() => loadSampleCase("cataract_1.jpg", "Arthur Miller (PT-302)", "72", "Male", "OD (Right Eye)")}
              className="rounded-lg border border-slate-300 bg-slate-100 px-2.5 py-1 font-bold text-slate-900 hover:bg-slate-200 shadow-sm transition-all text-[11px] flex items-center gap-1"
              title="Cataract sample (cataract 1.jpg)"
            >
              <span>⚪</span>
              <span>Cataract (cataract 1.jpg)</span>
            </button>

            {/* Other Benchmarks */}
            <span className="text-slate-300 mx-0.5">|</span>
            <button
              onClick={() => loadSampleCase("ARMD_Sample.jpeg", "Arthur Pendelton (PT-882)", "76", "Male", "OD (Right Eye)")}
              className="rounded-lg border border-amber-200 bg-amber-50/80 px-2.5 py-1 font-bold text-amber-900 hover:bg-amber-100 shadow-sm transition-all text-[11px]"
            >
              🟡 ARMD
            </button>
            <button
              onClick={() => loadSampleCase("BRVO_Sample.jpeg", "Marcus Vance (PT-914)", "65", "Male", "OD (Right Eye)")}
              className="rounded-lg border border-purple-200 bg-purple-50/80 px-2.5 py-1 font-bold text-purple-900 hover:bg-purple-100 shadow-sm transition-all text-[11px]"
            >
              🟣 BRVO
            </button>

            <button
              onClick={() => setIsSampleLibraryOpen(true)}
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 font-bold text-slate-800 hover:bg-slate-50 shadow-sm transition-all text-[11px] flex items-center gap-1"
            >
              <span>📁</span>
              <span>Browse All (7 Scans)</span>
            </button>
          </div>

          <button
            onClick={loadNonFundusTest}
            className="rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1 font-bold text-amber-900 hover:bg-amber-100 shadow-sm text-[11px]"
            title="Demonstrate Non-Fundus Image Rejection Guardrail"
          >
            ⚠️ Test Non-Fundus Guardrail
          </button>
        </div>
      </section>

      {/* Main Workspace Layout */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-6 print:hidden">
        {/* Non-Fundus Rejection Alert Banner */}
        {validationError && (
          <div className="mb-6 rounded-2xl border-2 border-red-300 bg-red-50 p-5 shadow-md animate-in fade-in duration-300">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-600 text-white font-black text-xl">
                ✕
              </div>
              <div className="flex-1 text-sm text-red-950">
                <h3 className="font-bold text-base text-red-900">
                  Clinical Image Validation Rejected (Non-Fundus File)
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-red-800 font-medium">
                  {validationError}
                </p>
                <div className="mt-3 flex items-center gap-3 text-xs">
                  <span className="rounded-md bg-red-100 px-2.5 py-1 font-bold text-red-900 border border-red-200">
                    Reason: Geometric, Chromatic & Texture Signature Mismatch
                  </span>
                  <button
                    onClick={() => setValidationError(null)}
                    className="font-bold text-red-700 underline hover:text-red-900"
                  >
                    Dismiss Alert
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-12 items-start">
          {/* ========================================================= */}
          {/* LEFT COLUMN: PATIENT DATA & IMAGE INSPECTION WORKSPACE (7 cols) */}
          {/* ========================================================= */}
          <div className="space-y-5 lg:col-span-7">
            {/* Patient Metadata Form */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">📋</span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Patient & Clinician Record
                  </h3>
                </div>
                <span className="text-[11px] font-medium text-slate-400">
                  Electronic Health Record (EHR) Integration
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase">
                    Patient Name / Hospital ID
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. John Doe (PT-1049)"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:border-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase">
                    Eye Laterality
                  </label>
                  <select
                    value={eyeLaterality}
                    onChange={(e) => setEyeLaterality(e.target.value as "OD (Right Eye)" | "OS (Left Eye)")}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:border-slate-900 focus:outline-none"
                  >
                    <option value="OD (Right Eye)">OD (Right Eye)</option>
                    <option value="OS (Left Eye)">OS (Left Eye)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase">
                    Age
                  </label>
                  <input
                    type="text"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:border-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase">
                    Gender
                  </label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:border-slate-900 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase">
                    Attending Clinician
                  </label>
                  <input
                    type="text"
                    value={clinicianName}
                    onChange={(e) => setClinicianName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:border-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Dropzone & Image Viewer */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🔬</span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Multi-Modal Fundus Viewport
                  </h3>
                </div>
                {previewUrl && (
                  <button
                    onClick={() => selectFile(null)}
                    className="text-xs font-bold text-red-600 hover:text-red-800"
                  >
                    ✕ Remove Image
                  </button>
                )}
              </div>

              {/* Upload Dropzone if no image */}
              {!previewUrl ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={onDrop}
                  onClick={() => inputRef.current?.click()}
                  className={`flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                    dragActive
                      ? "border-slate-900 bg-slate-100/80 scale-[0.99]"
                      : "border-slate-300 bg-slate-50/50 hover:bg-slate-100/40 hover:border-slate-400"
                  }`}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) selectFile(f);
                    }}
                  />
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md border border-slate-200 text-3xl mb-3">
                    📸
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">
                    Upload Patient Fundus Photograph
                  </h4>
                  <p className="mt-1 max-w-sm text-xs text-slate-500">
                    Drag and drop high-resolution JPEG/PNG, or click to browse local files.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                    <span>Compatible with: Topcon • Canon • Zeiss • Eyer Handheld</span>
                  </div>

                  {/* Test Images Helper inside dropzone */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mt-5 w-full max-w-lg rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/90 p-4 text-center shadow-sm"
                  >
                    <div className="flex items-center justify-center gap-1.5 text-xs font-black text-amber-950">
                      <span>💡</span>
                      <span>Don&apos;t have a fundus image? Test with our pre-loaded scans:</span>
                    </div>
                    <p className="mt-1 text-[11px] text-amber-800">
                      Click any button below to instantly load a test scan into the viewer:
                    </p>
                    <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => loadSampleCase("eye_dr.jpg", "Marcus Thorne (PT-701)", "58", "Male", "OD (Right Eye)")}
                        className="rounded-xl bg-red-700 hover:bg-red-800 text-white px-3 py-1.5 text-xs font-bold shadow-sm transition-all flex items-center gap-1"
                      >
                        <span>🔴</span>
                        <span>Diabetic Retinopathy</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => loadSampleCase("glaucoma_1.jpg", "Elena Rostova (PT-619)", "66", "Female", "OS (Left Eye)")}
                        className="rounded-xl bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 text-xs font-bold shadow-sm transition-all flex items-center gap-1"
                      >
                        <span>🔵</span>
                        <span>Glaucoma</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => loadSampleCase("cataract_1.jpg", "Arthur Miller (PT-302)", "72", "Male", "OD (Right Eye)")}
                        className="rounded-xl bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 text-xs font-bold shadow-sm transition-all flex items-center gap-1"
                      >
                        <span>⚪</span>
                        <span>Cataract</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsSampleLibraryOpen(true)}
                        className="rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 px-3 py-1.5 text-xs font-bold shadow-sm transition-all flex items-center gap-1"
                      >
                        <span>📁</span>
                        <span>Full Library...</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Multi-Modal Inspection Deck */
                <div className="space-y-3">
                  {/* Modality Tabs */}
                  <div className="flex items-center justify-between flex-wrap gap-2 rounded-xl bg-slate-100 p-1.5 text-xs font-bold">
                    <div className="flex items-center gap-1 flex-wrap">
                      <button
                        onClick={() => setViewMode("standard")}
                        className={`rounded-lg px-3 py-1.5 transition-all ${
                          viewMode === "standard"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        👁️ Natural Color
                      </button>
                      <button
                        onClick={() => setViewMode("bengraham")}
                        className={`rounded-lg px-3 py-1.5 transition-all ${
                          viewMode === "bengraham"
                            ? "bg-slate-900 text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        🕸️ Stream A (Ben Graham)
                      </button>
                      <button
                        onClick={() => setViewMode("colour")}
                        className={`rounded-lg px-3 py-1.5 transition-all ${
                          viewMode === "colour"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        🎨 Stream B (Colour)
                      </button>
                      <button
                        onClick={() => setViewMode("red_free")}
                        className={`rounded-lg px-3 py-1.5 transition-all ${
                          viewMode === "red_free"
                            ? "bg-emerald-800 text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        🟢 Red-Free (Green)
                      </button>
                      <button
                        onClick={() => setViewMode("invert")}
                        className={`rounded-lg px-3 py-1.5 transition-all ${
                          viewMode === "invert"
                            ? "bg-black text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        🌓 Invert
                      </button>
                    </div>

                    {/* Magnification Controls */}
                    <div className="flex items-center gap-2 pr-1">
                      <span className="text-[11px] text-slate-500 font-semibold">Zoom:</span>
                      <input
                        type="range"
                        min="1.0"
                        max="2.5"
                        step="0.1"
                        value={zoomLevel}
                        onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                        className="w-20 accent-slate-900 cursor-pointer"
                      />
                      <span className="font-mono text-[11px] text-slate-700 font-bold w-8">
                        {zoomLevel.toFixed(1)}x
                      </span>
                      {zoomLevel > 1.0 && (
                        <button
                          onClick={() => setZoomLevel(1.0)}
                          className="text-[10px] text-slate-500 hover:text-slate-900 underline"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Image Viewport */}
                  <div className="relative flex min-h-[380px] max-h-[460px] items-center justify-center overflow-hidden rounded-2xl bg-slate-950 p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeImageSrc() || previewUrl}
                      alt="Fundus Viewport"
                      className={`max-h-[440px] w-auto max-w-full rounded-xl object-contain transition-transform duration-200 ${
                        viewMode === "invert" ? "invert contrast-125" : ""
                      }`}
                      style={{
                        transform: `scale(${zoomLevel})`,
                      }}
                    />

                    {/* Viewport Badge */}
                    <div className="absolute bottom-4 left-4 rounded-lg bg-black/70 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                      {viewMode === "standard" && "Original RGB Fundus Capture"}
                      {viewMode === "bengraham" && "Stream A: High-Pass Gaussian Local Subtraction (Vasculature)"}
                      {viewMode === "colour" && "Stream B: Reinhard CIELAB Standardized Color (Drusen & Haze)"}
                      {viewMode === "red_free" && "Ophthalmic Green-Filter Simulation (RNFL & Hemorrhages)"}
                      {viewMode === "invert" && "Inverted Polarity (Optic Margin Tracing)"}
                    </div>
                  </div>

                  {/* Primary Action Button */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-slate-500">
                      File: <strong>{file?.name || "Fundus Scan"}</strong> {file ? `(${(file.size / 1024).toFixed(1)} KB)` : ""}
                    </div>

                    <button
                      onClick={analyze}
                      disabled={isLoading}
                      className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-slate-800 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Executing Dual-Stream AI...</span>
                        </>
                      ) : (
                        <>
                          <span>⚡</span>
                          <span>Run Diagnostic Inference</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: CLINICAL DECISION SUPPORT & RESULTS (5 cols) */}
          {/* ========================================================= */}
          <div className="space-y-5 lg:col-span-5">
            {/* Error Message */}
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-900 shadow-sm">
                ⚠️ {error}
              </div>
            )}

            {/* Awaiting State */}
            {!result && !isLoading && !validationError && (
              <div className="flex min-h-[480px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl mb-3">
                  🩺
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  Awaiting Diagnostic Input
                </h3>
                <p className="mt-1.5 max-w-xs text-xs text-slate-500 leading-relaxed">
                  Upload a fundus image or click a 1-click clinical sample above to execute 6-model dual-stream inference.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-2 text-left w-full max-w-xs text-[11px] text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div>• 10 Retinal Pathologies</div>
                  <div>• Automated IQA Grade</div>
                  <div>• Urgency Triage Level</div>
                  <div>• Printable Medical PDF</div>
                </div>
              </div>
            )}

            {/* Live Results Dashboard */}
            {result && (
              <div className="space-y-5 animate-in fade-in duration-300">
                {/* 1. Clinical Triage Urgency Level Banner */}
                {result.triage_urgency && (
                  <div
                    className={`rounded-2xl border p-5 shadow-sm ${
                      result.triage_urgency.color === "red"
                        ? "border-red-300 bg-red-50 text-red-950"
                        : result.triage_urgency.color === "amber"
                        ? "border-amber-300 bg-amber-50 text-amber-950"
                        : "border-emerald-300 bg-emerald-50 text-emerald-950"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {result.triage_urgency.color === "red"
                            ? "🚨"
                            : result.triage_urgency.color === "amber"
                            ? "⚠️"
                            : "✅"}
                        </span>
                        <h4 className="text-xs font-bold uppercase tracking-wider">
                          Clinical Triage Protocol
                        </h4>
                      </div>
                      <span
                        className={`rounded-md px-2.5 py-1 text-xs font-black uppercase ${
                          result.triage_urgency.color === "red"
                            ? "bg-red-600 text-white"
                            : result.triage_urgency.color === "amber"
                            ? "bg-amber-600 text-white"
                            : "bg-emerald-600 text-white"
                        }`}
                      >
                        {result.triage_urgency.level}
                      </span>
                    </div>
                    <p className="mt-2 text-xs font-medium leading-relaxed opacity-90">
                      {result.triage_urgency.action}
                    </p>
                  </div>
                )}

                {/* 2. Automated Image Quality Assessment (IQA) */}
                {result.iqa && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        📊 Automated Quality Assessment (IQA)
                      </h4>
                      <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-800 border border-slate-200">
                        {result.iqa.quality_grade}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 text-xs text-center">
                      <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                        <div className="text-[10px] uppercase font-bold text-slate-500">Focus Sharpness</div>
                        <div className="text-sm font-black text-slate-900 mt-0.5">{result.iqa.sharpness_score}%</div>
                      </div>
                      <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                        <div className="text-[10px] uppercase font-bold text-slate-500">Uniformity</div>
                        <div className="text-sm font-black text-slate-900 mt-0.5">{result.iqa.uniformity_score}%</div>
                      </div>
                      <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                        <div className="text-[10px] uppercase font-bold text-slate-500">Retinal Contrast</div>
                        <div className="text-sm font-black text-slate-900 mt-0.5">{result.iqa.contrast_score}%</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Multi-Label Finding List */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                        Calibrated Multi-Label Diagnoses
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Independent Sigmoid Probabilities vs Calibrated Thresholds
                      </p>
                    </div>
                    {primaryFinding && (
                      <button
                        onClick={() => setClinicalReportFinding(primaryFinding)}
                        className="rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-slate-800 transition-colors"
                      >
                        📄 View Report
                      </button>
                    )}
                  </div>

                  {/* Finding Rows */}
                  <div className="divide-y divide-slate-100">
                    {result.findings.map((f) => (
                      <FindingRow
                        key={f.disease}
                        finding={f}
                        onOpenDetails={(code) => setSelectedDiseaseDetail(code)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM SECTION: SESSION PATIENT TRIAGE AUDIT LOG */}
        {/* ========================================================= */}
        {sessionHistory.length > 0 && (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">📋</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Clinical Session Patient Triage Audit Log
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live record of patients triaged during current screening session ({sessionHistory.length} total)
                  </p>
                </div>
              </div>
              <button
                onClick={exportHistoryCSV}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 shadow-sm transition-colors"
              >
                📥 Export Session CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-600">
                    <th className="p-3">Record ID</th>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Patient</th>
                    <th className="p-3">Laterality</th>
                    <th className="p-3">Primary Diagnosis</th>
                    <th className="p-3">Confidence</th>
                    <th className="p-3">Triage Urgency</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {sessionHistory.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-900">{rec.id}</td>
                      <td className="p-3 text-slate-500">{rec.timestamp}</td>
                      <td className="p-3 font-semibold">{rec.patientName}</td>
                      <td className="p-3">{rec.eyeLaterality}</td>
                      <td className="p-3 font-bold text-slate-900">{rec.primaryDisease}</td>
                      <td className="p-3 font-mono font-bold">{(rec.confidence * 100).toFixed(0)}%</td>
                      <td className="p-3">
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            rec.urgencyColor === "red"
                              ? "bg-red-100 text-red-800"
                              : rec.urgencyColor === "amber"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {rec.urgencyLevel}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setResult(rec.result);
                            setPreviewUrl(rec.previewUrl);
                            setPatientName(rec.patientName);
                            setEyeLaterality(rec.eyeLaterality as "OD (Right Eye)" | "OS (Left Eye)");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-200"
                        >
                          Re-Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* Footer & Medical Disclaimer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-xs text-slate-500 print:hidden">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 RetinaScreen — Dual-Stream Deep Learning & Ophthalmic Decision Support
          </span>
          <span className="text-[11px] text-slate-400">
            Assistive Clinical AI Triage Tool • Compliant with WHO & ICD-10 Ophthalmic Guidelines
          </span>
        </div>
      </footer>

      {/* Modals */}
      <DiseaseDetailModal
        diseaseCode={selectedDiseaseDetail}
        onClose={() => setSelectedDiseaseDetail(null)}
      />

      <DiseaseEncyclopediaModal
        isOpen={isEncyclopediaOpen}
        onClose={() => setIsEncyclopediaOpen(false)}
      />

      <BackendConfigModal
        isOpen={isBackendConfigOpen}
        onClose={() => setIsBackendConfigOpen(false)}
        currentUrl={customBackendUrl}
        onSaveUrl={handleSaveBackendUrl}
        isOnline={backendReady}
        latencyMs={backendLatency}
      />

      {clinicalReportFinding && (
        <ClinicalReportModal
          primaryFinding={clinicalReportFinding}
          allFindings={result?.findings || []}
          previewUrl={previewUrl}
          onClose={() => setClinicalReportFinding(null)}
          patientName={patientName}
          patientAge={patientAge}
          patientGender={patientGender}
          eyeLaterality={eyeLaterality}
          clinicianName={clinicianName}
        />
      )}

      {/* Interactive New User Tutorial Modal */}
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        onComplete={handleCompleteTutorial}
        onLoadSample={(fileName, samplePatient, sampleAge, sampleGender, sampleLaterality) => {
          loadSampleCase(fileName, samplePatient, sampleAge, sampleGender, sampleLaterality);
        }}
      />

      {/* Pre-Loaded Fundus Images Library Modal */}
      <SampleLibraryModal
        isOpen={isSampleLibraryOpen}
        onClose={() => setIsSampleLibraryOpen(false)}
        onSelectSample={(fileName, samplePatient, sampleAge, sampleGender, sampleLaterality) => {
          loadSampleCase(fileName, samplePatient, sampleAge, sampleGender, sampleLaterality);
        }}
      />
    </div>
  );
}
