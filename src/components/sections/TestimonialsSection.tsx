"use client";

import React from "react";
import { Card, Typography, Avatar } from "antd";
import { getTranslatedText } from "@/utils/getTranslatedText";
import { useLanguage } from "@/hooks/useLanguage";
import { LanguageJson } from "@/utils/getTranslatedText";

const { Title, Text } = Typography;

interface TestimonialItem {
  name: LanguageJson;
  comment: LanguageJson;
  title?: string;
  company?: string;
  avatar?: string;
}

interface TestimonialsProps {
  section: {
    title?: LanguageJson;
    testimonials: TestimonialItem[];
  };
}

const Testimonials: React.FC<TestimonialsProps> = ({ section }) => {
  const { language } = useLanguage();
  const { title, testimonials = [] } = section || {};

  if (!testimonials.length) return null;

  const translatedTitle = getTranslatedText(title, language) || "Our Customers";

  return (
    <section
      style={{
        width: "100%",
        padding: "60px 20px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <Title
          level={2}
          style={{ fontSize: "2.25em", fontWeight: 600, color: "#2c3e50" }}
        >
          {translatedTitle}
        </Title>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 24,
          maxWidth: 1080,
          margin: "0 auto",
        }}
      >
        {testimonials.map((t, idx) => (
          <Card
            key={idx}
            bordered={false}
            hoverable
            style={{
              height: "100%",
              borderRadius: 12,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
              <Avatar size={48} src={t.avatar} />
              <div style={{ marginLeft: 12 }}>
                <Text strong style={{ display: "block", fontSize: 16 }}>
                  {getTranslatedText(t.name, language)}
                </Text>
                <Text style={{ color: "#999", fontSize: 13 }}>
                  {t.title}{t.company ? ` , ${t.company}` : ""}
                </Text>
              </div>
            </div>

            <div style={{ flexGrow: 1 }}>
              <Text
                style={{
                  fontStyle: "italic",
                  fontSize: 15,
                  color: "#555",
                  lineHeight: 1.6,
                  display: "block",
                }}
              >
                “{getTranslatedText(t.comment, language)}”
              </Text>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
