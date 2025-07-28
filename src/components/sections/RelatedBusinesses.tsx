"use client";

import React from "react";
import { Row, Col } from "antd";
import RelatedBusiness from "./RelatedBusiness";
import { motion } from "framer-motion";
import { getTranslatedText } from "@/utils/getTranslatedText";
import { useLanguage } from "@/hooks/useLanguage";
import {
  HOME_PAGE_SETTINGS_KEYS,
  HOME_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/HOME_PAGE_SETTINGS";

type RelatedBusinessSection =
  HOME_PAGE_SETTINGS_TYPES[typeof HOME_PAGE_SETTINGS_KEYS.RELATED_BUSINESS];

type RelatedBusinessesProps = {
  section: RelatedBusinessSection;
};

const variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

const RelatedBusinesses: React.FC<RelatedBusinessesProps> = ({ section }) => {
  const { language } = useLanguage();

  const title =
    getTranslatedText(section.title ?? undefined, language) ||
    "Related Businesses";
  const description = getTranslatedText(
    section.description ?? undefined,
    language
  );
  const items = Array.isArray(section.items) ? section.items : [];

  if (items.length === 0) return null;

  return (
    <section style={{ padding: "60px 20px", width: "100%" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: "2.25em", fontWeight: 600, color: "#222" }}>
            {title}
          </h2>
          {description && (
            <p
              style={{
                fontSize: 16,
                color: "#555",
                marginTop: 8,
                maxWidth: 720,
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              {description}
            </p>
          )}
        </div>

        <Row gutter={[24, 24]} justify="center">
          {items.map((business, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6}>
              <motion.div
                initial={variants.initial}
                animate={variants.animate}
                transition={{ duration: 0.4 + index * 0.1 }}
              >
                <RelatedBusiness business={business ?? undefined} />
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default RelatedBusinesses;
