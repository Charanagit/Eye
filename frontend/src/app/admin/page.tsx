"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

// --- Enterprise SVG Icons (Standard Clean Vectors, 0 Emojis) ---
const Icons = {
  Layers: () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  Folder: () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  ),
  FolderOpen: () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
    </svg>
  ),
  Play: () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  Square: () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  ),
  Sliders: () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  ),
  Refresh: () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  Upload: () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  ),
  Trash: () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <polyline points="3 6 5 6 21 6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  AlertCircle: () => (
    <svg className="h-4 w-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  Search: () => (
    <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Terminal: () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  ),
  Cpu: () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  ),
};

interface ModelFile {
  filename: string;
  path: string;
  size_bytes: number;
  size_mb: number;
  modified: string;
  is_active: boolean;
  format: string;
}

interface ModelsInventory {
  bengraham_models: ModelFile[];
  colour_models: ModelFile[];
  active_config: {
    diseases: string[];
    weights: { bengraham: number; colour: number };
    thresholds: Record<string, number>;
  };
  counts: {
    bengraham_total: number;
    bengraham_active: number;
    colour_total: number;
    colour_active: number;
  };
  is_simulated?: boolean;
}

interface TrainingJobStatus {
  job_id?: string;
  stream?: string;
  model_name?: string;
  backbone?: string;
  epochs?: number;
  batch_size?: number;
  learning_rate?: number;
  optimizer?: string;
  image_size?: number;
  status: "idle" | "queued" | "running" | "completed" | "stopped" | "failed";
  current_epoch?: number;
  progress_percent?: number;
  logs?: string[];
  history?: {
    epochs: number[];
    train_loss: number[];
    val_loss: number[];
    train_f1: number[];
    val_f1: number[];
    val_auc: number[];
  };
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"repositories" | "training" | "calibration">("repositories");
  const [activeFolder, setActiveFolder] = useState<"bengraham" | "colour">("bengraham");
  const [searchQuery, setSearchQuery] = useState("");

  const [inventory, setInventory] = useState<ModelsInventory | null>(null);
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  // Upload State
  const [uploadStream, setUploadStream] = useState<"bengraham" | "colour">("bengraham");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Training Configuration
  const [trainStream, setTrainStream] = useState<"bengraham" | "colour">("bengraham");
  const [trainModelName, setTrainModelName] = useState("v10_bengraham_fold4.keras");
  const [trainBackbone, setTrainBackbone] = useState("EfficientNetB0");
  const [trainEpochs, setTrainEpochs] = useState(10);
  const [trainBatchSize, setTrainBatchSize] = useState(16);
  const [trainLr, setTrainLr] = useState(0.0001);
  const [trainOptimizer, setTrainOptimizer] = useState("AdamW");
  const [trainImgSize, setTrainImgSize] = useState(512);
  const [trainingStatus, setTrainingStatus] = useState<TrainingJobStatus>({ status: "idle" });
  const [isStartingTrain, setIsStartingTrain] = useState(false);

  // Calibration State
  const [thresholds, setThresholds] = useState<Record<string, number>>({});
  const [streamWeightBg, setStreamWeightBg] = useState(0.5);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Delete Target Modal
  const [deleteTarget, setDeleteTarget] = useState<{ stream: "bengraham" | "colour"; filename: string } | null>(null);

  const logsEndRef = useRef<HTMLDivElement>(null);

