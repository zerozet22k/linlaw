"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Select,
  Table,
  Spin,
  message,
  Row,
  Col,
  Typography,
} from "antd";
import { debounce } from "lodash";
import apiClient from "@/utils/api/apiClient";

import type { UserAPI } from "@/models/UserModel";

const { Title } = Typography;

const PAGE_SIZE = 50;

const SendEmailPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const [filterLoading, setFilterLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [includeRoles, setIncludeRoles] = useState<string[]>([]);
  const [excludeRoles, setExcludeRoles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [matchingUsers, setMatchingUsers] = useState<UserAPI[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [hasLoadedUsers, setHasLoadedUsers] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const loadingRef = useRef(false);
  const requestIdRef = useRef(0);

  const rowSelection = {
    selectedRowKeys: selectedUserIds,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedUserIds(selectedRowKeys as string[]);
    },
  };

  const columns = [
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Roles",
      dataIndex: "roles",
      key: "roles",
      render: (roles: UserAPI["roles"]) =>
        (roles ?? []).map((r) => r.name).join(", "),
    },
  ];

  const fetchUsers = async (nextPage: number, mode: "replace" | "append") => {
    const reqId = ++requestIdRef.current;

    if (mode === "replace") setFilterLoading(true);
    else setLoadingMore(true);

    loadingRef.current = true;

    try {
      const response = await apiClient.post("/data", {
        type: "users",
        searchQuery,
        includeRoles,
        excludeRoles,
        page: nextPage,
        limit: PAGE_SIZE,
      })
      if (reqId !== requestIdRef.current) return;

      const items: UserAPI[] = response.data.items ?? [];
      const apiHasMore: boolean = !!response.data.hasMore;

      setHasLoadedUsers(true);
      setHasMore(apiHasMore);
      setPage(nextPage);

      setMatchingUsers((prev) =>
        mode === "append" ? [...prev, ...items] : items
      );
    } catch (error) {
      console.error("Error loading matching users:", error);
      message.error("Error loading matching users.");
    } finally {
      loadingRef.current = false;
      setFilterLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMatchingUsers = async () => {
    setSelectedUserIds([]);
    setHasMore(true);
    setPage(1);
    await fetchUsers(1, "replace");
  };

  const loadMoreUsers = async () => {
    if (!hasMore || loadingRef.current) return;
    await fetchUsers(page + 1, "append");
  };

  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchQuery(value);
      }, 500),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [debouncedSetSearch]);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearch(e.target.value);
  };

  const onPopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      loadMoreUsers();
    }
  };

  const onFinish = async (values: { subject: string; message: string }) => {
    try {
      setLoading(true);
      const payload = {
        subject: values.subject,
        message: values.message,
        userIds: selectedUserIds,
      };
      const response = await apiClient.post("/send-emails", payload);
      if (response.status === 200) message.success("Emails sent successfully.");
      else if (response.status === 207)
        message.warning("Emails sent with some errors.");
      else message.error("Failed to send emails.");
    } catch (error: any) {
      console.error("Error sending emails:", error);
      message.error("An error occurred while sending emails.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <Title level={3} style={{ marginBottom: 16 }}>
        Send Emails
      </Title>

      <Row gutter={16}>
        <Col xs={24} md={8}>
          <div style={{ position: "sticky", top: 80 }}>
            <Card size="small" title="Filter Options">
              <label style={{ display: "block", marginBottom: 6 }}>
                Include Roles
              </label>
              <Select
                mode="multiple"
                placeholder="Select roles to include"
                value={includeRoles}
                onChange={setIncludeRoles}
                style={{ width: "100%", marginBottom: 16 }}
              >
                <Select.Option value="admin">Admin</Select.Option>
                <Select.Option value="editor">Editor</Select.Option>
                <Select.Option value="user">User</Select.Option>
              </Select>

              <label style={{ display: "block", marginBottom: 6 }}>
                Exclude Roles
              </label>
              <Select
                mode="multiple"
                placeholder="Select roles to exclude"
                value={excludeRoles}
                onChange={setExcludeRoles}
                style={{ width: "100%", marginBottom: 16 }}
              >
                <Select.Option value="admin">Admin</Select.Option>
                <Select.Option value="editor">Editor</Select.Option>
                <Select.Option value="user">User</Select.Option>
              </Select>

              <label style={{ display: "block", marginBottom: 6 }}>
                Search Query
              </label>
              <Input
                placeholder="Search users by name or email"
                onChange={onSearchChange}
                style={{ marginBottom: 16 }}
              />

              <Button
                type="primary"
                block
                onClick={loadMatchingUsers}
                loading={filterLoading}
              >
                Load Matching Users
              </Button>
            </Card>
          </div>
        </Col>

        <Col xs={24} md={16}>
          <Card size="small" title="Matching Users" style={{ marginBottom: 16 }}>
            {hasLoadedUsers ? (
              <>
                <div
                  style={{ height: 300, overflowY: "auto" }}
                  onScroll={onPopupScroll}
                >
                  <Table<UserAPI>
                    rowKey="_id"
                    columns={columns as any}
                    dataSource={matchingUsers}
                    rowSelection={rowSelection}
                    size="middle"
                    pagination={false}
                    loading={filterLoading}
                  />
                </div>

                {loadingMore && (
                  <div style={{ textAlign: "center", padding: 12 }}>
                    <Spin />
                  </div>
                )}

                {!hasMore && matchingUsers.length > 0 && (
                  <div style={{ textAlign: "center", padding: 8, opacity: 0.7 }}>
                    End of results
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: "center", padding: 40 }}>
                <Spin spinning={filterLoading} />
                {!filterLoading && (
                  <p style={{ marginTop: 16 }}>
                    No users loaded yet. Use filters and click &quot;Load Matching
                    Users&quot;.
                  </p>
                )}
              </div>
            )}
          </Card>

          <Card size="small" title="Compose Email">
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Subject"
                name="subject"
                rules={[{ required: true, message: "Please input the subject." }]}
              >
                <Input placeholder="Email subject" />
              </Form.Item>

              <Form.Item
                label="Message"
                name="message"
                rules={[{ required: true, message: "Please input the message." }]}
              >
                <Input.TextArea rows={6} placeholder="Email message" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  disabled={selectedUserIds.length === 0}
                >
                  Send Emails to Selected Users
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SendEmailPage;
