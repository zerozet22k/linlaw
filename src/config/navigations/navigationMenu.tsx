"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { Menu, MenuProps } from "antd";
import { useUser } from "@/hooks/useUser";
import { UserAPI } from "@/models/UserModel";
import { hasPermission } from "../permissions";
import { usePathname, useSearchParams } from "next/navigation";
import {
  dashboardMenu,
  mainMenu,
  NavigationMenuItem,
} from "@/config/navigations/menu";
import { DynamicIcon } from "./IconMapper";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/i18n";
import { DEFAULT_LANG } from "@/i18n/languages";

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

  // 1) Exact match first (this is what fixes "/#services" etc.)
  const exact = flat.find((item) => item.link === currentPathWithHash)?.key;
  if (exact) return exact;

  // 2) Prefix match for detail pages ("/newsletters/123" => "/newsletters")
  //    - Never allow "/" to match everything
  //    - Skip hash-links for prefix matching (only exact match for those)
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
}

const AppMenu: React.FC<AppMenuProps> = ({
  menuMode = "vertical",
  isDashboard,
  isMobile,
  onMenuClick,
}) => {
  const { user, logout } = useUser();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { language } = useLanguage();

  // --- hash tracking (Next often updates URL via history API, not always firing hashchange) ---
  const [hash, setHash] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => setHash(window.location.hash || "");
    update();

    const origPush = window.history.pushState;
    const origReplace = window.history.replaceState;

    const wrap =
      (fn: typeof window.history.pushState) =>
      function (this: History, ...args: Parameters<typeof fn>) {
        const ret = fn.apply(this, args as any);
        update();
        return ret;
      };

    window.history.pushState = wrap(origPush);
    window.history.replaceState = wrap(origReplace);

    window.addEventListener("popstate", update);
    window.addEventListener("hashchange", update);

    return () => {
      window.history.pushState = origPush;
      window.history.replaceState = origReplace;
      window.removeEventListener("popstate", update);
      window.removeEventListener("hashchange", update);
    };
  }, []);

  const currentPathWithHash = `${pathname}${hash}`;

  // keep lang in links (so clicking menu doesn’t drop it)
  const langToCarry = useMemo(() => {
    const fromUrl = searchParams?.get("lang") || "";
    if (fromUrl) return fromUrl;
    return language !== DEFAULT_LANG ? language : "";
  }, [searchParams, language]);

  const withLang = useCallback(
    (href: string) => {
      if (!langToCarry || langToCarry === DEFAULT_LANG) return href;

      const [pathPart, hashPart] = href.split("#");
      const url = new URL(pathPart || "/", "http://local"); // safe on server/client

      if (!url.searchParams.get("lang")) url.searchParams.set("lang", langToCarry);

      const qs = url.searchParams.toString();
      const out = `${url.pathname}${qs ? `?${qs}` : ""}`;
      return hashPart !== undefined ? `${out}#${hashPart}` : out;
    },
    [langToCarry]
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
          <Link href={withLang(menu.link)}>
            {renderLabel(menu)}
          </Link>
        ) : (
          <span>{renderLabel(menu)}</span>
        ),
        children: menu.children ? walk(menu.children) : undefined,
      }));

    const base = walk(navMenu) ?? [];

    if (!isMobile) return base;

    if (user) {
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
        key: "login",
        icon: DynamicIcon({ name: "LogoutOutlined" }),
        label: (
          <Link href={withLang("/login")}>
            {t(language, "nav.actions.login", "Login")}
          </Link>
        ),
      });
    }

    return base;
  }, [navMenu, isMobile, user, logout, language, withLang]);

  const selectedKey = useMemo(
    () => getSelectedKey(user, currentPathWithHash, isDashboard),
    [user, currentPathWithHash, isDashboard]
  );

  return (
    <Menu
      mode={menuMode}
      items={items}
      onClick={onMenuClick}
      selectedKeys={selectedKey ? [selectedKey] : []}
    />
  );
};

export default AppMenu;
