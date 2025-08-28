/* components/sections/NewsletterSection.tsx */
"use client";

import React, { useEffect, useState } from "react";
import { Typography, Alert, Empty, Card, Skeleton, theme } from "antd";
import Link from "next/link";
import {
  ArrowRightOutlined,
  CalendarOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { getTranslatedText } from "@/utils/getTranslatedText";
import { INewsletterAPI } from "@/models/Newsletter";
import apiClient from "@/utils/api/apiClient";
import { commonTranslations } from "@/translations";
import {
  HOME_PAGE_SETTINGS_KEYS as K,
  HOME_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/HOME_PAGE_SETTINGS";

const { Title, Text } = Typography;
const { useToken } = theme;

type NewsletterData = HOME_PAGE_SETTINGS_TYPES[typeof K.NEWSLETTER_SECTION];

type Props = {
  data?: NewsletterData;
  language: string; // still used for UI strings only
};

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

const NewsletterSection: React.FC<Props> = ({ data, language }) => {
  const { token } = useToken();

  const [newsletters, setNewsletters] = useState<INewsletterAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await apiClient.get(`/newsletters?search=&page=1&limit=5`);
        const list = Array.isArray(res?.data?.newsletters)
          ? (res.data.newsletters as INewsletterAPI[])
          : [];
        if (mounted) setNewsletters(list);
      } catch (e) {
        console.error("Newsletter fetch error:", e);
        if (mounted) setError("Failed to load newsletters.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const tReadMore =
    getTranslatedText(commonTranslations.readMore, language) || "Read More";
  const tViewAll =
    getTranslatedText(commonTranslations.viewAll, language) ||
    "View all newsletters";

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: token.sizeLG,
  };

  let content: React.ReactNode;

  if (loading) {
    content = (
      <div style={gridStyle}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card
            key={i}
            bordered
            hoverable={false}
            style={{
              borderRadius: token.borderRadiusLG,
              borderColor: token.colorBorderSecondary,
              boxShadow: "none",
              background: token.colorBgContainer,
            }}
            styles={{ body: { padding: token.paddingLG } }}
          >
            <Skeleton active title paragraph={{ rows: 2 }} />
          </Card>
        ))}
      </div>
    );
  } else if (error) {
    content = (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        style={{ maxWidth: 600, margin: "0 auto" }}
      />
    );
  } else if (newsletters.length === 0) {
    content = (
      <Empty
        description="No newsletters found."
        style={{ marginTop: token.marginXL }}
      />
    );
  } else {
    content = (
      <>
        <div style={gridStyle}>
          {newsletters.map((item) => {
            const title =
              typeof item.title === "string"
                ? item.title
                : item.title?.[language] || item.title?.en || "Untitled";

            const created = formatDate(item.createdAt);
            const files = Array.isArray(item.fileAttachments)
              ? item.fileAttachments.length
              : 0;

            return (
              <Link
                key={item._id}
                href={`/newsletters/${item._id}`}
                style={{ textDecoration: "none", display: "block" }}
                aria-label={`Open newsletter: ${title}`}
              >
                <Card
                  bordered
                  hoverable
                  style={{
                    borderRadius: token.borderRadiusLG,
                    borderColor: token.colorBorderSecondary,
                    boxShadow: "none",
                    background: token.colorBgContainer,
                    height: "100%",
                  }}
                  styles={{ body: { padding: token.paddingLG } }}
                >
                  <Title
                    level={5}
                    style={{
                      marginBottom: token.marginXS,
                      color: token.colorText,
                    }}
                  >
                    {title}
                  </Title>

                  <div
                    style={{
                      display: "flex",
                      gap: token.sizeLG,
                      alignItems: "center",
                      color: token.colorTextTertiary,
                      fontSize: 13,
                      marginBottom: token.marginSM,
                    }}
                  >
                    {created && (
                      <span>
                        <CalendarOutlined /> {created}
                      </span>
                    )}
                    {files > 0 && (
                      <span>
                        <PaperClipOutlined /> {files}
                      </span>
                    )}
                  </div>

                  <Text type="secondary" style={{ fontSize: 14 }}>
                    {tReadMore} <ArrowRightOutlined />
                  </Text>
                </Card>
              </Link>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: token.marginXL }}>
          <Link
            href="/newsletters"
            style={{
              fontWeight: 500,
              fontSize: 16,
              color: token.colorPrimary,
              textDecoration: "none",
            }}
          >
            {tViewAll}
          </Link>
        </div>
      </>
    );
  }

  return (
    <div
      data-component="NewsletterSection"
      aria-busy={loading ? "true" : "false"}
      style={{ width: "100%" }}
    >
      {content}
    </div>
  );
};

export default NewsletterSection;
