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

type ServiceItem = {
  title: LanguageJson;
  description: LanguageJson;
  icon?: string;
  iconColor?: string;
};

type ServicesSectionProps = {
  section: {
    title?: LanguageJson;
    description?: LanguageJson;
    items: ServiceItem[];
  };
  language: string;
};

const variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

const ServicesSection: React.FC<ServicesSectionProps> = ({
  section,
  language,
}) => {
  const { items = [], title, description } = section || {};

  if (!items || items.length === 0) return null;

  const translatedTitle = getTranslatedText(title, language) || "Our Services";
  const translatedDescription = getTranslatedText(description, language);

  return (
    <section style={sectionOuterStyle}>
      <div style={sectionWrapperStyle}>
        <h2 style={sectionTitleStyle}>{translatedTitle}</h2>
        {translatedDescription && (
          <p style={sectionDescriptionStyle}>{translatedDescription}</p>
        )}
      </div>

      <Row gutter={[24, 24]} justify="center">
        {items.map((service, index) => {
          const descLength =
            getTranslatedText(service.description, language)?.length || 0;

          const isLong = descLength > 150;
          const colSpan = isLong
            ? { xs: 24, sm: 24, md: 12, lg: 12 }
            : { xs: 24, sm: 12, md: 8, lg: 6 };

          return (
            <Col {...colSpan} key={index} style={{ display: "flex" }}>
              <motion.div
                initial={variants.initial}
                animate={variants.animate}
                transition={{ duration: 0.5 + index * 0.1, ease: "easeOut" }}
                style={{ width: "100%" }}
              >
                <Card
                  bordered={false}
                  hoverable
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    borderRadius: "10px",
                    boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.08)",
                    padding: 20,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 16,
                    }}
                  >
                    {service.icon && (
                      <DynamicIcon
                        name={service.icon}
                        style={{
                          color: service.iconColor || "#1677ff",
                          fontSize: 28,
                        }}
                      />
                    )}
                    <span
                      style={{
                        marginLeft: 10,
                        fontSize: "1.3em",
                        fontWeight: 600,
                        color: "#333",
                      }}
                    >
                      {getTranslatedText(service.title, language)}
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: "15px",
                      color: "#666",
                      lineHeight: 1.6,
                      flexGrow: 1,
                    }}
                  >
                    {getTranslatedText(service.description, language)}
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

export default ServicesSection;
