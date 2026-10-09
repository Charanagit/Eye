"use client";

import React, { useEffect } from "react";
import { DISEASE_DATABASE } from "@/data/diseases";

type Props = {
  diseaseCode: string | null;
  onClose: () => void;
};

export default function DiseaseDetailModal({ diseaseCode, onClose }: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!diseaseCode) return null;
  const detail = DISEASE_DATABASE[diseaseCode];
  if (!detail) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-800">
                {detail.code}
              </span>
              <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                Category: {detail.category}
              </span>
            </div>
            <h2 className="mt-2 text-xl font-bold text-slate-900">
              {detail.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-5 space-y-5 text-sm">
          {/* Overview */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-4">
            <h3 className="font-semibold text-slate-900">Medical Overview</h3>
            <p className="mt-1.5 leading-relaxed text-slate-700">
              {detail.overview}
            </p>
          </div>

          {/* Anatomical Landmark */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-4">
            <h3 className="font-semibold text-slate-900">Primary Anatomical Landmark</h3>
            <p className="mt-1 text-slate-700 font-medium">
              📍 {detail.landmark}
            </p>
          </div>

          {/* Key Visual Signs */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-4">
            <h3 className="font-semibold text-slate-900">Key Visual Fundus Signs</h3>
            <ul className="mt-2 space-y-1.5 text-slate-700">
              {detail.visualSigns.map((sign, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-slate-400 font-bold">•</span>
                  <span>{sign}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Dual-Stream Preference */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-4">
            <h3 className="font-semibold text-slate-900">Dual-Stream Pipeline Feature</h3>
            <p className="mt-1 text-slate-700">
              💡 <span className="font-medium">{detail.streamPreference}</span>
            </p>
          </div>

          {/* Clinical Management */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-4">
            <h3 className="font-semibold text-slate-900">Clinical Management & Next Steps</h3>
            <p className="mt-1.5 leading-relaxed text-slate-700">
              {detail.recommendations}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end border-t border-slate-200 pt-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
