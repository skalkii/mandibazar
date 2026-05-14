import './_env';
import { getServerSupabase } from '../lib/supabase';

async function main() {
  const sb = getServerSupabase();
  // Try inserting a decimal value to detect column type
  const { error } = await sb.from('price_records').insert({
    mandi_id: 1, commodity_id: 1, variety: '__test__',
    arrival_date: '2000-01-01',
    min_price_per_quintal: 1.5,
    max_price_per_quintal: 1.5,
    modal_price_per_quintal: 1.5,
  });
  if (error) {
    console.log('INSERT decimal failed:', error.code, error.message);
  } else {
    console.log('INSERT decimal OK — columns are numeric');
    await sb.from('price_records').delete().eq('variety', '__test__').eq('arrival_date', '2000-01-01');
  }
}
main().catch(e => { console.error(e); process.exit(1); });
