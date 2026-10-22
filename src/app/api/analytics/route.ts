import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { cleanEvent } from "@/lib/measurement/contract";
import { measurementRedis, storeEvents } from "@/lib/measurement/store";
export const runtime = "nodejs";
export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (
    !origin ||
    !["https://www.lauraharrispm.com", "https://lauraharrispm.com"].includes(
      origin,
    ) ||
    process.env.VERCEL_ENV !== "production"
  )
    return new NextResponse(null, { status: 403 });
  if (!req.headers.get("content-type")?.startsWith("application/json"))
    return new NextResponse(null, { status: 415 });
  // Read a bounded stream rather than allocating an arbitrarily large request.
  const reader = req.body?.getReader();
  if (!reader) return new NextResponse(null, { status: 400 });
  let size = 0;
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 16_384) {
      await reader.cancel();
      return new NextResponse(null, { status: 413 });
    }
    chunks.push(value);
  }
  let body;
  try {
    body = JSON.parse(Buffer.concat(chunks).toString());
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  if (
    !Array.isArray(body.events) ||
    body.events.length < 1 ||
    body.events.length > 20
  )
    return new NextResponse(null, { status: 400 });
  const events = body.events.map(cleanEvent);
  if (events.some((e: unknown) => !e))
    return new NextResponse(null, { status: 400 });
  try {
    const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0];
    const key = `measurement:rl:${createHash("sha256").update(ip).digest("hex").slice(0, 24)}:${Math.floor(Date.now() / 60_000)}`;
    const count = await measurementRedis().eval(
      `local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],120) end; return n`,
      [key],
      [],
    );
    if (Number(count) > 60) return new NextResponse(null, { status: 429 });
    await storeEvents(events);
    return new NextResponse(null, { status: 204 });
  } catch {
    console.error("measurement: persistence failed");
    return new NextResponse(null, { status: 503 });
  }
}
