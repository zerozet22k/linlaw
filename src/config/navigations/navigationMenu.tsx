import React, { useMemo } from "react";
import Link from "next/link";
import { Menu, MenuProps } from "antd";
import { useUser } from "@/hooks/useUser";
import { UserAPI } from "@/models/UserModel";
import { hasPermission } from "../permissions";
import { usePathname } from "next/navigation";
import {
  dashboardMenu,
  mainMenu,
  NavigationMenuItem,
} from "@/config/navigations/menu";
import { DynamicIcon } from "./IconMapper";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/i18n";

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

export const getSelectedKey = (
  user: UserAPI | null,
  pathname: string,
  isDashboard: boolean
): string | undefined => {
  const menuData = buildMenu(user, isDashboard ? dashboardMenu : mainMenu);

  return menuData
    .flatMap((item) => [item, ...(item.children || [])])
    .find((item) => item.link === pathname)?.key;
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
  const { language } = useLanguage();

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
          <Link href={menu.link} passHref>
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
          <Link href="/login" passHref>
            {t(language, "nav.actions.login", "Login")}
          </Link>
        ),
      });
    }

    return base;
  }, [navMenu, isMobile, user, logout, language]);

  const selectedKey = useMemo(
    () => getSelectedKey(user, pathname, isDashboard),
    [user, pathname, isDashboard]
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
