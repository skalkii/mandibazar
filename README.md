# Mandi Price Aggregator

Real-time agricultural commodity prices for Indian mandis, sourced from the government Agmarknet feed on data.gov.in.

> **Status:** Day 1 scaffold complete — data pipeline ready, UI lands Day 2.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind v4
- Supabase (Postgres) for storage
- data.gov.in Agmarknet API for prices
- Vercel Cron for daily ingestion

## Quick start

```bash
pnpm install
cp .env.example .env.local   # fill in keys
# Paste db/schema.sql into Supabase SQL editor and run.
pnpm seed                    # ingests last 3 days
pnpm dev
```

## Environment

See `.env.example`. You need:

- A Supabase project (free tier) — paste its URL + anon + service-role keys.
- A data.gov.in API key — register at <https://data.gov.in/user/register>.
- A `CRON_SECRET` — `openssl rand -hex 32` works.

## Scripts

| Command | What |
|---|---|
| `pnpm dev` | Next dev server |
| `pnpm build` | Production build |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm seed` | Ingest last 3 days (override with `SEED_DAYS=N`) |
| `pnpm backfill 30` | Ingest the last N days |

## Cron

`vercel.json` runs `/api/cron/ingest` daily at `30 12 * * *` UTC (= 6 PM IST). The route checks `Authorization: Bearer ${CRON_SECRET}`. Vercel attaches that header automatically when `CRON_SECRET` is set as a project env var.

## Layout

```
app/
  api/cron/ingest/route.ts   # daily ingestion endpoint
  page.tsx                   # landing (Day 2 builds picker UI here)
lib/
  agmarknet.ts               # data.gov.in API wrapper + paginator
  ingest.ts                  # upsert pipeline
  normalize.ts               # date + name helpers
  supabase.ts                # server + browser clients
  types.ts
  utils.ts
db/
  schema.sql                 # paste into Supabase SQL editor
scripts/
  seed-locations.ts          # pnpm seed
  backfill.ts                # pnpm backfill [days]
vercel.json                  # cron config
```

## Day 2 / Day 3 scope

See the original handover doc. Day 2 = picker + results UI + `/api/prices`. Day 3 = WhatsApp share, geolocation, polish.
