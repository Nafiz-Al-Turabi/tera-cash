import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr"],
  defaultLocale: "en",
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];

export function isValidLocale(locale: string): locale is AppLocale {
  return routing.locales.includes(locale as AppLocale);
}

export function stripLocalePrefix(pathname: string) {
  const localePattern = routing.locales.join("|");
  const normalizedPathname = pathname.replace(
    new RegExp(`^/(${localePattern})(?=/|$)`),
    ""
  );

  return normalizedPathname || "/";
}
