"use client";

import React, { useState } from "react";

interface SampleImageItem {
  id: string;
  title: string;
  diseaseLabel: string;
  category: "user_samples" | "benchmark_samples";
  fileName: string;
  badgeColor: string;
  description: string;
  clinicalFeatures: string[];
  patientName: string;
  patientAge: string;
  patientGender: string;
  eyeLaterality: "OD (Right Eye)" | "OS (Left Eye)";
}

const SAMPLE_IMAGES: SampleImageItem[] = [
  // User-provided sample images from the folder
  {
    id: "user-dr",
    title: "Diabetic Retinopathy (DR) Test Scan",
    diseaseLabel: "Diabetic Retinopathy",
    category: "user_samples",
    fileName: "eye_dr.jpg",
    badgeColor: "bg-red-100 text-red-800 border-red-200",
    description: "Sample fundus photograph showing severe microvascular diabetic alterations with hard exudates and hemorrhages.",
    clinicalFeatures: ["Microaneurysms", "Dot & Blot Hemorrhages", "Hard Lipid Exudates"],
    patientName: "Marcus Thorne (PT-701)",
    patientAge: "58",
    patientGender: "Male",
    eyeLaterality: "OD (Right Eye)",
  },
  {
    id: "user-glaucoma",
    title: "Glaucoma Optic Neuropathy Test Scan",
    diseaseLabel: "Glaucoma (Optic Cupping)",
    category: "user_samples",
    fileName: "glaucoma_1.jpg",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    description: "Sample fundus photograph showing deep optic disc excavation and pathological cup-to-disc ratio enlargement.",
    clinicalFeatures: ["Enlarged Optic Cup (> 0.7 CDR)", "Neuroretinal Rim Thinning", "Optic Margin Notching"],
    patientName: "Elena Rostova (PT-619)",
    patientAge: "66",
    patientGender: "Female",
    eyeLaterality: "OS (Left Eye)",
  },
  {
    id: "user-cataract",
    title: "Cataract Media Opacity Test Scan",
    diseaseLabel: "Cataract (Media Haze)",
    category: "user_samples",
    fileName: "cataract_1.jpg",
    badgeColor: "bg-slate-200 text-slate-800 border-slate-300",
    description: "Sample photograph showing crystalline lens opacity leading to diffuse optical media haze and obscured retinal details.",
    clinicalFeatures: ["Nuclear Lens Sclerosis", "Diffuse Retinal Blurring", "Attenuation of Fine Macular Vessels"],
    patientName: "Arthur Miller (PT-302)",
    patientAge: "72",
    patientGender: "Male",
    eyeLaterality: "OD (Right Eye)",
  },

  // Additional Benchmark Samples
  {
    id: "bm-dr3",
    title: "Diabetic Retinopathy Grade 3 (Severe NPDR)",
    diseaseLabel: "Diabetic Retinopathy",
    category: "benchmark_samples",
    fileName: "Diabetic_Retinopathy_Dr3.jpeg",
    badgeColor: "bg-red-100 text-red-800 border-red-200",
    description: "Benchmark clinic capture of advanced diabetic retinopathy with extensive retinal microvascular lesions.",
    clinicalFeatures: ["Extensive Intraretinal Hemorrhages", "Cotton Wool Spots", "Venous Beading"],
    patientName: "Sarah Connor (PT-104)",
    patientAge: "54",
    patientGender: "Female",
    eyeLaterality: "OD (Right Eye)",
  },
  {
    id: "bm-armd",
    title: "Age-Related Macular Degeneration (ARMD)",
    diseaseLabel: "Macular Degeneration",
    category: "benchmark_samples",
    fileName: "ARMD_Sample.jpeg",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    description: "High-resolution capture displaying confluent drusen and retinal pigment epithelium changes in the central macula.",
    clinicalFeatures: ["Confluent Soft Drusen", "Pigmentary Clumping", "Central Macular Geographic Atrophy"],
    patientName: "Arthur Pendelton (PT-882)",
    patientAge: "76",
    patientGender: "Male",
    eyeLaterality: "OD (Right Eye)",
  },
  {
    id: "bm-glaucoma-eyer",
    title: "Glaucoma Optic Cupping (Eyer Handheld)",
    diseaseLabel: "Glaucoma",
    category: "benchmark_samples",
    fileName: "Glaucoma_Eyer_g2.png",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    description: "Handheld ophthalmic camera scan capturing pronounced vertical cup elongation and retinal nerve fiber layer thinning.",
    clinicalFeatures: ["Vertical Optic Cup Elongation", "ISNT Rule Violation", "Peripapillary Chorioretinal Atrophy"],
    patientName: "Grace Hopper (PT-520)",
    patientAge: "69",
    patientGender: "Female",
    eyeLaterality: "OS (Left Eye)",
  },
  {
    id: "bm-brvo",
    title: "Branch Retinal Vein Occlusion (BRVO)",
    diseaseLabel: "Vein Occlusion (BRVO)",
    category: "benchmark_samples",
    fileName: "BRVO_Sample.jpeg",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    description: "Acute retinal vascular blockage with flame-shaped hemorrhages along the superior temporal vascular arcade.",
    clinicalFeatures: ["Flame Hemorrhages in Arcade Sector", "Vascular Tortuosity & Engorgement", "Macular Edema Risk"],
    patientName: "Marcus Vance (PT-914)",
    patientAge: "65",
    patientGender: "Male",
    eyeLaterality: "OD (Right Eye)",
  },
];

