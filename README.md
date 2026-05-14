# 🌾 Mandi Price Aggregator

> Real-time agricultural commodity prices from Indian mandis (markets), sourced from the government Agmarknet feed on data.gov.in. Built for farmers, traders, and anyone who wants to know what tomatoes are going for in their nearest market today.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ecf8e?logo=supabase)
![License](https://img.shields.io/badge/License-MIT-green)

---

## What it does

- 🔎 **Search & multi-select** commodities and states — pick Tomato + Onion across Karnataka + Tamil Nadu in one query
- 💰 **Ranked prices** per mandi: modal ₹/kg, min–max range, variety, district, "as of" date
- 🌐 **8 Indian languages** — English, हिन्दी, मराठी, ಕನ್ನಡ, नेपाली, தமிழ், తెలుగు, বাংলা (cookie-persisted)
- 🌙 **Light · Dark · System** theme, warm Claude-inspired palette
- 📱 **Mobile-first** — sticky header, touch-sized controls, installable PWA (manifest + icons)
- 🔁 **Daily auto-ingest** at 6 PM IST via Vercel Cron — no manual refresh
- 📡 **JSON API** for power users: `/api/prices?commodity=Tomato&state=Karnataka`

## How it works

```
┌──────────────────────────────┐
│ data.gov.in Agmarknet API    │  free, public, daily-updated mandi feed
└──────────────┬───────────────┘
               │ paginated fetch (1 page = 1000 records, cap ~10k/day)
               ▼
┌──────────────────────────────┐
│ /api/cron/ingest             │  Vercel Cron · 30 12 * * * UTC = 6 PM IST
│ (Next.js Route, node runtime)│  · Bearer CRON_SECRET auth
└──────────────┬───────────────┘
               │ upsert in 500-row batches, dedupe by (mandi, commodity, variety, date)
               ▼
┌──────────────────────────────┐
│ Supabase Postgres            │  free tier · 500 MB · public-read RLS
│  states / districts / mandis │
│  commodities / price_records │
└──────────────┬───────────────┘
               │ public-read via anon key
               ▼
┌──────────────────────────────┐
│ Next.js App Router (SSR)     │  picker → /prices?commodity=X&state=Y
│ shadcn/ui + Tailwind v4      │
└──────────────────────────────┘
```

---

## Stack

| Layer        | Choice                                            | Why                                            |
| ------------ | ------------------------------------------------- | ---------------------------------------------- |
| Framework    | **Next.js 16** App Router + TypeScript            | SSR, route handlers, Vercel Cron native        |
| Styling      | **Tailwind v4** + **shadcn/ui**                   | Mobile-first utilities, accessible primitives  |
| Database     | **Supabase** (Postgres)                           | Free 500 MB, instant REST, row-level security  |
| Data source  | **data.gov.in** Agmarknet                         | Official, free, no scraping                    |
| Cron         | **Vercel Cron**                                   | 1 job/day on free hobby tier                   |
| Hosting      | **Vercel** free hobby                             | $0 at any reasonable traffic                   |
| Themes/i18n  | `next-themes` + cookie-based dictionary           | No client routing changes                      |

**Estimated cost at <10K daily users: $0.**

---

## Quick start (local)

```bash
# 1. Clone + install
git clone https://github.com/skalkii/mandibazar.git
cd mandibazar
pnpm install

# 2. Configure env
cp .env.example .env.local
# fill in 5 values — see "Environment variables" below

# 3. Initialize the database
# Open Supabase SQL Editor → paste db/schema.sql → Run

# 4. Seed some data
pnpm seed              # last 3 days (override with SEED_DAYS=N)

# 5. Start dev server
pnpm dev               # → http://localhost:3000
```

Pick a commodity + (optional) state → click **See prices** → ranked list of mandis.

---

## Environment variables

Copy `.env.example` to `.env.local` and fill these 5 values:

| Variable                          | Where to get                                                                                                | Notes                                       |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`        | Supabase Dashboard → **Project Settings → API** → "Project URL"                                             | Just the base, no `/rest/v1/` suffix        |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | Same page → "Project API Keys" → **anon public**                                                            | Safe in browser; RLS protects data          |
| `SUPABASE_SERVICE_ROLE_KEY`       | Same page → "Project API Keys" → **service_role**                                                           | ⚠️ Server-only. Bypasses RLS. Never commit. |
| `AGMARKNET_API_KEY`               | Register at <https://data.gov.in/user/register> → profile → "API Key"                                       | One key per account; works for any dataset  |
| `CRON_SECRET`                     | Generate: `openssl rand -hex 32`                                                                            | Used to auth the ingest endpoint            |

Optional tuning:

| Variable       | Default | What                                              |
| -------------- | ------- | ------------------------------------------------- |
| `SEED_DAYS`    | 3       | Days back `pnpm seed` ingests                     |
| `BACKFILL_DAYS`| 30      | Default for `pnpm backfill` with no arg           |

---

## Scripts

| Command                | What it does                                                  |
| ---------------------- | ------------------------------------------------------------- |
| `pnpm dev`             | Start Next.js dev server                                      |
| `pnpm build`           | Production build (compiles routes + types)                    |
| `pnpm start`           | Run production build locally                                  |
| `pnpm lint`            | ESLint                                                        |
| `pnpm typecheck`       | `tsc --noEmit`                                                |
| `pnpm seed`            | Ingest the last `$SEED_DAYS` days (default 3)                 |
| `pnpm backfill [days]` | Ingest the last N days (e.g. `pnpm backfill 30`)              |
| `pnpm tsx scripts/smoke.ts` | Verify Supabase connection + row counts                   |

---

## Database schema

```
states          (id, name)
districts       (id, state_id, name)
mandis          (id, district_id, name, latitude?, longitude?)
commodities    (id, canonical_name, hindi_name?, kannada_name?, category?)
price_records   (id, mandi_id, commodity_id, variety, arrival_date,
                 min_price_per_quintal, max_price_per_quintal,
                 modal_price_per_quintal, ingested_at)
                 UNIQUE (mandi_id, commodity_id, variety, arrival_date)
```

All tables have **public-read RLS policies**. Writes only via service-role key (cron + seed scripts). See `db/schema.sql`.

Migrations live in `db/migrations/`. Run them in Supabase SQL Editor after the base schema.

---

## API

Read-only JSON endpoints:

```http
GET /api/commodities
→ { "commodities": ["Ajwan", "Apple", …] }

GET /api/locations
→ { "states": ["Andhra Pradesh", "Bihar", …] }

GET /api/locations?state=Karnataka
→ { "districts": ["Bagalkot", "Bangalore", …] }

GET /api/prices?commodity=Tomato&commodity=Onion&state=Karnataka
→ {
    "commodities": ["Tomato", "Onion"],
    "states": ["Karnataka"],
    "latest_date": "2026-05-14",
    "count": 38,
    "prices": [ { mandi, district, state, modal_per_kg, … } ],
    "byCommodity": { "Tomato": [...], "Onion": [...] }
  }
```

Multi-value: repeat the param key (`?commodity=A&commodity=B`).

---

## Deploy to Vercel (free)

1. Sign in: <https://vercel.com> → "Continue with GitHub".
2. **Add New → Project** → import this repo.
3. Click **Environment Variables** → paste the same 5 keys from your `.env.local`. Mark the 3 server-only ones (`SUPABASE_SERVICE_ROLE_KEY`, `AGMARKNET_API_KEY`, `CRON_SECRET`) as **Sensitive**.
4. **Deploy**. ~90 sec → live at `https://mandibazar-<hash>.vercel.app`.
5. Cron auto-wires from `vercel.json` (`30 12 * * *` UTC = 6 PM IST). Vercel injects `Authorization: Bearer ${CRON_SECRET}` automatically.

Smoke test:
- `https://your-app.vercel.app/`
- `https://your-app.vercel.app/api/commodities`
- `https://your-app.vercel.app/api/prices?commodity=Tomato&state=Karnataka`

### Free tier limits (all comfortable)

| Service       | Free tier             | This app's load           |
| ------------- | --------------------- | ------------------------- |
| Vercel        | 100 GB bandwidth/mo   | JSON tiny, far below      |
| Vercel cron   | 2 jobs / day          | Uses 1                    |
| Vercel funcs  | 100k invocations/mo   | Page reads cheap          |
| Supabase      | 500 MB storage        | ~10k rows/day fits easily |
| data.gov.in   | ~100 req/min          | 1 cron/day, ~10 calls     |

---

## Project layout

```
app/
  api/
    cron/ingest/route.ts    # daily ingest (Bearer-auth'd)
    commodities/route.ts    # GET commodity list
    locations/route.ts      # GET states or districts
    prices/route.ts         # GET filtered prices (multi)
  prices/page.tsx           # results SSR
  page.tsx                  # landing (picker)
  layout.tsx                # theme + i18n + header + footer
  globals.css               # Tailwind v4 + theme tokens

components/
  ui/                       # shadcn primitives (button, card, select, …)
  Header.tsx                # sticky, theme + lang switchers
  Footer.tsx                # data attribution + GitHub
  PickerForm.tsx            # commodity + state multi-select
  MultiSelect.tsx           # searchable, multi, chips
  PriceCard.tsx             # ranked mandi card
  ThemeProvider.tsx         # next-themes wrapper
  ThemeToggle.tsx           # light/dark/system
  LanguageSwitcher.tsx      # 8 locales, cookie

lib/
  agmarknet.ts              # data.gov.in API wrapper (retry, content-type guard, paginator)
  ingest.ts                 # upsert pipeline (dedupe + 500-row batches)
  prices-query.ts           # shared price query (used by /api/prices + /prices SSR)
  queries.ts                # commodity + state list helpers
  supabase.ts               # browser + server clients
  format.ts                 # INR + date formatters (Intl)
  normalize.ts              # DD/MM/YYYY parse, canonical names, quintal→kg
  types.ts
  utils.ts                  # cn() helper
  i18n/
    dictionaries.ts         # 8 locale strings
    server.ts               # getLocale() via cookie

db/
  schema.sql                # full schema + RLS — paste into Supabase
  migrations/               # ordered ALTERs

scripts/
  _env.ts                   # loads .env.local then .env
  seed-locations.ts         # pnpm seed
  backfill.ts               # pnpm backfill N
  smoke.ts                  # connection + row count check

public/
  favicon.svg, favicon.ico, apple-touch-icon.png, icon-192/512.png
  site.webmanifest          # PWA installable
```

---

## Adding a new language

1. Open `lib/i18n/dictionaries.ts`.
2. Add the locale code to the `LOCALES` tuple and `LOCALE_NAMES` map.
3. Copy the `en` dictionary, translate each value.
4. Add it to the `dictionaries` record at the bottom.

That's it — switcher picks it up automatically.

---

## Common gotchas

- **`PGRST125 Invalid path`** on Supabase calls → your `NEXT_PUBLIC_SUPABASE_URL` includes `/rest/v1/`. Strip it; use just `https://<ref>.supabase.co`.
- **`invalid input syntax for type integer`** during seed → migration `001_prices_to_numeric.sql` not run, or you're on an old `lib/ingest.ts` that didn't round. Latest code rounds at the boundary, so any int column accepts the data.
- **Empty pickers** in dev → no seed yet. Run `pnpm seed` once.
- **Empty results for "Karnataka + Tomato" right after first seed** → first seed sometimes truncates due to the rare duplicate-in-batch issue; re-run `pnpm seed`.
- **Cron returns 401 in Vercel** → `CRON_SECRET` env var isn't set in Vercel project settings.

---

## Roadmap

- [ ] WhatsApp deep-link share button
- [ ] Geolocation auto-detect nearest district
- [ ] 7-day modal-price trendline per mandi
- [ ] Saved searches + email/WhatsApp digest
- [ ] Hindi/Kannada commodity name secondary labels (currently UI-only i18n)
- [ ] Map view
- [ ] SMS interface (Twilio India)

---

## License

MIT.

---

## Credits

- Data: [data.gov.in Agmarknet](https://data.gov.in/resource/current-daily-price-various-commodities-various-markets-mandi) · Ministry of Agriculture and Farmers Welfare
- UI primitives: [shadcn/ui](https://ui.shadcn.com)
- Icons: [lucide](https://lucide.dev)
- Fonts: [Inter](https://rsms.me/inter/), [Newsreader](https://fonts.google.com/specimen/Newsreader), [Geist Mono](https://vercel.com/font)
