import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const customUrl = req.headers.get("x-backend-url");
  const backendUrl = customUrl || process.env.BACKEND_URL || "http://127.0.0.1:8000";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const start = Date.now();
    const res = await fetch(`${backendUrl}/health`, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const latency = Date.now() - start;

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return NextResponse.json({
        status: "connected",
        backend_url: backendUrl,
        latency_ms: latency,
        data,
      });
    }

    return NextResponse.json(
      {
        status: "unreachable",
        backend_url: backendUrl,
        error: `Backend responded with HTTP ${res.status}`,
      },
      { status: 503 }
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Connection failed";
    return NextResponse.json(
      {
        status: "unreachable",
        backend_url: backendUrl,
        error: errorMessage,
      },
      { status: 503 }
    );
  }
}