  // Fetch inventory
  const fetchInventory = async () => {
    setIsLoadingModels(true);
    try {
      const res = await fetch("/api/admin/models");
      if (res.ok) {
        const data = (await res.json()) as ModelsInventory;
        setInventory(data);
        if (data.active_config?.thresholds) {
          setThresholds(data.active_config.thresholds);
        }
        if (data.active_config?.weights) {
          setStreamWeightBg(data.active_config.weights.bengraham ?? 0.5);
        }
      }
    } catch (err) {
      console.error("Failed to load models inventory", err);
    } finally {
      setIsLoadingModels(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Poll training status
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    const checkTrainStatus = async () => {
      try {
        const res = await fetch("/api/admin/train");
        if (res.ok) {
          const data = (await res.json()) as TrainingJobStatus;
          setTrainingStatus(data);
          if (data.status === "completed" && activeTab === "training") {
            fetchInventory();
          }
        }
      } catch (err) {
        console.error("Train status check failed", err);
      }
    };

    if (trainingStatus.status === "running") {
      interval = setInterval(checkTrainStatus, 1000);
    } else {
      checkTrainStatus();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [trainingStatus.status, activeTab]);

  useEffect(() => {
    if (trainingStatus.logs && trainingStatus.logs.length > 0) {
      logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [trainingStatus.logs]);

  // Handle Model Upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setIsUploading(true);
    setStatusMessage(null);

    try {
      const formData = new FormData();
      formData.append("stream", uploadStream);
      formData.append("file", uploadFile);

      const res = await fetch("/api/admin/models?action=upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setStatusMessage({ type: "success", text: `Model '${uploadFile.name}' registered to ${uploadStream}_models repository.` });
      setUploadFile(null);
      fetchInventory();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload error";
      setStatusMessage({ type: "error", text: msg });
    } finally {
      setIsUploading(false);
    }
  };

  // Toggle Model Active in Ensemble
  const handleToggleModel = async (stream: "bengraham" | "colour", filename: string, active: boolean) => {
    try {
      const res = await fetch("/api/admin/models?action=toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stream, filename, active }),
      });
      if (res.ok) {
        fetchInventory();
        setStatusMessage({
          type: "info",
          text: `Model '${filename}' ${active ? "enabled in" : "disabled from"} active inference ensemble.`,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Confirm Model Delete
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch("/api/admin/models?action=delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deleteTarget),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");

      setStatusMessage({ type: "success", text: `Model '${deleteTarget.filename}' deleted from repository.` });
      setDeleteTarget(null);
      fetchInventory();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Delete error";
      setStatusMessage({ type: "error", text: msg });
    }
  };

  // Hot Reload Models
  const handleReloadPipeline = async () => {
    try {
      const res = await fetch("/api/admin/models?action=reload", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage({
          type: "success",
          text: `Inference weights reloaded (${data.data?.bengraham_count} Ben Graham + ${data.data?.colour_count} Colour models active).`,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Start Training
  const handleStartTraining = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsStartingTrain(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/admin/train?action=start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stream: trainStream,
          model_name: trainModelName,
          backbone: trainBackbone,
          epochs: trainEpochs,
          batch_size: trainBatchSize,
          learning_rate: trainLr,
          optimizer: trainOptimizer,
          image_size: trainImgSize,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start training");

      setStatusMessage({ type: "success", text: `Training job initiated: ${trainModelName}` });
      setTrainingStatus({ status: "running", logs: [] });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error starting training";
      setStatusMessage({ type: "error", text: msg });
    } finally {
      setIsStartingTrain(false);
    }
  };

  // Abort Training
  const handleStopTraining = async () => {
    try {
      await fetch("/api/admin/train?action=stop", { method: "POST" });
      setTrainingStatus((prev) => ({ ...prev, status: "stopped" }));
      setStatusMessage({ type: "info", text: "Training process terminated by administrator." });
    } catch (err) {
      console.error(err);
    }
  };

  // Save Configuration
  const handleSaveConfig = async () => {
    setIsSavingConfig(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thresholds,
          weights: {
            bengraham: streamWeightBg,
            colour: Number((1.0 - streamWeightBg).toFixed(2)),
          },
        }),
      });
      if (res.ok) {
        setStatusMessage({ type: "success", text: "Operating parameters & ensemble weights updated." });
        fetchInventory();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingConfig(false);
    }
  };

  const currentModels =
    activeFolder === "bengraham"
      ? inventory?.bengraham_models.filter((m) => m.filename.toLowerCase().includes(searchQuery.toLowerCase())) ?? []
      : inventory?.colour_models.filter((m) => m.filename.toLowerCase().includes(searchQuery.toLowerCase())) ?? [];

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased flex flex-col">
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur-md px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
            >
              <Icons.ArrowLeft />
              <span>Diagnostic Portal</span>
            </Link>

            <div className="h-4 w-[1px] bg-zinc-800" />

            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                <Icons.Layers />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white tracking-tight">RetinaScreen ML Control Panel</span>
                <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 border border-zinc-700">
                  v10.2.0-prod
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-400 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>
                Ensemble: {inventory?.counts.bengraham_active ?? 3} BG + {inventory?.counts.colour_active ?? 3} COL
              </span>
            </div>

            <button
              onClick={handleReloadPipeline}
              className="flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-700 hover:text-white transition-colors"
              title="Hot-reloads active neural weights into inference memory"
            >
              <Icons.Refresh />
              <span>Reload Weights</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar + Content Layout */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 px-6 py-6 gap-6">
        {/* Left Navigation Sidebar */}
        <aside className="w-64 flex-shrink-0 space-y-6">
          <div className="space-y-1">
            <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              System Management
            </div>

            <button
              onClick={() => setActiveTab("repositories")}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                activeTab === "repositories"
                  ? "bg-zinc-800 text-white font-semibold"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icons.Folder />
                <span>Model Repositories</span>
              </div>
              <span className="rounded bg-zinc-900 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 border border-zinc-800">
                {(inventory?.counts.bengraham_total ?? 3) + (inventory?.counts.colour_total ?? 3)}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("training")}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                activeTab === "training"
                  ? "bg-zinc-800 text-white font-semibold"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icons.Cpu />
                <span>Training Pipelines</span>
              </div>
              {trainingStatus.status === "running" && (
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("calibration")}
              className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                activeTab === "calibration"
                  ? "bg-zinc-800 text-white font-semibold"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              <Icons.Sliders />
              <span>Ensemble Calibration</span>
            </button>
          </div>

          {/* Quick Environment Specs */}
          <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/50 p-3.5 space-y-2 text-xs">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Host Runtime</div>
            <div className="space-y-1.5 text-zinc-400 font-mono text-[11px]">
              <div className="flex justify-between">
                <span>Engine:</span>
                <span className="text-zinc-200">FastAPI / Keras 3</span>
              </div>
              <div className="flex justify-between">
                <span>Backbone:</span>
                <span className="text-zinc-200">EfficientNet-B0</span>
              </div>
              <div className="flex justify-between">
                <span>Fusion Mode:</span>
                <span className="text-zinc-200">Soft Polling TTA</span>
              </div>
              <div className="flex justify-between">
                <span>Classes:</span>
                <span className="text-zinc-200">10 Retinal Conditions</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 space-y-6 min-w-0">
          {/* Status Message Notification */}
          {statusMessage && (
            <div
              className={`flex items-center justify-between rounded-md px-4 py-3 text-xs border ${
                statusMessage.type === "success"
                  ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
                  : statusMessage.type === "error"
                  ? "bg-rose-950/40 border-rose-800/60 text-rose-300"
                  : "bg-zinc-900 border-zinc-700 text-zinc-300"
              }`}
            >
              <div className="flex items-center gap-2">
                {statusMessage.type === "success" && <Icons.CheckCircle />}
                {statusMessage.type === "error" && <Icons.AlertCircle />}
                <span>{statusMessage.text}</span>
              </div>
              <button
                onClick={() => setStatusMessage(null)}
                className="text-zinc-400 hover:text-white text-xs font-semibold ml-4"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* TAB 1: MODEL REPOSITORIES (TWO FOLDERS: BENGRAHAM & COLOUR) */}
          {activeTab === "repositories" && (
            <div className="space-y-6">
              {/* Folder Selection Header Tabs */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveFolder("bengraham")}
                    className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
                      activeFolder === "bengraham"
                        ? "bg-zinc-800 text-white font-semibold border border-zinc-700"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                    }`}
                  >
                    <Icons.FolderOpen />
                    <span>bengrahm models</span>
                    <span className="rounded bg-zinc-900 px-1.5 py-0.2 text-[10px] font-mono text-zinc-400 border border-zinc-800">
                      {inventory?.counts.bengraham_total ?? 3}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveFolder("colour")}
                    className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
                      activeFolder === "colour"
                        ? "bg-zinc-800 text-white font-semibold border border-zinc-700"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                    }`}
                  >
                    <Icons.FolderOpen />
                    <span>color enhanced models</span>
                    <span className="rounded bg-zinc-900 px-1.5 py-0.2 text-[10px] font-mono text-zinc-400 border border-zinc-800">
                      {inventory?.counts.colour_total ?? 3}
                    </span>
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative w-64">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <Icons.Search />
                  </div>
                  <input
                    type="text"
                    placeholder="Filter models by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-md border border-zinc-800 bg-zinc-900/80 pl-8 pr-3 py-1 text-xs text-zinc-200 placeholder-zinc-500 focus:border-zinc-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Active Folder Path Metadata Card */}
              <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-xs">
                <div className="space-y-0.5">
                  <div className="text-[11px] font-mono text-zinc-400">
                    Repository Path:{" "}
                    <strong className="text-zinc-200">
                      models/{activeFolder === "bengraham" ? "bengraham_models" : "colour_models"}/
                    </strong>
                  </div>
                  <div className="text-zinc-500 text-[11px]">
                    {activeFolder === "bengraham"
                      ? "Stream A: High-pass Gaussian subtraction for vascular bifurcation, hemorrhages, and microaneurysms."
                      : "Stream B: Reinhard CIELAB color space standardization for drusen deposits, lipid exudates, and disc cup."}
                  </div>
                </div>

                <div className="text-right text-zinc-400 font-mono text-[11px]">
                  <span>Active Folds in Ensemble: </span>
                  <strong className="text-emerald-400">
                    {activeFolder === "bengraham"
                      ? inventory?.counts.bengraham_active ?? 3
                      : inventory?.counts.colour_active ?? 3}
                  </strong>
                  <span> / </span>
                  <span>{currentModels.length}</span>
                </div>
              </div>

              {/* Models DataTable */}
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-zinc-800 bg-zinc-900 text-zinc-400 font-medium">
                    <tr>
                      <th className="px-4 py-2.5">Model Identifier</th>
                      <th className="px-4 py-2.5">Format</th>
                      <th className="px-4 py-2.5">Size</th>
                      <th className="px-4 py-2.5">Last Modified</th>
                      <th className="px-4 py-2.5">Ensemble Status</th>
                      <th className="px-4 py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                    {isLoadingModels ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                          Scanning directory contents...
                        </td>
                      </tr>
                    ) : currentModels.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                          No model artifacts matching query found in this repository.
                        </td>
                      </tr>
                    ) : (
                      currentModels.map((model) => (
                        <tr key={model.filename} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="px-4 py-3 font-mono font-medium text-white flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-zinc-600" />
                            <span>{model.filename}</span>
                          </td>
                          <td className="px-4 py-3 font-mono text-zinc-400">{model.format}</td>
                          <td className="px-4 py-3 font-mono text-zinc-400">{model.size_mb} MB</td>
                          <td className="px-4 py-3 text-zinc-400">{model.modified}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] font-medium ${
                                model.is_active
                                  ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/60"
                                  : "bg-zinc-800 text-zinc-500 border border-zinc-700"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  model.is_active ? "bg-emerald-400" : "bg-zinc-500"
                                }`}
                              />
                              <span>{model.is_active ? "Active" : "Disabled"}</span>
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleToggleModel(activeFolder, model.filename, !model.is_active)}
                                className={`rounded px-2.5 py-1 text-[11px] font-medium border transition-colors ${
                                  model.is_active
                                    ? "border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                                    : "border-emerald-800/60 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60"
                                }`}
                              >
                                {model.is_active ? "Disable" : "Enable"}
                              </button>

                              <button
                                onClick={() => setDeleteTarget({ stream: activeFolder, filename: model.filename })}
                                className="rounded px-2 py-1 text-[11px] font-medium border border-rose-900/50 bg-rose-950/20 text-rose-400 hover:bg-rose-900/40 transition-colors"
                                title="Delete model weights"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Upload Model Card */}
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <div className="text-xs font-semibold text-zinc-200">Register New Model Checkpoint (.keras / .h5)</div>
                  <div className="text-[11px] text-zinc-500">Max size: 500 MB per file</div>
                </div>

                <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end text-xs">
                  <div className="md:col-span-4">
                    <label className="block text-zinc-400 mb-1">Target Repository Folder</label>
                    <select
                      value={uploadStream}
                      onChange={(e) => setUploadStream(e.target.value as "bengraham" | "colour")}
                      className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-zinc-200 focus:border-zinc-700 focus:outline-none"
                    >
                      <option value="bengraham">models/bengraham_models/ (Stream A)</option>
                      <option value="colour">models/colour_models/ (Stream B)</option>
                    </select>
                  </div>

                  <div className="md:col-span-5">
                    <label className="block text-zinc-400 mb-1">Select Checkpoint File</label>
                    <input
                      type="file"
                      accept=".keras,.h5"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-zinc-300 file:mr-2 file:rounded file:border-0 file:bg-zinc-800 file:px-2 file:py-0.5 file:text-xs file:text-zinc-200 hover:file:bg-zinc-700 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <button
                      type="submit"
                      disabled={!uploadFile || isUploading}
                      className="w-full flex items-center justify-center gap-1.5 rounded-md bg-zinc-100 px-3 py-1.5 font-medium text-zinc-900 hover:bg-white disabled:opacity-40 transition-colors"
                    >
                      <Icons.Upload />
                      <span>{isUploading ? "Uploading..." : "Register Model"}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: TRAINING PIPELINES STUDIO */}
          {activeTab === "training" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Job Configuration Form */}
              <div className="lg:col-span-5 rounded-lg border border-zinc-800 bg-zinc-900/60 p-5 space-y-4">
                <div className="border-b border-zinc-800 pb-2">
                  <h3 className="text-xs font-semibold text-zinc-200">Pipeline Parameters</h3>
                  <p className="text-[11px] text-zinc-500">Configure CNN architecture and optimization schedule</p>
                </div>

                <form onSubmit={handleStartTraining} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-zinc-400 mb-1">Target Stream & Folder</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setTrainStream("bengraham");
                          setTrainModelName("v10_bengraham_fold4.keras");
                        }}
                        className={`rounded border px-3 py-2 text-left transition-colors ${
                          trainStream === "bengraham"
                            ? "border-zinc-600 bg-zinc-800 text-white font-medium"
                            : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700"
                        }`}
                      >
                        <div className="text-xs font-medium">Ben Graham (Stream A)</div>
                        <div className="text-[10px] text-zinc-500 font-mono">bengraham_models/</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setTrainStream("colour");
                          setTrainModelName("v10_colour_fold4.keras");
                        }}
                        className={`rounded border px-3 py-2 text-left transition-colors ${
                          trainStream === "colour"
                            ? "border-zinc-600 bg-zinc-800 text-white font-medium"
                            : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700"
                        }`}
                      >
                        <div className="text-xs font-medium">Colour Enhanced (Stream B)</div>
                        <div className="text-[10px] text-zinc-500 font-mono">colour_models/</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Output Model Filename</label>
                    <input
                      type="text"
                      value={trainModelName}
                      onChange={(e) => setTrainModelName(e.target.value)}
                      className="w-full rounded border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-zinc-200 font-mono focus:border-zinc-700 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-zinc-400 mb-1">Backbone CNN</label>
                      <select
                        value={trainBackbone}
                        onChange={(e) => setTrainBackbone(e.target.value)}
                        className="w-full rounded border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-zinc-200 focus:border-zinc-700 focus:outline-none"
                      >
                        <option value="EfficientNetB0">EfficientNet-B0 (Standard)</option>
                        <option value="EfficientNetB3">EfficientNet-B3 (High-Res)</option>
                        <option value="ResNet50">ResNet-50</option>
                        <option value="DenseNet121">DenseNet-121</option>
                        <option value="ConvNeXtTiny">ConvNeXt-Tiny</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1">Optimizer</label>
                      <select
                        value={trainOptimizer}
                        onChange={(e) => setTrainOptimizer(e.target.value)}
                        className="w-full rounded border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-zinc-200 focus:border-zinc-700 focus:outline-none"
                      >
                        <option value="AdamW">AdamW (Decoupled Decay)</option>
                        <option value="Adam">Adam</option>
                        <option value="SGD">SGD + Momentum (0.9)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-zinc-400 mb-1">Epochs</label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={trainEpochs}
                        onChange={(e) => setTrainEpochs(Number(e.target.value))}
                        className="w-full rounded border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-zinc-200 focus:border-zinc-700 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1">Batch Size</label>
                      <input
                        type="number"
                        min={4}
                        max={128}
                        value={trainBatchSize}
                        onChange={(e) => setTrainBatchSize(Number(e.target.value))}
                        className="w-full rounded border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-zinc-200 focus:border-zinc-700 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1">Resolution</label>
                      <select
                        value={trainImgSize}
                        onChange={(e) => setTrainImgSize(Number(e.target.value))}
                        className="w-full rounded border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-zinc-200 focus:border-zinc-700 focus:outline-none"
                      >
                        <option value={512}>512 x 512</option>
                        <option value={384}>384 x 384</option>
                        <option value={256}>256 x 256</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Initial Learning Rate</label>
                    <input
                      type="number"
                      step="0.00001"
                      value={trainLr}
                      onChange={(e) => setTrainLr(Number(e.target.value))}
                      className="w-full rounded border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-zinc-200 font-mono focus:border-zinc-700 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    {trainingStatus.status === "running" ? (
                      <button
                        type="button"
                        onClick={handleStopTraining}
                        className="w-full flex items-center justify-center gap-1.5 rounded-md bg-rose-600 px-4 py-2 font-medium text-white hover:bg-rose-500 transition-colors"
                      >
                        <Icons.Square />
                        <span>Abort Training Job</span>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isStartingTrain}
                        className="w-full flex items-center justify-center gap-1.5 rounded-md bg-zinc-100 px-4 py-2 font-medium text-zinc-900 hover:bg-white disabled:opacity-50 transition-colors"
                      >
                        <Icons.Play />
                        <span>{isStartingTrain ? "Initializing..." : "Launch Training Job"}</span>
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Right Column: Execution Telemetry & Terminal Console */}
              <div className="lg:col-span-7 space-y-4">
                {/* Active Run Telemetry Card */}
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-zinc-200">Execution Telemetry</span>
                      {trainingStatus.job_id && (
                        <span className="text-[10px] font-mono text-zinc-500">[{trainingStatus.job_id}]</span>
                      )}
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[10px] font-mono font-medium ${
                        trainingStatus.status === "running"
                          ? "bg-amber-950/60 text-amber-400 border border-amber-800/60"
                          : trainingStatus.status === "completed"
                          ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/60"
                          : trainingStatus.status === "stopped"
                          ? "bg-rose-950/60 text-rose-400 border border-rose-800/60"
                          : "bg-zinc-800 text-zinc-500 border border-zinc-700"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          trainingStatus.status === "running"
                            ? "bg-amber-400 animate-pulse"
                            : trainingStatus.status === "completed"
                            ? "bg-emerald-400"
                            : "bg-zinc-500"
                        }`}
                      />
                      <span>{trainingStatus.status.toUpperCase()}</span>
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-zinc-400 font-mono">
                      <span>
                        Epoch {trainingStatus.current_epoch ?? 0} / {trainingStatus.epochs ?? trainEpochs}
                      </span>
                      <span>{trainingStatus.progress_percent ?? 0}% Complete</span>
                    </div>
                    <div className="h-2 w-full rounded bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-zinc-300 transition-all duration-300"
                        style={{ width: `${trainingStatus.progress_percent ?? 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Metric Summary Grid */}
                  <div className="grid grid-cols-4 gap-2 pt-1 font-mono text-xs">
                    <div className="rounded border border-zinc-800 bg-zinc-900/80 p-2 text-center">
                      <div className="text-[10px] text-zinc-500">Train Loss</div>
                      <div className="text-zinc-200 font-medium">
                        {trainingStatus.history?.train_loss.slice(-1)[0] ?? "--"}
                      </div>
                    </div>
                    <div className="rounded border border-zinc-800 bg-zinc-900/80 p-2 text-center">
                      <div className="text-[10px] text-zinc-500">Val Loss</div>
                      <div className="text-zinc-200 font-medium">
                        {trainingStatus.history?.val_loss.slice(-1)[0] ?? "--"}
                      </div>
                    </div>
                    <div className="rounded border border-zinc-800 bg-zinc-900/80 p-2 text-center">
                      <div className="text-[10px] text-zinc-500">Val F1</div>
                      <div className="text-emerald-400 font-medium">
                        {trainingStatus.history?.val_f1.slice(-1)[0] ?? "--"}
                      </div>
                    </div>
                    <div className="rounded border border-zinc-800 bg-zinc-900/80 p-2 text-center">
                      <div className="text-[10px] text-zinc-500">Val AUC</div>
                      <div className="text-zinc-200 font-medium">
                        {trainingStatus.history?.val_auc.slice(-1)[0] ?? "--"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Console Log Terminal */}
                <div className="rounded-lg border border-zinc-800 bg-black/90 p-3.5 font-mono text-[11px] text-zinc-300 space-y-2">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2 text-zinc-500 text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <Icons.Terminal />
                      <span>Standard Output / Diagnostics Stream</span>
                    </div>
                    <span>TTY-1</span>
                  </div>

                  <div className="h-64 overflow-y-auto space-y-1 pr-2">
                    {!trainingStatus.logs || trainingStatus.logs.length === 0 ? (
                      <div className="text-zinc-600 italic py-2">No active process output.</div>
                    ) : (
                      trainingStatus.logs.map((log, idx) => (
                        <div
                          key={idx}
                          className={`leading-relaxed ${
                            log.includes("Completed Successfully")
                              ? "text-emerald-400 font-semibold"
                              : log.includes("aborted")
                              ? "text-rose-400"
                              : "text-zinc-300"
                          }`}
                        >
                          {log}
                        </div>
                      ))
                    )}
                    <div ref={logsEndRef} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ENSEMBLE CALIBRATION & THRESHOLDS */}
          {activeTab === "calibration" && (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-5 space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div>
                  <h3 className="text-xs font-semibold text-zinc-200">Ensemble Weighting & Decision Thresholds</h3>
                  <p className="text-[11px] text-zinc-500">
                    Configure dual-stream linear fusion coefficient and per-disease multi-label operating points
                  </p>
                </div>

                <button
                  onClick={handleSaveConfig}
                  disabled={isSavingConfig}
                  className="rounded-md bg-zinc-100 px-4 py-1.5 text-xs font-medium text-zinc-900 hover:bg-white disabled:opacity-50 transition-colors"
                >
                  {isSavingConfig ? "Saving..." : "Apply Calibration"}
                </button>
              </div>

              {/* Dual-Stream Ratio Slider */}
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-4 space-y-2 text-xs">
                <div className="flex justify-between font-mono">
                  <span className="text-zinc-300">
                    Stream A (Ben Graham): <strong>{(streamWeightBg * 100).toFixed(0)}%</strong>
                  </span>
                  <span className="text-zinc-500">Fusion Balance</span>
                  <span className="text-zinc-300">
                    Stream B (Colour Enhanced): <strong>{((1.0 - streamWeightBg) * 100).toFixed(0)}%</strong>
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={streamWeightBg}
                  onChange={(e) => setStreamWeightBg(parseFloat(e.target.value))}
                  className="w-full accent-zinc-200 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>100% Vasculature</span>
                  <span>Balanced 50/50 Dual-Stream</span>
                  <span>100% Color Space</span>
                </div>
              </div>

              {/* Operating Thresholds Grid */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-zinc-300">
                  Classification Operating Points (10 Disease Targets)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {Object.entries(thresholds).map(([disease, thr]) => (
                    <div key={disease} className="rounded border border-zinc-800 bg-zinc-900/80 p-3 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-zinc-200">{disease}</span>
                        <span className="font-mono text-zinc-400">{thr.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="0.95"
                        step="0.05"
                        value={thr}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setThresholds((prev) => ({ ...prev, [disease]: val }));
                        }}
                        className="w-full accent-zinc-200 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-zinc-500">
                        <span>Sens.</span>
                        <span>Spec.</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-sm rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4 text-xs shadow-2xl">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-white">Confirm Model Deletion</h4>
              <p className="text-zinc-400">
                Are you sure you want to permanently remove{" "}
                <strong className="text-zinc-200 font-mono">{deleteTarget.filename}</strong> from the repository?
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded border border-zinc-700 bg-zinc-800 px-3 py-1.5 font-medium text-zinc-300 hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded bg-rose-600 px-3 py-1.5 font-medium text-white hover:bg-rose-500"
              >
                Delete File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
