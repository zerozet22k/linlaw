"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Alert,
  Button,
  Card,
  Empty,
  Input,
  Skeleton,
  Typography,
  theme,
} from "antd";
import Link from "next/link";
import {
  ArrowRightOutlined,
  CalendarOutlined,
  PaperClipOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import apiClient from "@/utils/api/apiClient";
import PageWrapper from "@/components/ui/PageWrapper";
import { useLanguage } from "@/hooks/useLanguage";

import {
  NEWSLETTER_PAGE_SETTINGS_KEYS,
  NEWSLETTER_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/NEWSLETTER_PAGE_SETTINGS";
import { INewsletterAPI } from "@/models/Newsletter";
import { commonTranslations } from "@/translations";
import { getTranslatedText } from "@/utils/getTranslatedText";

const { Title, Text } = Typography;

type NewsletterContentProps = {
  data: NEWSLETTER_PAGE_SETTINGS_TYPES;
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

const NewsletterContent: React.FC<NewsletterContentProps> = ({ data }) => {
  const { language } = useLanguage();
  const { token } = theme.useToken();

  const pageContent = data[NEWSLETTER_PAGE_SETTINGS_KEYS.PAGE_CONTENT];
  const newsletterSection = data[NEWSLETTER_PAGE_SETTINGS_KEYS.SECTIONS];
  const limit = newsletterSection?.maxNewslettersCount || 6;

  const [newsletters, setNewsletters] = useState<INewsletterAPI[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // type-to-search (debounced) + Enter applies immediately
  const [queryDraft, setQueryDraft] = useState("");
  const [searchText, setSearchText] = useState("");

  const reqIdRef = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => setSearchText(queryDraft.trim()), 300);
    return () => clearTimeout(t);
  }, [queryDraft]);

  const tSearch = getTranslatedText(commonTranslations.search, language) || "Search";
  const tLoadMore = getTranslatedText(commonTranslations.loadMore, language) || "Load more";
  const tLoading = getTranslatedText(commonTranslations.loading, language) || "Loading...";
  const tError = getTranslatedText(commonTranslations.error, language) || "Error";
  const tNoData =
    getTranslatedText(commonTranslations.noData, language) || "No newsletters found.";
  const tClickToView =
    getTranslatedText(commonTranslations.clickToView, language) || "Click to view";

  const fetchNewsletters = useCallback(
    async (opts?: { reset?: boolean }) => {
      const reset = !!opts?.reset;
      const currentPage = reset ? 1 : page;

      const reqId = ++reqIdRef.current;
      if (reset) setLoading(true);
      else setLoadingMore(true);

      setError(null);

      try {
        const response = await apiClient.get(
          `/newsletters?search=${encodeURIComponent(searchText)}&page=${currentPage}&limit=${limit}`
        );

        if (reqId !== reqIdRef.current) return;

        if (response.status === 200 && Array.isArray(response.data?.newsletters)) {
          const fetched = response.data.newsletters as INewsletterAPI[];
          setNewsletters((prev) => (reset ? fetched : [...prev, ...fetched]));
          setHasMore(!!response.data?.hasMore);
          setPage(reset ? 2 : currentPage + 1);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        if (reqId !== reqIdRef.current) return;
        console.error("Error fetching newsletters:", err);
        setError("Failed to load newsletters.");
      } finally {
        if (reqId !== reqIdRef.current) return;
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [searchText, page, limit]
  );

  useEffect(() => {
    fetchNewsletters({ reset: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  const countLabel = useMemo(() => {
    const n = newsletters.length;
    if (loading && n === 0) return "";
    return `${n}`;
  }, [newsletters.length, loading]);

  const contentWidth = 860;

  const listStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: token.sizeLG,
  };

  const itemShadow = "0 10px 26px rgba(15, 23, 42, 0.06)";
  const itemHoverShadow = "0 18px 44px rgba(15, 23, 42, 0.10)";

  return (
    <PageWrapper pageContent={pageContent}>
      <div
        style={{
          maxWidth: contentWidth,
          margin: "0 auto",
          padding: `${token.paddingXL}px ${token.paddingLG}px ${token.paddingXL}px`,
        }}
      >
        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            gap: token.sizeMD,
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: token.marginLG,
          }}
        >
          <Input
            value={queryDraft}
            onChange={(e) => setQueryDraft(e.target.value)}
            onPressEnter={() => setSearchText(queryDraft.trim())}
            allowClear
            prefix={<SearchOutlined />}
            placeholder={`${tSearch} newsletters...`}
            size="large"
            style={{
              flex: "1 1 520px",
              borderRadius: token.borderRadiusLG,
            }}
          />

          <Text style={{ color: token.colorTextTertiary, fontSize: 13 }}>
            {countLabel ? `${countLabel} results` : ""}
          </Text>
        </div>

        {/* Content */}
        {error ? (
          <Alert
            message={tError}
            description={error}
            type="error"
            showIcon
            style={{ borderRadius: token.borderRadiusLG }}
          />
        ) : loading && newsletters.length === 0 ? (
          <div style={listStyle}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Card
                key={i}
                bordered
                style={{
                  borderRadius: token.borderRadiusLG,
                  borderColor: token.colorBorderSecondary,
                }}
                styles={{ body: { padding: token.paddingLG } }}
              >
                <Skeleton active title paragraph={{ rows: 2 }} />
              </Card>
            ))}
          </div>
        ) : newsletters.length === 0 ? (
          <Empty description={tNoData} style={{ padding: `${token.paddingXL}px 0` }} />
        ) : (
          <>
            <div style={listStyle}>
              {newsletters.map((n) => {
                const title =
                  typeof n.title === "string"
                    ? n.title
                    : n.title?.[language] || n.title?.en || "Untitled";

                const created = formatDate((n as any).createdAt);
                const files = Array.isArray((n as any).fileAttachments)
                  ? (n as any).fileAttachments.length
                  : 0;

                return (
                  <Link
                    key={n._id}
                    href={`/newsletters/${n._id}`}
                    style={{ textDecoration: "none", display: "block" }}
                    aria-label={`Open newsletter: ${title}`}
                  >
                    <Card
                      bordered
                      hoverable
                      style={{
                        borderRadius: token.borderRadiusLG,
                        borderColor: token.colorBorderSecondary,
                        background: token.colorBgContainer,
                        boxShadow: itemShadow,
                        transition: "box-shadow 180ms ease, transform 180ms ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.boxShadow = itemHoverShadow;
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.boxShadow = itemShadow;
                        (e.currentTarget as HTMLElement).style.transform = "translateY(0px)";
                      }}
                      styles={{ body: { padding: token.paddingLG } }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: token.sizeLG }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Title
                            level={5}
                            style={{
                              margin: 0,
                              color: token.colorText,
                              lineHeight: 1.25,
                            }}
                          >
                            {title}
                          </Title>

                          <div
                            style={{
                              display: "flex",
                              gap: token.sizeLG,
                              alignItems: "center",
                              marginTop: 10,
                              color: token.colorTextTertiary,
                              fontSize: 13,
                              flexWrap: "wrap",
                            }}
                          >
                            {created ? (
                              <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                                <CalendarOutlined /> {created}
                              </span>
                            ) : null}

                            {files > 0 ? (
                              <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                                <PaperClipOutlined /> {files}
                              </span>
                            ) : null}

                            <Text type="secondary" style={{ fontSize: 13 }}>
                              {tClickToView}
                            </Text>
                          </div>
                        </div>

                        <span style={{ color: token.colorPrimary, fontSize: 14, whiteSpace: "nowrap" }}>
                          View <ArrowRightOutlined />
                        </span>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {hasMore && (
              <div style={{ marginTop: token.marginXL, textAlign: "center" }}>
                <Button
                  size="large"
                  type="primary"
                  onClick={() => fetchNewsletters({ reset: false })}
                  loading={loadingMore}
                  disabled={loading}
                  style={{
                    borderRadius: token.borderRadiusLG,
                    paddingInline: token.paddingXL,
                  }}
                >
                  {loadingMore ? tLoading : tLoadMore}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
};

export default NewsletterContent;
