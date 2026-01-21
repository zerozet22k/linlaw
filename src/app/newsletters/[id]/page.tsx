"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Alert,
  Button,
  Card,
  List,
  Skeleton,
  Space,
  Tag,
  Typography,
  theme,
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  DownloadOutlined,
  FileTextOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";

import apiClient from "@/utils/api/apiClient";
import { INewsletterAPI } from "@/models/Newsletter";
import { useLanguage } from "@/hooks/useLanguage";
import { getTranslatedText } from "@/utils/getTranslatedText";
import { commonTranslations } from "@/translations";

const { Title, Text, Paragraph } = Typography;

type Attachment = NonNullable<INewsletterAPI["fileAttachments"]>[number];

function formatDate(d?: string | number | Date) {
  if (!d) return "";
  try {
    const date = d instanceof Date ? d : new Date(d);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return "";
  }
}

function getFileExtension(fileName?: string) {
  if (!fileName) return "";
  const parts = fileName.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

function humanizeExt(ext: string) {
  if (!ext) return "";
  return ext.toUpperCase();
}

type AttachmentPreviewProps = {
  attachment: Attachment;
  onLoad?: () => void;
};

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
  attachment,
  onLoad,
}) => {
  const ext = getFileExtension(attachment.fileName);

  const frameStyle: React.CSSProperties = {
    width: "100%",
    height: "clamp(520px, 70vh, 860px)",
    border: "none",
    borderRadius: 12,
    background: "transparent",
  };

  if (ext === "pdf") {
    return (
      <iframe
        src={attachment.publicUrl}
        style={frameStyle}
        title={attachment.fileName}
        onLoad={onLoad}
      />
    );
  }

  if (ext === "docx" || ext === "doc") {
    // Google viewer works for public URLs
    const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
      attachment.publicUrl
    )}&embedded=true`;

    return (
      <iframe
        src={viewerUrl}
        style={frameStyle}
        title={attachment.fileName}
        onLoad={onLoad}
      />
    );
  }

  return (
    <div>
      <Paragraph style={{ marginBottom: 8 }}>
        Preview isn’t available for this file type.
      </Paragraph>
      <Button
        type="primary"
        icon={<DownloadOutlined />}
        href={attachment.publicUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Download
      </Button>
    </div>
  );
};

const NewsletterDetail: React.FC = () => {
  const router = useRouter();
  const params = useParams<{ id: string | string[] }>();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const { language } = useLanguage();
  const { token } = theme.useToken();

  const [newsletter, setNewsletter] = useState<INewsletterAPI | null>(null);
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [previewLoading, setPreviewLoading] = useState(false);
  const reqIdRef = useRef(0);

  const tLoading =
    getTranslatedText(commonTranslations.loading, language) || "Loading...";
  const tError = getTranslatedText(commonTranslations.error, language) || "Error";
  const tNoData =
    getTranslatedText(commonTranslations.noData, language) || "No Data";
  const tBack = getTranslatedText(commonTranslations.back, language) || "Back";
  const tDownload =
    getTranslatedText(commonTranslations.download, language) || "Download";
  const tEmpty =
    getTranslatedText(commonTranslations.empty, language) ||
    "No attachments available.";

  const fetchNewsletter = useCallback(async () => {
    if (!id) return;

    const reqId = ++reqIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/newsletters/${id}`);
      if (reqId !== reqIdRef.current) return;

      if (response.status === 200 && response.data) {
        const data = response.data as INewsletterAPI;
        setNewsletter(data);

        const first = Array.isArray(data.fileAttachments) ? data.fileAttachments[0] : null;
        setSelectedAttachment(first ?? null);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (err) {
      if (reqId !== reqIdRef.current) return;
      console.error("Error fetching newsletter:", err);
      setError("Failed to load newsletter.");
    } finally {
      if (reqId !== reqIdRef.current) return;
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchNewsletter();
  }, [fetchNewsletter]);

  // When switching attachments, show skeleton until iframe loads.
  useEffect(() => {
    if (!selectedAttachment) return;
    const ext = getFileExtension(selectedAttachment.fileName);
    // only show loading for iframe-able previews
    if (ext === "pdf" || ext === "doc" || ext === "docx") setPreviewLoading(true);
    else setPreviewLoading(false);
  }, [selectedAttachment]);

  const attachments = useMemo<Attachment[]>(
    () => (Array.isArray(newsletter?.fileAttachments) ? newsletter!.fileAttachments : []),
    [newsletter]
  );

  const newsletterTitle = useMemo(() => {
    if (!newsletter) return "";
    if (typeof newsletter.title === "string") return newsletter.title;
    return (
      getTranslatedText(newsletter.title as any, language) ||
      (newsletter.title as any)?.en ||
      "Untitled"
    );
  }, [newsletter, language]);

  const metaDate = formatDate((newsletter as any)?.createdAt);
  const metaAttachments = attachments.length;

  if (loading) {
    return (
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
        <Card
          variant="outlined"
          style={{
            borderRadius: token.borderRadiusLG,
            borderColor: token.colorBorderSecondary,
          }}
          styles={{ body: { padding: token.paddingLG } }}
        >
          <Skeleton active title paragraph={{ rows: 6 }} />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message={tError}
        description={error}
        type="error"
        showIcon
        style={{ margin: "40px auto", maxWidth: 900 }}
      />
    );
  }

  if (!newsletter) {
    return <Paragraph style={{ textAlign: "center" }}>{tNoData}</Paragraph>;
  }

  const selectedExt = selectedAttachment ? getFileExtension(selectedAttachment.fileName) : "";

  return (
    <div style={{ width: "100%", margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Page header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: token.sizeLG,
            flexWrap: "wrap",
            marginBottom: token.marginLG,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <Title level={3} style={{ margin: 0, lineHeight: 1.2 }}>
              {newsletterTitle}
            </Title>

            <div
              style={{
                marginTop: 8,
                display: "flex",
                gap: token.sizeMD,
                alignItems: "center",
                flexWrap: "wrap",
                color: token.colorTextSecondary,
                fontSize: 13,
              }}
            >
              {metaDate && (
                <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                  <CalendarOutlined /> {metaDate}
                </span>
              )}
              <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                <PaperClipOutlined /> {metaAttachments}
              </span>
            </div>
          </div>

          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
              {tBack}
            </Button>

            {selectedAttachment && (
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                href={selectedAttachment.publicUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {tDownload}
              </Button>
            )}
          </Space>
        </div>

        {/* Content */}
        {attachments.length === 0 ? (
          <Card
            variant="outlined"
            style={{
              borderRadius: token.borderRadiusLG,
              borderColor: token.colorBorderSecondary,
            }}
            styles={{ body: { padding: token.paddingLG } }}
          >
            <Paragraph style={{ margin: 0 }}>{tEmpty}</Paragraph>
          </Card>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: attachments.length > 1 ? "320px 1fr" : "1fr",
              gap: token.sizeLG,
              alignItems: "start",
            }}
          >
            {attachments.length > 1 && (
              <Card
                variant="outlined"
                style={{
                  borderRadius: token.borderRadiusLG,
                  borderColor: token.colorBorderSecondary,
                  position: "sticky",
                  top: 90,
                }}
                styles={{ body: { padding: token.paddingMD } }}
              >
                <Text strong style={{ display: "block", marginBottom: 10 }}>
                  Attachments
                </Text>

                <List
                  dataSource={attachments}
                  split={false}
                  renderItem={(att) => {
                    const active = selectedAttachment?._id === att._id;
                    const ext = getFileExtension(att.fileName);

                    return (
                      <List.Item
                        onClick={() => setSelectedAttachment(att)}
                        style={{
                          cursor: "pointer",
                          borderRadius: 12,
                          padding: "10px 12px",
                          marginBottom: 8,
                          background: active ? token.colorFillSecondary : "transparent",
                          border: `1px solid ${active ? token.colorPrimaryBorder : "transparent"
                            }`,
                          transition: "background 150ms ease, border-color 150ms ease",
                        }}
                      >
                        <div style={{ display: "flex", gap: 10, width: "100%", minWidth: 0 }}>
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 10,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: token.colorFillTertiary,
                              flex: "0 0 auto",
                            }}
                          >
                            <FileTextOutlined />
                          </div>

                          <div style={{ minWidth: 0, flex: 1 }}>
                            <Text
                              style={{
                                display: "block",
                                fontWeight: active ? 600 : 500,
                              }}
                              ellipsis
                            >
                              {att.fileName}
                            </Text>

                            <div
                              style={{
                                display: "flex",
                                gap: 8,
                                alignItems: "center",
                                marginTop: 4,
                                color: token.colorTextTertiary,
                                fontSize: 12,
                              }}
                            >
                              {ext && <Tag style={{ marginInlineEnd: 0 }}>{humanizeExt(ext)}</Tag>}
                              {active && (
                                <Text style={{ fontSize: 12, color: token.colorPrimary }}>
                                  Selected
                                </Text>
                              )}
                            </div>
                          </div>
                        </div>
                      </List.Item>
                    );
                  }}
                />
              </Card>
            )}

            <Card
              variant="outlined"
              style={{
                borderRadius: token.borderRadiusLG,
                borderColor: token.colorBorderSecondary,
              }}
              styles={{ body: { padding: token.paddingLG } }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: token.sizeMD,
                  marginBottom: token.marginMD,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <Text strong style={{ fontSize: 16 }} ellipsis>
                    {selectedAttachment?.fileName ?? "Preview"}
                  </Text>
                </div>

                {selectedExt ? <Tag>{humanizeExt(selectedExt)}</Tag> : null}
              </div>

              <div style={{ position: "relative" }}>
                {previewLoading && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      zIndex: 1,
                      borderRadius: 12,
                      background: token.colorBgContainer,
                    }}
                  >
                    <Skeleton active title={false} paragraph={{ rows: 10 }} />
                  </div>
                )}

                {selectedAttachment && (
                  <div style={{ opacity: previewLoading ? 0 : 1, transition: "opacity 160ms ease" }}>
                    <AttachmentPreview
                      attachment={selectedAttachment}
                      onLoad={() => setPreviewLoading(false)}
                    />
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsletterDetail;
