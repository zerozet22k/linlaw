"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert, Button, Card, List, Skeleton, Space, Tag, Typography, theme } from "antd";
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
import { t } from "@/i18n";
import type { LanguageJson } from "@/i18n/types";
import { getFileExtension, humanizeExt } from "@/utils/filesUtil";
import { formatDate } from "@/utils/timeUtil";

const { Title, Text, Paragraph } = Typography;

type Attachment = NonNullable<INewsletterAPI["fileAttachments"]>[number];

type AttachmentPreviewProps = {
  lang: string;
  attachment: Attachment;
  onLoad?: () => void;
};

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({ lang, attachment, onLoad }) => {
  const ext = getFileExtension(attachment.fileName);

  const frameStyle: React.CSSProperties = {
    width: "100%",
    height: "clamp(520px, 70vh, 860px)",
    border: "none",
    borderRadius: 12,
    background: "transparent",
  };

  if (ext === "pdf") {
    return <iframe src={attachment.publicUrl} style={frameStyle} title={attachment.fileName} onLoad={onLoad} />;
  }

  if (ext === "docx" || ext === "doc") {
    const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(attachment.publicUrl)}&embedded=true`;
    return <iframe src={viewerUrl} style={frameStyle} title={attachment.fileName} onLoad={onLoad} />;
  }

  const tNoPreview = t(lang, "newsletter.noPreview");
  const tDownload = t(lang, "common.download");

  return (
    <div>
      <Paragraph style={{ marginBottom: 8 }}>{tNoPreview}</Paragraph>
      <Button type="primary" icon={<DownloadOutlined />} href={attachment.publicUrl} target="_blank" rel="noopener noreferrer">
        {tDownload}
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
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);

  const [loading, setLoading] = useState(true);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const [previewLoading, setPreviewLoading] = useState(false);
  const reqIdRef = useRef(0);

  const tError = useMemo(() => t(language, "common.error"), [language]);
  const tNoData = useMemo(() => t(language, "common.noData"), [language]);
  const tBack = useMemo(() => t(language, "common.back"), [language]);
  const tDownload = useMemo(() => t(language, "common.download"), [language]);

  const tEmpty = useMemo(() => t(language, "newsletter.emptyAttachments"), [language]);
  const tAttachments = useMemo(() => t(language, "newsletter.attachments"), [language]);
  const tSelected = useMemo(() => t(language, "newsletter.selected"), [language]);
  const tPreview = useMemo(() => t(language, "newsletter.preview"), [language]);
  const tFailedToLoad = useMemo(() => t(language, "newsletter.failedToLoad"), [language]);
  const tUntitled = useMemo(() => t(language, "newsletter.untitled"), [language]);

  const fetchNewsletter = useCallback(async () => {
    if (!id) return;

    const reqId = ++reqIdRef.current;
    setLoading(true);
    setErrorCode(null);

    try {
      const response = await apiClient.get(`/newsletters/${id}`);
      if (reqId !== reqIdRef.current) return;

      if (response.status === 200 && response.data) {
        const data = response.data as INewsletterAPI;
        setNewsletter(data);

        const first = Array.isArray(data.fileAttachments) ? data.fileAttachments[0] : null;
        setSelectedAttachment(first ?? null);
      } else {
        setErrorCode("failedToLoad");
      }
    } catch (err) {
      if (reqId !== reqIdRef.current) return;
      console.error("Error fetching newsletter:", err);
      setErrorCode("failedToLoad");
    } finally {
      if (reqId !== reqIdRef.current) return;
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchNewsletter();
  }, [fetchNewsletter]);

  useEffect(() => {
    if (!selectedAttachment) return;
    const ext = getFileExtension(selectedAttachment.fileName);
    if (ext === "pdf" || ext === "doc" || ext === "docx") setPreviewLoading(true);
    else setPreviewLoading(false);
  }, [selectedAttachment]);

  const attachments = useMemo<Attachment[]>(
    () => (Array.isArray(newsletter?.fileAttachments) ? newsletter!.fileAttachments : []),
    [newsletter]
  );

  const newsletterTitle = useMemo(() => {
    if (!newsletter) return "";
    const raw = newsletter.title as unknown as string | LanguageJson | undefined;
    return t(language, raw, tUntitled).trim();
  }, [newsletter, language, tUntitled]);

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

  if (errorCode) {
    const desc = errorCode === "failedToLoad" ? tFailedToLoad : String(errorCode);
    return (
      <Alert
        message={tError}
        description={desc}
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
              <Button type="primary" icon={<DownloadOutlined />} href={selectedAttachment.publicUrl} target="_blank" rel="noopener noreferrer">
                {tDownload}
              </Button>
            )}
          </Space>
        </div>

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
                  {tAttachments}
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
                          border: `1px solid ${active ? token.colorPrimaryBorder : "transparent"}`,
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
                                  {tSelected}
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
                    {selectedAttachment?.fileName ?? tPreview}
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
                    <AttachmentPreview lang={language} attachment={selectedAttachment} onLoad={() => setPreviewLoading(false)} />
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
