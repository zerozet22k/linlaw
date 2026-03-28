"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Row,
  Space,
  Statistic,
  Tag,
  Typography,
} from "antd";
import {
  AreaChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { APP_PERMISSIONS, hasPermission } from "@/config/permissions";
import { useAdminAnalytics } from "@/hooks/useAdminAnalytics";
import { useUser } from "@/hooks/useUser";
import { formatDate, formatYmd } from "@/utils/timeUtil";

const { Title, Text } = Typography;

function formatNumber(value: number) {
  return new Intl.NumberFormat().format(value || 0);
}

export default function DashboardPage() {
  const { user } = useUser();
  const { data, error, loading } = useAdminAnalytics("7d");

  const derived = useMemo(() => {
    if (!user) return null;

    const roles = user.roles ?? [];
    const allPerms = new Set<string>();
    roles.forEach((role) =>
      (role.permissions ?? []).forEach((permission) => allPerms.add(permission))
    );

    const created =
      (user as any).created_at ?? (user as any).createdAt ?? (user as any).created;
    const updated =
      (user as any).updated_at ?? (user as any).updatedAt ?? (user as any).updated;

    return {
      roles,
      permissionsCount: allPerms.size,
      devicesCount: user.devices?.length ?? 0,
      created,
      updated,
      displayName: user.name || user.username,
      canViewUsers: hasPermission(user, [APP_PERMISSIONS.VIEW_USERS]),
      canEditSettings: hasPermission(user, [APP_PERMISSIONS.EDIT_SETTINGS]),
    };
  }, [user]);

  if (!user || !derived) {
    return (
      <div style={{ padding: 24 }}>
        <Card style={{ borderRadius: 16 }}>
          <Empty description="No user data available." />
        </Card>
      </div>
    );
  }

  const phones =
    user.phones?.length
      ? user.phones.map((phone, index) => (
          <div key={`${phone.type}-${phone.number}-${index}`}>
            <Text strong>{phone.type}:</Text> <Text>{phone.number}</Text>
          </div>
        ))
      : null;

  const google = data?.google;
  const internal = data?.internal;

  return (
    <div style={{ padding: 8 }}>
      <Space direction="vertical" size={20} style={{ width: "100%" }}>
        <Card
          style={{
            borderRadius: 24,
            background:
              "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(12,74,110,0.94))",
            color: "#fff",
          }}
          styles={{ body: { padding: 24 } }}
        >
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} xl={16}>
              <Space direction="vertical" size={8} style={{ width: "100%" }}>
                <Space align="center" size={12}>
                  <Avatar size={56} src={user.avatar}>
                    {derived.displayName?.[0]?.toUpperCase()}
                  </Avatar>
                  <div>
                    <Title level={2} style={{ margin: 0, color: "#fff" }}>
                      Welcome back, {derived.displayName}
                    </Title>
                    <Text style={{ color: "rgba(255,255,255,0.72)" }}>
                      @{user.username}
                    </Text>
                  </div>
                </Space>
                <Text style={{ color: "rgba(255,255,255,0.78)", maxWidth: 720 }}>
                  Your dashboard now includes live site metrics, guest-account counts, and
                  quick paths into analytics and account management.
                </Text>
                <Space wrap size={[8, 8]}>
                  {derived.roles.map((role) => (
                    <Tag key={role._id} color={role.color} style={{ margin: 0 }}>
                      {role.name}
                    </Tag>
                  ))}
                  <Tag color="cyan">{formatNumber(derived.permissionsCount)} permissions</Tag>
                  <Tag color="blue">{formatNumber(derived.devicesCount)} devices</Tag>
                </Space>
              </Space>
            </Col>

            <Col xs={24} xl={8}>
              <Space
                direction="vertical"
                size={12}
                style={{ width: "100%", alignItems: "flex-start" }}
              >
                <Link href="/dashboard/analytics">
                  <Button type="primary" icon={<AreaChartOutlined />} size="large">
                    Open Analytics
                  </Button>
                </Link>
                {derived.canViewUsers ? (
                  <Link href="/dashboard/users">
                    <Button size="large">Manage Users</Button>
                  </Link>
                ) : null}
                <Link href="/profile">
                  <Button size="large">Open Profile</Button>
                </Link>
                {derived.canEditSettings ? (
                  <Link href="/dashboard/settings">
                    <Button size="large">Site Settings</Button>
                  </Link>
                ) : null}
              </Space>
            </Col>
          </Row>
        </Card>

        {error ? (
          <Alert
            type="warning"
            showIcon
            message="Dashboard metrics are temporarily unavailable."
            description={error}
          />
        ) : null}

        {!loading && !google?.configured ? (
          <Alert
            type="info"
            showIcon
            message="Google Analytics reporting is not configured yet."
            description="Traffic cards will fill in once GA4 property credentials are added."
          />
        ) : null}

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} xl={6}>
            <Card style={{ borderRadius: 18 }}>
              <Statistic
                title="Page Views"
                value={google?.overview.pageViews ?? 0}
                formatter={(value) => formatNumber(Number(value))}
                suffix="7d"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <Card style={{ borderRadius: 18 }}>
              <Statistic
                title="Sessions"
                value={google?.overview.sessions ?? 0}
                formatter={(value) => formatNumber(Number(value))}
                suffix="7d"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <Card style={{ borderRadius: 18 }}>
              <Statistic
                title="Total Accounts"
                value={internal?.totalUsers ?? 0}
                formatter={(value) => formatNumber(Number(value))}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <Card style={{ borderRadius: 18 }}>
              <Statistic
                title="Guest Accounts"
                value={internal?.guestUsers ?? 0}
                formatter={(value) => formatNumber(Number(value))}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} xl={14}>
            <Card style={{ borderRadius: 20, height: "100%" }}>
              <Space
                direction="vertical"
                size={8}
                style={{ width: "100%", marginBottom: 16 }}
              >
                <Title level={4} style={{ margin: 0 }}>
                  This Week at a Glance
                </Title>
                <Text type="secondary">
                  Quick operational view for traffic and account growth.
                </Text>
              </Space>

              <Row gutter={[12, 12]}>
                <Col xs={24} sm={12}>
                  <Card size="small" style={{ borderRadius: 16 }}>
                    <Statistic
                      title="Active Users"
                      value={google?.overview.activeUsers ?? 0}
                      formatter={(value) => formatNumber(Number(value))}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12}>
                  <Card size="small" style={{ borderRadius: 16 }}>
                    <Statistic
                      title="Realtime Users"
                      value={google?.realtimeActiveUsers ?? 0}
                      formatter={(value) => formatNumber(Number(value))}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12}>
                  <Card size="small" style={{ borderRadius: 16 }}>
                    <Statistic
                      title="New Signups"
                      value={internal?.recentSignups7d ?? 0}
                      formatter={(value) => formatNumber(Number(value))}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12}>
                  <Card size="small" style={{ borderRadius: 16 }}>
                    <Statistic
                      title="Stored Devices"
                      value={internal?.storedDevices ?? 0}
                      formatter={(value) => formatNumber(Number(value))}
                    />
                  </Card>
                </Col>
              </Row>

              <Space direction="vertical" size={10} style={{ width: "100%", marginTop: 20 }}>
                <Text strong>Recent Signup Trend</Text>
                {internal?.signupTrend?.length ? (
                  internal.signupTrend.map((point) => {
                    const maxValue = Math.max(
                      ...(internal.signupTrend ?? []).map((entry) => entry.users),
                      1
                    );

                    return (
                      <div key={point.date}>
                        <Space
                          align="center"
                          style={{ width: "100%", justifyContent: "space-between" }}
                        >
                          <Text>{formatYmd(point.date)}</Text>
                          <Text type="secondary">{formatNumber(point.users)} users</Text>
                        </Space>
                        <div
                          style={{
                            marginTop: 6,
                            height: 8,
                            borderRadius: 999,
                            background: "rgba(15, 23, 42, 0.06)",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${Math.max((point.users / maxValue) * 100, point.users > 0 ? 8 : 0)}%`,
                              height: "100%",
                              borderRadius: 999,
                              background:
                                "linear-gradient(90deg, rgba(59,130,246,0.95), rgba(34,197,94,0.95))",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <Text type="secondary">No recent signup data yet.</Text>
                )}
              </Space>
            </Card>
          </Col>

          <Col xs={24} xl={10}>
            <Card style={{ borderRadius: 20, height: "100%" }}>
              <Space
                direction="vertical"
                size={8}
                style={{ width: "100%", marginBottom: 16 }}
              >
                <Title level={4} style={{ margin: 0 }}>
                  Your Profile Snapshot
                </Title>
                <Text type="secondary">
                  Personal details and access context for this account.
                </Text>
              </Space>

              <Descriptions
                size="small"
                column={1}
                styles={{ label: { width: 110, fontWeight: 600 } }}
              >
                <Descriptions.Item label="Name">
                  {user.name || <Text type="secondary">N/A</Text>}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {user.email || <Text type="secondary">N/A</Text>}
                </Descriptions.Item>
                <Descriptions.Item label="Position">
                  {user.position || <Text type="secondary">N/A</Text>}
                </Descriptions.Item>
                <Descriptions.Item label="Phones">
                  {phones ?? <Text type="secondary">None</Text>}
                </Descriptions.Item>
                <Descriptions.Item label="Joined">
                  {formatDate(derived.created)}
                </Descriptions.Item>
                <Descriptions.Item label="Updated">
                  {formatDate(derived.updated)}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>

        <Card style={{ borderRadius: 20 }}>
          <Space
            direction="vertical"
            size={8}
            style={{ width: "100%", marginBottom: 12 }}
          >
            <Title level={4} style={{ margin: 0 }}>
              Latest Accounts
            </Title>
            <Text type="secondary">
              The most recently created accounts in your system.
            </Text>
          </Space>

          {internal?.recentUsers?.length ? (
            <Row gutter={[12, 12]}>
              {internal.recentUsers.slice(0, 4).map((account) => (
                <Col xs={24} md={12} xl={6} key={account.id}>
                  <Card size="small" style={{ borderRadius: 16, height: "100%" }}>
                    <Space direction="vertical" size={8} style={{ width: "100%" }}>
                      <Space align="center">
                        <Avatar src={account.avatar || undefined} icon={<UserOutlined />} />
                        <div>
                          <Text strong>{account.name}</Text>
                          <div>
                            <Text type="secondary">@{account.username}</Text>
                          </div>
                        </div>
                      </Space>
                      <Text style={{ wordBreak: "break-word" }}>{account.email}</Text>
                      <Text type="secondary">
                        Joined {formatDate(account.createdAt || undefined)}
                      </Text>
                      <Space wrap size={[6, 6]}>
                        {account.roles.length ? (
                          account.roles.map((role) => (
                            <Tag key={`${account.id}-${role}`}>{role}</Tag>
                          ))
                        ) : (
                          <Tag>None</Tag>
                        )}
                      </Space>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Text type="secondary">No recent accounts yet.</Text>
          )}
        </Card>
      </Space>
    </div>
  );
}
