"use client";

import React, { useMemo } from "react";
import { Card, Typography, Avatar, theme } from "antd";
import { getTranslatedText } from "@/utils/getTranslatedText";
import {
  HOME_PAGE_SETTINGS_KEYS,
  HOME_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/HOME_PAGE_SETTINGS";
import CustomCarousel from "./CustomCarousel";

const { Text } = Typography;
const { useToken } = theme;

type TestimonialsData =
  HOME_PAGE_SETTINGS_TYPES[typeof HOME_PAGE_SETTINGS_KEYS.TESTIMONIALS_SECTION];
type TestimonialItem = TestimonialsData["items"][number];

interface TestimonialsProps {
  data: TestimonialsData;
  language: string;
  slidesToShow?: number;
  dots?: boolean;
}

const COMMENT_LINES = 7;

const pickInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";

// Stable empty array reference (prevents new [] every render)
const EMPTY_ITEMS: TestimonialItem[] = [];

const Testimonials: React.FC<TestimonialsProps> = ({
  data,
  language,
  slidesToShow = 3,
  dots = true,
}) => {
  const { token } = useToken();

  const raw: TestimonialItem[] = Array.isArray(data?.items) ? data.items : EMPTY_ITEMS;

  const items = useMemo(() => {
    return raw.map((t, idx) => {
      const name = (getTranslatedText(t.name, language) || "").trim();
      const comment = (getTranslatedText(t.comment, language) || "").trim();

      const title = typeof (t as any).title === "string" ? (t as any).title.trim() : "";
      const company =
        typeof (t as any).company === "string" ? (t as any).company.trim() : "";

      const sub = [title, company].filter(Boolean).join(" · ");
      const avatar = (t as any).avatar as string | undefined;

      const id = (t as any)._id ?? (t as any).id; // prefer stable ids if present

      return {
        key: String(id ?? idx), // NEVER Math.random() for React keys
        name: name || "Anonymous",
        comment: comment || "—",
        sub,
        avatar,
      };
    });
  }, [raw, language]);

  // Early return AFTER hooks
  if (items.length === 0) return null;

  const show = Math.min(slidesToShow, Math.max(1, items.length));
  const contentMax = 1600;

  return (
    <section style={{ maxWidth: contentMax, margin: "0 auto", width: "100%" }}>
      <CustomCarousel
        slidesToShow={show}
        dots={dots}
        autoplay
        autoplaySpeed={5200}
        infinite
        arrowColor={token.colorTextSecondary}
        dotColor={token.colorBorderSecondary}
        dotActiveColor={token.colorPrimary}
      >
        {items.map((t) => (
          <div
            key={t.key}
            style={{
              padding: 16,
              display: "flex",
              height: "100%",
            }}
          >
            <Card
              bordered
              className="tsCard"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: token.borderRadiusLG,
                borderColor: token.colorBorderSecondary,
                background: token.colorBgContainer,
                overflow: "hidden",
              }}
              styles={{
                body: {
                  padding: token.paddingLG,
                  display: "flex",
                  flexDirection: "column",
                  gap: token.sizeMD,
                  minHeight: 270,
                },
              }}
            >
              <div
                aria-hidden
                style={{
                  height: 3,
                  width: 54,
                  borderRadius: 999,
                  background: token.colorPrimary,
                  opacity: 0.9,
                  marginBottom: 6,
                }}
              />

              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                <div className="tsAvatarWrap" aria-hidden>
                  <Avatar
                    size={48}
                    src={t.avatar}
                    style={{
                      background: token.colorFillSecondary,
                      color: token.colorText,
                      fontWeight: 800,
                    }}
                  >
                    {pickInitials(t.name)}
                  </Avatar>
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <Text
                    strong
                    style={{
                      display: "block",
                      fontSize: 16,
                      lineHeight: 1.25,
                      color: token.colorText,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {t.name}
                  </Text>

                  {!!t.sub && (
                    <Text
                      style={{
                        display: "block",
                        marginTop: 4,
                        color: token.colorTextSecondary,
                        fontSize: 13,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {t.sub}
                    </Text>
                  )}
                </div>
              </div>

              <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: -8,
                    left: -4,
                    fontSize: 44,
                    lineHeight: "44px",
                    fontWeight: 900,
                    color: token.colorFillSecondary,
                    userSelect: "none",
                  }}
                >
                  “
                </span>

                <Text
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical" as any,
                    WebkitLineClamp: COMMENT_LINES as any,
                    overflow: "hidden",
                    fontSize: 15,
                    lineHeight: 1.75,
                    color: token.colorTextSecondary,
                    paddingLeft: 18,
                    paddingTop: 8,
                    whiteSpace: "normal",
                  }}
                >
                  {t.comment}
                </Text>
              </div>

              <div
                aria-hidden
                style={{
                  height: 1,
                  width: "100%",
                  background: token.colorSplit,
                  marginTop: 2,
                  opacity: 0.9,
                }}
              />

              <Text style={{ color: token.colorTextTertiary, fontSize: 12.5 }}>
                Verified client feedback
              </Text>
            </Card>
          </div>
        ))}
      </CustomCarousel>

      <style jsx global>{`
        .tsCard.ant-card {
          box-shadow: 0 10px 28px rgba(15, 23, 42, 0.06);
          transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
          will-change: transform;
        }

        @media (hover: hover) and (pointer: fine) {
          .tsCard.ant-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 18px 46px rgba(15, 23, 42, 0.1);
            border-color: rgba(15, 23, 42, 0.18);
          }
        }

        .tsCard.ant-card:focus-visible {
          outline: none;
          box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.12);
        }

        .tsAvatarWrap {
          border-radius: 999px;
          padding: 2px;
          background: linear-gradient(
            135deg,
            rgba(15, 23, 42, 0.12),
            rgba(15, 23, 42, 0.06)
          );
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
