/* components/sections/NewsletterSection.tsx */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Typography,
  Alert,
  Empty,
  Card,
  Skeleton,
  theme,
  Button,
  Grid,
} from "antd";
import Link from "next/link";
import {
  ArrowRightOutlined,
  CalendarOutlined,
  PaperClipOutlined,
  FileTextOutlined,
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
  language: string;
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

function resolveLocalized(val: any, language: string): string {
  if (!val) return "";
  if (typeof val === "string") return val.trim();
  if (typeof val === "object") {
    return String(val?.[language] ?? val?.en ?? "").trim();
  }
  return "";
}

function extractPreview(item: any, language: string): string {
  // Try common fields. If none exist, return empty (we'll hide preview block).
  const candidates = [
    item?.excerpt,
    item?.summary,
    item?.description,
    item?.content,
    item?.body,
  ];

  for (const c of candidates) {
    const v = resolveLocalized(c, language);
    if (v) return v;
  }
  return "";
}

function clampText(s: string, max = 140) {
  const t = (s || "").replace(/\s+/g, " ").trim();
  if (!t) return "";
  return t.length > max ? `${t.slice(0, max).trim()}…` : t;
}

const NewsletterSection: React.FC<Props> = ({ data, language }) => {
  const { token } = useToken();
  const screens = Grid.useBreakpoint();
  const isMdUp = !!screens.md;

  const [newsletters, setNewsletters] = useState<INewsletterAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await apiClient.get(`/newsletters?search=&page=1&limit=6`);
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
    getTranslatedText(commonTranslations.viewAll, language) || "View all";

  const sorted = useMemo(() => {
    const arr = Array.isArray(newsletters) ? [...newsletters] : [];
    arr.sort((a, b) => {
      const ad = a?.createdAt ? new Date(a.createdAt as any).getTime() : 0;
      const bd = b?.createdAt ? new Date(b.createdAt as any).getTime() : 0;
      return bd - ad;
    });
    return arr;
  }, [newsletters]);

  const featured = sorted[0];
  const rest = sorted.slice(1, isMdUp ? 5 : 4);

  const containerStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 1200,
    margin: "0 auto",
  };

  const layoutStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMdUp ? "1.35fr 0.65fr" : "1fr",
    gap: token.sizeLG,
    alignItems: "stretch",
  };

  const softBorder = `1px solid ${token.colorBorderSecondary}`;
  const softShadow = (token as any).boxShadowSecondary || "0 10px 26px rgba(0,0,0,0.08)";

  const chipStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 10px",
    borderRadius: 999,
    border: softBorder,
    background: token.colorFillQuaternary,
    color: token.colorTextSecondary,
    fontSize: 12.5,
    lineHeight: 1,
    whiteSpace: "nowrap",
  };

  const featuredCardStyle: React.CSSProperties = {
    borderRadius: token.borderRadiusLG,
    border: softBorder,
    background: token.colorBgContainer,
    overflow: "hidden",
    height: "100%",
    transition: "transform 160ms ease, box-shadow 160ms ease",
  };

  const featuredTopStyle: React.CSSProperties = {
    padding: token.paddingLG,
    background: `linear-gradient(135deg, ${token.colorFillTertiary}, ${token.colorBgContainer})`,
    borderBottom: softBorder,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: token.sizeMD,
  };

  const listWrapStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: token.sizeSM,
    height: "100%",
  };

  const listItemStyle: React.CSSProperties = {
    borderRadius: token.borderRadiusLG,
    border: softBorder,
    background: token.colorBgContainer,
    overflow: "hidden",
    transition: "transform 160ms ease, box-shadow 160ms ease",
  };

  if (!loading && !error && sorted.length === 0) return null;

  if (loading) {
    return (
      <div data-component="NewsletterSection" aria-busy="true" style={containerStyle}>
        <div style={layoutStyle}>
          <Card bordered={false} style={featuredCardStyle} styles={{ body: { padding: 0 } }}>
            <div style={featuredTopStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <FileTextOutlined style={{ fontSize: 18, color: token.colorPrimary }} />
                <Text style={{ fontWeight: 700, color: token.colorText }}>Latest Newsletter</Text>
              </div>
              <span style={{ ...chipStyle, opacity: 0.6 }}>
                <CalendarOutlined /> —
              </span>
            </div>
            <div style={{ padding: token.paddingLG }}>
              <Skeleton active title paragraph={{ rows: 3 }} />
              <div style={{ marginTop: token.marginMD, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <span style={{ ...chipStyle, opacity: 0.6 }}>
                  <PaperClipOutlined /> —
                </span>
              </div>
            </div>
          </Card>

          <div style={listWrapStyle}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Card
                key={i}
                bordered={false}
                style={listItemStyle}
                styles={{ body: { padding: token.paddingMD } }}
              >
                <Skeleton active title={{ width: "70%" }} paragraph={{ rows: 1 }} />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div data-component="NewsletterSection" aria-busy="false" style={containerStyle}>
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ borderRadius: token.borderRadiusLG }}
        />
      </div>
    );
  }

  if (!featured) {
    return (
      <div data-component="NewsletterSection" aria-busy="false" style={containerStyle}>
        <Empty description="No newsletters found." />
      </div>
    );
  }

  const featuredTitle = resolveLocalized((featured as any).title, language) || "Untitled";
  const featuredDate = formatDate((featured as any).createdAt);
  const featuredFiles = Array.isArray((featured as any).fileAttachments)
    ? (featured as any).fileAttachments.length
    : 0;
  const featuredPreview = clampText(extractPreview(featured, language), 220);

  return (
    <div data-component="NewsletterSection" aria-busy="false" style={containerStyle}>
      <div style={layoutStyle}>
        {/* Featured */}
        <Link
          href={`/newsletters/${(featured as any)._id}`}
          style={{ textDecoration: "none", display: "block", height: "100%" }}
          aria-label={`Open newsletter: ${featuredTitle}`}
        >
          <Card
            bordered={false}
            style={featuredCardStyle}
            styles={{ body: { padding: 0, height: "100%" } }}
            hoverable
            onMouseEnter={(e) => {
              (e.currentTarget as any).style.transform = "translateY(-2px)";
              (e.currentTarget as any).style.boxShadow = softShadow;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as any).style.transform = "";
              (e.currentTarget as any).style.boxShadow = "";
            }}
          >
            <div style={featuredTopStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <FileTextOutlined style={{ fontSize: 18, color: token.colorPrimary }} />
                <Text
                  style={{
                    fontWeight: 800,
                    color: token.colorText,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100%",
                  }}
                >
                  Featured
                </Text>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
                {featuredDate && (
                  <span style={chipStyle}>
                    <CalendarOutlined /> {featuredDate}
                  </span>
                )}
                {featuredFiles > 0 && (
                  <span style={chipStyle}>
                    <PaperClipOutlined /> {featuredFiles}
                  </span>
                )}
              </div>
            </div>

            <div style={{ padding: token.paddingLG }}>
              <Title
                level={4}
                style={{
                  margin: 0,
                  marginBottom: token.marginSM,
                  lineHeight: 1.2,
                  color: token.colorText,
                }}
              >
                {featuredTitle}
              </Title>

              {featuredPreview && (
                <Text
                  style={{
                    display: "block",
                    color: token.colorTextSecondary,
                    fontSize: 15,
                    lineHeight: 1.7,
                    marginBottom: token.marginLG,
                  }}
                >
                  {featuredPreview}
                </Text>
              )}

              <Button type="primary" icon={<ArrowRightOutlined />} size="large">
                {tReadMore}
              </Button>
            </div>
          </Card>
        </Link>

        {/* Latest list */}
        <div style={listWrapStyle}>
          {rest.length === 0 ? (
            <Card bordered={false} style={listItemStyle} styles={{ body: { padding: token.paddingLG } }}>
              <Text style={{ color: token.colorTextSecondary }}>No more newsletters.</Text>
            </Card>
          ) : (
            rest.map((item) => {
              const id = (item as any)._id;
              const title = resolveLocalized((item as any).title, language) || "Untitled";
              const created = formatDate((item as any).createdAt);
              const files = Array.isArray((item as any).fileAttachments)
                ? (item as any).fileAttachments.length
                : 0;

              return (
                <Link
                  key={id}
                  href={`/newsletters/${id}`}
                  style={{ textDecoration: "none", display: "block" }}
                  aria-label={`Open newsletter: ${title}`}
                >
                  <Card
                    bordered={false}
                    style={listItemStyle}
                    styles={{ body: { padding: token.paddingMD } }}
                    hoverable
                    onMouseEnter={(e) => {
                      (e.currentTarget as any).style.transform = "translateY(-1px)";
                      (e.currentTarget as any).style.boxShadow = softShadow;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as any).style.transform = "";
                      (e.currentTarget as any).style.boxShadow = "";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ minWidth: 0 }}>
                        <Text
                          style={{
                            display: "block",
                            fontWeight: 700,
                            color: token.colorText,
                            fontSize: 14.5,
                            lineHeight: 1.25,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%",
                          }}
                        >
                          {title}
                        </Text>

                        <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                          {created && (
                            <span style={{ ...chipStyle, padding: "5px 9px", fontSize: 12 }}>
                              <CalendarOutlined /> {created}
                            </span>
                          )}
                          {files > 0 && (
                            <span style={{ ...chipStyle, padding: "5px 9px", fontSize: 12 }}>
                              <PaperClipOutlined /> {files}
                            </span>
                          )}
                        </div>
                      </div>

                      <ArrowRightOutlined style={{ color: token.colorTextTertiary, marginTop: 4 }} />
                    </div>
                  </Card>
                </Link>
              );
            })
          )}

          <div style={{ marginTop: "auto", paddingTop: token.paddingSM }}>
            <Link href="/newsletters" style={{ textDecoration: "none" }}>
              <Button
                block
                size="large"
                type="default"
                icon={<ArrowRightOutlined />}
                style={{
                  borderRadius: token.borderRadiusLG,
                  border: softBorder,
                  fontWeight: 700,
                }}
              >
                {tViewAll}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSection;
