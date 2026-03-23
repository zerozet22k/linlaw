"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Input, Result, Space, Table, Tag, message } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

import apiClient from "@/utils/api/apiClient";
import { useUser } from "@/hooks/useUser";
import { APP_PERMISSIONS, hasPermission } from "@/config/permissions";
import type { CareerAPI } from "@/models/CareerModel";

const getEn = (value: any) => String(value?.en ?? "").trim();

const CareersPage: React.FC = () => {
  const { user, initialLoading } = useUser();
  const router = useRouter();

  const [items, setItems] = useState<CareerAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  const canView = !!user && hasPermission(user, [APP_PERMISSIONS.VIEW_CAREER]);
  const canCreate = !!user && hasPermission(user, [APP_PERMISSIONS.CREATE_CAREER]);
  const canEdit = !!user && hasPermission(user, [APP_PERMISSIONS.EDIT_CAREER]);
  const canDelete = !!user && hasPermission(user, [APP_PERMISSIONS.DELETE_CAREER]);

  useEffect(() => {
    if (initialLoading) return;

    if (!canView) {
      setLoading(false);
      setItems([]);
      return;
    }

    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/careers?includeInactive=1&page=1&limit=200");
        const list = Array.isArray(response.data?.careers) ? response.data.careers : [];
        setItems(list);
      } catch (error: any) {
        if (error?.response?.status === 403) {
          message.warning("You do not have permission to view careers.");
        } else {
          console.error("Fetch careers error:", error);
          message.error("Failed to fetch careers.");
        }
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [initialLoading, canView]);

  const filteredItems = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return items;

    return items.filter((item) => {
      const title = getEn(item.title).toLowerCase();
      const department = String(item.department || "").toLowerCase();
      const location = String(item.location || "").toLowerCase();
      return (
        title.includes(query) ||
        department.includes(query) ||
        location.includes(query)
      );
    });
  }, [items, searchText]);

  const handleDelete = async (id: string) => {
    if (!canDelete || deletingIds.includes(id)) return;

    setDeletingIds((prev) => [...prev, id]);
    try {
      await apiClient.delete(`/careers/${id}`);
      message.success("Career deleted successfully.");
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (error: any) {
      if (error?.response?.status === 403) {
        message.warning("You do not have permission to delete careers.");
      } else {
        console.error("Delete career error:", error);
        message.error("Failed to delete career.");
      }
    } finally {
      setDeletingIds((prev) => prev.filter((value) => value !== id));
    }
  };

  if (!initialLoading && !canView) {
    return (
      <Result
        status="403"
        title="Access denied"
        subTitle="You do not have permission to view careers."
      />
    );
  }

  return (
    <Card
      title="Careers Management"
      extra={
        canCreate ? (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push("/dashboard/careers/create")}
          >
            Create Career
          </Button>
        ) : null
      }
      style={{ width: "100%", overflowX: "auto" }}
    >
      <Input
        placeholder="Search title / department / location"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        style={{ marginBottom: 16, maxWidth: 360 }}
      />

      <Table<CareerAPI>
        rowKey="_id"
        loading={loading}
        dataSource={filteredItems}
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
        columns={[
          {
            title: "Title (EN)",
            key: "title",
            render: (_value, record) => {
              const label = getEn(record.title) || "Untitled";
              return canEdit ? (
                <a onClick={() => router.push(`/dashboard/careers/${record._id}`)}>
                  {label}
                </a>
              ) : (
                <span>{label}</span>
              );
            },
          },
          {
            title: "Department",
            dataIndex: "department",
            key: "department",
            render: (value?: string) => value || "-",
          },
          {
            title: "Location",
            dataIndex: "location",
            key: "location",
            render: (value?: string) => value || "-",
          },
          {
            title: "Active",
            dataIndex: "isActive",
            key: "isActive",
            render: (value?: boolean) =>
              value ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag>,
          },
          {
            title: "Order",
            dataIndex: "order",
            key: "order",
            render: (value?: number) => (typeof value === "number" ? value : 0),
          },
          {
            title: "Actions",
            key: "actions",
            render: (_value, record) => (
              <Space size="middle">
                {canEdit && (
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => router.push(`/dashboard/careers/${record._id}`)}
                  >
                    Edit
                  </Button>
                )}
                {canDelete && (
                  <Button
                    danger
                    type="primary"
                    icon={<DeleteOutlined />}
                    loading={deletingIds.includes(record._id)}
                    onClick={() => handleDelete(record._id)}
                  >
                    Delete
                  </Button>
                )}
              </Space>
            ),
          },
        ]}
      />
    </Card>
  );
};

export default CareersPage;
