import { NextRequest, NextResponse } from "next/server";

// Fallback in-memory state for Vercel preview environments
const fallbackInventory = {
  bengraham_models: [
    {
      filename: "v10_bengraham_fold1.keras",
      path: "models/bengraham_models/v10_bengraham_fold1.keras",
      size_bytes: 111864118,
      size_mb: 106.68,
      modified: "2026-07-11 17:46:00",
      is_active: true,
      format: ".keras",
    },
    {
      filename: "v10_bengraham_fold2.keras",
      path: "models/bengraham_models/v10_bengraham_fold2.keras",
      size_bytes: 111864118,
      size_mb: 106.68,
      modified: "2026-07-11 18:09:00",
      is_active: true,
      format: ".keras",
    },
    {
      filename: "v10_bengraham_fold3.keras",
      path: "models/bengraham_models/v10_bengraham_fold3.keras",
      size_bytes: 111864118,
      size_mb: 106.68,
      modified: "2026-07-11 18:32:00",
      is_active: true,
      format: ".keras",
    },
  ],
  colour_models: [
    {
      filename: "v10_colour_fold1.keras",
      path: "models/colour_models/v10_colour_fold1.keras",
      size_bytes: 111864118,
      size_mb: 106.68,
      modified: "2026-07-11 22:56:00",
      is_active: true,
      format: ".keras",
    },
    {
      filename: "v10_colour_fold2.keras",
      path: "models/colour_models/v10_colour_fold2.keras",
      size_bytes: 111864118,
      size_mb: 106.68,
      modified: "2026-07-11 23:27:00",
      is_active: true,
      format: ".keras",
    },
    {
      filename: "v10_colour_fold3.keras",
      path: "models/colour_models/v10_colour_fold3.keras",
      size_bytes: 111864118,
      size_mb: 106.68,
      modified: "2026-07-12 00:00:00",
      is_active: true,
      format: ".keras",
    },
  ],
  active_config: {
    diseases: ["DR", "ARMD", "DN", "MYA", "BRVO", "TSLN", "ODC", "Cataract", "Glaucoma", "Normal"],
    weights: { bengraham: 0.5, colour: 0.5 },
    thresholds: {
      DR: 0.65,
      ARMD: 0.65,
      DN: 0.65,
      MYA: 0.65,
      BRVO: 0.65,
      TSLN: 0.65,
      ODC: 0.7,
      Cataract: 0.9,
      Glaucoma: 0.7,
      Normal: 0.75,
    },
  },
  counts: {
    bengraham_total: 3,
    bengraham_active: 3,
    colour_total: 3,
    colour_active: 3,
  },
};

