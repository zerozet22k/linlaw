"use client";

import React, { useMemo } from "react";
import { Card, Typography, Avatar, theme, Grid } from "antd";
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

const EMPTY_ITEMS: TestimonialItem[] = [];

const Testimonials: React.FC<TestimonialsProps> = ({
  data,
  language,
  slidesToShow = 3,
  dots = true,
}) => {
  const { token } = useToken();
  const screens = Grid.useBreakpoint();

  // Make the array reference stable
  const raw = useMemo<TestimonialItem[]>(
    () => (Array.isArray(data?.items) ? data.items : EMPTY_ITEMS),
    [data?.items]
  );

  const items = useMemo(() => {
    return raw.map((t, idx) => {
      const name = (getTranslatedText(t.name, language) || "").trim();
      const comment = (getTranslatedText(t.comment, language) || "").trim();

      const title =
        typeof (t as any).title === "string" ? (t as any).title.trim() : "";
      const company =
        typeof (t as any).company === "string" ? (t as any).company.trim() : "";

      const sub = [title, company].filter(Boolean).join(" · ");
      const avatar = (t as any).avatar as string | undefined;

      const id = (t as any)._id ?? (t as any).id;

      return {
        key: String(id ?? idx),
        name: name || "Anonymous",
        comment: comment || "—",
        sub,
        avatar,
      };
    });
  }, [raw, language]);

  // ✅ Hook must be before any early return
  const responsiveSlides = useMemo(() => {
    if (!screens.sm) return 1;
    if (!screens.md) return 2;
    return slidesToShow;
  }, [screens.sm, screens.md, slidesToShow]);

  // Now you can early-return safely
  if (items.length === 0) return null;

  const show = Math.min(responsiveSlides, Math.max(1, items.length));

  const contentMax = 1400;

  const sectionPadInline = !screens.sm ? 12 : token.paddingLG;
  const slidePad = !screens.sm ? 14 : !screens.md ? 18 : 22;
  const cardBodyPad = !screens.sm ? token.paddingMD : token.paddingLG;
  const cardMinHeight = !screens.sm ? 240 : !screens.md ? 260 : 280;

  const clampChars = !screens.sm ? 260 : 340;

  const softShadow = "none";

  return (
    <section
      style={{
        maxWidth: contentMax,
        margin: "0 auto",
        width: "100%",
        paddingInline: sectionPadInline,
        boxSizing: "border-box",
      }}
    >
      <CustomCarousel
        slidesToShow={show}
        dots={dots}
        autoplay
        autoplaySpeed={5200}
        infinite={items.length > show}
        arrowColor={token.colorTextSecondary}
        dotColor={token.colorBorderSecondary}
        dotActiveColor={token.colorPrimary}
        paddingTop={!screens.sm ? 6 : 10}
        paddingBottom={!screens.sm ? 8 : 10}
        paddingInline={0}
      >
        {items.map((t) => {
          const commentDisplay =
            t.comment.length > clampChars
              ? t.comment.slice(0, clampChars).trimEnd() + "…"
              : t.comment;

          return (
            <div
              key={t.key}
              className="tsSlide"
              style={{
                padding: slidePad,
                display: "flex",
                height: "100%",
                width: "100%",
                boxSizing: "border-box",
                alignItems: "stretch",
              }}
            >
              <Card
                variant="outlined"
                className="tsCard"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: token.borderRadiusLG,
                  background: token.colorBgContainer,
                  border: `1px solid ${token.colorBorderSecondary}`,
                  boxShadow: softShadow,
                  overflow: "hidden",
                  minHeight: cardMinHeight,
                  display: "flex",
                  flexDirection: "column",
                  outline: "6px solid transparent",
                  backgroundClip: "padding-box",
                }}
                styles={{
                  body: {
                    padding: cardBodyPad,
                    display: "flex",
                    flexDirection: "column",
                    gap: token.sizeMD,
                    height: "100%",
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
                    flex: "0 0 auto",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    minWidth: 0,
                    flex: "0 0 auto",
                  }}
                >
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
                      title={t.name}
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
                        title={t.sub}
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
                      overflowWrap: "anywhere",
                      wordBreak: "break-word",
                      hyphens: "auto",
                    }}
                    title={t.comment}
                  >
                    {commentDisplay}
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
                    flex: "0 0 auto",
                  }}
                />

                <Text
                  style={{
                    color: token.colorTextTertiary,
                    fontSize: 12.5,
                    flex: "0 0 auto",
                  }}
                >
                  Verified client feedback
                </Text>
              </Card>
            </div>
          );
        })}
      </CustomCarousel>

      <style jsx global>{`
        .tsCard.ant-card {
          transition: box-shadow 160ms ease, border-color 160ms ease;
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
