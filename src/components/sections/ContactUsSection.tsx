"use client";

import React from "react";
import { Row, Col, Typography } from "antd";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";

import {
  GLOBAL_SETTINGS_KEYS as GK,
  GLOBAL_SETTINGS_TYPES,
} from "@/config/CMS/settings/keys/GLOBAL_SETTINGS_KEYS";
import { useLanguage } from "@/hooks/useLanguage";
import { getTranslatedText } from "@/utils/getTranslatedText";
import { contactTranslations, commonTranslations } from "@/translations";

import {
  sectionOuterStyle,
  sectionWrapperStyle,
  sectionTitleStyle,
  sectionDescriptionStyle,
} from "./sectionStyles";

const { Title, Text } = Typography;

type BusinessInfo = GLOBAL_SETTINGS_TYPES[typeof GK.BUSINESS_INFO];

interface Props {
  contactInfo: BusinessInfo;
}

const ContactUsSection: React.FC<Props> = ({ contactInfo }) => {
  const { language } = useLanguage();

  const {
    address = "-",
    phoneNumber: phone = "-",
    email = "-",
    mapLink = "",
  } = contactInfo ?? {};

  const translatedTitle =
    getTranslatedText(contactTranslations.header, language) ||
    "Contact Information";
  const translatedAddress =
    getTranslatedText(contactTranslations.address, language) || "Address";
  const translatedPhone =
    getTranslatedText(contactTranslations.phoneNumber, language) ||
    "Phone Number";
  const translatedEmail =
    getTranslatedText(contactTranslations.email, language) || "Email";
  const translatedMapNotice =
    getTranslatedText(contactTranslations.mapNotice, language) ||
    "Map will appear here once available.";
  const translatedLoading =
    getTranslatedText(commonTranslations.loading, language) || "Loading...";
  const translatedNoData =
    getTranslatedText(commonTranslations.noData, language) || "No Data";

  // shared responsive height for both columns on md+ so vertical centering lines up with the map
  const colMinHeight = "clamp(240px, 32vw, 420px)";

  return (
    <section style={sectionOuterStyle}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
          paddingInline: 24,
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* Header on top */}
        <div style={sectionWrapperStyle}>
          <Title
            level={2}
            style={{
              ...sectionTitleStyle,
              fontSize: "clamp(1.6em, 5vw, 2.25em)",
              color: "#2c3e50",
              marginBottom: 0,
            }}
          >
            {translatedTitle}
          </Title>
        </div>

        <Row gutter={[{ xs: 16, sm: 20, md: 48 }, 24]} align="stretch" wrap>
          {/* LEFT: details, vertically centered to map on md+ */}
          <Col xs={24} md={12} style={{ minWidth: 0 }}>
            <div
              style={{
                // match map height so we can center vertically
                minHeight: colMinHeight,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center", // vertical centering
                gap: 18,
              }}
            >
              {/* Address */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <EnvironmentOutlined
                    style={{ fontSize: 22, color: "#d4380d" }}
                  />
                  <Text strong style={{ fontSize: 16 }}>
                    {translatedAddress}
                  </Text>
                </div>
                <Text
                  style={{
                    color: "#666",
                    fontSize: 14,
                    display: "block",
                    marginTop: 6,
                    wordBreak: "break-word",
                  }}
                >
                  {address}
                </Text>
              </div>

              {/* Phone */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <PhoneOutlined style={{ fontSize: 22, color: "#389e0d" }} />
                  <Text strong style={{ fontSize: 16 }}>
                    {translatedPhone}
                  </Text>
                </div>
                {phone && phone !== "-" ? (
                  <a
                    href={`tel:${phone.replace(/\s+/g, "")}`}
                    style={{
                      color: "#1677ff",
                      fontSize: 14,
                      display: "inline-block",
                      marginTop: 6,
                    }}
                  >
                    {phone}
                  </a>
                ) : (
                  <Text
                    style={{
                      color: "#666",
                      fontSize: 14,
                      display: "block",
                      marginTop: 6,
                    }}
                  >
                    {phone}
                  </Text>
                )}
              </div>

              {/* Email */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <MailOutlined style={{ fontSize: 22, color: "#096dd9" }} />
                  <Text strong style={{ fontSize: 16 }}>
                    {translatedEmail}
                  </Text>
                </div>
                {email && email !== "-" ? (
                  <a
                    href={`mailto:${email}`}
                    style={{
                      color: "#1677ff",
                      fontSize: 14,
                      display: "inline-block",
                      marginTop: 6,
                    }}
                  >
                    {email}
                  </a>
                ) : (
                  <Text
                    style={{
                      color: "#666",
                      fontSize: 14,
                      display: "block",
                      marginTop: 6,
                    }}
                  >
                    {email}
                  </Text>
                )}
              </div>
            </div>
          </Col>

          {/* RIGHT: map (or placeholder) */}
          <Col xs={24} md={12} style={{ minWidth: 0 }}>
            {mapLink ? (
              <div
                style={{
                  width: "100%",
                  // use same responsive height as left col
                  minHeight: colMinHeight,
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.07)",
                  background: "#f5f5f5",
                  display: "flex",
                }}
              >
                <iframe
                  src={mapLink}
                  style={{ border: "none", flex: 1, display: "block" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location map"
                />
              </div>
            ) : (
              <div
                style={{
                  width: "100%",
                  minHeight: colMinHeight,
                  borderRadius: 12,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.07)",
                  background: "linear-gradient(180deg, #fafafa, #f0f0f0)",
                  border: "1px dashed #d9d9d9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: 16,
                }}
              >
                <div>
                  <EnvironmentOutlined
                    style={{ fontSize: 28, color: "#8c8c8c" }}
                  />
                  <div
                    style={{
                      marginTop: 8,
                      ...sectionDescriptionStyle,
                      marginBottom: 0,
                    }}
                  >
                    {translatedMapNotice}
                  </div>
                </div>
              </div>
            )}
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default ContactUsSection;
