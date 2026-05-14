import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { queryPrices } from "@/lib/prices-query";
import { PriceCard } from "@/components/PriceCard";
import { formatDate } from "@/lib/format";
import { getServerDictionary } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  commodity?: string | string[];
  state?: string | string[];
  district?: string | string[];
}>;

function toArray(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v.filter(Boolean) : [v].filter(Boolean);
}

export default async function PricesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const commodities = toArray(sp.commodity);
  const states = toArray(sp.state);
  const districts = toArray(sp.district);
  const { dict } = await getServerDictionary();

  if (commodities.length === 0) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center gap-4 px-6 py-12">
        <p className="text-muted-foreground text-sm">No commodity selected.</p>
        <Link href="/" className="text-sm font-medium text-primary hover:underline">
          {dict.change}
        </Link>
      </main>
    );
  }

  let result;
  let loadError: string | null = null;
  try {
    result = await queryPrices({ commodities, states, districts });
  } catch (e) {
    loadError = e instanceof Error ? e.message : String(e);
  }

  const where =
    [districts.join(", "), states.join(", ")].filter(Boolean).join(" · ") ||
    dict.all_states;

  const groupKeys = result ? Object.keys(result.byCommodity) : [];
  const hasResults = result && result.prices.length > 0;

  return (
    <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8 mx-auto w-full max-w-2xl">
      <div className="flex items-center justify-between gap-4 mb-5 sm:mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {dict.change.replace("← ", "")}
        </Link>
        {result?.latest_date && (
          <p className="text-xs text-muted-foreground tabular-nums">
            {dict.as_of} {formatDate(result.latest_date)}
          </p>
        )}
      </div>

      <header className="flex flex-col gap-1.5">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight leading-tight">
          {commodities.length === 1
            ? commodities[0]
            : `${commodities.length} ${dict.pick_commodity.toLowerCase()}`}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {dict.top_prices} · {where}
        </p>
        {commodities.length > 1 && (
          <p className="text-xs text-muted-foreground/80 mt-1">
            {commodities.join(" · ")}
          </p>
        )}
      </header>

      {loadError ? (
        <div className="mt-8 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive p-4 text-sm">
          {loadError}
        </div>
      ) : !hasResults ? (
        <div className="mt-8 rounded-2xl border bg-card p-6 sm:p-8 text-center">
          <p className="font-medium">{dict.no_data}</p>
          <p className="text-sm text-muted-foreground mt-1">{dict.no_data_hint}</p>
          <Link
            href="/"
            className="inline-block mt-4 text-sm font-medium text-primary hover:underline"
          >
            {dict.change}
          </Link>
        </div>
      ) : commodities.length === 1 ? (
        <div className="mt-5 sm:mt-6 grid grid-cols-1 gap-3">
          {result!.prices.map((row, i) => (
            <PriceCard
              key={`${row.mandi}-${row.district}-${row.variety}-${i}`}
              row={row}
              rank={i + 1}
              dict={dict}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 sm:mt-8 flex flex-col gap-8">
          {groupKeys.map((commodity) => {
            const rows = result!.byCommodity[commodity];
            return (
              <section key={commodity} className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="font-serif text-xl sm:text-2xl font-medium tracking-tight">
                    {commodity}
                  </h2>
                  <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                    {rows.length}{" "}
                    {rows.length === 1 ? "mandi" : "mandis"}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {rows.map((row, i) => (
                    <PriceCard
                      key={`${commodity}-${row.mandi}-${row.district}-${row.variety}-${i}`}
                      row={row}
                      rank={i + 1}
                      dict={dict}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
