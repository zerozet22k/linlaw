"use client";

import React from "react";
import { Card, Typography, Divider } from "antd";
import { PhoneOutlined } from "@ant-design/icons";
import { getTranslatedText } from "@/utils/getTranslatedText";
import { useLanguage } from "@/hooks/useLanguage";
import { commonTranslations } from "@/translations";
import {
  HOME_PAGE_SETTINGS_TYPES,
  HOME_PAGE_SETTINGS_KEYS,
} from "@/config/CMS/pages/keys/HOME_PAGE_SETTINGS";

const { Title, Text } = Typography;

type AdItem =
  HOME_PAGE_SETTINGS_TYPES[typeof HOME_PAGE_SETTINGS_KEYS.ADS][number];

const RelatedBusiness: React.FC<{ ad: AdItem }> = ({ ad }) => {
  const { language } = useLanguage();

  const hasContacts = Array.isArray(ad.contacts) && ad.contacts.length > 0;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 500,
        margin: "0 auto",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
      }}
    >
      {/* Image Banner */}
      {ad.image && (
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingTop: "56.25%",
            backgroundImage: `url(${ad.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "40%",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.6), rgba(255,255,255,0))",
            }}
          />
        </div>
      )}

      {/* Content */}
      <Card
        bordered={false}
        bodyStyle={{ padding: 20 }}
        style={{ borderRadius: 0 }}
      >
        <div style={{ marginBottom: 12 }}>
          <Title level={4} style={{ fontSize: 20, color: "#222", margin: 0 }}>
            {getTranslatedText(ad.title, language)}
          </Title>
          {ad.subtitle && (
            <Text
              style={{
                display: "block",
                fontSize: 14,
                color: "#666",
                marginTop: 4,
              }}
            >
              {getTranslatedText(ad.subtitle, language)}
            </Text>
          )}
        </div>

        {ad.description && (
          <Text style={{ fontSize: 14, lineHeight: 1.6, color: "#444" }}>
            {getTranslatedText(ad.description, language)}
          </Text>
        )}

        <Divider style={{ margin: "16px 0" }} />

        <Title
          level={5}
          style={{ fontSize: 16, color: "#333", marginBottom: 8 }}
        >
          {getTranslatedText(commonTranslations.contacts, language)}
        </Title>

        {hasContacts ? (
          ad.contacts.map((contact, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 6,
              }}
            >
              <PhoneOutlined style={{ color: "#007bff" }} />
              <Text style={{ fontSize: 14, color: "#333" }}>
                <strong>{contact.name}:</strong>{" "}
                <a
                  href={`tel:${contact.number}`}
                  style={{ color: "#007bff", textDecoration: "none" }}
                >
                  {contact.number}
                </a>
              </Text>
            </div>
          ))
        ) : (
          <Text style={{ fontSize: 14, color: "#999" }}>
            {getTranslatedText(commonTranslations.noContacts, language)}
          </Text>
        )}
      </Card>
    </div>
  );
};

export default RelatedBusiness;
