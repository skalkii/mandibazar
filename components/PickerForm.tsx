"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/MultiSelect";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = {
  commodities: string[];
  states: string[];
  dict: Dictionary;
  initial?: { commodities?: string[]; states?: string[] };
};

export function PickerForm({ commodities, states, dict, initial }: Props) {
  const router = useRouter();
  const [pickedCommodities, setPickedCommodities] = useState<string[]>(
    initial?.commodities ?? [],
  );
  const [pickedStates, setPickedStates] = useState<string[]>(
    initial?.states ?? [],
  );
  const [pending, startTransition] = useTransition();

  const canSubmit = pickedCommodities.length > 0 && !pending;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    const params = new URLSearchParams();
    for (const c of pickedCommodities) params.append("commodity", c);
    for (const s of pickedStates) params.append("state", s);
    startTransition(() => {
      router.push(`/prices?${params.toString()}`);
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md flex flex-col gap-5 rounded-2xl border bg-card text-card-foreground shadow-sm p-5 sm:p-6"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="commodity" className="text-sm font-medium">
          {dict.pick_commodity}
        </Label>
        <MultiSelect
          id="commodity"
          options={commodities}
          value={pickedCommodities}
          onChange={setPickedCommodities}
          placeholder={dict.pick_commodity_placeholder}
          searchPlaceholder={dict.pick_commodity}
          emptyLabel={dict.no_commodities}
          ariaLabel={dict.pick_commodity}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="state" className="text-sm font-medium">
          {dict.state_optional}
        </Label>
        <MultiSelect
          id="state"
          options={states}
          value={pickedStates}
          onChange={setPickedStates}
          placeholder={dict.all_states}
          searchPlaceholder={dict.state}
          emptyLabel={dict.no_data}
          ariaLabel={dict.state}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="h-12 text-base font-medium gap-2"
        disabled={!canSubmit}
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {dict.loading}
          </>
        ) : (
          <>
            {dict.see_prices}
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
