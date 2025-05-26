"use client";

import React, { useEffect, useState, useCallback } from "react";
import { List, Input, Button, Spin, Alert, Typography, theme } from "antd";
import Link from "next/link";
import apiClient from "@/utils/api/apiClient";
import PageWrapper from "@/components/ui/PageWrapper";
import { useLanguage } from "@/hooks/useLanguage";
import {
  NEWSLETTER_PAGE_SETTINGS_KEYS,
  NEWSLETTER_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/NEWSLETTER_PAGE_SETTINGS";
import { INewsletterAPI } from "@/models/Newsletter";

const { Title, Paragraph } = Typography;
const { Search } = Input;

type NewsletterContentProps = {
  data: NEWSLETTER_PAGE_SETTINGS_TYPES;
};

const NewsletterContent: React.FC<NewsletterContentProps> = ({ data }) => {
  const { language } = useLanguage();
  const pageContent = data[NEWSLETTER_PAGE_SETTINGS_KEYS.PAGE_CONTENT];
  const newsletterSection = data[NEWSLETTER_PAGE_SETTINGS_KEYS.SECTIONS];

  const [newsletters, setNewsletters] = useState<INewsletterAPI[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const { token } = theme.useToken();

  const limit = newsletterSection?.maxNewslettersCount || 5;

  const fetchNewsletters = useCallback(
    async (reset: boolean = false) => {
      setLoading(true);
      try {
        const currentPage = reset ? 1 : page;
        const response = await apiClient.get(
          `/newsletters?search=${encodeURIComponent(
            searchText
          )}&page=${currentPage}&limit=${limit}`
        );
        if (
          response.status === 200 &&
          Array.isArray(response.data.newsletters)
        ) {
          const fetched = response.data.newsletters as INewsletterAPI[];
          setNewsletters((prev) => (reset ? fetched : [...prev, ...fetched]));
          setHasMore(response.data.hasMore);
          setPage(reset ? 2 : currentPage + 1);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        console.error("Error fetching newsletters:", err);
        setError("Failed to load newsletters.");
      } finally {
        setLoading(false);
      }
    },
    [searchText, page, limit]
  );

  useEffect(() => {
    fetchNewsletters(true);
  }, [searchText]);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const loadMore = () => {
    fetchNewsletters();
  };

  return (
    <PageWrapper pageContent={pageContent}>
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "40px 20px 80px",
        }}
      >
        <Search
          placeholder="Search newsletters..."
          enterButton="Search"
          size="large"
          onSearch={handleSearch}
          style={{
            marginBottom: 32,
            borderRadius: 8,
            overflow: "hidden",
          }}
        />

        {loading && newsletters.length === 0 ? (
          <Spin
            size="large"
            style={{ display: "block", margin: "40px auto" }}
          />
        ) : error ? (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: "40px" }}
          />
        ) : (
          <>
            <List
              grid={{ gutter: 24, column: 1 }}
              dataSource={newsletters}
              renderItem={(newsletter: INewsletterAPI) => {
                const title =
                  typeof newsletter.title === "string"
                    ? newsletter.title
                    : newsletter.title[language] ||
                      newsletter.title.en ||
                      "Untitled";

                return (
                  <List.Item>
                    <div
                      style={{
                        padding: "20px",
                        borderRadius: "10px",
                        boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                        border: "1px solid #222",
                        transition: "box-shadow 0.2s",
                      }}
                    >
                      <Title level={4} style={{ marginBottom: 12 }}>
                        <Link href={`/newsletters/${newsletter._id}`}>
                          {title}
                        </Link>
                      </Title>
                      <Paragraph style={{ color: token.colorTextSecondary }}>
                        Click to view newsletter details.
                      </Paragraph>
                    </div>
                  </List.Item>
                );
              }}
            />

            {hasMore && (
              <div style={{ textAlign: "center", marginTop: 32 }}>
                <Button type="primary" onClick={loadMore} disabled={loading}>
                  {loading ? "Loading..." : "Load More"}
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
