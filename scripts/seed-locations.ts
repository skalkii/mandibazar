import "./_env";
import { ingestForDate } from "../lib/ingest";

async function main() {
  const days = Number(process.env.SEED_DAYS ?? 3);
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    process.stdout.write(`Seeding ${d.toISOString().slice(0, 10)}... `);
    const r = await ingestForDate(d);
    console.log(JSON.stringify(r));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
