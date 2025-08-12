"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  message,
  Popconfirm,
  Card,
  Tag,
  Tooltip,
  Result,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import type { ColumnsType } from "antd/es/table";

import apiClient from "@/utils/api/apiClient";
import { UserAPI } from "@/models/UserModel";
import { RoleAPI, RoleType } from "@/models/RoleModel";
import { useUser } from "@/hooks/useUser";
import { APP_PERMISSIONS, hasPermission } from "@/config/permissions";

const UsersPage: React.FC = () => {
  const { user, initialLoading } = useUser();
  const router = useRouter();

  const [users, setUsers] = useState<UserAPI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  // Permission flags
  const canView = !!user && hasPermission(user, [APP_PERMISSIONS.VIEW_USERS]);
  const canCreate = !!user && hasPermission(user, [APP_PERMISSIONS.CREATE_USER]);
  const canEdit = !!user && hasPermission(user, [APP_PERMISSIONS.EDIT_USER]);
  const canDelete = !!user && hasPermission(user, [APP_PERMISSIONS.DELETE_USER]);

  useEffect(() => {
    if (initialLoading) return;

    if (!canView) {
      setLoading(false);
      setUsers([]);
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/users");
        if (response.status === 200) {
          setUsers(response.data);
        } else {
          message.error("Failed to fetch users");
        }
      } catch (error: any) {
        if (error?.response?.status === 403) {
          message.warning("You do not have permission to view users.");
        } else {
          message.error("An error occurred while fetching users");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [initialLoading, canView]);

  const handleDelete = async (userId: string, record: UserAPI) => {
    if (!canDelete) {
      message.warning("You do not have permission to delete users.");
      return;
    }
    const hasSystemRole = record.roles?.some((r) => r.type === RoleType.SYSTEM);
    if (hasSystemRole) {
      message.warning("Cannot delete a user with a system role.");
      return;
    }
    if (deletingIds.includes(userId)) return;

    setDeletingIds((prev) => [...prev, userId]);
    try {
      const response = await apiClient.delete(`/users/${userId}`);
      if (response.status === 200) {
        message.success("User deleted successfully");
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      } else {
        message.error("Failed to delete user");
      }
    } catch (error: any) {
      if (error?.response?.status === 403) {
        message.warning("You do not have permission to delete users.");
      } else {
        message.error("An error occurred while deleting the user");
      }
    } finally {
      setDeletingIds((prev) => prev.filter((id) => id !== userId));
    }
  };

  const columns: ColumnsType<UserAPI> = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar: string) => (
        <img
          src={avatar}
          alt="avatar"
          style={{ width: 40, height: 40, borderRadius: "50%" }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
      render: (text: string, record: UserAPI) =>
        canEdit || canView ? (
          <a onClick={() => router.push(`/dashboard/users/${record._id}`)}>
            {text}
          </a>
        ) : (
          <span>{text}</span>
        ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      sorter: (a, b) => (a.position || "").localeCompare(b.position || ""),
    },
    {
      title: "Roles",
      dataIndex: "roles",
      key: "roles",
      render: (roles: RoleAPI[]) => (
        <>
          {roles?.map((role) => (
            <Tag key={role._id} color={role.color || "red"}>
              {role.name}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_at", // your model uses created_at/updated_at
      key: "created_at",
      render: (_: any, rec: UserAPI) =>
        new Date((rec as any).created_at || (rec as any).createdAt).toLocaleString(),
      sorter: (a: any, b: any) =>
        new Date(a.created_at || a.createdAt).getTime() -
        new Date(b.created_at || b.createdAt).getTime(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const hasSystemRole = record.roles?.some((r) => r.type === RoleType.SYSTEM);
        return (
          <Space size="middle">
            {canEdit && (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => router.push(`/dashboard/users/${record._id}`)}
              >
                Edit
              </Button>
            )}
            {canDelete &&
              (hasSystemRole ? (
                <Tooltip title="Cannot delete a user with system role">
                  <Button type="primary" danger icon={<DeleteOutlined />} disabled>
                    Delete
                  </Button>
                </Tooltip>
              ) : (
                <Popconfirm
                  title="Are you sure to delete this user?"
                  onConfirm={() => handleDelete(record._id.toString(), record)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    loading={deletingIds.includes(record._id.toString())}
                  >
                    Delete
                  </Button>
                </Popconfirm>
              ))}
          </Space>
        );
      },
    },
  ];

  if (!initialLoading && !canView) {
    return (
      <Result
        status="403"
        title="Access denied"
        subTitle="You do not have permission to view users."
      />
    );
  }

  return (
    <Card
      title="Users Management"
      extra={
        canCreate ? (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push("/dashboard/users/create")}
          >
            Create User
          </Button>
        ) : null
      }
      style={{ width: "100%", overflowX: "auto" }}
    >
      <Input
        placeholder="Search users"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16, maxWidth: 300 }}
        disabled={!canView}
      />
      <Table<UserAPI>
        columns={columns}
        dataSource={users.filter((u) => {
          const q = searchText.toLowerCase();
          return (
            u.username.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            (u.name || "").toLowerCase().includes(q)
          );
        })}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />
    </Card>
  );
};

export default UsersPage;
