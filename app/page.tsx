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
    <main className="flex-1 flex flex-col items-center px-4 sm:px-6 pt-8 sm:pt-16 pb-16">
      <section className="w-full max-w-md flex flex-col items-center text-center gap-3 sm:gap-4">
        <div
          aria-hidden
          className="inline-flex items-center gap-1.5 rounded-full bg-accent text-accent-foreground px-2.5 py-1 text-[11px] font-medium"
        >
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          Live · data.gov.in
        </div>
        <h1 className="font-serif text-balance text-[2rem] sm:text-5xl md:text-6xl font-medium tracking-tight leading-[1.05]">
          {dict.app_title}
        </h1>
        <p className="text-pretty text-[15px] sm:text-base text-muted-foreground max-w-prose">
          {dict.app_tagline}
        </p>
      </section>

      <section className="w-full flex justify-center mt-7 sm:mt-10">
        {loadError ? (
          <div className="w-full max-w-md rounded-xl border border-destructive/30 bg-destructive/10 text-destructive p-4 text-sm">
            {loadError}
          </div>
        ) : (
          <PickerForm commodities={commodities} states={states} dict={dict} />
        )}
      </section>
    </main>
  );
}
