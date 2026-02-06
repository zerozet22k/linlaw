
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  DEFAULT_LANG,
  type SupportedLanguage,
  isSupportedLanguageLocal,
} from "@/i18n/languages";

import { langSegment, ensureLangPrefix, stripLangPrefix } from "@/i18n/path";

const PUBLIC_FILE = /\.(.*)$/;

const isBypass = (p: string) =>
  p.startsWith("/api") ||
  p.startsWith("/_next") ||
  p.startsWith("/dashboard") ||
  p === "/favicon.ico" ||
  p === "/robots.txt" ||
  p === "/sitemap.xml" ||
  PUBLIC_FILE.test(p);

const cookieRead = (req: NextRequest, k: string) =>
  (req.cookies.get(k)?.value || "").trim();

const cookieWriteIfChanged = (
  req: NextRequest,
  res: NextResponse,
  lang: SupportedLanguage
) => {
  const cur = cookieRead(req, "language");
  if (cur === lang) return;

  res.cookies.set("language", lang, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
};


const langPick = (req: NextRequest): SupportedLanguage => {
  const seg = (req.nextUrl.pathname.split("/")[1] || "").trim();
  if (seg && isSupportedLanguageLocal(seg)) return seg;

  const c = cookieRead(req, "language");
  if (c && isSupportedLanguageLocal(c)) return c as SupportedLanguage;

  return DEFAULT_LANG;
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname || "/";

  const seg = langSegment(pathname);
  const basePath = seg ? stripLangPrefix(pathname) : pathname;



  if (seg && isBypass(basePath)) {
    const u = url.clone();
    u.pathname = basePath;
    return NextResponse.redirect(u);
  }


  const lang = langPick(req);


  const h = new Headers(req.headers);
  h.set("x-lang-requested", lang);


  if (isBypass(basePath)) {
    const res = NextResponse.next({ request: { headers: h } });
    cookieWriteIfChanged(req, res, lang);
    return res;
  }




  if (!seg) {
    const u = url.clone();
    u.pathname = ensureLangPrefix(pathname, lang);


    const res = NextResponse.rewrite(u, { request: { headers: h } });
    cookieWriteIfChanged(req, res, lang);
    return res;
  }


  const res = NextResponse.next({ request: { headers: h } });
  cookieWriteIfChanged(req, res, lang);
  return res;
}

export const config = {

  matcher: ["/((?!api|_next|favicon.ico|robots.txt|sitemap.xml).*)"],
};
