/* components/sections/AboutUsSection.tsx */
"use client";

import React from "react";
import { Row, Col, Card, theme } from "antd";
import { motion, useReducedMotion } from "framer-motion";
import { DynamicIcon } from "@/config/navigations/IconMapper";
import { getTranslatedText } from "@/utils/getTranslatedText";
import {
  HOME_PAGE_SETTINGS_KEYS as K,
  HOME_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/HOME_PAGE_SETTINGS";

type AboutData = HOME_PAGE_SETTINGS_TYPES[typeof K.ABOUT_US_SECTION];

type AboutUsSectionProps = {
  data: AboutData;
  language: string;
};

const getColSpan = (descLen: number, totalItems: number) => {
  const count = Math.max(1, totalItems);

  if (count <= 3) {
    const span = Math.floor(24 / count);
    return { xs: 24, sm: span, md: span, lg: span };
  }
  if (descLen > 420) return { xs: 24, sm: 24, md: 24, lg: 24 };
  if (descLen > 260) return { xs: 24, sm: 24, md: 12, lg: 12 };
  return { xs: 24, sm: 12, md: 8, lg: 6 };
};

const AboutUsSection: React.FC<AboutUsSectionProps> = ({ data, language }) => {
  const { token } = theme.useToken();
  const reduceMotion = useReducedMotion();

  const items = Array.isArray((data as any)?.items) ? (data as any).items : [];
  if (items.length === 0) return null;

  const baseShadow =
    (token as any).boxShadowSecondary || "0 8px 24px rgba(0,0,0,0.06)";
  const hoverShadow =
    (token as any).boxShadowTertiary || "0 14px 40px rgba(0,0,0,0.10)";

  return (
    <Row gutter={[24, 24]} justify="start" align="stretch">
      {items.map((item: any, idx: number) => {
        const titleText = (getTranslatedText(item.title, language) || "").trim();
        const desc = (getTranslatedText(item.description, language) || "").trim();

        if (!titleText && !desc) return null;

        const colSpan = getColSpan(desc.length, items.length);
        const key = item._id || item.id || `${titleText}-${idx}`;
        const accentColor = item.iconColor || token.colorPrimary;

        return (
          <Col key={key} {...colSpan} style={{ display: "flex" }}>
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.42, ease: "easeOut", delay: idx * 0.06 }}
              whileHover={reduceMotion ? {} : { y: -4 }}
              style={{ width: "100%", height: "100%" }}
            >
              <Card
                bordered={false}
                hoverable
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: token.borderRadiusLG,
                  background: token.colorBgContainer,
                  border: `1px solid ${token.colorBorderSecondary}`,
                  boxShadow: baseShadow,
                  overflow: "hidden",
                  transition: "box-shadow 180ms ease, transform 180ms ease",
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = hoverShadow;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = baseShadow;
                }}
                styles={{
                  body: {
                    padding: token.paddingLG,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  },
                }}
              >
                {/* top accent */}
                <div
                  aria-hidden
                  style={{
                    height: 3,
                    width: "100%",
                    background: accentColor,
                    borderRadius: 999,
                    opacity: 0.85,
                  }}
                />

                {/* header */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: token.colorFillTertiary,
                      border: `1px solid ${token.colorBorderSecondary}`,
                      flex: "0 0 auto",
                    }}
                  >
                    {item.icon ? (
                      <DynamicIcon
                        name={item.icon}
                        style={{
                          color: accentColor,
                          fontSize: 22,
                          lineHeight: 1,
                        }}
                      />
                    ) : null}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 650,
                        color: token.colorText,
                        lineHeight: 1.2,
                        marginTop: 2,
                      }}
                    >
                      {titleText}
                    </div>
                  </div>
                </div>

                {/* body */}
                {desc && (
                  <p
                    style={{
                      margin: 0,
                      color: token.colorTextSecondary,
                      fontSize: 15.5,
                      lineHeight: 1.75,
                      whiteSpace: "pre-line",
                      flexGrow: 1,
                    }}
                  >
                    {desc}
                  </p>
                )}
              </Card>
            </motion.div>
          </Col>
        );
      })}
    </Row>
  );
};

export default AboutUsSection;
