import './_env';
import { getServerSupabase } from '../lib/supabase';

async function main() {
  const sb = getServerSupabase();
  
  // Tomato commodity id
  const { data: c } = await sb.from('commodities').select('id').eq('canonical_name', 'Tomato').single();
  console.log('Tomato id:', c?.id);
  
  // Karnataka state id
  const { data: s } = await sb.from('states').select('id').eq('name', 'Karnataka').single();
  console.log('Karnataka id:', s?.id);
  
  // Count Tomato prices by state
  const { data: rows } = await sb
    .from('price_records')
    .select('mandis!inner(districts!inner(states!inner(name)))')
    .eq('commodity_id', c!.id);
  
  const counts: Record<string, number> = {};
  type Row = { mandis: { districts: { states: { name: string } } } };
  for (const r of (rows as unknown as Row[]) ?? []) {
    const sn = r.mandis?.districts?.states?.name ?? '?';
    counts[sn] = (counts[sn] ?? 0) + 1;
  }
  console.log('Tomato rows by state:', counts);
}
main().catch(e => { console.error(e); process.exit(1); });
