"use client";

import React, { useMemo, useCallback } from "react";
import Link from "next/link";
import { Menu, MenuProps } from "antd";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";

import { useUser } from "@/hooks/useUser";
import { UserAPI } from "@/models/UserModel";
import { APP_PERMISSIONS, hasPermission } from "../permissions";

import {
  dashboardMenu,
  mainMenu,
  NavigationMenuItem,
} from "@/config/navigations/menu";
import { DynamicIcon } from "./IconMapper";

import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/i18n";
import { useHash } from "@/hooks/useHash";

import { hrefLang, stripLangPrefix } from "@/i18n/path";

const buildMenu = (
  user: UserAPI | null,
  menuConfig: NavigationMenuItem[]
): NavigationMenuItem[] => {
  const filterNavigationMenuItems = (
    menu: NavigationMenuItem
  ): NavigationMenuItem | null => {
    if (menu.access && !hasPermission(user, menu.access, true)) return null;

    if (menu.children) {
      const filteredChildren = menu.children
        .map(filterNavigationMenuItems)
        .filter((item): item is NavigationMenuItem => item !== null);

      return filteredChildren.length > 0
        ? { ...menu, children: filteredChildren }
        : null;
    }

    return menu;
  };

  return menuConfig
    .map(filterNavigationMenuItems)
    .filter((item): item is NavigationMenuItem => item !== null);
};

const flattenMenu = (menuData: NavigationMenuItem[]) =>
  menuData.flatMap((item) => [item, ...(item.children || [])]);

export const getSelectedKey = (
  user: UserAPI | null,
  currentPathWithHash: string,
  isDashboard: boolean
): string | undefined => {
  const menuData = buildMenu(user, isDashboard ? dashboardMenu : mainMenu);
  const flat = flattenMenu(menuData);

  const exact = flat.find((item) => item.link === currentPathWithHash)?.key;
  if (exact) return exact;

  const prefixCandidates = flat
    .filter((item) => !!item.link)
    .filter((item) => item.link !== "/")
    .filter((item) => !item.link!.includes("#"))
    .sort((a, b) => (b.link!.length || 0) - (a.link!.length || 0));

  return prefixCandidates.find((item) =>
    currentPathWithHash.startsWith(item.link!)
  )?.key;
};

interface AppMenuProps {
  menuMode?: MenuProps["mode"];
  isDashboard: boolean;
  isMobile: boolean;
  onMenuClick?: MenuProps["onClick"];
  menuStyle?: CSSProperties;
}

const AppMenu: React.FC<AppMenuProps> = ({
  menuMode = "vertical",
  isDashboard,
  isMobile,
  onMenuClick,
  menuStyle,
}) => {
  const { user, logout } = useUser();
  const pathname = usePathname();
  const { language } = useLanguage();
  const hash = useHash();

  const currentForMenuMatch = useMemo(() => {
    const base = isDashboard ? (pathname || "/") : stripLangPrefix(pathname || "/");
    return `${base}${hash}`;
  }, [pathname, hash, isDashboard]);

  const toHref = useCallback(
    (href: string) => (isDashboard ? href : hrefLang(href, language)),
    [isDashboard, language]
  );

  const menuConfig = isDashboard ? dashboardMenu : mainMenu;
  const navMenu = useMemo(() => buildMenu(user, menuConfig), [user, menuConfig]);

  const items: MenuProps["items"] = useMemo(() => {
    const renderLabel = (m: NavigationMenuItem) =>
      t(language, m.navKey ?? "", (m as any).label ?? m.key);

    const walk = (menuData: NavigationMenuItem[]): MenuProps["items"] =>
      menuData.map((menu) => ({
        key: menu.key,
        icon: menu.icon ? DynamicIcon({ name: menu.icon }) : null,
        label: menu.link ? (
          <Link href={toHref(menu.link)}>{renderLabel(menu)}</Link>
        ) : (
          <span>{renderLabel(menu)}</span>
        ),
        children: menu.children ? walk(menu.children) : undefined,
      }));

    const base = walk(navMenu) ?? [];

    if (!isMobile) return base;

    if (user) {
      if (hasPermission(user, [APP_PERMISSIONS.VIEW_DASHBOARD], true)) {
        base.push({
          key: "dashboard",
          icon: DynamicIcon({ name: "DashboardOutlined" }),
          label: (
            <Link href={toHref("/dashboard")}>
              {t(language, "nav.routes.dashboard", "Dashboard")}
            </Link>
          ),
        });

        base.push({
          key: "analytics",
          icon: DynamicIcon({ name: "AreaChartOutlined" }),
          label: (
            <Link href={toHref("/dashboard/analytics")}>
              {t(language, "nav.routes.analytics", "Analytics")}
            </Link>
          ),
        });
      }

      base.push({
        key: "profile",
        icon: DynamicIcon({ name: "UserOutlined" }),
        label: (
          <Link href={toHref("/profile")}>
            {t(language, "nav.routes.profile", "Profile")}
          </Link>
        ),
      });

      base.push({
        key: "logout",
        icon: DynamicIcon({ name: "LogoutOutlined" }),
        label: (
          <span onClick={() => logout()}>
            {t(language, "nav.actions.logout", "Logout")}
          </span>
        ),
      });
    } else {
      base.push({
        key: "profile",
        icon: DynamicIcon({ name: "UserOutlined" }),
        label: (
          <Link href={toHref("/profile")}>
            {t(language, "nav.routes.profile", "Profile")}
          </Link>
        ),
      });

      base.push({
        key: "login",
        icon: DynamicIcon({ name: "LoginOutlined" }),
        label: (
          <Link href={toHref("/login")}>
            {t(language, "nav.actions.login", "Login")}
          </Link>
        ),
      });
    }

    return base;
  }, [navMenu, isMobile, user, logout, language, toHref]);

  const selectedKey = useMemo(
    () => getSelectedKey(user, currentForMenuMatch, isDashboard),
    [user, currentForMenuMatch, isDashboard]
  );

  return (
    <Menu
      mode={menuMode}
      items={items}
      onClick={onMenuClick}
      selectedKeys={selectedKey ? [selectedKey] : []}
      style={menuStyle}
    />
  );
};

export default AppMenu;
