// src/components/router/LayoutRouter.tsx  (or wherever yours lives)
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Typography } from "antd";

import DashboardLayout from "../layouts/DashboardLayout";
import MainLayout from "../layouts/MainLayout";
import "@/styles/globals.css";

import { useUser } from "@/hooks/useUser";
import LoadingSpin from "@/components/loaders/LoadingSpin";
import { ROUTES } from "@/config/navigations/routes";
import { APP_PERMISSIONS, hasPermission } from "@/config/permissions";
import { LayoutProvider } from "@/providers/LayoutProvider";
import { useSettings } from "@/hooks/useSettings";
import { GLOBAL_SETTINGS_KEYS } from "@/config/CMS/settings/keys/GLOBAL_SETTINGS_KEYS";

import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/i18n";

import { useHash } from "@/hooks/useHash";

const { Title, Text } = Typography;

interface LayoutRouterProps {
  children: React.ReactNode;
}

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const pathToRegex = (path: string) => {
  // supports:
  // - "/newsletters/:id"
  // - "/#services"
  // - "/dashboard/users"
  const parts = path.split("/").map((p) => {
    if (p.startsWith(":")) return "[^/]+";
    return escapeRegex(p);
  });
  return new RegExp(`^${parts.join("/")}$`);
};

const LayoutRouter: React.FC<LayoutRouterProps> = ({ children }) => {
  const { user, initialLoading } = useUser();
  const { settings } = useSettings();
  const { language } = useLanguage();

  const pathname = usePathname();
  const hash = useHash(); // "#services" etc.
  const router = useRouter();

  const isDashboardRoute = pathname?.startsWith("/dashboard");
  const [loading, setLoading] = useState(false);

  // NOTE: hash-only navigation should not trigger your spinner; it breaks anchor UX.
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, [pathname]);

  const routeConfig = useMemo(() => {
    const fullPath = `${pathname}${hash}`; // "/#services"
    return (
      Object.values(ROUTES).find((route) => pathToRegex(route.path).test(fullPath)) ||
      // fallback to pathname-only match for non-hash routes
      Object.values(ROUTES).find((route) => pathToRegex(route.path).test(pathname)) ||
      null
    );
  }, [pathname, hash]);

  const hasAccess = useMemo(() => {
    if (!routeConfig) return true;
    if (!routeConfig.access && !routeConfig.loginRequired) return true;
    return hasPermission(user, routeConfig.access || [], true);
  }, [user, routeConfig]);

  // title = SiteName | translated route navKey
  useEffect(() => {
    const siteName =
      settings[GLOBAL_SETTINGS_KEYS.SITE_SETTINGS]?.siteName?.trim() ||
      process.env.NEXT_PUBLIC_SITE_NAME ||
      "Default Site";

    const pageTitle = routeConfig?.navKey
      ? t(language, routeConfig.navKey, routeConfig.key)
      : "";

    document.title = pageTitle ? `${siteName} | ${pageTitle}` : siteName;
  }, [routeConfig, settings, language]);

  useEffect(() => {
    if (initialLoading) return;

    const redirectTo = (target: string) => {
      router.replace(target);
    };

    if (!user && routeConfig?.loginRequired) {
      redirectTo(routeConfig.IfNotLoggedInRedirectUrl || "/login");
      return;
    }

    if (user && pathname === "/login") {
      if (hasPermission(user, [APP_PERMISSIONS.VIEW_DASHBOARD])) {
        redirectTo(routeConfig?.IfLoggedInRedirectUrl || "/dashboard");
      } else {
        redirectTo("/");
      }
    }
  }, [initialLoading, user, routeConfig, pathname, router]);

  if (initialLoading || loading) return <LoadingSpin message="Building Theme..." />;

  const content =
    user && routeConfig?.access && !hasAccess ? (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
          textAlign: "center",
        }}
      >
        <Title level={2}>❌</Title>
        <Text strong>
          {routeConfig?.noAccessMessage || "You do not have permission to view this page."}
        </Text>
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
