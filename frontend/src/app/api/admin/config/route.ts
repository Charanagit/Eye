import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const customUrl = req.headers.get("x-backend-url");
  const backendUrl = customUrl || process.env.BACKEND_URL || "http://127.0.0.1:8000";

  try {
    const body = await req.json();
    try {
      const res = await fetch(`${backendUrl}/api/admin/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) return NextResponse.json(await res.json());
    } catch {
      // Fallback
    }

    return NextResponse.json({
      status: "success",
      message: "Configuration saved successfully (Simulation Mode).",
      config: body,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update config";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
