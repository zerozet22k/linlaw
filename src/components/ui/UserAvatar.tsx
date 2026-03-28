"use client";

import React, { useMemo } from "react";
import { Avatar, Tooltip, Typography, Dropdown, MenuProps, Spin } from "antd";
import Link from "next/link";
import { APP_PERMISSIONS } from "@/config/permissions";
import { useUser } from "@/hooks/useUser";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/i18n";

const { Title } = Typography;

interface UserAvatarProps {
  isMobile: boolean;
  toggleDrawer: () => void;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ isMobile, toggleDrawer }) => {
  const { user, initialLoading, logout } = useUser();
  const { language } = useLanguage();

  const tGuest = t(language, "nav.actions.guest", "Guest");
  const tDashboard = t(language, "nav.routes.dashboard", "Dashboard");
  const tAnalytics = t(language, "nav.routes.analytics", "Analytics");
  const tProfile = t(language, "nav.routes.profile", "Profile");
  const tLogout = t(language, "nav.actions.logout", "Logout");
  const tLogin = t(language, "nav.actions.login", "Login");

  const canSeeDashboard =
    !!user &&
    user.roles?.some((role) =>
      role.permissions.includes(APP_PERMISSIONS.VIEW_DASHBOARD)
    );

  const menuItems: MenuProps["items"] = useMemo(
    () => [
      ...(canSeeDashboard
        ? [
          {
            key: "dashboard",
            label: <Link href="/dashboard">{tDashboard}</Link>,
          },
          {
            key: "analytics",
            label: <Link href="/dashboard/analytics">{tAnalytics}</Link>,
          },
        ]
        : []),
      {
        key: "profile",
        label: <Link href="/profile">{tProfile}</Link>,
      },
      user
        ? {
          key: "logout",
          label: <div onClick={() => logout()}>{tLogout}</div>,
        }
        : {
          key: "login",
          label: <Link href="/login">{tLogin}</Link>,
        },
    ],
    [
      canSeeDashboard,
      tDashboard,
      tAnalytics,
      tProfile,
      user,
      logout,
      tLogout,
      tLogin,
    ]
  );

  if (initialLoading) return <Spin size="small" />;

  const displayName = user ? user.name || user.username : tGuest;
  const tooltipTitle = user ? user.username : tGuest;

  const AvatarBlock = (
    <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
      <Tooltip title={tooltipTitle}>
        <Avatar src={user?.avatar || "/images/default-avatar.webp"} />
      </Tooltip>

      <div style={{ marginLeft: 12, display: "flex", flexDirection: "column" }}>
        <Title level={4} style={{ margin: 0, fontSize: 14 }}>
          {displayName}
        </Title>
      </div>
    </div>
  );

  return isMobile ? (
    <div onClick={toggleDrawer}>{AvatarBlock}</div>
  ) : (
    <Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="bottomRight">
      {AvatarBlock}
    </Dropdown>
  );
};

export default UserAvatar;
