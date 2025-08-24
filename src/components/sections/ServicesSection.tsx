/* components/sections/ServicesSection.tsx */
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

type ServicesData = HOME_PAGE_SETTINGS_TYPES[typeof K.SERVICES_SECTION];

type ServicesSectionProps = {
  data: ServicesData;
  language: string;
};

const variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

const ServicesSection: React.FC<ServicesSectionProps> = ({ data, language }) => {
  const { token } = theme.useToken();

  const items = Array.isArray(data?.items) ? data.items : [];
  if (items.length === 0) return null;

  return (
    <Row gutter={[24, 24]} justify="center">
      {items.map((service, index) => {
        const title = getTranslatedText(service.title, language) || "";
        const desc = getTranslatedText(service.description, language) || "";

        const isLong = desc.length > 150;
        const colSpan = isLong
          ? { xs: 24, sm: 24, md: 12, lg: 12 }
          : { xs: 24, sm: 12, md: 8, lg: 6 };

        return (
          <Col {...colSpan} key={`${title}-${index}`} style={{ display: "flex" }}>
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
                  borderRadius: 12,
                  boxShadow: "0 6px 18px rgba(0, 0, 0, 0.08)",
                }}
                styles={{ body: { padding: token.paddingLG } }}
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
                        color: service.iconColor || token.colorPrimary,
                        fontSize: 28,
                      }}
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
                    {title}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: 15,
                    color: token.colorTextSecondary,
                    lineHeight: 1.6,
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

export default ServicesSection;
