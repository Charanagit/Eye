import { DISEASE_LABELS, Finding } from "@/lib/types";

type Props = {
  finding: Finding;
  onOpenDetails: (code: string) => void;
};

export default function FindingRow({ finding, onOpenDetails }: Props) {
  const { disease, probability, bengraham_probability, colour_probability, threshold, flagged, uncertain } = finding;
  const pct = Math.round(probability * 100);
  const thrPct = Math.round(threshold * 100);
  const bgPct = bengraham_probability !== undefined ? Math.round(bengraham_probability * 100) : null;
  const colPct = colour_probability !== undefined ? Math.round(colour_probability * 100) : null;
  const isNormal = disease === "Normal";

  const barColor = flagged
    ? isNormal
      ? "bg-emerald-500"
      : "bg-red-500"
    : "bg-slate-400";

  return (
    <div className="py-3.5 px-2 transition-colors hover:bg-slate-100/60 rounded-lg">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-slate-900">
            {disease}
          </span>
          <span className="text-xs text-slate-500">
            ({DISEASE_LABELS[disease] ?? disease})
          </span>
          {flagged && (
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                isNormal
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {isNormal ? "Likely normal" : "Flagged Positive"}
            </span>
          )}
          {uncertain && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
              Uncertain (Refer)
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="tabular-nums text-sm font-bold text-slate-800">
            {pct}%
          </span>
          <button
            onClick={() => onOpenDetails(disease)}
            className="flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-100"
            title="View clinical details for this disease"
          >
            <svg className="h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Details
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative mt-2 h-2 w-full rounded-full bg-slate-200">
        <div
          className={`h-2 rounded-full transition-all ${barColor}`}
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute top-0 h-2 w-0.5 bg-slate-600"
          style={{ left: `${thrPct}%` }}
          title={`Decision threshold: ${thrPct}%`}
        />
      </div>

      {/* Stream Breakdown */}
      {bgPct !== null && colPct !== null && (
        <div className="mt-1.5 flex items-center gap-4 text-[11px] text-slate-500">
          <span>Ben Graham Stream: <strong className="text-slate-700">{bgPct}%</strong></span>
          <span>Colour Stream: <strong className="text-slate-700">{colPct}%</strong></span>
          <span>Threshold: <strong className="text-slate-700">{thrPct}%</strong></span>
        </div>
      )}
    </div>
  );
}
