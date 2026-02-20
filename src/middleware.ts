  import type { NextRequest } from "next/server";
  import { NextResponse } from "next/server";

  import { DEFAULT_LANG, isSupportedLanguageLocal, type SupportedLanguage } from "@/i18n/languages";
  import { ensureLangPrefix, stripLangPrefix } from "@/i18n/path";

  const PUBLIC_FILE = /\.(.*)$/;

  const ANCHOR_ALIASES: Record<string, string> = {
    "/services": "#services",
    "/about": "#about",
  };

  const normalizePath = (p: string) => {
    let x = (p || "/").trim();
    if (!x.startsWith("/")) x = `/${x}`;
    if (x !== "/" && x.endsWith("/")) x = x.replace(/\/+$/, "");
    return x;
  };

  const isBypass = (p: string) =>
    p.startsWith("/api") ||
    p.startsWith("/_next") ||
    p.startsWith("/dashboard") ||
    p === "/favicon.ico" ||
    p === "/robots.txt" ||
    p === "/sitemap.xml" ||
    PUBLIC_FILE.test(p);

  const cookieRead = (req: NextRequest, k: string) => (req.cookies.get(k)?.value || "").trim();

  const setLangCookie = (res: NextResponse, lang: SupportedLanguage) => {
    res.cookies.set("language", lang, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
  };

  const getPathLang = (pathname: string): SupportedLanguage | null => {
    const seg = (pathname.split("/")[1] || "").trim();
    return seg && isSupportedLanguageLocal(seg) ? (seg as SupportedLanguage) : null;
  };

  const pickLang = (req: NextRequest): SupportedLanguage => {
    const c = cookieRead(req, "language");
    if (c && isSupportedLanguageLocal(c)) return c as SupportedLanguage;
    return DEFAULT_LANG; // "en"
  };

  export function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const pathname = normalizePath(url.pathname || "/");

    const seg = getPathLang(pathname);
    const basePath = normalizePath(seg ? stripLangPrefix(pathname) : pathname);

    // If someone hits /en/sitemap.xml etc -> normalize to /sitemap.xml
    if (seg && isBypass(basePath)) {
      const u = url.clone();
      u.pathname = basePath;
      return NextResponse.redirect(u, 308);
    }

    // Bypass routes: don't set cookie, don't localize
    if (isBypass(basePath)) {
      return NextResponse.next();
    }

    // Already has /{lang}/... : keep it + set cookie to that lang
    if (seg) {
      const alias = ANCHOR_ALIASES[basePath];
      if (alias) {
        const u = url.clone();
        u.pathname = `/${seg}`;
        u.hash = alias;
        const res = NextResponse.redirect(u, 308);
        setLangCookie(res, seg);
        return res;
      }

      const res = NextResponse.next();
      setLangCookie(res, seg);
      return res;
    }

    // No lang segment: decide by cookie, fallback DEFAULT_LANG
    const lang = pickLang(req);

    const alias = ANCHOR_ALIASES[basePath];
    if (alias) {
      const u = url.clone();
      u.pathname = `/${lang}`;
      u.hash = alias;
      const res = NextResponse.redirect(u, 308);
      setLangCookie(res, lang);
      return res;
    }

    const u = url.clone();
    u.pathname = ensureLangPrefix(basePath, lang);
    const res = NextResponse.redirect(u, 308);
    setLangCookie(res, lang);
    return res;
  }

  export const config = {
    matcher: ["/((?!api|_next|favicon.ico|robots.txt|sitemap.xml).*)"],
  };
