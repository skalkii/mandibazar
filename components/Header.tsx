import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";

export function Header({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-2.5 font-semibold tracking-tight min-w-0"
        >
          <Image
            src="/favicon.svg"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 sm:h-8 sm:w-8 rounded-md shadow-sm"
            priority
          />
          <span className="font-serif text-base sm:text-lg truncate">
            {dict.app_title}
          </span>
        </Link>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <LanguageSwitcher current={locale} />
          <ThemeToggle dict={dict} />
        </div>
      </div>
    </header>
  );
}
