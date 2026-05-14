export function formatDDMMYYYY(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function parseDDMMYYYY(s: string): Date | null {
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  return Number.isNaN(d.getTime()) ? null : d;
}

export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function canonicalName(raw: string): string {
  return raw.trim().replace(/\s+/g, " ").toLowerCase();
}

export function titleCase(raw: string): string {
  return canonicalName(raw)
    .split(" ")
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export function quintalToKg(rupeesPerQuintal: number | string): number {
  const n = typeof rupeesPerQuintal === "string" ? Number(rupeesPerQuintal) : rupeesPerQuintal;
  if (!Number.isFinite(n)) return 0;
  return Math.round((n / 100) * 100) / 100;
}
