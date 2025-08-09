"use client";

import React from "react";
import { Row, Col, Card } from "antd";
import { motion } from "framer-motion";
import { DynamicIcon } from "@/config/navigations/IconMapper";
import { getTranslatedText, LanguageJson } from "@/utils/getTranslatedText";
import {
  sectionTitleStyle,
  sectionDescriptionStyle,
  sectionWrapperStyle,
  sectionOuterStyle,
} from "./sectionStyles";

export type AboutUsSectionItem = {
  title: LanguageJson;
  description: LanguageJson;
  icon?: string;
};

type AboutUsSectionProps = {
  section: {
    title?: LanguageJson;
    description?: LanguageJson;
    items: AboutUsSectionItem[];
  };
  language: string;
};

const variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

const getColSpan = (descLen: number, totalItems: number) => {
  if (totalItems <= 3) {
    const span = Math.floor(24 / totalItems);
    return { xs: 24, sm: span, md: span };
  }
  if (descLen > 380) return { xs: 24, sm: 24, md: 24 };
  if (descLen > 250) return { xs: 24, sm: 24, md: 12 };
  return { xs: 24, sm: 12, md: 8 };
};

const AboutUsSection: React.FC<AboutUsSectionProps> = ({
  section,
  language,
}) => {
  const items = section.items || [];
  if (!items.length) return null;

  const title = getTranslatedText(section.title, language) || "About Us";
  const description = getTranslatedText(section.description, language) || "";

  return (
    <section style={sectionOuterStyle}>
      <div style={sectionWrapperStyle}>
        <h2 style={sectionTitleStyle}>{title}</h2>
        {description && (
          <p
            style={{
              ...sectionDescriptionStyle,
              maxWidth: 720,
              margin: "0 auto",
            }}
          >
            {description}
          </p>
        )}
      </div>

      <Row gutter={[24, 24]} justify="start" align="top">
        {items.map((item, idx) => {
          const desc = getTranslatedText(item.description, language) || "";
          const titleText = getTranslatedText(item.title, language) || "";
          const colSpan = getColSpan(desc.length, items.length);

          return (
            <Col key={idx} {...colSpan}>
              <motion.div
                initial={variants.initial}
                animate={variants.animate}
                transition={{ duration: 0.4 + idx * 0.08 }}
              >
                <Card
                  bordered={false}
                  hoverable
                  style={{
                    borderRadius: "12px",
                    boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
                    padding: "24px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 16,
                    }}
                  >
                    {item.icon && (
                      <DynamicIcon
                        name={item.icon}
                        style={{ color: "#1677ff", fontSize: 28 }}
                      />
                    )}
                    <span
                      style={{
                        marginLeft: 10,
                        fontSize: "1.3em",
                        fontWeight: 600,
                        color: "#222",
                      }}
                    >
                      {titleText}
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: "15.5px",
                      color: "#444",
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
    </section>
  );
};

export default AboutUsSection;
