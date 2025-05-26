"use client";

import React, { useEffect, useState } from "react";
import { Card, Typography, Spin, Alert } from "antd";
import Link from "next/link";
import { getTranslatedText } from "@/utils/getTranslatedText";
import { useLanguage } from "@/hooks/useLanguage";
import { INewsletterAPI } from "@/models/Newsletter";
import apiClient from "@/utils/api/apiClient";
import { newsletterTitle, newsletterViewAllTranslations } from "@/translations";

const { Paragraph } = Typography;

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

  return (
    <Card
      title={getTranslatedText(newsletterTitle, language)}
      bordered={false}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "10px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        padding: 0,
      }}
      bodyStyle={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "24px auto" }} />
      ) : error ? (
        <Alert message="Error" description={error} type="error" showIcon />
      ) : (
        <>
          <div
            style={{
              flex: 1,
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
                    fontSize: 14,
                    fontWeight: 500,
                    lineHeight: 1.5,
                  }}
                >
                  <Link href={`/newsletters/${item._id}`}>{title}</Link>
                </Paragraph>
              );
            })}
          </div>

          <Paragraph style={{ textAlign: "center", marginTop: 16 }}>
            <Link href="/newsletters">
              {getTranslatedText(newsletterViewAllTranslations, language)}
            </Link>
          </Paragraph>
        </>
      )}
    </Card>
  );
};

export default NewsletterSection;
