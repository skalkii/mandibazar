import { getBrowserSupabase } from "./supabase";
import { quintalToKg } from "./normalize";
import type { PriceRow } from "./types";

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

export type PricesQueryResult = {
  commodities: string[];
  states: string[];
  districts: string[];
  latest_date: string | null;
  prices: PriceRow[];
  byCommodity: Record<string, PriceRow[]>;
};

export async function queryPrices(opts: {
  commodities: string[];
  states?: string[];
  districts?: string[];
  limit?: number;
}): Promise<PricesQueryResult> {
  const limit = Math.min(opts.limit ?? 100, 200);
  const sb = getBrowserSupabase();

  if (opts.commodities.length === 0) {
    return {
      commodities: [],
      states: opts.states ?? [],
      districts: opts.districts ?? [],
      latest_date: null,
      prices: [],
      byCommodity: {},
    };
  }

  const { data: commodityRows, error: cErr } = await sb
    .from("commodities")
    .select("id, canonical_name")
    .in("canonical_name", opts.commodities);
  if (cErr) throw cErr;
  const commodityIds = (commodityRows ?? []).map((r) => r.id);
  if (commodityIds.length === 0) {
    return {
      commodities: opts.commodities,
      states: opts.states ?? [],
      districts: opts.districts ?? [],
      latest_date: null,
      prices: [],
      byCommodity: {},
    };
  }

  const { data: latest } = await sb
    .from("price_records")
    .select("arrival_date")
    .in("commodity_id", commodityIds)
    .order("arrival_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!latest) {
    return {
      commodities: opts.commodities,
      states: opts.states ?? [],
      districts: opts.districts ?? [],
      latest_date: null,
      prices: [],
      byCommodity: {},
    };
  }

  let q = sb
    .from("price_records")
    .select(
      `variety, arrival_date,
       min_price_per_quintal, max_price_per_quintal, modal_price_per_quintal,
       commodities!inner(canonical_name),
       mandis!inner(name, districts!inner(name, states!inner(name)))`,
    )
    .in("commodity_id", commodityIds)
    .eq("arrival_date", latest.arrival_date)
    .order("modal_price_per_quintal", { ascending: false })
    .limit(limit);

  if (opts.states && opts.states.length > 0) {
    q = q.in("mandis.districts.states.name", opts.states);
  }
  if (opts.districts && opts.districts.length > 0) {
    q = q.in("mandis.districts.name", opts.districts);
  }

  const { data, error } = await q.returns<Row[]>();
  if (error) throw error;

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

  const byCommodity: Record<string, PriceRow[]> = {};
  for (const p of prices) {
    (byCommodity[p.commodity] ??= []).push(p);
  }

  return {
    commodities: opts.commodities,
    states: opts.states ?? [],
    districts: opts.districts ?? [],
    latest_date: latest.arrival_date,
    prices,
    byCommodity,
  };
}
