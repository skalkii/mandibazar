import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { queryPrices } from "@/lib/prices-query";
import { PriceCard } from "@/components/PriceCard";
import { formatDate } from "@/lib/format";
import { getServerDictionary } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  commodity?: string;
  state?: string;
  district?: string;
}>;

export default async function PricesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { commodity, state, district } = await searchParams;
  const { dict } = await getServerDictionary();

  if (!commodity) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center gap-4 px-6 py-12">
        <p className="text-muted-foreground text-sm">No commodity selected.</p>
        <Link
          href="/"
          className="text-sm font-medium text-primary hover:underline"
        >
          {dict.change}
        </Link>
      </main>
    );
  }

  let result;
  let loadError: string | null = null;
  try {
    result = await queryPrices({ commodity, state, district });
  } catch (e) {
    loadError = e instanceof Error ? e.message : String(e);
  }

  const where = [district, state].filter(Boolean).join(", ") || dict.all_states;

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

      <header className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
          {commodity}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {dict.top_prices} · {where}
        </p>
      </header>

      {loadError ? (
        <div className="mt-8 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive p-4 text-sm">
          {loadError}
        </div>
      ) : result && result.prices.length === 0 ? (
        <div className="mt-8 rounded-2xl border bg-card p-6 sm:p-8 text-center">
          <p className="font-medium">{dict.no_data}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {dict.no_data_hint}
          </p>
          <Link
            href="/"
            className="inline-block mt-4 text-sm font-medium text-primary hover:underline"
          >
            {dict.change}
          </Link>
        </div>
      ) : (
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
      )}
    </main>
  );
}
