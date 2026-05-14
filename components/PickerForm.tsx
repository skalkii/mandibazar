"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const ANY_STATE = "__any__";

type Props = {
  commodities: string[];
  states: string[];
  initial?: { commodity?: string; state?: string };
};

export function PickerForm({ commodities, states, initial }: Props) {
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
    <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full max-w-md">
      <div className="flex flex-col gap-2">
        <Label htmlFor="commodity">Commodity</Label>
        <Select value={commodity} onValueChange={setCommodity}>
          <SelectTrigger id="commodity" className="h-12 text-base">
            <SelectValue placeholder="Pick a commodity (e.g. Tomato)" />
          </SelectTrigger>
          <SelectContent>
            {commodities.length === 0 ? (
              <SelectItem value="__empty__" disabled>
                No commodities yet — run `pnpm seed`
              </SelectItem>
            ) : (
              commodities.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="state">State (optional)</Label>
        <Select value={state} onValueChange={setState}>
          <SelectTrigger id="state" className="h-12 text-base">
            <SelectValue placeholder="All states" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY_STATE}>All states</SelectItem>
            {states.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        size="lg"
        className="h-12 text-base font-medium"
        disabled={!canSubmit}
      >
        {pending ? "Loading…" : "See prices"}
      </Button>
    </form>
  );
}
