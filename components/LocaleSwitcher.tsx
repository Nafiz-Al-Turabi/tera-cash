"use client";

import { useTransition } from "react";
import { usePathname as useNextPathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { stripLocalePrefix, type AppLocale, routing } from "@/i18n/routing";

export default function LocaleSwitcher() {
  const locale = useLocale() as AppLocale;
  const pathname = useNextPathname();
  const router = useRouter();
  const t = useTranslations("Common");
  const [isPending, startTransition] = useTransition();

  const getCurrentQuery = () => {
    if (typeof window === "undefined") {
      return {};
    }

    return Object.fromEntries(new URLSearchParams(window.location.search).entries());
  };

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 p-1 backdrop-blur-sm">
      {/* <span className="px-2 text-xs uppercase tracking-[0.2em] text-white/65">
        {t("language")}
      </span> */}
      {routing.locales.map((nextLocale) => {
        const isActive = locale === nextLocale;

        return (
          <button
            key={nextLocale}
            type="button"
            aria-label={t(`locales.${nextLocale}`)}
            aria-pressed={isActive}
            disabled={isPending || isActive}
            onClick={() => {
              const query = getCurrentQuery();
              const internalPathname = stripLocalePrefix(pathname);

              startTransition(() => {
                router.replace(
                  {
                    pathname: internalPathname,
                    query,
                  },
                  { locale: nextLocale }
                );
              });
            }}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold tracking-[0.2em] transition-colors ${
              isActive
                ? "bg-[#FFB339] text-black"
                : "text-white/75 hover:bg-white/10 hover:text-white"
            } ${isPending ? "cursor-wait" : "cursor-pointer"}`}
          >
            {nextLocale.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
