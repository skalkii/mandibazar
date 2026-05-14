import { cookies } from "next/headers";
import { LOCALES, type Locale, getDictionary } from "./dictionaries";

export const LOCALE_COOKIE = "mb_locale";

export async function getLocale(): Promise<Locale> {
  const c = await cookies();
  const v = c.get(LOCALE_COOKIE)?.value;
  if (v && (LOCALES as readonly string[]).includes(v)) return v as Locale;
  return "en";
}

export async function getServerDictionary() {
  const locale = await getLocale();
  return { locale, dict: getDictionary(locale) };
}
