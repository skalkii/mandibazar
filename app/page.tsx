import { listCommodities, listStates } from "@/lib/queries";
import { PickerForm } from "@/components/PickerForm";

export const revalidate = 300;

export default async function Home() {
  let commodities: string[] = [];
  let states: string[] = [];
  let loadError: string | null = null;
  try {
    [commodities, states] = await Promise.all([listCommodities(), listStates()]);
  } catch (e) {
    loadError = e instanceof Error ? e.message : String(e);
  }

  return (
    <main className="min-h-dvh flex flex-col items-center px-6 py-12 sm:py-20">
      <div className="w-full max-w-md flex flex-col items-center text-center gap-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Mandi Price Aggregator
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base">
          Today&apos;s commodity prices across Indian mandis. Pick a commodity to see the best rates near you.
        </p>
      </div>

      <div className="w-full flex justify-center mt-8 sm:mt-12">
        {loadError ? (
          <p className="text-sm text-red-600 max-w-md text-center">
            Couldn&apos;t load pickers: {loadError}. Check Supabase env vars and run{" "}
            <code className="font-mono">pnpm seed</code>.
          </p>
        ) : (
          <PickerForm commodities={commodities} states={states} />
        )}
      </div>

      <p className="mt-12 text-xs text-zinc-500 max-w-md text-center">
        Data source: data.gov.in Agmarknet. Prices update daily ~6 PM IST.
      </p>
    </main>
  );
}
