import { NextResponse } from "next/server";
import { getBrowserSupabase } from "@/lib/supabase";
import { quintalToKg } from "@/lib/normalize";
import type { PriceRow } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_LIMIT = 50;

type Row = {
  variety: string;
  arrival_date: string;
  min_price_per_quintal: number | null;
  max_price_per_quintal: number | null;
  modal_price_per_quintal: number | null;
  commodities: { canonical_name: string } | null;
  mandis: {
    name: string;
    districts: { name: string; states: { name: string } | null } | null;
  } | null;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const commodity = url.searchParams.get("commodity");
  const state = url.searchParams.get("state");
  const district = url.searchParams.get("district");
  const limit = Math.min(Number(url.searchParams.get("limit") ?? MAX_LIMIT), MAX_LIMIT);

  if (!commodity) {
    return NextResponse.json({ error: "commodity is required" }, { status: 400 });
  }

  const sb = getBrowserSupabase();

  const { data: commodityRow, error: cErr } = await sb
    .from("commodities")
    .select("id, canonical_name")
    .eq("canonical_name", commodity)
    .single();
  if (cErr || !commodityRow) {
    return NextResponse.json({ commodity, prices: [], latest_date: null, count: 0 });
  }

  const { data: latest, error: lErr } = await sb
    .from("price_records")
    .select("arrival_date")
    .eq("commodity_id", commodityRow.id)
    .order("arrival_date", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (lErr) return NextResponse.json({ error: lErr.message }, { status: 500 });
  if (!latest) {
    return NextResponse.json({ commodity, prices: [], latest_date: null, count: 0 });
  }

  let q = sb
    .from("price_records")
    .select(
      `variety, arrival_date,
       min_price_per_quintal, max_price_per_quintal, modal_price_per_quintal,
       commodities!inner(canonical_name),
       mandis!inner(name, districts!inner(name, states!inner(name)))`,
    )
    .eq("commodity_id", commodityRow.id)
    .eq("arrival_date", latest.arrival_date)
    .order("modal_price_per_quintal", { ascending: false })
    .limit(limit);

  if (state) q = q.eq("mandis.districts.states.name", state);
  if (district) q = q.eq("mandis.districts.name", district);

  const { data, error } = await q.returns<Row[]>();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const prices: PriceRow[] = (data ?? [])
    .filter((r) => r.mandis?.districts?.states && r.commodities)
    .map((r) => ({
      mandi: r.mandis!.name,
      district: r.mandis!.districts!.name,
      state: r.mandis!.districts!.states!.name,
      commodity: r.commodities!.canonical_name,
      variety: r.variety ?? "",
      arrival_date: r.arrival_date,
      min_per_kg: quintalToKg(r.min_price_per_quintal ?? 0),
      max_per_kg: quintalToKg(r.max_price_per_quintal ?? 0),
      modal_per_kg: quintalToKg(r.modal_price_per_quintal ?? 0),
    }));

  return NextResponse.json({
    commodity: commodityRow.canonical_name,
    state,
    district,
    latest_date: latest.arrival_date,
    count: prices.length,
    prices,
  });
}
