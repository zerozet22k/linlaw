"use client";

import React, { useMemo } from "react";
import {
  Avatar,
  Card,
  Col,
  Collapse,
  Descriptions,
  Divider,
  Empty,
  Row,
  Space,
  Statistic,
  Tag,
  Typography,
} from "antd";
import { useUser } from "@/hooks/useUser";

const { Title, Text } = Typography;

const cap = (s?: string) => (s ? s[0].toUpperCase() + s.slice(1) : "");

const formatDate = (value: any) => {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
};

export default function DashboardPage() {
  const { user } = useUser();

  const derived = useMemo(() => {
    if (!user) return null;

    const roles = user.roles ?? [];
    const allPerms = new Set<string>();
    roles.forEach((r) => (r.permissions ?? []).forEach((p) => allPerms.add(p)));

    // support either snake_case or camelCase timestamps
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
    };
  }, [user]);

  if (!user || !derived) {
    return (
      <div style={{ padding: 24 }}>
        <Card style={{ borderRadius: 12 }}>
          <Empty description="No user data available." />
        </Card>
      </div>
    );
  }

  const phones =
    user.phones?.length
      ? user.phones.map((p, i) => (
          <div key={`${p.type}-${p.number}-${i}`}>
            <Text strong>{p.type}:</Text> <Text>{p.number}</Text>
          </div>
        ))
      : null;

  return (
    <div style={{ padding: 24 }}>
      <Row justify="center">
        <Col xs={24} md={22} lg={18} xl={16} xxl={14}>
          <Space orientation="vertical" size={16} style={{ width: "100%" }}>
            {/* Header */}
            <Card style={{ borderRadius: 14 }} styles={{ body: { padding: 20 } }}>
              <Space size={14} align="start" style={{ width: "100%" }}>
                <Avatar
                  size={56}
                  src={user.avatar}
                  style={{ flex: "0 0 auto" }}
                >
                  {derived.displayName?.[0]?.toUpperCase()}
                </Avatar>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <Title level={4} style={{ margin: 0 }}>
                    Welcome
                  </Title>
                  <Text type="secondary">@{user.username}</Text>

                  <div style={{ marginTop: 10 }}>
                    {derived.roles?.length ? (
                      <Space wrap size={[8, 8]}>
                        {derived.roles.map((r) => (
                          <Tag key={r._id} color={r.color}>
                            {r.name}
                          </Tag>
                        ))}
                      </Space>
                    ) : (
                      <Text type="secondary">No roles</Text>
                    )}
                  </div>
                </div>
              </Space>
            </Card>

            {/* Stats */}
            <Row gutter={[12, 12]}>
              <Col xs={24} sm={8}>
                <Card style={{ borderRadius: 14 }} styles={{ body: { padding: 16 } }}>
                  <Statistic title="Roles" value={derived.roles.length} />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card style={{ borderRadius: 14 }} styles={{ body: { padding: 16 } }}>
                  <Statistic title="Permissions" value={derived.permissionsCount} />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card style={{ borderRadius: 14 }} styles={{ body: { padding: 16 } }}>
                  <Statistic title="Devices" value={derived.devicesCount} />
                </Card>
              </Col>
            </Row>

            {/* Profile */}
            <Card style={{ borderRadius: 14 }} styles={{ body: { padding: 20 } }}>
              <Divider titlePlacement="start">Profile</Divider>

              <Descriptions
                size="middle"
                column={{ xs: 1, sm: 1, md: 2 }}
                labelStyle={{ width: 140 }}
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

                <Descriptions.Item label="Created">
                  {formatDate(derived.created)}
                </Descriptions.Item>

                <Descriptions.Item label="Updated">
                  {formatDate(derived.updated)}
                </Descriptions.Item>
              </Descriptions>

              {!!derived.roles.length && (
                <>
                  <Divider titlePlacement="start">Role details</Divider>

                  <Collapse
                    size="small"
                    items={derived.roles
                      .slice()
                      .sort((a, b) => (b.level ?? 0) - (a.level ?? 0))
                      .map((r) => {
                        const perms = r.permissions ?? [];
                        const preview = perms.slice(0, 6);
                        const more = perms.length - preview.length;

                        return {
                          key: r._id,
                          label: (
                            <Space wrap size={8}>
                              <Text strong>{r.name}</Text>
                              <Tag color={r.color}>{cap(r.type)}</Tag>
                              <Text type="secondary">Level: {r.level}</Text>
                              <Text type="secondary">Perms: {perms.length}</Text>
                            </Space>
                          ),
                          children: (
                            <Space orientation="vertical" size={10} style={{ width: "100%" }}>
                              {preview.length ? (
                                <Space wrap size={[8, 8]}>
                                  {preview.map((p) => (
                                    <Tag key={p}>{p}</Tag>
                                  ))}
                                  {more > 0 ? <Tag>+{more} more</Tag> : null}
                                </Space>
                              ) : (
                                <Text type="secondary">No permissions</Text>
                              )}
                            </Space>
                          ),
                        };
                      })}
                  />
                </>
              )}
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
}
