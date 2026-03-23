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
import { formatDate } from "@/utils/timeUtil";

const { Title, Text } = Typography;

const cap = (s?: string) => (s ? s[0].toUpperCase() + s.slice(1) : "");


export default function DashboardPage() {
  const { user } = useUser();

  const derived = useMemo(() => {
    if (!user) return null;

    const roles = user.roles ?? [];
    const allPerms = new Set<string>();
    roles.forEach((r) => (r.permissions ?? []).forEach((p) => allPerms.add(p)));

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
    <div>
      <Row justify="center">
        <Col xs={24} md={22} lg={18} xl={16} xxl={14}>
          <Space orientation="vertical" size={12} style={{ width: "100%" }}>
            {/* Header */}
            <Card style={{ borderRadius: 14 }} styles={{ body: { padding: 16 } }}>
              <Space size={12} align="center" style={{ width: "100%" }}>
                <Avatar
                  size={48}
                  src={user.avatar}
                  style={{ flex: "0 0 auto" }}
                >
                  {derived.displayName?.[0]?.toUpperCase()}
                </Avatar>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <Title level={5} style={{ margin: 0, lineHeight: 1.3 }}>
                    Welcome, {derived.displayName}
                  </Title>
                  <Text type="secondary" style={{ fontSize: 12 }}>@{user.username}</Text>

                  <div style={{ marginTop: 6 }}>
                    {derived.roles?.length ? (
                      <Space wrap size={[6, 6]}>
                        {derived.roles.map((r) => (
                          <Tag key={r._id} color={r.color} style={{ margin: 0 }}>
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
            <Row gutter={[8, 8]}>
              <Col xs={8}>
                <Card style={{ borderRadius: 14 }} styles={{ body: { padding: "12px 10px", textAlign: "center" } }}>
                  <Statistic title="Roles" value={derived.roles.length} styles={{ content: { fontSize: 22 } }} />
                </Card>
              </Col>
              <Col xs={8}>
                <Card style={{ borderRadius: 14 }} styles={{ body: { padding: "12px 10px", textAlign: "center" } }}>
                  <Statistic title="Perms" value={derived.permissionsCount} styles={{ content: { fontSize: 22 } }} />
                </Card>
              </Col>
              <Col xs={8}>
                <Card style={{ borderRadius: 14 }} styles={{ body: { padding: "12px 10px", textAlign: "center" } }}>
                  <Statistic title="Devices" value={derived.devicesCount} styles={{ content: { fontSize: 22 } }} />
                </Card>
              </Col>
            </Row>

            {/* Profile */}
            <Card style={{ borderRadius: 14 }} styles={{ body: { padding: 16 } }}>
              <Divider titlePlacement="start" style={{ marginTop: 0 }}>Profile</Divider>

              <Descriptions
                size="small"
                column={{ xs: 1, sm: 1, md: 2 }}
                styles={{ label: { width: 90, fontWeight: 500 } }}
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
