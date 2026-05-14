import { getBrowserSupabase } from "./supabase";

export async function listStates(): Promise<string[]> {
  const sb = getBrowserSupabase();
  const { data, error } = await sb.from("states").select("name").order("name");
  if (error) throw error;
  return (data ?? []).map((r) => r.name);
}

export async function listCommodities(): Promise<string[]> {
  const sb = getBrowserSupabase();
  const { data, error } = await sb
    .from("commodities")
    .select("canonical_name")
    .order("canonical_name");
  if (error) throw error;
  return (data ?? []).map((r) => r.canonical_name);
}
