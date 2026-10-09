"use client";

import React, { useState } from "react";
import { DISEASE_DATABASE } from "@/data/diseases";
import { CLINICAL_REPORTS_DATABASE } from "@/data/clinicalReports";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function DiseaseEncyclopediaModal({ isOpen, onClose }: Props) {
  const diseaseKeys = Object.keys(DISEASE_DATABASE);
  const [selectedKey, setSelectedKey] = useState<string>(diseaseKeys[0] || "DR");

  if (!isOpen) return null;

  const currentDisease = DISEASE_DATABASE[selectedKey];
  const currentReport = CLINICAL_REPORTS_DATABASE[selectedKey];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative flex h-[88vh] w-full max-w-5xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📖</span>
            <div>
              <h2 className="text-base font-bold">
                RetinaScreen Clinical Pathology Encyclopedia
              </h2>
              <p className="text-xs text-slate-300">
                Diagnostic Reference Guide for 10 Target Retinal Conditions & Biomarkers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar: Disease List */}
          <div className="w-64 border-r border-slate-200 bg-slate-50/80 p-3 overflow-y-auto space-y-1.5">
            <span className="px-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              10 Target Retinal Pathologies
            </span>
            {diseaseKeys.map((k) => {
              const d = DISEASE_DATABASE[k];
              const isSelected = k === selectedKey;
              return (
                <button
                  key={k}
                  onClick={() => setSelectedKey(k)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-slate-900 text-white shadow-md"
                      : "text-slate-700 hover:bg-slate-200/70"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={`font-mono text-[11px] px-1.5 py-0.5 rounded font-bold ${
                        isSelected
                          ? "bg-slate-800 text-white"
                          : "bg-slate-200 text-slate-800"
                      }`}
                    >
                      {d.code}
                    </span>
                    <span className="truncate">{d.name}</span>
                  </div>
                  <span className="text-[10px] opacity-70">➔</span>
                </button>
              );
            })}
          </div>

          {/* Right Main Content Pane */}
          {currentDisease && (
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-slate-800">
              {/* Header Title */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-slate-900 px-2.5 py-0.5 text-xs font-bold text-white">
                      {currentDisease.code}
                    </span>
                    <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200">
                      Category: {currentDisease.category}
                    </span>
                    {currentReport && (
                      <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-800 border border-blue-200">
                        ICD-10: {currentReport.icd10}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-2xl font-black text-slate-900">
                    {currentDisease.name}
                  </h3>
                </div>
              </div>

              {/* Overview & Landmark */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Medical Description & Etiology
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-700">
                    {currentDisease.overview}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Primary Anatomical Locus
                  </h4>
                  <div className="text-sm font-bold text-slate-900">
                    📍 {currentDisease.landmark}
                  </div>
                  <div className="mt-2 text-xs text-slate-600 border-t border-slate-100 pt-2">
                    <strong>Optimal AI Stream:</strong> {currentDisease.streamPreference}
                  </div>
                </div>
              </div>

              {/* Key Visual Signs */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  👁️ Key Diagnostic Fundus Biomarkers
                </h4>
                <ul className="grid gap-2 sm:grid-cols-2 text-xs text-slate-700">
                  {currentDisease.visualSigns.map((sign, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-red-500 font-bold">•</span>
                      <span>{sign}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Clinical Procedures & Management */}
              {currentReport && (
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    🩺 Standard Clinical Management & Confirmatory Testing
                  </h4>
                  <div className="grid gap-2.5 sm:grid-cols-2 text-xs">
                    {currentReport.procedures.map((proc, i) => (
                      <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between">
                          <strong className="text-slate-900">{proc.title}</strong>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                            {proc.type}
                          </span>
                        </div>
                        <p className="mt-1 text-slate-600 text-[11px] leading-relaxed">
                          {proc.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3 text-xs text-slate-500">
          <span>Source: WHO Priority Eye Diseases & Clinical Ophthalmology Guidelines</span>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-1.5 font-bold text-white hover:bg-slate-800"
          >
            Close Encyclopedia
          </button>
        </div>
      </div>
    </div>
  );
}
