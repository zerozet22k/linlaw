"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  message,
  Popconfirm,
  Card,
  Tag,
  Result,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

import apiClient from "@/utils/api/apiClient";
import { useUser } from "@/hooks/useUser";
import { APP_PERMISSIONS, hasPermission } from "@/config/permissions";
import { RelatedBusinessAPI } from "@/models/RelatedBusinessModel";

const getEn = (obj: any) => String(obj?.en ?? "").trim();

const RelatedBusinessesPage: React.FC = () => {
  const { user, initialLoading } = useUser();
  const router = useRouter();

  const [items, setItems] = useState<RelatedBusinessAPI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  const canView = !!user && hasPermission(user, [APP_PERMISSIONS.VIEW_RELATED_BUSINESSES]);
  const canCreate = !!user && hasPermission(user, [APP_PERMISSIONS.CREATE_RELATED_BUSINESS]);
  const canEdit = !!user && hasPermission(user, [APP_PERMISSIONS.EDIT_RELATED_BUSINESS]);
  const canDelete = !!user && hasPermission(user, [APP_PERMISSIONS.DELETE_RELATED_BUSINESS]);

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
        const res = await apiClient.get("/related-businesses?includeInactive=1&limit=200&page=1");
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.businesses)
            ? res.data.businesses
            : [];

        setItems(list);
      } catch (e: any) {
        if (e?.response?.status === 403) {
          message.warning("You do not have permission to view related businesses.");
          setItems([]);
        } else {
          console.error("Fetch related businesses error:", e);
          message.error("Failed to fetch related businesses.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [initialLoading, canView]);

  const handleDelete = async (id: string) => {
    if (!canDelete) {
      message.warning("You do not have permission to delete related businesses.");
      return;
    }
    if (deletingIds.includes(id)) return;

    setDeletingIds((prev) => [...prev, id]);
    try {
      // matches your edit route style: /related-businesses/id/:id
      const res = await apiClient.delete(`/related-businesses/id/${id}`);
      if (res.status === 200) {
        message.success("Related business deleted successfully");
        setItems((prev) => prev.filter((x) => x._id !== id));
      } else {
        message.error("Failed to delete related business");
      }
    } catch (e: any) {
      if (e?.response?.status === 403) {
        message.warning("You do not have permission to delete related businesses.");
      } else {
        console.error("Delete related business error:", e);
        message.error(e?.response?.data?.message || "Failed to delete related business.");
      }
    } finally {
      setDeletingIds((prev) => prev.filter((x) => x !== id));
    }
  };

  const filteredItems = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return items;

    return items.filter((x: any) => {
      const slug = String(x.slug || "").toLowerCase();
      const titleEn = getEn(x.title).toLowerCase();
      const website = String(x.website || "").toLowerCase();
      const email = String(x.email || "").toLowerCase();
      return slug.includes(q) || titleEn.includes(q) || website.includes(q) || email.includes(q);
    });
  }, [items, searchText]);

  const columns: ColumnsType<RelatedBusinessAPI> = [
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      sorter: (a, b) => (a.slug || "").localeCompare(b.slug || ""),
      render: (v: string, row) =>
        canEdit || canView ? (
          <a onClick={() => router.push(`/dashboard/related-businesses/${row._id}`)}>
            <code>{v}</code>
          </a>
        ) : (
          <code>{v}</code>
        ),
    },
    {
      title: "Title (EN)",
      key: "titleEn",
      sorter: (a: any, b: any) => getEn(a.title).localeCompare(getEn(b.title)),
      render: (_: any, row: any) => getEn(row.title) || "-",
    },
    {
      title: "Website",
      dataIndex: "website",
      key: "website",
      render: (v?: string) =>
        v ? (
          <a href={v} target="_blank" rel="noreferrer">
            {v}
          </a>
        ) : (
          "-"
        ),
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      width: 110,
      render: (v?: boolean) =>
        v ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag>,
    },
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
      width: 90,
      sorter: (a, b) => (a.order ?? 0) - (b.order ?? 0),
      render: (v?: number) => (typeof v === "number" ? v : 0),
    },
    {
      title: "Actions",
      key: "actions",
      width: 240,
      render: (_: any, row: RelatedBusinessAPI) => (
        <Space size="middle">
          {canEdit && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => router.push(`/dashboard/related-businesses/${row._id}`)}
            >
              Edit
            </Button>
          )}

          {canDelete ? (
            <Popconfirm
              title="Are you sure to delete this related business?"
              onConfirm={() => handleDelete(row._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                loading={deletingIds.includes(row._id)}
              >
                Delete
              </Button>
            </Popconfirm>
          ) : (
            <Tooltip title="No permission">
              <Button type="primary" danger icon={<DeleteOutlined />} disabled>
                Delete
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  if (!initialLoading && !canView) {
    return (
      <Result
        status="403"
        title="Access denied"
        subTitle="You do not have permission to view related businesses."
      />
    );
  }

  return (
    <Card
      title="Related Businesses Management"
      extra={
        canCreate ? (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push("/dashboard/related-businesses/create")}
          >
            Create
          </Button>
        ) : null
      }
      style={{ width: "100%", overflowX: "auto" }}
    >
      <Input
        placeholder="Search slug / title(en) / website / email"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16, maxWidth: 360 }}
        disabled={!canView}
      />

      <Table<RelatedBusinessAPI>
        columns={columns}
        dataSource={filteredItems}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />
    </Card>
  );
};

export default RelatedBusinessesPage;
