"use client";

import React, { useState } from "react";

interface SampleImageItem {
  id: string;
  title: string;
  diseaseLabel: string;
  fileName: string;
  description: string;
  patientName: string;
  patientAge: string;
  patientGender: string;
  eyeLaterality: "OD (Right Eye)" | "OS (Left Eye)";
}

const SAMPLE_IMAGES: SampleImageItem[] = [
  {
    id: "dr-user",
    title: "Diabetic Retinopathy",
    diseaseLabel: "DR",
    fileName: "eye_dr.jpg",
    description: "Retinal scan displaying microaneurysms, dot hemorrhages, and hard lipid exudates.",
    patientName: "Marcus Thorne (PT-701)",
    patientAge: "58",
    patientGender: "Male",
    eyeLaterality: "OD (Right Eye)",
  },
  {
    id: "glaucoma-user",
    title: "Glaucoma (Optic Cupping)",
    diseaseLabel: "Glaucoma",
    fileName: "glaucoma_1.jpg",
    description: "Deep optic disc excavation with vertical cup enlargement and neuroretinal rim thinning.",
    patientName: "Elena Rostova (PT-619)",
    patientAge: "66",
    patientGender: "Female",
    eyeLaterality: "OS (Left Eye)",
  },
  {
    id: "cataract-user",
    title: "Cataract (Media Haze)",
    diseaseLabel: "Cataract",
    fileName: "cataract_1.jpg",
    description: "Lens opacity creating diffuse optical haze and obscured retinal vasculature.",
    patientName: "Arthur Miller (PT-302)",
    patientAge: "72",
    patientGender: "Male",
    eyeLaterality: "OD (Right Eye)",
  },
  {
    id: "armd-sample",
    title: "Age-Related Macular Degeneration",
    diseaseLabel: "ARMD",
    fileName: "ARMD_Sample.jpeg",
    description: "Confluent drusen deposits and retinal pigment epithelial changes in the macula.",
    patientName: "Arthur Pendelton (PT-882)",
    patientAge: "76",
    patientGender: "Male",
    eyeLaterality: "OD (Right Eye)",
  },
  {
    id: "brvo-sample",
    title: "Branch Retinal Vein Occlusion",
    diseaseLabel: "BRVO",
    fileName: "BRVO_Sample.jpeg",
    description: "Venous occlusion with flame hemorrhages along the superior temporal arcade.",
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
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative flex flex-col max-h-[85vh] w-full max-w-4xl rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-white">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Sample Fundus Images
            </h2>
            <p className="text-xs text-slate-500">
              Select a scan to test the triage screener without your own fundus camera
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors text-sm font-semibold"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Image Grid */}
        <div className="overflow-y-auto p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SAMPLE_IMAGES.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-3.5 hover:border-slate-300 hover:shadow-xs transition-all"
              >
                <div>
                  {/* Thumbnail Preview */}
                  <div className="relative mb-3 flex h-36 w-full items-center justify-center overflow-hidden rounded-lg bg-slate-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/samples/${item.fileName}`}
                      alt={item.title}
                      className="h-full w-full object-contain"
                    />
                    <span className="absolute top-2 left-2 rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-800 shadow-xs">
                      {item.diseaseLabel}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                  <p className="mt-2 text-[11px] text-slate-400 font-mono">
                    {item.fileName}
                  </p>
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
                    className="flex-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors text-center"
                  >
                    Load Scan
                  </button>
                  <button
                    onClick={(e) => handleDownload(item, e)}
                    disabled={downloadingId === item.id}
                    title="Download image file to test dragging & dropping"
                    className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    {downloadingId === item.id ? "..." : "Download"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-3 flex items-center justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
