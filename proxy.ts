import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const duplicateLocalePattern = new RegExp(
    `^/(${routing.locales.join("|")})/\\1(?=/|$)`
  );

  if (duplicateLocalePattern.test(request.nextUrl.pathname)) {
    const normalizedUrl = request.nextUrl.clone();
    normalizedUrl.pathname = request.nextUrl.pathname.replace(
      duplicateLocalePattern,
      "/$1"
    );

    return NextResponse.redirect(normalizedUrl);
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
