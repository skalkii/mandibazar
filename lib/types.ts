export type AgmarknetRecord = {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  arrival_date: string;
  min_price: string;
  max_price: string;
  modal_price: string;
};

export type AgmarknetResponse = {
  records: AgmarknetRecord[];
  total: number;
  count: number;
  offset: number;
  limit: number;
};

export type PriceRow = {
  mandi: string;
  district: string;
  state: string;
  commodity: string;
  variety: string;
  arrival_date: string;
  min_per_kg: number;
  max_per_kg: number;
  modal_per_kg: number;
};
