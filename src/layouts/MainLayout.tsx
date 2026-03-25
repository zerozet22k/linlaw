"use client";

import React, { useState } from "react";
import { Layout, Drawer, Typography, Button, theme } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";

import { useSettings } from "@/hooks/useSettings";
import { useLanguage } from "@/hooks/useLanguage"; // ✅
import { DEFAULT_LANG } from "@/i18n/languages"; // ✅

import {
  GLOBAL_SETTINGS_KEYS as G,
  GLOBAL_SETTINGS_TYPES,
} from "@/config/CMS/settings/keys/GLOBAL_SETTINGS_KEYS";
import { RouteConfig } from "@/config/navigations/routes";
import { useLayout } from "@/hooks/useLayout";

import UserAvatar from "@/components/ui/UserAvatar";
import SocialLinks from "@/components/ui/SocialLinks";
import AppMenu from "@/config/navigations/navigationMenu";
import OverlayBar from "./OverlayBar";

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

type SiteSettings = GLOBAL_SETTINGS_TYPES[typeof G.SITE_SETTINGS];
type BusinessInfo = GLOBAL_SETTINGS_TYPES[typeof G.BUSINESS_INFO];

interface Props {
  children: React.ReactNode;
  routeConfig: RouteConfig | null;
}

const MainLayout: React.FC<Props> = ({ children, routeConfig }) => {
  const { settings } = useSettings();
  const { language } = useLanguage(); // ✅
  const homeHref = `/${language || DEFAULT_LANG}`; // ✅

  const { showGoTop, scrollToTop, isMobile, shouldCollapsePublicNav } = useLayout();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const siteDefaults: SiteSettings = {
    siteName: "Site Logo",
    siteUrl: "",
    siteLogo: "/images/logo.svg",
    siteBanner: "",
  };

  const bizDefaults: BusinessInfo = {
    address: "",
    mapLink: "",
    phoneNumber: "+95 9 765432100",
    email: "contact@example.com",
    openingHours: [],
  };

  const s: SiteSettings = {
    ...siteDefaults,
    ...((settings?.[G.SITE_SETTINGS] as SiteSettings) ?? {}),
  };

  const b: BusinessInfo = {
    ...bizDefaults,
    ...((settings?.[G.BUSINESS_INFO] as BusinessInfo) ?? {}),
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const toggleDrawer = () => setDrawerOpen((o) => !o);
  const showGoTopBtn = routeConfig?.showGoTop && showGoTop;

  const logoSrc = (s.siteLogo || "").trim();
  const logoAlt = s.siteName || "Logo";
  const showInlinePublicMenu = !shouldCollapsePublicNav;
  const showPublicDrawer = !showInlinePublicMenu;

  return (
    <Layout style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <OverlayBar businessInfo={b} />

      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 999,
          height: 90,
          padding: isMobile ? "10px 12px" : "10px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: isMobile ? 12 : 24,
          minWidth: 0,
          background: colorBgContainer,
          transition: "background 0.3s ease",
        }}
      >
        {/* ✅ was href="/" */}
        <Link
          href={homeHref}
          style={{
            display: "flex",
            alignItems: "center",
            height: 80,
            flexShrink: 0,
          }}
        >
          {logoSrc ? (
            <div style={{ position: "relative", height: 80, width: 80 }}>
              <Image
                src={logoSrc}
                alt={logoAlt}
                fill
                priority
                sizes="80px"
                style={{ objectFit: "contain" }}
              />
            </div>
          ) : (
            <span style={{ fontSize: 20, fontWeight: 700 }}>{s.siteName}</span>
          )}
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: isMobile ? 12 : 20,
            flex: "1 1 auto",
            minWidth: 0,
          }}
        >
          {showInlinePublicMenu && (
            <div style={{ flex: "1 1 auto", minWidth: 0 }}>
              <AppMenu
                menuMode="horizontal"
                isDashboard={false}
                isMobile={false}
                menuStyle={{ minWidth: 0, justifyContent: "flex-end" }}
              />
            </div>
          )}

          <div style={{ flexShrink: 0 }}>
            <UserAvatar isMobile={showPublicDrawer} toggleDrawer={toggleDrawer} />
          </div>
        </div>
      </Header>

      <Content style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {showPublicDrawer && (
          <Drawer
            title="Menu"
            placement="right"
            open={drawerOpen}
            onClose={toggleDrawer}
            styles={{ body: { padding: "24px 0" } }}
          >
            <AppMenu
              menuMode="inline"
              isDashboard={false}
              isMobile
              onMenuClick={toggleDrawer}
            />
          </Drawer>
        )}
        {children}
      </Content>

      <Footer style={{ textAlign: "center", padding: 20 }}>
        <SocialLinks settings={settings} />
        <Text>
          {s.siteName} © {new Date().getFullYear()} — All&nbsp;rights reserved.
        </Text>
      </Footer>

      {showGoTopBtn && (
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<ArrowUpOutlined />}
          onClick={scrollToTop}
          style={{ position: "fixed", bottom: 20, right: 20, zIndex: 14_000 }}
        />
      )}
    </Layout>
  );
};

export default MainLayout;
