"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, Input, Space, message, Card, Result, Tooltip } from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FileOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileZipOutlined,
  FileMarkdownOutlined,
  FilePptOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  CodeOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import apiClient from "@/utils/api/apiClient";
import { useUser } from "@/hooks/useUser";
import { APP_PERMISSIONS, hasPermission } from "@/config/permissions";

// ---------------- helpers ----------------
const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const ext = (name?: string) => (name?.split(".").pop() || "").toLowerCase();

const fileIcon = (filename?: string) => {
  const e = ext(filename);
  if (["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "tiff"].includes(e)) return <FileImageOutlined />;
  if (["mp4", "mkv", "mov", "avi", "webm"].includes(e)) return <VideoCameraOutlined />;
  if (["mp3", "wav", "flac", "aac", "ogg", "m4a"].includes(e)) return <AudioOutlined />;
  if (["pdf"].includes(e)) return <FilePdfOutlined />;
  if (["doc", "docx"].includes(e)) return <FileWordOutlined />;
  if (["xls", "xlsx", "csv"].includes(e)) return <FileExcelOutlined />;
  if (["ppt", "pptx"].includes(e)) return <FilePptOutlined />;
  if (["zip", "rar", "7z", "gz", "tar"].includes(e)) return <FileZipOutlined />;
  if (["md", "markdown"].includes(e)) return <FileMarkdownOutlined />;
  if (["js","ts","tsx","jsx","py","java","c","cpp","rs","go","rb","php","sh","json","yml","yaml","xml","html","css"].includes(e)) return <CodeOutlined />;
  return <FileOutlined />;
};

const shortName = (name?: string) => {
  if (!name) return "Unnamed";
  if (name.length <= 18) return name;
  const e = ext(name);
  const base = e ? name.slice(0, Math.max(0, 18 - (e.length + 1))) : name.slice(0, 18);
  return e ? `${base}….${e}` : `${name.slice(0, 18)}…`;
};
// -----------------------------------------

const NewslettersPage: React.FC = () => {
  const { user, initialLoading } = useUser();
  const [newsletters, setNewsletters] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const router = useRouter();

  // Permission flags
  const canView = !!user && hasPermission(user, [APP_PERMISSIONS.VIEW_NEWSLETTER]);
  const canCreate = !!user && hasPermission(user, [APP_PERMISSIONS.CREATE_NEWSLETTER]);
  const canEdit = !!user && hasPermission(user, [APP_PERMISSIONS.EDIT_NEWSLETTER]);
  const canDelete = !!user && hasPermission(user, [APP_PERMISSIONS.DELETE_NEWSLETTER]);

  useEffect(() => {
    if (initialLoading) return;

    if (!canView) {
      setLoading(false);
      setNewsletters([]);
      return;
    }

    const fetchNewsletters = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/newsletters");
        if (response.status === 200) {
          setNewsletters(response.data.newsletters);
        } else {
          message.error("Failed to fetch newsletters");
        }
      } catch (error: any) {
        if (error?.response?.status === 403) {
          message.warning("You do not have permission to view newsletters.");
        } else {
          message.error("An error occurred while fetching newsletters");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchNewsletters();
  }, [initialLoading, canView]);

  const filteredNewsletters = newsletters.filter((n) => {
    if (!searchText) return true;
    const searchLower = searchText.toLowerCase();
    if (typeof n.title === "string") {
      return n.title.toLowerCase().includes(searchLower);
    } else if (typeof n.title === "object" && n.title !== null) {
      return Object.values(n.title).some((val) =>
        (val as string)?.toLowerCase().includes(searchLower)
      );
    }
    return false;
  });

  const handleDelete = async (id: string) => {
    if (!canDelete) {
      message.warning("You do not have permission to delete newsletters.");
      return;
    }
    if (deletingIds.includes(id)) return;

    setDeletingIds((prev) => [...prev, id]);
    try {
      const response = await apiClient.delete(`/newsletters/${id}`);
      if (response.status === 200) {
        message.success("Newsletter deleted successfully");
        setNewsletters((prev) => prev.filter((n) => n._id !== id));
      } else {
        message.error("Failed to delete newsletter");
      }
    } catch (error: any) {
      if (error?.response?.status === 403) {
        message.warning("You do not have permission to delete newsletters.");
      } else {
        message.error("An error occurred while deleting the newsletter");
      }
    } finally {
      setDeletingIds((prev) => prev.filter((delId) => delId !== id));
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title: any, record: any) => {
        let displayTitle = "";
        if (typeof title === "string") {
          displayTitle = title;
        } else if (typeof title === "object" && title !== null) {
          displayTitle = title.en || "No Title";
        }
        const canOpen = canEdit || canView;
        return canOpen ? (
          <a onClick={() => router.push(`/dashboard/newsletters/${record._id}`)}>
            {displayTitle}
          </a>
        ) : (
          <span>{displayTitle}</span>
        );
      },
    },
    {
      title: "Attachments",
      dataIndex: "fileAttachments",
      key: "attachments",
      render: (attachments: any[]) => {
        if (!attachments || attachments.length === 0) {
          return "None";
        }
        return (
          <Space wrap>
            {attachments.map((att, idx) => {
              const name = att.fileName || "Unnamed";
              const size = att.size ? ` (${formatBytes(att.size)})` : "";
              const full = `${name}${size}`;
              return (
                <Tooltip key={idx} title={full}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "4px 10px",
                      borderRadius: 999,
                      background: "#f5f5f5",
                      border: "1px solid #eee",
                      fontSize: 12,
                      lineHeight: 1,
                      maxWidth: 180,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      cursor: "pointer",
                    }}
                  >
                    {fileIcon(name)}
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                      {shortName(name)}
                    </span>
                  </span>
                </Tooltip>
              );
            })}
          </Space>
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => new Date(createdAt).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="middle">
          {canEdit && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => router.push(`/dashboard/newsletters/${record._id}`)}
            >
              Edit
            </Button>
          )}
          {canDelete && (
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record._id)}
              loading={deletingIds.includes(record._id)}
            >
              Delete
            </Button>
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
        subTitle="You do not have permission to view newsletters."
      />
    );
  }

  return (
    <Card
      title="Newsletters Management"
      extra={
        canCreate ? (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push("/dashboard/newsletters/create")}
          >
            Create Newsletter
          </Button>
        ) : null
      }
      style={{ width: "100%", overflowX: "auto" }}
    >
      <Input
        placeholder="Search newsletters (by title)"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16, maxWidth: 300 }}
        disabled={!canView}
      />
      <Table
        columns={columns}
        dataSource={filteredNewsletters}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />
    </Card>
  );
};

export default NewslettersPage;
