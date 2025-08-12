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
  Result,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import apiClient from "@/utils/api/apiClient";
import { RoleAPI, RoleType } from "@/models/RoleModel";
import { useUser } from "@/hooks/useUser";
import { APP_PERMISSIONS, hasPermission } from "@/config/permissions";

const RolesPage: React.FC = () => {
  const { user, initialLoading } = useUser();
  const [roles, setRoles] = useState<RoleAPI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const router = useRouter();

  // Permission flags
  const canView = !!user && hasPermission(user, [APP_PERMISSIONS.VIEW_ROLES]);
  const canCreate = !!user && hasPermission(user, [APP_PERMISSIONS.CREATE_ROLE]);
  const canEdit = !!user && hasPermission(user, [APP_PERMISSIONS.EDIT_ROLE]);
  const canDelete = !!user && hasPermission(user, [APP_PERMISSIONS.DELETE_ROLE]);

  useEffect(() => {
    if (initialLoading) return;

    if (!canView) {
      setLoading(false);
      setRoles([]);
      return;
    }

    const fetchRoles = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/roles");
        if (response.status === 200) {
          setRoles(response.data);
        } else {
          message.error("Failed to fetch roles");
        }
      } catch (error: any) {
        if (error?.response?.status === 403) {
          message.warning("You do not have permission to view roles.");
        } else {
          message.error("An error occurred while fetching roles");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [initialLoading, canView]);

  const handleDelete = async (roleId: string, roleType: RoleType) => {
    if (!canDelete) {
      message.warning("You do not have permission to delete roles.");
      return;
    }
    if (roleType === RoleType.SYSTEM || roleType === RoleType.GUEST) {
      message.warning("This role type cannot be deleted.");
      return;
    }
    if (deletingIds.includes(roleId)) return;

    setDeletingIds((prev) => [...prev, roleId]);
    try {
      const response = await apiClient.delete(`/roles/${roleId}`);
      if (response.status === 200) {
        message.success("Role deleted successfully");
        setRoles((prev) => prev.filter((role) => role._id !== roleId));
      } else {
        message.error("Failed to delete role");
      }
    } catch (error: any) {
      if (error?.response?.status === 403) {
        message.warning("You do not have permission to delete roles.");
      } else {
        message.error("An error occurred while deleting the role");
      }
    } finally {
      setDeletingIds((prev) => prev.filter((id) => id !== roleId));
    }
  };

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Role Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: RoleAPI, b: RoleAPI) => a.name.localeCompare(b.name),
      render: (text: string, record: RoleAPI) => (
        <a onClick={() => router.push(`/dashboard/roles/${record._id}`)}>
          {text}
        </a>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: RoleType) => (
        <Tag
          color={
            type === RoleType.SYSTEM
              ? "red"
              : type === RoleType.GUEST
              ? "blue"
              : "green"
          }
        >
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: RoleAPI) => (
        <Space size="middle">
          {canEdit && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => router.push(`/dashboard/roles/${record._id}`)}
            >
              Edit
            </Button>
          )}
          {canDelete &&
            record.type !== RoleType.SYSTEM &&
            record.type !== RoleType.GUEST && (
              <Popconfirm
                title="Are you sure to delete this role?"
                onConfirm={() => handleDelete(record._id, record.type)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  loading={deletingIds.includes(record._id)}
                >
                  Delete
                </Button>
              </Popconfirm>
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
        subTitle="You do not have permission to view roles."
      />
    );
    }

  return (
    <Card
      title="Roles Management"
      extra={
        canCreate ? (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push("/dashboard/roles/create")}
          >
            Create Role
          </Button>
        ) : null
      }
      style={{
        width: "100%",
        overflowX: "auto",
      }}
    >
      <Input
        placeholder="Search roles"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16, maxWidth: 300 }}
        disabled={!canView}
      />
      <Table<RoleAPI>
        columns={columns}
        dataSource={filteredRoles}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />
    </Card>
  );
};

export default RolesPage;
