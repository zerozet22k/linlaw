/* components/sections/ClickToAction.tsx */
"use client";

import React, { useState } from "react";
import {
  Row, Col, Typography, Button, Modal, Form, Input, notification, Card, theme,
} from "antd";
import {
  EnvironmentOutlined, PhoneOutlined, MailOutlined, ArrowRightOutlined,
} from "@ant-design/icons";

import {
  GLOBAL_SETTINGS_KEYS as GK,
  GLOBAL_SETTINGS_TYPES,
} from "@/config/CMS/settings/keys/GLOBAL_SETTINGS_KEYS";
import { useLanguage } from "@/hooks/useLanguage";
import { useSettings } from "@/hooks/useSettings";
import { getTranslatedText } from "@/utils/getTranslatedText";
import { contactTranslations } from "@/translations";
import apiClient from "@/utils/api/apiClient";

const { Text } = Typography;
const { useToken } = theme;

type BusinessInfo = GLOBAL_SETTINGS_TYPES[typeof GK.BUSINESS_INFO];

function resolveEmbedSrc(mapLink: string, address: string) {
  const trimmed = (mapLink || "").trim();
  if (/google\.[^/]+\/maps\/embed/i.test(trimmed)) return { embedSrc: trimmed, externalHref: trimmed };
  if (/openstreetmap\.org\/export\/embed\.html/i.test(trimmed)) return { embedSrc: trimmed, externalHref: trimmed };

  const isGoogleMaps =
    /google\.[^/]+\/maps/i.test(trimmed) ||
    /goo\.gl\/maps/i.test(trimmed) ||
    /maps\.app\.goo\.gl/i.test(trimmed);

  if (isGoogleMaps || address) {
    const q = encodeURIComponent(address || trimmed);
    return {
      embedSrc: `https://www.google.com/maps?q=${q}&output=embed`,
      externalHref: trimmed || `https://www.google.com/maps?q=${q}`,
    };
  }
  return { embedSrc: null as string | null, externalHref: trimmed || null };
}

