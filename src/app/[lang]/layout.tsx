// src/app/[lang]/layout.tsx
import React from "react";
import { notFound } from "next/navigation";

import { isSupportedLanguageLocal, type SupportedLanguage } from "@/i18n/languages";
import { getPublicSettings } from "@/utils/server/publicSiteSettings";
import type { SettingsInterface } from "@/config/CMS/settings/settingKeys";
import { langsFromSettings } from "@/middlewares/langMiddleware";

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const langRaw = (params.lang || "").trim();
  if (!langRaw || !isSupportedLanguageLocal(langRaw)) notFound();

  const settings = (await getPublicSettings()) as Partial<SettingsInterface>;
  const enabled = langsFromSettings(settings);
  if (!enabled.includes(langRaw as SupportedLanguage)) notFound();

  return <>{children}</>;
}
