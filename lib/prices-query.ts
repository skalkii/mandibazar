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
  commodity: string;
  state: string | null;
  district: string | null;
  latest_date: string | null;
  prices: PriceRow[];
};

export async function queryPrices(opts: {
  commodity: string;
  state?: string;
  district?: string;
  limit?: number;
}): Promise<PricesQueryResult> {
  const limit = Math.min(opts.limit ?? 50, 50);
  const sb = getBrowserSupabase();

  const { data: commodityRow } = await sb
    .from("commodities")
    .select("id, canonical_name")
    .eq("canonical_name", opts.commodity)
    .maybeSingle();

  if (!commodityRow) {
    return {
      commodity: opts.commodity,
      state: opts.state ?? null,
      district: opts.district ?? null,
      latest_date: null,
      prices: [],
    };
  }

  const { data: latest } = await sb
    .from("price_records")
    .select("arrival_date")
    .eq("commodity_id", commodityRow.id)
    .order("arrival_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!latest) {
    return {
      commodity: commodityRow.canonical_name,
      state: opts.state ?? null,
      district: opts.district ?? null,
      latest_date: null,
      prices: [],
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
    .eq("commodity_id", commodityRow.id)
    .eq("arrival_date", latest.arrival_date)
    .order("modal_price_per_quintal", { ascending: false })
    .limit(limit);

  if (opts.state) q = q.eq("mandis.districts.states.name", opts.state);
  if (opts.district) q = q.eq("mandis.districts.name", opts.district);

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

  return {
    commodity: commodityRow.canonical_name,
    state: opts.state ?? null,
    district: opts.district ?? null,
    latest_date: latest.arrival_date,
    prices,
  };
}
