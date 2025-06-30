"use client";

import React from "react";
import { Row, Col } from "antd";
import RelatedBusiness from "./RelatedBusiness";
import {
  HOME_PAGE_SETTINGS_TYPES,
  HOME_PAGE_SETTINGS_KEYS,
} from "@/config/CMS/pages/keys/HOME_PAGE_SETTINGS";
import { getTranslatedText } from "@/utils/getTranslatedText";
import { useLanguage } from "@/hooks/useLanguage";
import { commonTranslations } from "@/translations";

const RelatedBusinesses: React.FC<{
  cards?: HOME_PAGE_SETTINGS_TYPES[typeof HOME_PAGE_SETTINGS_KEYS.ADS];
}> = ({ cards = [] }) => {
  const { language } = useLanguage();

  return (
    <section style={{ padding: "40px 20px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2
          style={{
            textAlign: "center",
            fontSize: "28px",
            fontWeight: "bold",
            marginBottom: "16px",
            color: "#333",
          }}
        >
          {getTranslatedText(commonTranslations.relatedBusinessTitle, language)}
        </h2>
        <Row gutter={[24, 24]} justify="center">
          {cards.length > 0 ? (
            cards.map((ad, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6}>
                <RelatedBusiness ad={ad} />
              </Col>
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                fontSize: "16px",
                color: "gray",
                width: "100%",
                minHeight: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {getTranslatedText(commonTranslations.noAds, language)}
            </div>
          )}
        </Row>
      </div>
    </section>
  );
};

export default RelatedBusinesses;
