"use client";

import React from "react";
import { Card, Typography, Avatar } from "antd";
import { getTranslatedText } from "@/utils/getTranslatedText";
import {
  HOME_PAGE_SETTINGS_KEYS,
  HOME_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/HOME_PAGE_SETTINGS";
import CustomCarousel from "./CustomCarousel";

const { Text } = Typography;

type TestimonialsData =
  HOME_PAGE_SETTINGS_TYPES[typeof HOME_PAGE_SETTINGS_KEYS.TESTIMONIALS_SECTION];
type TestimonialItem = TestimonialsData["items"][number];

interface TestimonialsProps {
  data: TestimonialsData;
  language: string;
  slidesToShow?: number;
  dots?: boolean;
}

const CARD_HEIGHT = 360;
const COMMENT_LINES = 6;

const Testimonials: React.FC<TestimonialsProps> = ({
  data,
  language,
  slidesToShow = 3,
  dots = true,
}) => {
  const testimonials: TestimonialItem[] = Array.isArray(data?.items) ? data.items : [];
  if (testimonials.length === 0) return null;

  const show = Math.min(slidesToShow, Math.max(1, testimonials.length));

  return (
    <section style={{ maxWidth: 1600, margin: "0 auto" }}>
      <CustomCarousel
        slidesToShow={show}
        dots={dots}
        autoplay
        autoplaySpeed={4000}
        infinite
        arrowColor="rgba(0,0,0,0.65)"
        dotColor="#d9d9d9"
        dotActiveColor="#fa541c"
      >
        {testimonials.map((t, idx) => {
          const name = getTranslatedText(t.name, language) || "";
          const comment = getTranslatedText(t.comment, language) || "";
          const sub = [t.title, t.company].filter(Boolean).join(" · ");

          return (
            <div key={idx} style={{ height: CARD_HEIGHT, padding: 20, display: "flex" }}>
              <Card
                bordered={false}
                hoverable
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: 12,
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
                }}
              >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", marginBottom: 16, minWidth: 0 }}>
                  <Avatar size={48} src={t.avatar}>
                    {name?.charAt(0) || "?"}
                  </Avatar>
                  <div style={{ marginLeft: 12, minWidth: 0 }}>
                    <Text
                      strong
                      style={{
                        display: "block",
                        fontSize: 16,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "100%",
                      }}
                    >
                      {name}
                    </Text>
                    {sub && (
                      <Text
                        style={{
                          color: "#999",
                          fontSize: 13,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "100%",
                          display: "block",
                        }}
                      >
                        {sub}
                      </Text>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div style={{ flex: 1, minHeight: 0 }}>
                  <Text
                    style={{
                      fontStyle: "italic",
                      fontSize: 15,
                      color: "#555",
                      lineHeight: 1.6,
                      whiteSpace: "normal",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical" as any,
                      WebkitLineClamp: COMMENT_LINES as any,
                      overflow: "hidden",
                    }}
                  >
                    “{comment}”
                  </Text>
                </div>
              </Card>
            </div>
          );
        })}
      </CustomCarousel>
    </section>
  );
};

export default Testimonials;
