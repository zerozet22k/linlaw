"use client";

import React from "react";
import { Row, Col, Card, Image } from "antd";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import { DynamicIcon } from "@/config/navigations/IconMapper";
import { useLanguage } from "@/hooks/useLanguage";
import { getTranslatedText } from "@/utils/getTranslatedText";
import {
  SERVICES_PAGE_SETTINGS_KEYS,
  SERVICES_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/SERVICES_PAGE_SETTINGS";

type ServicesContentProps = {
  data: SERVICES_PAGE_SETTINGS_TYPES;
};

const ServicesContent: React.FC<ServicesContentProps> = ({ data }) => {
  const { language } = useLanguage();

  const pageContent = data[SERVICES_PAGE_SETTINGS_KEYS.PAGE_CONTENT] || {};
  const design = data[SERVICES_PAGE_SETTINGS_KEYS.DESIGN] || {};
  const typography = design.typography || {};
  const gridGutter = parseInt(design.gridGutter) || 16;
  const servicesSections = data[SERVICES_PAGE_SETTINGS_KEYS.SECTIONS] || [];
  const animationType = design.animation || "none";

  const getAnimationVariants = (animation: string) => {
    switch (animation) {
      case "fade-in":
        return { initial: { opacity: 0 }, animate: { opacity: 1 } };
      case "slide-up":
        return { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };
      case "scale-in":
        return { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } };
      default:
        return { initial: {}, animate: {} };
    }
  };

  const variants = getAnimationVariants(animationType);

  return (
    <PageWrapper pageContent={pageContent}>
      <Row gutter={[gridGutter, gridGutter]}>
        {servicesSections.map((service, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <motion.div
              initial={variants.initial}
              animate={variants.animate}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Card
                title={
                  <>
                    {design.showImages && service.image ? (
                      <Image
                        src={service.image}
                        alt={getTranslatedText(service.title, language)}
                        preview={false}
                        style={{ width: "24px", height: "24px" }}
                      />
                    ) : design.showIcons ? (
                      <DynamicIcon
                        name={service.icon}
                        style={{ color: service.iconColor, fontSize: "24px" }}
                      />
                    ) : null}
                    <span
                      style={{
                        marginLeft: "10px",
                        fontSize: typography.titleSize || "1.5em",
                        color: typography.color || "#333",
                      }}
                    >
                      {getTranslatedText(service.title, language)}
                    </span>
                  </>
                }
                bordered={false}
                style={{
                  padding: "20px",
                  borderRadius: design.borderRadius || "8px",
                  textAlign: design.textAlign || "center",
                  boxShadow:
                    design.cardStyle === "shadow"
                      ? "0px 6px 16px rgba(0, 0, 0, 0.12)"
                      : "none",
                }}
              >
                <p
                  style={{
                    fontSize: typography.descriptionSize || "16px",
                    color: typography.color || "#555",
                  }}
                >
                  {getTranslatedText(service.description, language)}
                </p>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    </PageWrapper>
  );
};

export default ServicesContent;
