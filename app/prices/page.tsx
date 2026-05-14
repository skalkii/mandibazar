import Link from "next/link";
import { queryPrices } from "@/lib/prices-query";
import { PriceCard } from "@/components/PriceCard";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";

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

  if (!commodity) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-12 gap-4">
        <p className="text-zinc-600">No commodity selected.</p>
        <Link href="/">
          <Button>Go back</Button>
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

  const where = [district, state].filter(Boolean).join(", ") || "all India";

  return (
    <main className="min-h-dvh px-4 sm:px-6 py-6 sm:py-10 max-w-2xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          href="/"
          className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Change
        </Link>
        {result?.latest_date && (
          <p className="text-xs text-zinc-500">
            as of {formatDate(result.latest_date)}
          </p>
        )}
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{commodity}</h1>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
        Top mandi prices · {where}
      </p>

      {loadError ? (
        <p className="mt-8 text-sm text-red-600">Failed to load: {loadError}</p>
      ) : result && result.prices.length === 0 ? (
        <div className="mt-8 p-6 border rounded-lg text-center text-sm text-zinc-600">
          No prices found for <strong>{commodity}</strong>
          {state ? ` in ${state}` : ""}. Try a different state or commodity.
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {result!.prices.map((row, i) => (
            <PriceCard
              key={`${row.mandi}-${row.district}-${row.variety}-${i}`}
              row={row}
              rank={i + 1}
            />
          ))}
        </div>
      )}
    </main>
  );
}
