import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/proxy-session";

const intl = createIntlMiddleware(routing);

/**
 * Locale negotiation + Supabase session refresh + optimistic gating of
 * private areas. Real authorization happens in the data access layer; this
 * only keeps signed-out visitors from loading private shells.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const stripped = pathname.replace(/^\/(en|fr)(?=\/|$)/, "") || "/";
  const isPrivate = stripped.startsWith("/account") || stripped.startsWith("/admin");

  const intlResponse = intl(request);
  const { response, user } = await updateSession(request, intlResponse);

  if (isPrivate && !user) {
    const localePrefix = pathname.startsWith("/fr") ? "/fr" : "";
    const url = request.nextUrl.clone();
    url.pathname = `${localePrefix}/login`;
    url.searchParams.set("next", stripped);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|assets|icons|manifest\\.webmanifest|sw\\.js|robots\\.txt|sitemap\\.xml|.*\\..*).*)"],
};
