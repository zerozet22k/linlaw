/* components/sections/AboutUsSection.tsx */
"use client";

import React from "react";
import { Row, Col, Card, theme } from "antd";
import { motion } from "framer-motion";
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

const variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

const getColSpan = (descLen: number, totalItems: number) => {
  if (totalItems <= 3) {
    const span = Math.floor(24 / Math.max(totalItems, 1));
    return { xs: 24, sm: span, md: span, lg: span };
  }
  if (descLen > 380) return { xs: 24, sm: 24, md: 24, lg: 24 };
  if (descLen > 250) return { xs: 24, sm: 24, md: 12, lg: 12 };
  return { xs: 24, sm: 12, md: 8, lg: 6 };
};

const AboutUsSection: React.FC<AboutUsSectionProps> = ({ data, language }) => {
  const { token } = theme.useToken();

  const items = Array.isArray(data?.items) ? data.items : [];
  if (items.length === 0) return null;

  return (
    <Row gutter={[24, 24]} justify="start" align="stretch">
      {items.map((item, idx) => {
        const desc = getTranslatedText(item.description, language) || "";
        const titleText = getTranslatedText(item.title, language) || "";
        const colSpan = getColSpan(desc.length, items.length);

        return (
          <Col key={`${titleText}-${idx}`} {...colSpan} style={{ display: "flex" }}>
            <motion.div
              initial={variants.initial}
              animate={variants.animate}
              transition={{ duration: 0.4 + idx * 0.08 }}
              style={{ width: "100%", height: "100%" }}
            >
              <Card
                bordered={false}
                hoverable
                style={{
                  borderRadius: 12,
                  boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                styles={{
                  body: {
                    padding: token.paddingLG,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    height: "100%",
                  },
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {item.icon && (
                    <DynamicIcon
                      name={item.icon}
                      style={{ color: token.colorPrimary, fontSize: 28 }}
                    />
                  )}
                  <span
                    style={{
                      marginLeft: 10,
                      fontSize: "1.3em",
                      fontWeight: 600,
                      color: token.colorText,
                    }}
                  >
                    {titleText}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: 15.5,
                    color: token.colorTextSecondary,
                    lineHeight: 1.75,
                    margin: 0,
                    whiteSpace: "pre-line",
                    flexGrow: 1,
                  }}
                >
                  {desc}
                </p>
              </Card>
            </motion.div>
          </Col>
        );
      })}
    </Row>
  );
};

export default AboutUsSection;
