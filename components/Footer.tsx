import type { Dictionary } from "@/lib/i18n/dictionaries";

export function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className="mt-auto border-t border-border/60">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm text-muted-foreground">
        <p>{dict.data_source}</p>
        <p className="flex items-center gap-1.5">
          <span>Built for farmers</span>
          <span aria-hidden>·</span>
          <a
            href="https://github.com/skalkii/mandibazar"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:text-primary transition-colors"
          >
            GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
