import type { AgmarknetResponse } from "./types";
import { formatDDMMYYYY } from "./normalize";

const BASE = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";
const MAX_LIMIT = 1000;

export type FetchPricesOpts = {
  state?: string;
  district?: string;
  commodity?: string;
  date?: Date;
  limit?: number;
  offset?: number;
};

export class AgmarknetError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = "AgmarknetError";
  }
}

function buildUrl(opts: FetchPricesOpts, apiKey: string): string {
  const params = new URLSearchParams({
    "api-key": apiKey,
    format: "json",
    limit: String(opts.limit ?? MAX_LIMIT),
    offset: String(opts.offset ?? 0),
  });
  if (opts.state) params.set("filters[state]", opts.state);
  if (opts.district) params.set("filters[district]", opts.district);
  if (opts.commodity) params.set("filters[commodity]", opts.commodity);
  if (opts.date) params.set("filters[arrival_date]", formatDDMMYYYY(opts.date));
  return `${BASE}?${params.toString()}`;
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function fetchPrices(
  opts: FetchPricesOpts,
  retries = 3,
): Promise<AgmarknetResponse> {
  const apiKey = process.env.AGMARKNET_API_KEY;
  if (!apiKey) throw new AgmarknetError("AGMARKNET_API_KEY not set");

  const url = buildUrl(opts, apiKey);
  let lastErr: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        throw new AgmarknetError(`HTTP ${res.status}`, res.status);
      }
      const ct = res.headers.get("content-type") ?? "";
      if (!ct.toLowerCase().includes("json")) {
        throw new AgmarknetError(`Non-JSON response (content-type: ${ct})`);
      }
      return (await res.json()) as AgmarknetResponse;
    } catch (e) {
      lastErr = e;
      if (attempt < retries) {
        await sleep(500 * Math.pow(2, attempt));
        continue;
      }
    }
  }
  if (lastErr instanceof Error) throw lastErr;
  throw new AgmarknetError("Unknown fetch failure");
}

export async function* paginate(
  opts: Omit<FetchPricesOpts, "offset" | "limit"> & { pageSize?: number },
) {
  const pageSize = opts.pageSize ?? MAX_LIMIT;
  let offset = 0;
  while (true) {
    const res = await fetchPrices({ ...opts, limit: pageSize, offset });
    for (const rec of res.records ?? []) yield rec;
    if (!res.records || res.records.length < pageSize) return;
    offset += pageSize;
    if (offset >= (res.total ?? Infinity)) return;
  }
}
