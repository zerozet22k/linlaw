"use client";

import React, { useEffect, useState } from "react";
import { Typography, Spin, Alert } from "antd";
import Link from "next/link";
import { getTranslatedText } from "@/utils/getTranslatedText";
import { useLanguage } from "@/hooks/useLanguage";
import { INewsletterAPI } from "@/models/Newsletter";
import apiClient from "@/utils/api/apiClient";
import { newsletterTranslations } from "@/translations";

const { Paragraph, Text } = Typography;

const NewsletterSection: React.FC = () => {
  const { language } = useLanguage();
  const [newsletters, setNewsletters] = useState<INewsletterAPI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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

  const translatedTitle =
    getTranslatedText(newsletterTranslations.title, language) ||
    "Our Newsletters";
  const translatedSubtitle = getTranslatedText(
    newsletterTranslations.subtitle,
    language
  );
  const translatedViewAll =
    getTranslatedText(newsletterTranslations.viewAll, language) ||
    "View all newsletters";

  return (
    <section style={{ padding: "60px 20px", width: "100%" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h2 style={{ fontSize: "2.25em", fontWeight: 600, color: "#222" }}>
          {translatedTitle}
        </h2>
        {translatedSubtitle && (
          <Text type="secondary" style={{ fontSize: 16 }}>
            {translatedSubtitle}
          </Text>
        )}
      </div>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "24px auto" }} />
      ) : error ? (
        <Alert message="Error" description={error} type="error" showIcon />
      ) : (
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {newsletters.map((item) => {
            const title =
              typeof item.title === "string"
                ? item.title
                : item.title[language] || item.title.en || "Untitled";

            return (
              <Paragraph
                key={item._id}
                style={{
                  marginBottom: 0,
                  fontSize: 15,
                  fontWeight: 500,
                  lineHeight: 1.6,
                }}
              >
                <Link href={`/newsletters/${item._id}`}>{title}</Link>
              </Paragraph>
            );
          })}

          <Paragraph style={{ textAlign: "center", marginTop: 16 }}>
            <Link href="/newsletters">{translatedViewAll}</Link>
          </Paragraph>
        </div>
      )}
    </section>
  );
};

export default NewsletterSection;
