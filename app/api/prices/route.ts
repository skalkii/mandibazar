import { NextResponse } from "next/server";
import { queryPrices } from "@/lib/prices-query";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const commodities = url.searchParams.getAll("commodity");
  const states = url.searchParams.getAll("state");
  const districts = url.searchParams.getAll("district");
  const limit = Number(url.searchParams.get("limit") ?? 100);

  if (commodities.length === 0) {
    return NextResponse.json({ error: "commodity is required" }, { status: 400 });
  }

  try {
    const result = await queryPrices({ commodities, states, districts, limit });
    return NextResponse.json({ ...result, count: result.prices.length });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