export async function GET(req: NextRequest) {
  const customUrl = req.headers.get("x-backend-url");
  const backendUrl = customUrl || process.env.BACKEND_URL || "http://127.0.0.1:8000";

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${backendUrl}/api/admin/models`, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ ...data, is_simulated: false });
    }
  } catch {
    // Return fallback inventory on preview / offline
  }

  return NextResponse.json({ ...fallbackInventory, is_simulated: true });
}

export async function POST(req: NextRequest) {
  const customUrl = req.headers.get("x-backend-url");
  const backendUrl = customUrl || process.env.BACKEND_URL || "http://127.0.0.1:8000";
  const url = new URL(req.url);
  const action = url.searchParams.get("action"); // "upload" | "delete" | "toggle" | "reload"

  const contentType = req.headers.get("content-type") || "";

  // 1. Upload Model Action
  if (action === "upload") {
    try {
      const formData = await req.formData();
      const stream = (formData.get("stream") as string) || "bengraham";
      const file = formData.get("file") as File;

      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      // Try proxying to remote backend
      try {
        const proxyForm = new FormData();
        proxyForm.append("stream", stream);
        proxyForm.append("auto_activate", "true");
        proxyForm.append("file", file);

        const res = await fetch(`${backendUrl}/api/admin/models/upload`, {
          method: "POST",
          body: proxyForm,
        });
        if (res.ok) {
          const data = await res.json();
          return NextResponse.json(data);
        }
      } catch {
        // Fallback simulation
      }

      // Simulated upload
      const newModel = {
        filename: file.name,
        path: `models/${stream}_models/${file.name}`,
        size_bytes: file.size || 111864118,
        size_mb: Number(((file.size || 111864118) / (1024 * 1024)).toFixed(2)),
        modified: new Date().toISOString().replace("T", " ").slice(0, 19),
        is_active: true,
        format: file.name.endsWith(".h5") ? ".h5" : ".keras",
      };

      if (stream === "bengraham") {
        fallbackInventory.bengraham_models.push(newModel);
        fallbackInventory.counts.bengraham_total++;
        fallbackInventory.counts.bengraham_active++;
      } else {
        fallbackInventory.colour_models.push(newModel);
        fallbackInventory.counts.colour_total++;
        fallbackInventory.counts.colour_active++;
      }

      return NextResponse.json({
        status: "success",
        message: `Successfully uploaded '${file.name}' to ${stream}_models (Simulation Mode).`,
        model: newModel,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  // 2. Delete Model Action
  if (action === "delete") {
    try {
      const body = await req.json();
      const { stream, filename } = body;

      try {
        const res = await fetch(`${backendUrl}/api/admin/models/delete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stream, filename }),
        });
        if (res.ok) return NextResponse.json(await res.json());
      } catch {
        // Fallback
      }

      if (stream === "bengraham") {
        fallbackInventory.bengraham_models = fallbackInventory.bengraham_models.filter((m) => m.filename !== filename);
        fallbackInventory.counts.bengraham_total = fallbackInventory.bengraham_models.length;
        fallbackInventory.counts.bengraham_active = fallbackInventory.bengraham_models.filter((m) => m.is_active).length;
      } else {
        fallbackInventory.colour_models = fallbackInventory.colour_models.filter((m) => m.filename !== filename);
        fallbackInventory.counts.colour_total = fallbackInventory.colour_models.length;
        fallbackInventory.counts.colour_active = fallbackInventory.colour_models.filter((m) => m.is_active).length;
      }

      return NextResponse.json({ status: "success", message: `Model '${filename}' deleted successfully.` });
    } catch (err: unknown) {
      return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
  }

  // 3. Toggle Model Action
  if (action === "toggle") {
    try {
      const body = await req.json();
      const { stream, filename, active } = body;

      try {
        const res = await fetch(`${backendUrl}/api/admin/models/toggle`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stream, filename, active }),
        });
        if (res.ok) return NextResponse.json(await res.json());
      } catch {
        // Fallback
      }

      const list = stream === "bengraham" ? fallbackInventory.bengraham_models : fallbackInventory.colour_models;
      const target = list.find((m) => m.filename === filename);
      if (target) target.is_active = active;

      if (stream === "bengraham") {
        fallbackInventory.counts.bengraham_active = fallbackInventory.bengraham_models.filter((m) => m.is_active).length;
      } else {
        fallbackInventory.counts.colour_active = fallbackInventory.colour_models.filter((m) => m.is_active).length;
      }

      return NextResponse.json({ status: "success", filename, is_active: active });
    } catch {
      return NextResponse.json({ error: "Toggle failed" }, { status: 500 });
    }
  }

  // 4. Reload Models Action
  if (action === "reload") {
    try {
      const res = await fetch(`${backendUrl}/api/admin/models/reload`, { method: "POST" });
      if (res.ok) return NextResponse.json(await res.json());
    } catch {
      // Fallback
    }

    return NextResponse.json({
      status: "success",
      data: {
        status: "reloaded",
        bengraham_count: fallbackInventory.counts.bengraham_active,
        colour_count: fallbackInventory.counts.colour_active,
        bengraham_names: fallbackInventory.bengraham_models.filter((m) => m.is_active).map((m) => m.filename),
        colour_names: fallbackInventory.colour_models.filter((m) => m.is_active).map((m) => m.filename),
      },
    });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
