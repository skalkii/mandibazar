import { listCommodities, listStates } from "@/lib/queries";
import { PickerForm } from "@/components/PickerForm";
import { getServerDictionary } from "@/lib/i18n/server";

export const revalidate = 300;

export default async function Home() {
  const { dict } = await getServerDictionary();

  let commodities: string[] = [];
  let states: string[] = [];
  let loadError: string | null = null;
  try {
    [commodities, states] = await Promise.all([listCommodities(), listStates()]);
  } catch (e) {
    loadError = e instanceof Error ? e.message : String(e);
  }

  return (
    <main className="flex-1 flex flex-col items-center px-4 sm:px-6 pt-6 sm:pt-12 pb-12">
      <section className="w-full max-w-md flex flex-col items-center text-center gap-3 sm:gap-4">
        <div
          aria-hidden
          className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-3 py-1 text-xs font-medium"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Live · data.gov.in
        </div>
        <h1 className="text-balance text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          {dict.app_title}
        </h1>
        <p className="text-pretty text-sm sm:text-base text-muted-foreground max-w-prose">
          {dict.app_tagline}
        </p>
      </section>

      <section className="w-full flex justify-center mt-8 sm:mt-10">
        {loadError ? (
          <div className="w-full max-w-md rounded-lg border border-destructive/30 bg-destructive/10 text-destructive p-4 text-sm">
            {loadError}
          </div>
        ) : (
          <PickerForm
            commodities={commodities}
            states={states}
            dict={dict}
          />
        )}
      </section>

      <p className="mt-10 sm:mt-12 text-xs text-muted-foreground max-w-md text-center px-4">
        {dict.data_source}
      </p>
    </main>
  );
}
