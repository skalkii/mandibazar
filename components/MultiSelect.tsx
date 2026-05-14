"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Props = {
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyLabel?: string;
  ariaLabel?: string;
  id?: string;
  max?: number;
};

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyLabel = "No results.",
  ariaLabel,
  id,
  max,
}: Props) {
  const [open, setOpen] = useState(false);
  const selected = new Set(value);

  function toggle(v: string) {
    if (selected.has(v)) {
      onChange(value.filter((x) => x !== v));
    } else {
      if (max && value.length >= max) return;
      onChange([...value, v]);
    }
  }

  function remove(v: string, e: React.MouseEvent | React.KeyboardEvent) {
    e.preventDefault();
    e.stopPropagation();
    onChange(value.filter((x) => x !== v));
  }

  function clearAll(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onChange([]);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={ariaLabel}
          className={cn(
            "h-auto min-h-12 w-full justify-between px-3 py-2 text-left font-normal",
            "border-input bg-background hover:bg-background",
            value.length === 0 && "text-muted-foreground",
          )}
        >
          <div className="flex flex-wrap gap-1.5 min-w-0">
            {value.length === 0 ? (
              <span className="text-base">{placeholder}</span>
            ) : (
              value.map((v) => (
                <Badge
                  key={v}
                  variant="secondary"
                  className="rounded-md gap-1 pr-1 text-sm font-normal"
                >
                  <span className="truncate max-w-[14ch]">{v}</span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => remove(v, e)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") remove(v, e);
                    }}
                    className="ml-0.5 grid place-items-center rounded-sm hover:bg-foreground/10 h-4 w-4 cursor-pointer"
                    aria-label={`Remove ${v}`}
                  >
                    <X className="h-3 w-3" />
                  </span>
                </Badge>
              ))
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0 self-start mt-0.5">
            {value.length > 0 && (
              <span
                role="button"
                tabIndex={0}
                onClick={clearAll}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") clearAll(e as unknown as React.MouseEvent);
                }}
                className="grid place-items-center rounded-sm hover:bg-foreground/10 h-5 w-5 cursor-pointer text-muted-foreground"
                aria-label="Clear all"
              >
                <X className="h-3.5 w-3.5" />
              </span>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 w-[var(--radix-popover-trigger-width)] max-w-[calc(100vw-2rem)]"
        align="start"
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-10" />
          <CommandList className="max-h-72">
            <CommandEmpty>{emptyLabel}</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => {
                const isSelected = selected.has(opt);
                return (
                  <CommandItem
                    key={opt}
                    value={opt}
                    onSelect={() => toggle(opt)}
                    className="text-base"
                  >
                    <span
                      className={cn(
                        "mr-2 grid place-items-center h-4 w-4 rounded-sm border",
                        isSelected
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-input",
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </span>
                    {opt}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
