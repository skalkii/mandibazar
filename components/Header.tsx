import Link from "next/link";
import { Sprout } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";

export function Header({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <span className="grid place-items-center h-7 w-7 rounded-md bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm">
            <Sprout className="h-4 w-4" aria-hidden />
          </span>
          <span className="text-sm sm:text-base truncate max-w-[12ch] sm:max-w-none">
            {dict.app_title}
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher current={locale} />
          <ThemeToggle dict={dict} />
        </div>
      </div>
    </header>
  );
}
