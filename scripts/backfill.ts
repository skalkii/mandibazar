import "./_env";
import { ingestForDate } from "../lib/ingest";

async function main() {
  const days = Number(process.argv[2] ?? process.env.BACKFILL_DAYS ?? 30);
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    process.stdout.write(`Backfilling ${d.toISOString().slice(0, 10)}... `);
    try {
      const r = await ingestForDate(d);
      console.log(JSON.stringify(r));
    } catch (e) {
      console.error("FAILED", e);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
