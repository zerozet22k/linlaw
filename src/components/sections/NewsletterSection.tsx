"use client";

import React, { useEffect, useState } from "react";
import { Typography, Spin, Alert, Empty, Card } from "antd";
import Link from "next/link";
import { ArrowRightOutlined } from "@ant-design/icons";
import { getTranslatedText } from "@/utils/getTranslatedText";
import { useLanguage } from "@/hooks/useLanguage";
import { INewsletterAPI } from "@/models/Newsletter";
import apiClient from "@/utils/api/apiClient";
import { commonTranslations, titleTranslations } from "@/translations";

const { Title, Text } = Typography;

const NewsletterSection: React.FC = () => {
  const { language } = useLanguage();
  const [newsletters, setNewsletters] = useState<INewsletterAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const response = await apiClient.get(
          `/newsletters?search=&page=1&limit=5`
        );
        if (
          response.status === 200 &&
          Array.isArray(response.data.newsletters)
        ) {
          setNewsletters(response.data.newsletters);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Newsletter fetch error:", err);
        setError("Failed to load newsletters.");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletters();
  }, []);

  // pull in your titles/subtitles
  const translatedTitle =
    getTranslatedText(titleTranslations.newsletterTitle, language) ||
    "Our Newsletters";
  const translatedSubtitle =
    getTranslatedText(titleTranslations.newsletterSubtitle, language) || "";

  // read-more and view-all
  const translatedReadMore =
    getTranslatedText(commonTranslations.readMore, language) || "Read More";
  const translatedViewAll =
    getTranslatedText(commonTranslations.viewAll, language) ||
    "View all newsletters";

  return (
    <section style={{ padding: "60px 20px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Title level={2} style={{ fontSize: "2.25em", marginBottom: 8 }}>
            {translatedTitle}
          </Title>
          {translatedSubtitle && (
            <Text type="secondary" style={{ fontSize: 16 }}>
              {translatedSubtitle}
            </Text>
          )}
        </div>

        {loading ? (
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
            style={{ maxWidth: 600, margin: "0 auto" }}
          />
        ) : newsletters.length === 0 ? (
          <Empty
            description="No newsletters found."
            style={{ marginTop: 40 }}
          />
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 20,
              }}
            >
              {newsletters.map((item) => {
                const title =
                  typeof item.title === "string"
                    ? item.title
                    : item.title[language] || item.title.en || "Untitled";

                return (
                  <Link
                    key={item._id}
                    href={`/newsletters/${item._id}`}
                    passHref
                  >
                    <Card
                      hoverable
                      bordered={false}
                      style={{
                        borderRadius: 10,
                        boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
                        padding: 16,
                        height: "100%",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <Title
                        level={5}
                        style={{
                          marginBottom: 12,
                          fontSize: "1.1em",
                          color: "#222",
                        }}
                      >
                        {title}
                      </Title>
                      <Text type="secondary" style={{ fontSize: 14 }}>
                        {translatedReadMore} <ArrowRightOutlined />
                      </Text>
                    </Card>
                  </Link>
                );
              })}
            </div>

            <div style={{ textAlign: "center", marginTop: 40 }}>
              <Link
                href="/newsletters"
                style={{
                  fontWeight: 500,
                  fontSize: 16,
                  color: "#1677ff",
                  textDecoration: "none",
                }}
              >
                <span style={{ borderBottom: "1px solid transparent" }}>
                  {translatedViewAll}
                </span>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default NewsletterSection;