interface SampleLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (
    fileName: string,
    patientName: string,
    patientAge: string,
    patientGender: string,
    eyeLaterality: "OD (Right Eye)" | "OS (Left Eye)"
  ) => void;
}

export default function SampleLibraryModal({
  isOpen,
  onClose,
  onSelectSample,
}: SampleLibraryModalProps) {
  const [filter, setFilter] = useState<"all" | "user" | "benchmark">("all");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredSamples = SAMPLE_IMAGES.filter((s) => {
    if (filter === "user") return s.category === "user_samples";
    if (filter === "benchmark") return s.category === "benchmark_samples";
    return true;
  });

  const handleDownload = async (item: SampleImageItem, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setDownloadingId(item.id);
      const res = await fetch(`/samples/${item.fileName}`);
      if (!res.ok) throw new Error("File not found");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = item.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(`Could not download image: ${err instanceof Error ? err.message : "Error"}`);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative flex flex-col max-h-[90vh] w-full max-w-5xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow">
              <span className="text-xl">📁</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900">
                  Fundus Test Images Library
                </h2>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 border border-blue-200">
                  {SAMPLE_IMAGES.length} Pre-Loaded Images
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Ready-to-use retinal fundus scans for clinicians, students, and new users without their own fundus camera
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors text-sm font-bold"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Filter Pills & Info Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-100 bg-white px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Filter:
            </span>
            <button
              onClick={() => setFilter("all")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                filter === "all"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All Scans ({SAMPLE_IMAGES.length})
            </button>
            <button
              onClick={() => setFilter("user")}
              className={`flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                filter === "user"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-200"
              }`}
            >
              <span>⭐</span>
              <span>Your Test Folder Images (3)</span>
            </button>
            <button
              onClick={() => setFilter("benchmark")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                filter === "benchmark"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Clinical Benchmarks (4)
            </button>
          </div>

          <div className="text-xs font-medium text-slate-500">
            Click <strong>&quot;Load Image&quot;</strong> to test immediately, or <strong>&quot;Download&quot;</strong> to practice uploading!
          </div>
        </div>

        {/* Image Grid */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* User Test Folder Highlight Section */}
          {(filter === "all" || filter === "user") && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-amber-500 px-2 py-0.5 text-[11px] font-black uppercase tracking-wider text-white">
                  ⭐ From Your Test Folder
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  User Created Fundus Samples (Ready to Test)
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {SAMPLE_IMAGES.filter((s) => s.category === "user_samples").map((item) => (
                  <div
                    key={item.id}
                    className="group relative flex flex-col justify-between rounded-2xl border-2 border-amber-200 bg-amber-50/30 p-4 transition-all hover:border-amber-400 hover:shadow-md"
                  >
                    <div>
                      {/* Thumbnail Preview */}
                      <div className="relative mb-3 flex h-40 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-950">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`/samples/${item.fileName}`}
                          alt={item.title}
                          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                        <span className={`absolute top-2 left-2 rounded-md border px-2 py-0.5 text-[10px] font-bold ${item.badgeColor}`}>
                          {item.diseaseLabel}
                        </span>
                        <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-mono text-white backdrop-blur">
                          {item.fileName}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>

                      {/* Clinical feature tags */}
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {item.clinicalFeatures.map((f, i) => (
                          <span
                            key={i}
                            className="rounded bg-white/80 border border-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
                          >
                            • {f}
                          </span>
                        ))}
                      </div>

                      {/* Patient metadata preview */}
                      <div className="mt-3 rounded-lg bg-white/70 p-2 text-[11px] text-slate-600 border border-slate-100 flex items-center justify-between">
                        <span>{item.patientName}</span>
                        <span className="font-semibold text-slate-800">{item.eyeLaterality}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex items-center gap-2 pt-2 border-t border-amber-100">
                      <button
                        onClick={() => {
                          onSelectSample(
                            item.fileName,
                            item.patientName,
                            item.patientAge,
                            item.patientGender,
                            item.eyeLaterality
                          );
                          onClose();
                        }}
                        className="flex-1 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-all text-center"
                      >
                        ⚡ Load Scan
                      </button>
                      <button
                        onClick={(e) => handleDownload(item, e)}
                        disabled={downloadingId === item.id}
                        title="Download image file to test dragging & dropping"
                        className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 shadow-sm transition-all"
                      >
                        {downloadingId === item.id ? "⏳" : "📥"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Benchmark Archive Section */}
          {(filter === "all" || filter === "benchmark") && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-slate-700 px-2 py-0.5 text-[11px] font-black uppercase tracking-wider text-white">
                  🔬 Clinical Benchmarks
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Standard Ophthalmic Evaluation Presets
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {SAMPLE_IMAGES.filter((s) => s.category === "benchmark_samples").map((item) => (
                  <div
                    key={item.id}
                    className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-400 hover:shadow-md"
                  >
                    <div>
                      {/* Thumbnail Preview */}
                      <div className="relative mb-3 flex h-40 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-950">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`/samples/${item.fileName}`}
                          alt={item.title}
                          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                        <span className={`absolute top-2 left-2 rounded-md border px-2 py-0.5 text-[10px] font-bold ${item.badgeColor}`}>
                          {item.diseaseLabel}
                        </span>
                        <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-mono text-white backdrop-blur">
                          {item.fileName}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>

                      {/* Clinical feature tags */}
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {item.clinicalFeatures.map((f, i) => (
                          <span
                            key={i}
                            className="rounded bg-slate-50 border border-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
                          >
                            • {f}
                          </span>
                        ))}
                      </div>

                      {/* Patient metadata preview */}
                      <div className="mt-3 rounded-lg bg-slate-50 p-2 text-[11px] text-slate-600 border border-slate-100 flex items-center justify-between">
                        <span>{item.patientName}</span>
                        <span className="font-semibold text-slate-800">{item.eyeLaterality}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          onSelectSample(
                            item.fileName,
                            item.patientName,
                            item.patientAge,
                            item.patientGender,
                            item.eyeLaterality
                          );
                          onClose();
                        }}
                        className="flex-1 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-all text-center"
                      >
                        ⚡ Load Scan
                      </button>
                      <button
                        onClick={(e) => handleDownload(item, e)}
                        disabled={downloadingId === item.id}
                        title="Download image file to test dragging & dropping"
                        className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 shadow-sm transition-all"
                      >
                        {downloadingId === item.id ? "⏳" : "📥"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>💡</span>
            <span>You can also test the optical guardrail with non-fundus pictures on the main screen.</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-300 transition-colors"
          >
            Close Library
          </button>
        </div>
      </div>
    </div>
  );
}
