-- Agmarknet returns decimal prices (e.g. "2761.42"). Original int columns
-- rejected them. Convert to numeric(10,2). Safe on existing data: ints
-- cast cleanly to numeric.

alter table price_records
  alter column min_price_per_quintal type numeric(10,2) using min_price_per_quintal::numeric(10,2),
  alter column max_price_per_quintal type numeric(10,2) using max_price_per_quintal::numeric(10,2),
  alter column modal_price_per_quintal type numeric(10,2) using modal_price_per_quintal::numeric(10,2);
