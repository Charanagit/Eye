"use client";

import React, { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
  onSaveUrl: (url: string) => void;
  isOnline: boolean | null;
  latencyMs: number | null;
};

export default function BackendConfigModal({
  isOpen,
  onClose,
  currentUrl,
  onSaveUrl,
  isOnline,
  latencyMs,
}: Props) {
  const [inputUrl, setInputUrl] = useState(currentUrl);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    msg: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const start = Date.now();
      const res = await fetch("/api/health", {
        headers: { "x-backend-url": inputUrl.trim() },
      });
      const latency = Date.now() - start;
      const data = await res.json();

      if (res.ok) {
        setTestResult({
          ok: true,
          msg: `Connected successfully! Latency: ${latency} ms`,
        });
      } else {
        setTestResult({
          ok: false,
          msg: data.error || "Backend returned an error status.",
        });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Connection failed";
      setTestResult({
        ok: false,
        msg: `Failed to connect: ${errorMessage}`,
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    onSaveUrl(inputUrl.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div
              className={`h-3 w-3 rounded-full ${
                isOnline ? "bg-emerald-500 animate-pulse" : "bg-amber-400"
              }`}
            />
            <h3 className="font-bold text-slate-900 text-base">
              AI Inference Backend Configuration
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-4 text-sm text-slate-600">
          <p className="leading-relaxed text-xs text-slate-500">
            RetinaScreen runs a 6-model Dual-Stream EfficientNetB3 ensemble.
            You can connect this Vercel web app to your live on-premise local server or a hosted cloud API instance (e.g. Hugging Face Spaces, Render, AWS, Modal).
          </p>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Current Status:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                  isOnline
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {isOnline ? "● FastAPI Live (Online)" : "○ Standalone / Demo Fallback Mode"}
              </span>
            </div>
            {latencyMs !== null && (
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Response Time:</span>
                <span className="font-mono font-medium text-slate-700">{latencyMs} ms</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Backend Endpoint URL
            </label>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="http://127.0.0.1:8000 or https://your-backend.hf.space"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-mono text-slate-900 shadow-sm focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
            />
          </div>

          {testResult && (
            <div
              className={`rounded-xl p-3 text-xs font-medium ${
                testResult.ok
                  ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                  : "bg-red-50 text-red-900 border border-red-200"
              }`}
            >
              {testResult.ok ? "✓ " : "✕ "}
              {testResult.msg}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={handleTest}
              disabled={testing || !inputUrl}
              className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-50 transition-colors"
            >
              {testing ? "Pinging..." : "⚡ Test Connection"}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow hover:bg-slate-800"
              >
                Save & Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
