import { getRequestConfig } from "next-intl/server";
import { isValidLocale, routing, type AppLocale } from "./routing";

const messageLoaders: Record<AppLocale, () => Promise<Record<string, unknown>>> =
  {
    en: () => import("../messages/en.json").then((module) => module.default),
    fr: () => import("../messages/fr.json").then((module) => module.default),
  };

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const locale =
    requestedLocale && isValidLocale(requestedLocale)
      ? requestedLocale
      : routing.defaultLocale;

  return {
    locale,
    messages: await messageLoaders[locale](),
  };
});
