import type { PriceRow } from "@/lib/types";
import { formatRupees } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Card, CardContent } from "@/components/ui/card";

export function PriceCard({
  row,
  rank,
  dict,
}: {
  row: PriceRow;
  rank?: number;
  dict: Dictionary;
}) {
  return (
    <Card className="transition-colors hover:bg-accent/40">
      <CardContent className="flex items-start justify-between gap-3 sm:gap-4 p-4 sm:p-5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {rank !== undefined && (
              <span className="text-xs font-semibold text-muted-foreground tabular-nums shrink-0">
                #{rank}
              </span>
            )}
            <h3 className="font-semibold text-base sm:text-lg truncate">
              {row.mandi}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
            {row.district}, {row.state}
          </p>
          {row.variety && (
            <p className="text-xs text-muted-foreground/80 mt-1.5 truncate">
              <span className="text-muted-foreground">{dict.variety}:</span>{" "}
              {row.variety}
            </p>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg sm:text-2xl font-bold tabular-nums leading-none">
            {formatRupees(row.modal_per_kg)}
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              {dict.per_kg}
            </span>
          </p>
          <p className="text-[11px] sm:text-xs text-muted-foreground tabular-nums mt-1.5">
            {formatRupees(row.min_per_kg)} – {formatRupees(row.max_per_kg)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
