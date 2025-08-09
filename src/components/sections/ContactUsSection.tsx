"use client";

import React from "react";
import { Row, Col, Typography, Space } from "antd";
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

const { Title, Text } = Typography;

type BusinessInfo = GLOBAL_SETTINGS_TYPES[typeof GK.BUSINESS_INFO];

interface Props {
  contactInfo: BusinessInfo;
}

const ContactUsSection: React.FC<Props> = ({ contactInfo }) => {
  const { language } = useLanguage();
  const [loading] = React.useState(false);
  const [hasData] = React.useState(true);

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

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 48 }}>
        <Text type="secondary">{translatedLoading}</Text>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div style={{ textAlign: "center", padding: 48 }}>
        <Text type="secondary">{translatedNoData}</Text>
      </div>
    );
  }

  return (
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
      <Row gutter={[{ xs: 24, sm: 24, md: 48 }, 32]} align="middle" wrap>
        <Col xs={24} md={14} style={{ minWidth: 0 }}>
          <div style={{ paddingRight: 24 }}>
            <Title
              level={2}
              style={{
                fontSize: "2.25em",
                fontWeight: 600,
                marginBottom: 32,
                color: "#2c3e50",
              }}
            >
              {translatedTitle}
            </Title>

            <Space direction="vertical" size="large" style={{ fontSize: 16 }}>
              <div>
                <EnvironmentOutlined
                  style={{ fontSize: 22, color: "#d4380d", marginRight: 12 }}
                />
                <Text strong style={{ fontSize: 16 }}>
                  {translatedAddress}
                </Text>
                <br />
                <Text style={{ color: "#999", fontSize: 13 }}>{address}</Text>
              </div>

              <div>
                <PhoneOutlined
                  style={{ fontSize: 22, color: "#389e0d", marginRight: 12 }}
                />
                <Text strong style={{ fontSize: 16 }}>
                  {translatedPhone}
                </Text>
                <br />
                <Text style={{ color: "#999", fontSize: 13 }}>{phone}</Text>
              </div>

              <div>
                <MailOutlined
                  style={{ fontSize: 22, color: "#096dd9", marginRight: 12 }}
                />
                <Text strong style={{ fontSize: 16 }}>
                  {translatedEmail}
                </Text>
                <br />
                <Text style={{ color: "#999", fontSize: 13 }}>{email}</Text>
              </div>
            </Space>
          </div>
        </Col>

        {/* RIGHT SIDE — MAP */}
        <Col xs={24} md={10} style={{ minWidth: 0 }}>
          {mapLink ? (
            <div
              style={{
                width: "100%",
                height: 360,
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.07)",
              }}
            >
              <iframe
                src={mapLink}
                width="100%"
                height="100%"
                style={{ border: "none", display: "block" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location map"
              />
            </div>
          ) : (
            <div style={{ padding: 24, textAlign: "center" }}>
              <Text type="secondary">{translatedMapNotice}</Text>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ContactUsSection;
