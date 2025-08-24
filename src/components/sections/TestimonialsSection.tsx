"use client";

import React from "react";
import { Card, Typography, Avatar } from "antd";
import { getTranslatedText } from "@/utils/getTranslatedText";
import { useLanguage } from "@/hooks/useLanguage";
import {
  HOME_PAGE_SETTINGS_KEYS,
  HOME_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/HOME_PAGE_SETTINGS";

const { Text } = Typography;

type TestimonialsData =
  HOME_PAGE_SETTINGS_TYPES[typeof HOME_PAGE_SETTINGS_KEYS.TESTIMONIALS_SECTION];
type TestimonialItem = TestimonialsData["items"][number];

interface TestimonialsProps {
  data: TestimonialsData;
  language: string;
}

const Testimonials: React.FC<TestimonialsProps> = ({ data, language }) => {


  const testimonials: TestimonialItem[] = Array.isArray(data?.items)
    ? data.items
    : [];

  if (testimonials.length === 0) return null;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 24,
        maxWidth: 1080,
        margin: "0 auto",
      }}
    >
      {testimonials.map((t, idx) => {
        const name = getTranslatedText(t.name, language) || "";
        const comment = getTranslatedText(t.comment, language) || "";
        const sub = [t.title, t.company].filter(Boolean).join(" · ");

        return (
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Avatar size={48} src={t.avatar}>
                {name?.charAt(0) || "?"}
              </Avatar>
              <div style={{ marginLeft: 12 }}>
                <Text strong style={{ display: "block", fontSize: 16 }}>
                  {name}
                </Text>
                {sub && (
                  <Text style={{ color: "#999", fontSize: 13 }}>{sub}</Text>
                )}
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
                  whiteSpace: "pre-line",
                }}
              >
                “{comment}”
              </Text>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default Testimonials;
