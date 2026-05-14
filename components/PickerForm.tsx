"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const ANY_STATE = "__any__";

type Props = {
  commodities: string[];
  states: string[];
  dict: Dictionary;
  initial?: { commodity?: string; state?: string };
};

export function PickerForm({ commodities, states, dict, initial }: Props) {
  const router = useRouter();
  const [commodity, setCommodity] = useState(initial?.commodity ?? "");
  const [state, setState] = useState(initial?.state ?? ANY_STATE);
  const [pending, startTransition] = useTransition();

  const canSubmit = Boolean(commodity) && !pending;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    const params = new URLSearchParams({ commodity });
    if (state && state !== ANY_STATE) params.set("state", state);
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
        <Select value={commodity} onValueChange={setCommodity}>
          <SelectTrigger id="commodity" className="h-12 text-base">
            <SelectValue placeholder={dict.pick_commodity_placeholder} />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            {commodities.length === 0 ? (
              <SelectItem value="__empty__" disabled>
                {dict.no_commodities}
              </SelectItem>
            ) : (
              commodities.map((c) => (
                <SelectItem key={c} value={c} className="text-base">
                  {c}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="state" className="text-sm font-medium">
          {dict.state_optional}
        </Label>
        <Select value={state} onValueChange={setState}>
          <SelectTrigger id="state" className="h-12 text-base">
            <SelectValue placeholder={dict.all_states} />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            <SelectItem value={ANY_STATE} className="text-base">
              {dict.all_states}
            </SelectItem>
            {states.map((s) => (
              <SelectItem key={s} value={s} className="text-base">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
