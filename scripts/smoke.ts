import './_env';
import { getServerSupabase } from '../lib/supabase';

async function main() {
  const sb = getServerSupabase();
  for (const t of ['states','districts','mandis','commodities','price_records']) {
    const { count, error } = await sb.from(t).select('*', { count: 'exact', head: true });
    console.log(t, '->', error ? `ERROR ${error.code} ${error.message}` : `count=${count}`);
  }
}
main().catch(e => { console.error(e); process.exit(1); });
