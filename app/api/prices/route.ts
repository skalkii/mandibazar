import { NextResponse } from "next/server";
import { queryPrices } from "@/lib/prices-query";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const commodity = url.searchParams.get("commodity");
  const state = url.searchParams.get("state") ?? undefined;
  const district = url.searchParams.get("district") ?? undefined;
  const limit = Number(url.searchParams.get("limit") ?? 50);

  if (!commodity) {
    return NextResponse.json({ error: "commodity is required" }, { status: 400 });
  }

  try {
    const result = await queryPrices({ commodity, state, district, limit });
    return NextResponse.json({ ...result, count: result.prices.length });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
