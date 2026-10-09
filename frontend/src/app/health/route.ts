import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const customUrl = req.headers.get("x-backend-url");
  const backendUrl = customUrl || process.env.BACKEND_URL || "http://127.0.0.1:8000";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${backendUrl}/health`, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return NextResponse.json({ status: "healthy", backend_url: backendUrl });
    }
    return NextResponse.json({ status: "unreachable", backend_url: backendUrl }, { status: 503 });
  } catch {
    return NextResponse.json({ status: "unreachable", backend_url: backendUrl }, { status: 503 });
  }
}
