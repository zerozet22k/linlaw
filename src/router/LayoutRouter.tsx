
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Typography } from "antd";

import DashboardLayout from "@/layouts/DashboardLayout";
import MainLayout from "@/layouts/MainLayout";
import "@/styles/globals.css";

import { useUser } from "@/hooks/useUser";
import LoadingSpin from "@/components/loaders/LoadingSpin";
import { APP_PERMISSIONS, hasPermission } from "@/config/permissions";
import { LayoutProvider } from "@/providers/LayoutProvider";
import { useSettings } from "@/hooks/useSettings";
import { GLOBAL_SETTINGS_KEYS } from "@/config/CMS/settings/keys/GLOBAL_SETTINGS_KEYS";

import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/i18n";
import { useHash } from "@/hooks/useHash";

import { matchRoute } from "@/router/routeMatch";
import { stripLangPrefix } from "@/i18n/path"; 

const { Title, Text } = Typography;

const LayoutRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, initialLoading } = useUser();
  const { settings } = useSettings();
  const { language } = useLanguage();

  const pathname = usePathname() || "/";
  const hash = useHash();
  const router = useRouter();

  const isDashboardRoute = pathname.startsWith("/dashboard");

  
  const routeConfig = useMemo(() => {
    const basePath = isDashboardRoute ? pathname : stripLangPrefix(pathname);
    return matchRoute(basePath, hash);
  }, [pathname, hash, isDashboardRoute]);

  const hasAccess = useMemo(() => {
    if (!routeConfig) return true;
    if (!routeConfig.access && !routeConfig.loginRequired) return true;
    return hasPermission(user, routeConfig.access || [], true);
  }, [user, routeConfig]);

  
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 120);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const siteName =
      settings[GLOBAL_SETTINGS_KEYS.SITE_SETTINGS]?.siteName?.trim() ||
      process.env.NEXT_PUBLIC_SITE_NAME ||
      "Default Site";

    const pageTitle = routeConfig?.navKey ? t(language, routeConfig.navKey, routeConfig.key) : "";
    document.title = pageTitle ? `${siteName} | ${pageTitle}` : siteName;
  }, [routeConfig, settings, language]);

  useEffect(() => {
    if (initialLoading) return;

    if (!user && routeConfig?.loginRequired) {
      router.replace(routeConfig.IfNotLoggedInRedirectUrl || "/login");
      return;
    }

    if (user && pathname === "/login") {
      router.replace(
        hasPermission(user, [APP_PERMISSIONS.VIEW_DASHBOARD])
          ? routeConfig?.IfLoggedInRedirectUrl || "/dashboard"
          : "/"
      );
    }
  }, [initialLoading, user, routeConfig, pathname, router]);

  if (initialLoading || loading) return <LoadingSpin message="Building Theme..." />;

  const content =
    user && routeConfig?.access && !hasAccess ? (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", width: "100%", textAlign: "center" }}>
        <Title level={2}>❌</Title>
        <Text strong>{routeConfig?.noAccessMessage || "You do not have permission to view this page."}</Text>
      </div>
    ) : (
      children
    );

  return (
    <LayoutProvider>
      {isDashboardRoute && user ? (
        <DashboardLayout>{content}</DashboardLayout>
      ) : (
        <MainLayout routeConfig={routeConfig}>{content}</MainLayout>
      )}
    </LayoutProvider>
  );
};

export default LayoutRouter;
