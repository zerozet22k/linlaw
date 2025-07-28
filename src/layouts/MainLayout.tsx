"use client";

import React, { useState } from "react";
import { Layout, Drawer, Space, Typography, Button, theme } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import Link from "next/link";

import { useSettings } from "@/hooks/useSettings";
import {
  GLOBAL_SETTINGS_KEYS as G,
  GLOBAL_SETTINGS_TYPES,
} from "@/config/CMS/settings/keys/GLOBAL_SETTINGS_KEYS";
import { RouteConfig } from "@/config/routes";
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
  const { showGoTop, scrollToTop, isMobile } = useLayout();
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

  return (
    <Layout
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* thin black bar */}
      <OverlayBar businessInfo={b} />

      {/* sticky header */}
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 999,
          height: 90,
          padding: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: colorBgContainer,
          transition: "background 0.3s ease",
        }}
      >
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", height: 80 }}
        >
          {s.siteLogo ? (
            <img
              src={s.siteLogo}
              alt={s.siteName}
              style={{ height: 80, objectFit: "contain" }}
            />
          ) : (
            <span style={{ fontSize: 20, fontWeight: 700 }}>{s.siteName}</span>
          )}
        </Link>

        <Space>
          {!isMobile && (
            <AppMenu
              menuMode="horizontal"
              isDashboard={false}
              isMobile={false}
            />
          )}
          <UserAvatar isMobile={isMobile} toggleDrawer={toggleDrawer} />
        </Space>
      </Header>

      {/* main content */}
      <Content
        style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        {isMobile && (
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

      {/* footer */}
      <Footer style={{ textAlign: "center", padding: 20 }}>
        <SocialLinks settings={settings} />
        <Text>
          {s.siteName} © {new Date().getFullYear()} — All&nbsp;rights reserved.
        </Text>
      </Footer>

      {/* back-to-top FAB */}
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