const ClickToAction: React.FC = () => {
  const { token } = useToken();
  const { language } = useLanguage();
  const { settings } = useSettings();

  const businessInfo = (settings?.[GK.BUSINESS_INFO] ?? {}) as BusinessInfo;
  const { address = "-", phoneNumber: phone = "-", email = "-", mapLink = "" } = businessInfo;

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // i18n
  const tCTAHeader = getTranslatedText(contactTranslations.clickToActionHeader, language) || "";
  const tCTASub = getTranslatedText(contactTranslations.subheader, language) || "";
  const tCTAButton = getTranslatedText(contactTranslations.buttonLabel, language) || "Send a Message";

  const tAddress = getTranslatedText(contactTranslations.address, language) || "Address";
  const tPhone = getTranslatedText(contactTranslations.phoneNumber, language) || "Phone Number";
  const tEmail = getTranslatedText(contactTranslations.email, language) || "Email";
  const tMapNote = getTranslatedText(contactTranslations.mapNotice, language) || "Map will appear here once available.";

  const tModal = getTranslatedText(contactTranslations.modalTitle, language) || "Contact Form";
  const tYourName = getTranslatedText(contactTranslations.yourName, language) || "Your Name";
  const tYourNameReq = getTranslatedText(contactTranslations.yourNameRequired, language) || "Name is required";
  const tYourPhone = getTranslatedText(contactTranslations.yourPhoneNumber, language) || "Your Phone Number";
  const tYourPhoneReq = getTranslatedText(contactTranslations.yourPhoneNumberRequired, language) || "Enter a valid phone number";
  const tYourEmail = getTranslatedText(contactTranslations.yourEmail, language) || "Your Email";
  const tYourEmailReq = getTranslatedText(contactTranslations.yourEmailRequired, language) || "Valid email required";
  const tSubject = getTranslatedText(contactTranslations.subject, language) || "Subject";
  const tSubjectReq = getTranslatedText(contactTranslations.subjectRequired, language) || "Subject is required";
  const tMessage = getTranslatedText(contactTranslations.message, language) || "Message";
  const tMessageReq = getTranslatedText(contactTranslations.messageRequired, language) || "Message is required";
  const tSend = getTranslatedText(contactTranslations.sendEmail, language) || "Send";

  const tOk = getTranslatedText(contactTranslations.notifSuccess, language) || "Message sent!";
  const tBad = getTranslatedText(contactTranslations.notifFailure, language) || "Failed to send message.";
  const tErr = getTranslatedText(contactTranslations.notifGenericFailure, language) || "Something went wrong.";

  const { embedSrc } = resolveEmbedSrc(mapLink, address === "-" ? "" : address);

  // make map taller (and match left panel)
  const panelHeight = "clamp(340px, 48vh, 620px)"; // taller than 16:9, grows with viewport

  const handleSendEmail = async (values: any) => {
    setLoading(true);
    try {
      const response = await apiClient.post("/contact-us", {
        name: values.name || "",
        phone: values.phone || "",
        email: values.email,
        subject: values.subject,
        message: values.message,
      });
      if (response.status === 200) {
        notification.success({ message: tOk });
        form.resetFields();
        setVisible(false);
      } else {
        throw new Error(response.data?.error || tBad);
      }
    } catch (error: any) {
      notification.error({ message: error?.message || tErr });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        width: "100%",
        paddingInline: token.paddingLG, // kills gutter overflow
        boxSizing: "border-box",
      }}
    >
      <Row gutter={[token.sizeLG, token.sizeLG]} align="stretch" wrap>
        {/* CTA + Details */}
        <Col xs={24} md={12}>
          <Card
            bordered={false}
            style={{
              height: "100%",
              minHeight: panelHeight,         // match map height
              border: "none",
              boxShadow: "none",
              borderRadius: token.borderRadiusLG,
              background: token.colorBgContainer, // ← theme bg
            }}
            bodyStyle={{ padding: token.paddingLG }}
          >
            {tCTAHeader && (
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  margin: 0,
                  color: token.colorText,
                }}
              >
                {tCTAHeader}
              </h3>
            )}
            {tCTASub && (
              <p
                style={{
                  fontSize: 16,
                  color: token.colorTextSecondary,
                  marginTop: token.marginXS,
                }}
              >
                {tCTASub}
              </p>
            )}
            <Button
              type="primary"
              size="large"
              icon={<ArrowRightOutlined />}
              onClick={() => setVisible(true)}
              style={{ marginTop: token.marginSM }}
            >
              {tCTAButton}
            </Button>

            <div
              style={{
                marginTop: token.marginLG,
                height: 1,
                background: token.colorSplit,
              }}
            />

            {/* Address */}
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                marginTop: token.marginLG,
              }}
            >
              <EnvironmentOutlined style={{ fontSize: 20, color: token.colorWarning, marginTop: 2 }} />
              <div>
                <Text strong style={{ color: token.colorText }}>{tAddress}</Text>
                <div style={{ color: token.colorTextSecondary, fontSize: 14, marginTop: 4, wordBreak: "break-word" }}>
                  {address}
                </div>
              </div>
            </div>

            {/* Phone */}
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                marginTop: token.marginMD,
              }}
            >
              <PhoneOutlined style={{ fontSize: 20, color: token.colorSuccess, marginTop: 2 }} />
              <div>
                <Text strong style={{ color: token.colorText }}>{tPhone}</Text>
                <div style={{ marginTop: 4 }}>
                  {phone && phone !== "-" ? (
                    <a href={`tel:${phone.replace(/\s+/g, "")}`} style={{ color: token.colorPrimary }}>
                      {phone}
                    </a>
                  ) : (
                    <span style={{ color: token.colorTextSecondary }}>{phone}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Email */}
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                marginTop: token.marginMD,
              }}
            >
              <MailOutlined style={{ fontSize: 20, color: token.colorInfo, marginTop: 2 }} />
              <div>
                <Text strong style={{ color: token.colorText }}>{tEmail}</Text>
                <div style={{ marginTop: 4 }}>
                  {email && email !== "-" ? (
                    <a href={`mailto:${email}`} style={{ color: token.colorPrimary }}>
                      {email}
                    </a>
                  ) : (
                    <span style={{ color: token.colorTextSecondary }}>{email}</span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Map */}
        <Col xs={24} md={12}>
          <Card
            bordered={false}
            style={{
              height: "100%",
              border: "none",
              boxShadow: "none",
              borderRadius: token.borderRadiusLG,
              background: token.colorBgContainer, // ← theme bg
            }}
            bodyStyle={{ padding: 0 }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: panelHeight,            // ← taller map
                background: token.colorBgLayout,
                borderRadius: token.borderRadiusLG,
                overflow: "hidden",
              }}
            >
              {embedSrc ? (
                <iframe
                  src={embedSrc}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", display: "block" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location map"
                />
              ) : (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: token.padding,
                    background: token.colorFillQuaternary,
                    border: `1px dashed ${token.colorBorder}`,
                  }}
                >
                  <div>
                    <EnvironmentOutlined style={{ fontSize: 28, color: token.colorTextQuaternary }} />
                    <div
                      style={{
                        marginTop: token.marginXS,
                        color: token.colorTextSecondary,
                        fontSize: 14,
                        marginBottom: token.marginXS,
                      }}
                    >
                      {tMapNote}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Modal */}
      <Modal
        title={tModal}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSendEmail}>
          <Form.Item label={tYourName} name="name" rules={[{ required: true, message: tYourNameReq }]}>
            <Input />
          </Form.Item>

          <Form.Item label={tYourPhone} name="phone" rules={[{ pattern: /^\+?\d{7,15}$/, message: tYourPhoneReq }]}>
            <Input placeholder="+66987654321" />
          </Form.Item>

          <Form.Item
            label={tYourEmail}
            name="email"
            rules={[{ required: true, message: tYourEmailReq }, { type: "email", message: tYourEmailReq }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label={tSubject} name="subject" rules={[{ required: true, message: tSubjectReq }]}>
            <Input />
          </Form.Item>

          <Form.Item label={tMessage} name="message" rules={[{ required: true, message: tMessageReq }]}>
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {tSend}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClickToAction;
