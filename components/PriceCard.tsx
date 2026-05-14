import type { PriceRow } from "@/lib/types";
import { formatRupees } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";

export function PriceCard({ row, rank }: { row: PriceRow; rank?: number }) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4 p-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {rank !== undefined && (
              <span className="text-xs font-medium text-zinc-500 tabular-nums w-6">
                #{rank}
              </span>
            )}
            <h3 className="font-semibold truncate">{row.mandi}</h3>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
            {row.district}, {row.state}
          </p>
          {row.variety && (
            <p className="text-xs text-zinc-500 mt-1">Variety: {row.variety}</p>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-xl font-bold tabular-nums">
            {formatRupees(row.modal_per_kg)}
            <span className="text-xs font-normal text-zinc-500 ml-1">/kg</span>
          </p>
          <p className="text-xs text-zinc-500 tabular-nums mt-1">
            {formatRupees(row.min_per_kg)} – {formatRupees(row.max_per_kg)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
