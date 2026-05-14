-- Mandi Price Aggregator schema
-- Paste into Supabase SQL editor and run.

create table if not exists states (
  id serial primary key,
  name text unique not null
);

create table if not exists districts (
  id serial primary key,
  state_id int references states(id) on delete cascade,
  name text not null,
  unique (state_id, name)
);

create table if not exists mandis (
  id serial primary key,
  district_id int references districts(id) on delete cascade,
  name text not null,
  latitude decimal(9,6),
  longitude decimal(9,6),
  unique (district_id, name)
);

create table if not exists commodities (
  id serial primary key,
  canonical_name text unique not null,
  hindi_name text,
  kannada_name text,
  category text
);

create table if not exists price_records (
  id bigserial primary key,
  mandi_id int references mandis(id) on delete cascade,
  commodity_id int references commodities(id) on delete cascade,
  variety text not null default '',
  arrival_date date not null,
  min_price_per_quintal numeric(10,2),
  max_price_per_quintal numeric(10,2),
  modal_price_per_quintal numeric(10,2),
  ingested_at timestamptz default now(),
  unique (mandi_id, commodity_id, variety, arrival_date)
);

create index if not exists idx_price_date on price_records(arrival_date desc);
create index if not exists idx_price_commodity_date on price_records(commodity_id, arrival_date desc);
create index if not exists idx_price_mandi_date on price_records(mandi_id, arrival_date desc);

-- Public read policy via anon key (no RLS on writes — writes use service role only).
alter table states enable row level security;
alter table districts enable row level security;
alter table mandis enable row level security;
alter table commodities enable row level security;
alter table price_records enable row level security;

drop policy if exists "public read states" on states;
create policy "public read states" on states for select using (true);
drop policy if exists "public read districts" on districts;
create policy "public read districts" on districts for select using (true);
drop policy if exists "public read mandis" on mandis;
create policy "public read mandis" on mandis for select using (true);
drop policy if exists "public read commodities" on commodities;
create policy "public read commodities" on commodities for select using (true);
drop policy if exists "public read price_records" on price_records;
create policy "public read price_records" on price_records for select using (true);
