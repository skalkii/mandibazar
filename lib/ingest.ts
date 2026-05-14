import { getServerSupabase } from "./supabase";
import { paginate } from "./agmarknet";
import { canonicalName, parseDDMMYYYY, titleCase, toISODate } from "./normalize";
import type { AgmarknetRecord } from "./types";

type IdMap = Map<string, number>;

async function upsertState(name: string, cache: IdMap): Promise<number> {
  const key = canonicalName(name);
  const cached = cache.get(key);
  if (cached) return cached;
  const supabase = getServerSupabase();
  const display = titleCase(name);
  const { data, error } = await supabase
    .from("states")
    .upsert({ name: display }, { onConflict: "name" })
    .select("id")
    .single();
  if (error) throw error;
  cache.set(key, data.id);
  return data.id;
}

async function upsertDistrict(stateId: number, name: string, cache: IdMap): Promise<number> {
  const key = `${stateId}:${canonicalName(name)}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const supabase = getServerSupabase();
  const display = titleCase(name);
  const { data, error } = await supabase
    .from("districts")
    .upsert({ state_id: stateId, name: display }, { onConflict: "state_id,name" })
    .select("id")
    .single();
  if (error) throw error;
  cache.set(key, data.id);
  return data.id;
}

async function upsertMandi(districtId: number, name: string, cache: IdMap): Promise<number> {
  const key = `${districtId}:${canonicalName(name)}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const supabase = getServerSupabase();
  const display = titleCase(name);
  const { data, error } = await supabase
    .from("mandis")
    .upsert({ district_id: districtId, name: display }, { onConflict: "district_id,name" })
    .select("id")
    .single();
  if (error) throw error;
  cache.set(key, data.id);
  return data.id;
}

async function upsertCommodity(name: string, cache: IdMap): Promise<number> {
  const key = canonicalName(name);
  const cached = cache.get(key);
  if (cached) return cached;
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("commodities")
    .upsert({ canonical_name: titleCase(name) }, { onConflict: "canonical_name" })
    .select("id")
    .single();
  if (error) throw error;
  cache.set(key, data.id);
  return data.id;
}

export type IngestResult = {
  fetched: number;
  upserted: number;
  skipped: number;
  errors: number;
};

export async function ingestForDate(date: Date): Promise<IngestResult> {
  const supabase = getServerSupabase();
  const stateCache: IdMap = new Map();
  const districtCache: IdMap = new Map();
  const mandiCache: IdMap = new Map();
  const commodityCache: IdMap = new Map();

  const result: IngestResult = { fetched: 0, upserted: 0, skipped: 0, errors: 0 };
  const batch: Array<Record<string, unknown>> = [];

  const flush = async () => {
    if (!batch.length) return;
    const { error } = await supabase
      .from("price_records")
      .upsert(batch, { onConflict: "mandi_id,commodity_id,variety,arrival_date" });
    if (error) {
      result.errors += batch.length;
      console.error("price upsert error", error);
    } else {
      result.upserted += batch.length;
    }
    batch.length = 0;
  };

  for await (const rec of paginate({ date })) {
    result.fetched += 1;
    try {
      const parsedDate = parseDDMMYYYY(rec.arrival_date);
      if (!parsedDate) {
        result.skipped += 1;
        continue;
      }
      const required: Array<keyof AgmarknetRecord> = ["state", "district", "market", "commodity"];
      if (required.some((k) => !rec[k])) {
        result.skipped += 1;
        continue;
      }
      const stateId = await upsertState(rec.state, stateCache);
      const districtId = await upsertDistrict(stateId, rec.district, districtCache);
      const mandiId = await upsertMandi(districtId, rec.market, mandiCache);
      const commodityId = await upsertCommodity(rec.commodity, commodityCache);

      const min = Number(rec.min_price);
      const max = Number(rec.max_price);
      const modal = Number(rec.modal_price);

      batch.push({
        mandi_id: mandiId,
        commodity_id: commodityId,
        variety: rec.variety || "",
        arrival_date: toISODate(parsedDate),
        min_price_per_quintal: Number.isFinite(min) ? min : null,
        max_price_per_quintal: Number.isFinite(max) ? max : null,
        modal_price_per_quintal: Number.isFinite(modal) ? modal : null,
      });

      if (batch.length >= 500) await flush();
    } catch (e) {
      result.errors += 1;
      console.error("record error", e);
    }
  }

  await flush();
  return result;
}
