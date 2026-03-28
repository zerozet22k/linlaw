"use client";

import React, { useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  List,
  Progress,
  Row,
  Segmented,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import {
  AreaChartOutlined,
  EyeOutlined,
  ReloadOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import SubLoader from "@/components/loaders/SubLoader";
import { useAdminAnalytics } from "@/hooks/useAdminAnalytics";
import type {
  AnalyticsDimensionStat,
  AnalyticsPageStat,
  AnalyticsRange,
  AnalyticsTrafficPoint,
  RecentAccountStat,
} from "@/types/adminAnalytics";
import { formatDate, formatYmd } from "@/utils/timeUtil";

const { Title, Text } = Typography;

function formatNumber(value: number) {
  return new Intl.NumberFormat().format(value || 0);
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatDuration(seconds: number) {
  if (!seconds) return "0s";

  const rounded = Math.round(seconds);
  const minutes = Math.floor(rounded / 60);
  const remainingSeconds = rounded % 60;

  if (minutes <= 0) return `${remainingSeconds}s`;
  return `${minutes}m ${remainingSeconds}s`;
}

function TrafficTrendCard({ items }: { items: AnalyticsTrafficPoint[] }) {
  const maxValue = Math.max(...items.map((item) => item.pageViews), 1);

  return (
    <Card style={{ borderRadius: 20, height: "100%" }}>
      <Space
        direction="vertical"
        size={4}
        style={{ width: "100%", marginBottom: 16 }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Traffic Trend
        </Title>
        <Text type="secondary">Daily page views with sessions and active users.</Text>
      </Space>

      {!items.length ? (
        <Empty description="No traffic data yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <Space direction="vertical" size={10} style={{ width: "100%" }}>
          {items.map((item) => {
            const width = Math.max(
              (item.pageViews / maxValue) * 100,
              item.pageViews > 0 ? 8 : 0
            );

            return (
              <div key={item.date}>
                <Space
                  align="center"
                  style={{ width: "100%", justifyContent: "space-between" }}
                >
                  <Text strong>{formatYmd(item.date)}</Text>
                  <Text type="secondary">
                    {formatNumber(item.activeUsers)} active
                  </Text>
                </Space>
                <div
                  style={{
                    marginTop: 6,
                    height: 10,
                    borderRadius: 999,
                    background: "rgba(15, 23, 42, 0.06)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${width}%`,
                      height: "100%",
                      borderRadius: 999,
                      background:
                        "linear-gradient(90deg, rgba(34,197,94,0.95), rgba(59,130,246,0.95))",
                    }}
                  />
                </div>
                <Space
                  align="center"
                  style={{ width: "100%", justifyContent: "space-between", marginTop: 4 }}
                >
                  <Text>{formatNumber(item.pageViews)} views</Text>
                  <Text type="secondary">{formatNumber(item.sessions)} sessions</Text>
                </Space>
              </div>
            );
          })}
        </Space>
      )}
    </Card>
  );
}

function BreakdownCard({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: AnalyticsDimensionStat[];
}) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <Card style={{ borderRadius: 20, height: "100%" }}>
      <Space
        direction="vertical"
        size={4}
        style={{ width: "100%", marginBottom: 16 }}
      >
        <Title level={4} style={{ margin: 0 }}>
          {title}
        </Title>
        <Text type="secondary">{subtitle}</Text>
      </Space>

      {!items.length ? (
        <Empty description="No data yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <List
          dataSource={items}
          renderItem={(item) => (
            <List.Item style={{ paddingLeft: 0, paddingRight: 0 }}>
              <Space direction="vertical" size={6} style={{ width: "100%" }}>
                <Space
                  align="center"
                  style={{ width: "100%", justifyContent: "space-between" }}
                >
                  <Text strong>{item.label}</Text>
                  <Text>{formatNumber(item.value)}</Text>
                </Space>
                <Progress
                  percent={Math.round((item.value / maxValue) * 100)}
                  showInfo={false}
                  strokeColor="#1677ff"
                  trailColor="rgba(15, 23, 42, 0.06)"
                />
              </Space>
            </List.Item>
          )}
        />
      )}
    </Card>
  );
}

export default function DashboardAnalyticsPage() {
  const [range, setRange] = useState<AnalyticsRange>("30d");
  const { data, loading, error, reload } = useAdminAnalytics(range);

  const topPageColumns = useMemo<ColumnsType<AnalyticsPageStat>>(
    () => [
      {
        title: "Path",
        dataIndex: "path",
        key: "path",
        render: (path: string) => (
          <Text code style={{ wordBreak: "break-all" }}>
            {path || "/"}
          </Text>
        ),
      },
      {
        title: "Views",
        dataIndex: "views",
        key: "views",
        width: 120,
        render: (value: number) => formatNumber(value),
      },
      {
        title: "Active Users",
        dataIndex: "activeUsers",
        key: "activeUsers",
        width: 140,
        render: (value: number) => formatNumber(value),
      },
    ],
    []
  );

  const recentUsersColumns = useMemo<ColumnsType<RecentAccountStat>>(
    () => [
      {
        title: "Account",
        key: "account",
        render: (_, record) => (
          <Space size={12}>
            <Avatar src={record.avatar || undefined} icon={<UserOutlined />} />
            <Space direction="vertical" size={0}>
              <Text strong>{record.name}</Text>
              <Text type="secondary">@{record.username}</Text>
            </Space>
          </Space>
        ),
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        responsive: ["md"],
      },
      {
        title: "Roles",
        key: "roles",
        render: (_, record) => (
          <Space wrap size={[6, 6]}>
            {record.roles.length ? (
              record.roles.map((role) => <Tag key={`${record.id}-${role}`}>{role}</Tag>)
            ) : (
              <Tag>None</Tag>
            )}
          </Space>
        ),
      },
      {
        title: "Joined",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 140,
        render: (value: string | null) => formatDate(value || undefined) || "N/A",
      },
    ],
    []
  );

  if (loading && !data) {
    return <SubLoader tip="Loading analytics..." minHeight="60vh" />;
  }

  if (!data) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          type="error"
          showIcon
          message="Analytics could not be loaded."
          description={error || "Please try again."}
        />
      </div>
    );
  }

  const { google, internal, generatedAt } = data;
  const hasGoogleIssue = !google.configured || !!google.error;

  return (
    <div style={{ padding: 8 }}>
      <Space direction="vertical" size={20} style={{ width: "100%" }}>
        <Card
          style={{
            borderRadius: 24,
            background:
              "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(30,64,175,0.94))",
            color: "#fff",
            overflow: "hidden",
          }}
          styles={{ body: { padding: 24 } }}
        >
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} lg={16}>
              <Space direction="vertical" size={8} style={{ width: "100%" }}>
                <Space align="center">
                  <AreaChartOutlined style={{ fontSize: 20, color: "#7dd3fc" }} />
                  <Text style={{ color: "rgba(255,255,255,0.75)" }}>
                    Google Analytics + Internal Accounts
                  </Text>
                </Space>
                <Title level={2} style={{ color: "#fff", margin: 0 }}>
                  Site Analytics
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.75)", maxWidth: 720 }}>
                  Track traffic, guest accounts, recent signups, and device footprint in one
                  place.
                </Text>
                <Space wrap size={[8, 8]}>
                  {google.measurementId ? (
                    <Tag color="blue">GA tag: {google.measurementId}</Tag>
                  ) : null}
                  {google.propertyId ? (
                    <Tag color="geekblue">Property: {google.propertyId}</Tag>
                  ) : null}
                  <Tag color="cyan">Updated {formatDate(generatedAt)}</Tag>
                </Space>
              </Space>
            </Col>

            <Col xs={24} lg={8}>
              <Space
                direction="vertical"
                size={12}
                style={{ width: "100%", alignItems: "flex-end" }}
              >
                <Segmented<AnalyticsRange>
                  value={range}
                  options={[
                    { label: "Last 7 days", value: "7d" },
                    { label: "Last 30 days", value: "30d" },
                  ]}
                  onChange={(value) => setRange(value)}
                />
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => reload()}
                  loading={loading}
                >
                  Refresh
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {error ? (
          <Alert type="error" showIcon message="Analytics request failed" description={error} />
        ) : null}

        {hasGoogleIssue ? (
          <Alert
            type={!google.configured ? "warning" : "error"}
            showIcon
            message={
              !google.configured
                ? "Google Analytics reporting is not configured yet."
                : "Google Analytics could not return data."
            }
            description={
              google.error ||
              "Set GOOGLE_ANALYTICS_PROPERTY_ID plus service-account credentials to unlock GA4 reporting."
            }
          />
        ) : null}

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} xl={6}>
            <Card style={{ borderRadius: 20 }}>
              <Statistic
                title="Active Users"
                value={google.overview.activeUsers}
                formatter={(value) => formatNumber(Number(value))}
                prefix={<ThunderboltOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <Card style={{ borderRadius: 20 }}>
              <Statistic
                title="Sessions"
                value={google.overview.sessions}
                formatter={(value) => formatNumber(Number(value))}
                prefix={<AreaChartOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <Card style={{ borderRadius: 20 }}>
              <Statistic
                title="Page Views"
                value={google.overview.pageViews}
                formatter={(value) => formatNumber(Number(value))}
                prefix={<EyeOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <Card style={{ borderRadius: 20 }}>
              <Statistic
                title="Realtime Users"
                value={google.realtimeActiveUsers}
                formatter={(value) => formatNumber(Number(value))}
                prefix={<ThunderboltOutlined />}
              />
              <Text type="secondary">Last 30 minutes</Text>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} xl={6}>
            <Card style={{ borderRadius: 20 }}>
              <Statistic
                title="Total Accounts"
                value={internal.totalUsers}
                formatter={(value) => formatNumber(Number(value))}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <Card style={{ borderRadius: 20 }}>
              <Statistic
                title="Guest Accounts"
                value={internal.guestUsers}
                formatter={(value) => formatNumber(Number(value))}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <Card style={{ borderRadius: 20 }}>
              <Statistic
                title="New Accounts"
                value={internal.recentSignupsInRange}
                formatter={(value) => formatNumber(Number(value))}
                suffix={range}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <Card style={{ borderRadius: 20 }}>
              <Statistic
                title="Stored Devices"
                value={internal.storedDevices}
                formatter={(value) => formatNumber(Number(value))}
              />
              <Text type="secondary">
                {formatNumber(internal.usersWithDevices)} users with remembered devices
              </Text>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} xl={14}>
            <TrafficTrendCard items={google.trend} />
          </Col>
          <Col xs={24} xl={10}>
            <Card style={{ borderRadius: 20, height: "100%" }}>
              <Space
                direction="vertical"
                size={8}
                style={{ width: "100%", marginBottom: 16 }}
              >
                <Title level={4} style={{ margin: 0 }}>
                  Engagement Snapshot
                </Title>
                <Text type="secondary">
                  Quick quality signals from GA4 for the selected range.
                </Text>
              </Space>
              <Row gutter={[12, 12]}>
                <Col xs={24} sm={12}>
                  <Card size="small" style={{ borderRadius: 16 }}>
                    <Statistic
                      title="Engagement Rate"
                      value={google.overview.engagementRate * 100}
                      precision={1}
                      suffix="%"
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12}>
                  <Card size="small" style={{ borderRadius: 16 }}>
                    <Statistic
                      title="Avg. Session"
                      value={formatDuration(google.overview.averageSessionDuration)}
                    />
                  </Card>
                </Col>
                <Col xs={24}>
                  <Card size="small" style={{ borderRadius: 16 }}>
                    <Space direction="vertical" size={6}>
                      <Text strong>Account Mix</Text>
                      <Text type="secondary">
                        {formatPercent(
                          internal.totalUsers
                            ? internal.guestUsers / internal.totalUsers
                            : 0
                        )}{" "}
                        of accounts are currently guests.
                      </Text>
                      <Text type="secondary">
                        {formatNumber(internal.systemUsers)} system account
                        {internal.systemUsers === 1 ? "" : "s"} and{" "}
                        {formatNumber(internal.staffUsers)} non-guest accounts.
                      </Text>
                      <Text type="secondary">
                        {formatNumber(internal.recentSignups7d)} signups in 7 days,{" "}
                        {formatNumber(internal.recentSignups30d)} in 30 days.
                      </Text>
                    </Space>
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} xl={14}>
            <Card style={{ borderRadius: 20 }}>
              <Space
                direction="vertical"
                size={4}
                style={{ width: "100%", marginBottom: 16 }}
              >
                <Title level={4} style={{ margin: 0 }}>
                  Top Pages
                </Title>
                <Text type="secondary">
                  Highest-viewed public paths for the selected range.
                </Text>
              </Space>

              <Table
                columns={topPageColumns}
                dataSource={google.topPages}
                rowKey={(record) => record.path}
                pagination={false}
                locale={{ emptyText: "No page view data yet." }}
                scroll={{ x: "max-content" }}
              />
            </Card>
          </Col>
          <Col xs={24} xl={10}>
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              <BreakdownCard
                title="Top Countries"
                subtitle="Where your recent visitors came from."
                items={google.countries}
              />
              <BreakdownCard
                title="Devices"
                subtitle="Recent device mix from GA4."
                items={google.devices}
              />
            </Space>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} xl={10}>
            <Card style={{ borderRadius: 20, height: "100%" }}>
              <Space
                direction="vertical"
                size={4}
                style={{ width: "100%", marginBottom: 16 }}
              >
                <Title level={4} style={{ margin: 0 }}>
                  Signup Trend
                </Title>
                <Text type="secondary">
                  New accounts created across the selected range.
                </Text>
              </Space>

              {!internal.signupTrend.length ? (
                <Empty
                  description="No recent signup data"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                <Space direction="vertical" size={10} style={{ width: "100%" }}>
                  {internal.signupTrend.map((item) => {
                    const maxValue = Math.max(
                      ...internal.signupTrend.map((point) => point.users),
                      1
                    );
                    const width = Math.max(
                      (item.users / maxValue) * 100,
                      item.users > 0 ? 8 : 0
                    );

                    return (
                      <div key={item.date}>
                        <Space
                          align="center"
                          style={{ width: "100%", justifyContent: "space-between" }}
                        >
                          <Text strong>{formatYmd(item.date)}</Text>
                          <Text>{formatNumber(item.users)} users</Text>
                        </Space>
                        <div
                          style={{
                            marginTop: 6,
                            height: 10,
                            borderRadius: 999,
                            background: "rgba(15, 23, 42, 0.06)",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${width}%`,
                              height: "100%",
                              borderRadius: 999,
                              background:
                                "linear-gradient(90deg, rgba(249,115,22,0.95), rgba(234,88,12,0.95))",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </Space>
              )}
            </Card>
          </Col>
          <Col xs={24} xl={14}>
            <Card style={{ borderRadius: 20 }}>
              <Space
                direction="vertical"
                size={4}
                style={{ width: "100%", marginBottom: 16 }}
              >
                <Title level={4} style={{ margin: 0 }}>
                  Recent Accounts
                </Title>
                <Text type="secondary">
                  Latest people created inside your own database.
                </Text>
              </Space>

              <Table
                columns={recentUsersColumns}
                dataSource={internal.recentUsers}
                rowKey={(record) => record.id}
                pagination={false}
                locale={{ emptyText: "No user accounts found." }}
                scroll={{ x: "max-content" }}
              />
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
}
