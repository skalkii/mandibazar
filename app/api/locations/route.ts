import { NextResponse } from "next/server";
import { getBrowserSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const stateName = url.searchParams.get("state");
  const sb = getBrowserSupabase();

  if (stateName) {
    const { data: state, error: stateErr } = await sb
      .from("states")
      .select("id")
      .eq("name", stateName)
      .single();
    if (stateErr || !state) {
      return NextResponse.json({ districts: [] });
    }
    const { data, error } = await sb
      .from("districts")
      .select("name")
      .eq("state_id", state.id)
      .order("name");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ districts: (data ?? []).map((r) => r.name) });
  }

  const { data, error } = await sb.from("states").select("name").order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ states: (data ?? []).map((r) => r.name) });
}
