import { NextResponse } from "next/server";
import { getBrowserSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  const sb = getBrowserSupabase();
  const { data, error } = await sb
    .from("commodities")
    .select("canonical_name")
    .order("canonical_name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ commodities: (data ?? []).map((r) => r.canonical_name) });
}
