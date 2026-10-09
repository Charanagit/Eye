"use client";

import React, { useEffect, useState } from "react";
import { CLINICAL_REPORTS_DATABASE } from "@/data/clinicalReports";
import { DISEASE_DATABASE } from "@/data/diseases";
import { DISEASE_LABELS, Finding } from "@/lib/types";

type Props = {
  primaryFinding: Finding | null;
  allFindings: Finding[];
  previewUrl: string | null;
  onClose: () => void;
  patientName?: string;
  patientAge?: string;
  patientGender?: string;
  eyeLaterality?: "OD (Right Eye)" | "OS (Left Eye)";
  clinicianName?: string;
};

export default function ClinicalReportModal({
  primaryFinding,
  allFindings,
  previewUrl,
  onClose,
  patientName: initialPatientName = "",
  patientAge: initialPatientAge = "",
  patientGender: initialPatientGender = "Male",
  eyeLaterality: initialEyeLaterality = "OD (Right Eye)",
  clinicianName: initialClinicianName = "",
}: Props) {
  const [patientName, setPatientName] = useState(initialPatientName);
  const [patientAge, setPatientAge] = useState(initialPatientAge);
  const [patientGender, setPatientGender] = useState(initialPatientGender);
  const [eyeLaterality, setEyeLaterality] = useState<"OD (Right Eye)" | "OS (Left Eye)">(initialEyeLaterality);
  const [clinicianName, setClinicianName] = useState(initialClinicianName);
  const [reportDate, setReportDate] = useState("");

  useEffect(() => {
    const today = new Date();
    setReportDate(
      today.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    );

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!primaryFinding) return null;
  const report = CLINICAL_REPORTS_DATABASE[primaryFinding.disease];
  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  const probPct = Math.round(primaryFinding.probability * 100);

  // Filter secondary findings (excluding the primary finding)
  const secondaryFindings = allFindings.filter(
    (f) => f.disease !== primaryFinding.disease && (f.flagged || f.probability >= 0.30)
  );

  const curabilityBadgeColor = report.curabilityStatus.includes("Curable")
    ? "bg-emerald-100 text-emerald-900 border-emerald-300 "
    : report.curabilityStatus.includes("Manageable") || report.curabilityStatus.includes("Arrestable")
    ? "bg-blue-100 text-blue-900 border-blue-300 "
    : "bg-slate-100 text-slate-800 border-slate-300 ";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-in fade-in duration-200 print:static print:block print:p-0 print:bg-white print:z-auto">
      <div
        className="relative w-full max-w-4xl max-h-[94vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-7 shadow-2xl transition-all print:static print:max-h-none print:w-full print:max-w-none print:shadow-none print:border-none print:p-0 print:bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Action Bar (Hidden when printing) */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-slate-900 px-3 py-1 text-xs font-bold text-white ">
              OFFICIAL CLINICAL ASSESSMENT REPORT
            </span>
            <span className="text-xs font-medium text-slate-500">
              Confidential Ophthalmic Record
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow transition-colors hover:bg-slate-800 :bg-slate-200"
            >
              🖨️ Print / Export PDF Report
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 :bg-slate-800 :text-slate-200"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Medical Document Header */}
        <div className="mt-4 border-b border-slate-200 pb-5 print:mt-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                Ophthalmic Clinical Assessment Report
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                RetinaScreen Digital Fundus Assessment System · Department of Ophthalmology
              </p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p><strong className="text-slate-700 ">Date:</strong> {reportDate}</p>
              <p><strong className="text-slate-700 ">ICD-10 Code:</strong> {report.icd10}</p>
            </div>
          </div>

          {/* Patient Metadata & Fundus Image Banner */}
          <div className="mt-5 grid gap-4 md:grid-cols-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 print:bg-white print:border-slate-300">
            {/* Column 1 & 2: Patient Metadata */}
            <div className="md:col-span-2 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500">Patient Name / ID</label>
                  <input
                    type="text"
                    value={patientName}
                    placeholder="Enter Patient Name or ID..."
                    onChange={(e) => setPatientName(e.target.value)}
                    className="mt-0.5 w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 font-semibold text-slate-900 shadow-sm focus:outline-none print:border-none print:p-0 print:bg-transparent print:font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500">Age & Sex</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={patientAge}
                      placeholder="Age"
                      onChange={(e) => setPatientAge(e.target.value)}
                      className="w-16 rounded-md border border-slate-300 bg-white px-2 py-1.5 font-semibold text-slate-900 shadow-sm focus:outline-none print:border-none print:p-0 print:bg-transparent print:font-bold"
                    />
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value)}
                      className="rounded-md border border-slate-300 bg-white px-2 py-1.5 font-semibold text-slate-900 shadow-sm focus:outline-none print:border-none print:p-0 print:bg-transparent print:font-bold"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500">Examined Eye (Laterality)</label>
                  <select
                    value={eyeLaterality}
                    onChange={(e) => setEyeLaterality(e.target.value as any)}
                    className="mt-0.5 w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 font-semibold text-slate-900 shadow-sm focus:outline-none print:border-none print:p-0 print:bg-transparent print:font-bold"
                  >
                    <option value="OD (Right Eye)">OD (Right Eye)</option>
                    <option value="OS (Left Eye)">OS (Left Eye)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500">Examining Clinician</label>
                  <input
                    type="text"
                    value={clinicianName}
                    placeholder="Enter Clinician Name..."
                    onChange={(e) => setClinicianName(e.target.value)}
                    className="mt-0.5 w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 font-semibold text-slate-900 shadow-sm focus:outline-none print:border-none print:p-0 print:bg-transparent print:font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Column 3: Fundus Photograph Thumbnail */}
            <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4 ">
              <span className="text-[11px] font-bold uppercase text-slate-500 mb-1">Fundus Photograph</span>
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Examined fundus photograph"
                  className="h-28 w-28 rounded-lg border border-slate-300 object-cover shadow-sm bg-black "
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-xs text-slate-400">
                  No Photo
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Primary Diagnostic Impression Summary */}
        <div className="mt-6 rounded-xl border border-slate-900 bg-slate-900 p-5 text-white shadow print:bg-slate-900 print:text-white print:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-slate-300">
                Primary Diagnostic Impression
              </span>
              <h2 className="text-2xl font-black tracking-tight">
                {report.name} ({report.code})
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-300 print:text-slate-300">Diagnostic Confidence Score</span>
              <div className="text-3xl font-black leading-none">{probPct}%</div>
            </div>
          </div>
        </div>

        {/* Diagnostic Status Cards */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className={`rounded-xl border p-4 ${curabilityBadgeColor}`}>
            <span className="text-xs font-bold uppercase opacity-80">Curability & Reversibility Status</span>
            <div className="mt-1 text-base font-black">
              {report.curabilityStatus}
            </div>
            <span className="text-[11px] opacity-80 mt-1 block">Therapeutic Classification</span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 print:bg-white">
            <span className="text-xs font-bold uppercase text-slate-500">Anatomical Locus Affected</span>
            <div className="mt-1 text-sm font-extrabold text-slate-900 ">
              📍 {DISEASE_DATABASE[primaryFinding.disease]?.landmark || report.category}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Primary Ocular Feature</span>
          </div>
        </div>

        {/* Report Content Body */}
        <div className="mt-6 space-y-6 text-sm print:space-y-4">
          {/* Section 1: Visual Acuity Outlook */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 print:p-3">
            <h3 className="font-bold text-slate-900 text-base">
              1. Visual Acuity Prognosis & Clinical Outlook
            </h3>
            <p className="mt-2 leading-relaxed text-slate-700 font-normal">
              {report.prognosisSummary}
            </p>
          </div>

          {/* Section 2: Secondary Differential Findings */}
          {secondaryFindings.length > 0 && (
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-5 print:bg-white print:p-3">
              <h3 className="font-bold text-slate-900 text-base mb-2">
                2. Secondary Differential Findings & Co-Existing Suspected Conditions
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Other pathologies identified above clinical screening criteria during fundus image assessment:
              </p>
              <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white ">
                {secondaryFindings.map((sf) => (
                  <div key={sf.disease} className="flex items-center justify-between p-3 text-xs">
                    <div>
                      <strong className="font-bold text-slate-900 ">
                        {sf.disease} — {DISEASE_LABELS[sf.disease] ?? sf.disease}
                      </strong>
                      {sf.flagged && (
                        <span className="ml-2 rounded bg-red-100 px-2 py-0.5 font-bold text-red-800 ">
                          Clinical Criteria Met
                        </span>
                      )}
                    </div>
                    <div className="font-extrabold text-slate-900 ">
                      {Math.round(sf.probability * 100)}% Confidence
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Surgical & Pharmacological Interventions */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5 print:bg-white print:p-3">
            <h3 className="font-bold text-slate-900 text-base mb-3">
              3. Recommended Surgical & Pharmacological Interventions
            </h3>
            <div className="space-y-3">
              {report.procedures.map((proc, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm print:p-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-slate-900 ">
                      {idx + 1}. {proc.title}
                    </h4>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 ">
                      {proc.type}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    {proc.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Secondary Diagnostic Confirmation Protocol */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 print:p-3">
            <h3 className="font-bold text-slate-900 text-base mb-2">
              4. Ancillary Diagnostic Confirmation Protocol
            </h3>
            <ul className="space-y-2 text-slate-700 ">
              {report.diagnosticConfirmation.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs">
                  <span className="font-bold text-slate-900 ">✓</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 5: Systemic Risk Factor Mitigation */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5 print:bg-white print:p-3">
            <h3 className="font-bold text-slate-900 text-base mb-1.5">
              5. Systemic Management & Risk Mitigation
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              {report.systemicManagement}
            </p>
          </div>

          {/* Section 6: Specialist Referral Criteria */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 print:p-3">
            <h3 className="font-bold text-slate-900 text-base mb-1.5">
              6. Specialist Referral Recommendation
            </h3>
            <p className="text-xs font-semibold text-slate-800 leading-relaxed">
              👨‍⚕️ {report.specialistReferral}
            </p>
          </div>
        </div>

        {/* Clinician Sign-Off Line (Print View) */}
        <div className="mt-8 border-t border-slate-200 pt-6 grid grid-cols-2 text-xs text-slate-600 print:mt-6">
          <div>
            <p><strong className="text-slate-900 ">Examining Clinician:</strong> {clinicianName || "___________________________"}</p>
            <p className="mt-4">Signature: ___________________________</p>
          </div>
          <div className="text-right">
            <p><strong className="text-slate-900 ">Assessment System:</strong> RetinaScreen Ophthalmic Assessment</p>
            <p className="mt-4">Date: {reportDate}</p>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="mt-6 text-center text-[10px] text-slate-400 print:mt-4">
          Confidential Healthcare Assessment Report · Intended for Clinical Decision Support · Always confirm automated assessment with full biomicroscopic examination.
        </div>
      </div>
    </div>
  );
}
