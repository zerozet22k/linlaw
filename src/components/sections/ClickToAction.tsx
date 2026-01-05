"use client";

import React, { useMemo, useState } from "react";
import {
  Row,
  Col,
  Typography,
  Button,
  Modal,
  Form,
  Input,
  notification,
  theme,
  Space,
} from "antd";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  ArrowRightOutlined,
  GlobalOutlined,
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

const { Title, Text } = Typography;

type BusinessInfo = GLOBAL_SETTINGS_TYPES[typeof GK.BUSINESS_INFO];

type Props = {
  /** footer = compact strip (for bottom of most pages), full = big map layout (Home/Contact page) */
  variant?: "footer" | "full";
  /** optional: tighten spacing when used inside a footer area */
  tight?: boolean;
};

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

const isPlaceholder = (v: unknown) => {
  const s = String(v ?? "").trim();
  return !s || s === "-";
};

// allow + digits spaces () - ; require 7–15 digits total
const phoneRule = {
  validator(_: any, value: string) {
    if (!value) return Promise.resolve();
    const okChars = /^[\d+\-\s()]+$/.test(String(value));
    if (!okChars) return Promise.reject(new Error("Invalid phone number"));
    const digits = String(value).replace(/\D/g, "");
    if (digits.length < 7 || digits.length > 15) return Promise.reject(new Error("Invalid phone number"));
    return Promise.resolve();
  },
};

const ClickToAction: React.FC<Props> = ({ variant = "footer", tight = false }) => {
  const { token } = theme.useToken();
  const { language } = useLanguage();
  const { settings } = useSettings();

  const businessInfo = (settings?.[GK.BUSINESS_INFO] ?? {}) as BusinessInfo;
  const address = businessInfo?.address ?? "-";
  const phone = businessInfo?.phoneNumber ?? "-";
  const email = businessInfo?.email ?? "-";
  const mapLink = businessInfo?.mapLink ?? "";

  const { embedSrc, externalHref } = useMemo(
    () => resolveEmbedSrc(mapLink, isPlaceholder(address) ? "" : String(address)),
    [mapLink, address]
  );

  const [visible, setVisible] = useState(false);
  const [sending, setSending] = useState(false);
  const [form] = Form.useForm();

  // translations
  const tCTAHeader = getTranslatedText(contactTranslations.clickToActionHeader, language) || "Need Legal Assistance?";
  const tCTASub =
    getTranslatedText(contactTranslations.subheader, language) ||
    "Contact us today for a consultation and let us help you navigate your legal matters with confidence.";
  const tCTAButton = getTranslatedText(contactTranslations.buttonLabel, language) || "Get in Touch";

  const tAddress = getTranslatedText(contactTranslations.address, language) || "Address";
  const tPhone = getTranslatedText(contactTranslations.phoneNumber, language) || "Phone Number";
  const tEmail = getTranslatedText(contactTranslations.email, language) || "Email";
  const tMapNote =
    getTranslatedText(contactTranslations.mapNotice, language) || "Map will appear here once available.";

  const tModal = getTranslatedText(contactTranslations.modalTitle, language) || "Contact Form";
  const tYourName = getTranslatedText(contactTranslations.yourName, language) || "Your Name";
  const tYourNameReq = getTranslatedText(contactTranslations.yourNameRequired, language) || "Name is required";
  const tYourPhone = getTranslatedText(contactTranslations.yourPhoneNumber, language) || "Your Phone Number";
  const tYourPhoneReq =
    getTranslatedText(contactTranslations.yourPhoneNumberRequired, language) || "Enter a valid phone number";
  const tYourEmail = getTranslatedText(contactTranslations.yourEmail, language) || "Your Email";
  const tYourEmailReq = getTranslatedText(contactTranslations.yourEmailRequired, language) || "Valid email required";
  const tSubject = getTranslatedText(contactTranslations.subject, language) || "Subject";
  const tSubjectReq = getTranslatedText(contactTranslations.subjectRequired, language) || "Subject is required";
  const tMessage = getTranslatedText(contactTranslations.message, language) || "Message";
  const tMessageReq = getTranslatedText(contactTranslations.messageRequired, language) || "Message is required";
  const tSend = getTranslatedText(contactTranslations.sendEmail, language) || "Send";

  const tOk = getTranslatedText(contactTranslations.notifSuccess, language) || "Message sent!";
  const tBad = getTranslatedText(contactTranslations.notifFailure, language) || "Failed to send message.";
  const tErr =
    getTranslatedText(contactTranslations.notifGenericFailure, language) || "Something went wrong.";

  const handleSendEmail = async (values: any) => {
    setSending(true);
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
      setSending(false);
    }
  };

  // ===== FOOTER VARIANT (compact strip) =====
  if (variant === "footer") {
    const py = tight ? token.paddingLG : token.paddingXL;

    return (
      <div
        style={{
          width: "100%",
          borderTop: `1px solid ${token.colorSplit}`,
          background: token.colorBgContainer,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: `${py}px ${token.paddingLG}px`,
            boxSizing: "border-box",
          }}
        >
          <Row gutter={[token.sizeLG, token.sizeLG]} align="middle">
            <Col xs={24} md={14}>
              <Title level={4} style={{ margin: 0, lineHeight: 1.15 }}>
                {tCTAHeader}
              </Title>
              <Text
                style={{
                  display: "block",
                  marginTop: token.marginSM,
                  color: token.colorTextSecondary,
                  fontSize: 14,
                  lineHeight: 1.6,
                  maxWidth: 720,
                }}
              >
                {tCTASub}
              </Text>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 14,
                  marginTop: token.marginLG,
                  color: token.colorTextSecondary,
                  fontSize: 13,
                }}
              >
                {/* address */}
                {!isPlaceholder(address) ? (
                  <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                    <EnvironmentOutlined style={{ color: token.colorWarning }} />
                    <span>
                      <Text strong style={{ fontSize: 13 }}>{tAddress}:</Text>{" "}
                      {address}
                    </span>
                  </span>
                ) : null}

                {/* phone */}
                {!isPlaceholder(phone) ? (
                  <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                    <PhoneOutlined style={{ color: token.colorSuccess }} />
                    <a
                      href={`tel:${String(phone).replace(/\s+/g, "")}`}
                      style={{ color: token.colorPrimary }}
                    >
                      {phone}
                    </a>
                  </span>
                ) : null}

                {/* email */}
                {!isPlaceholder(email) ? (
                  <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                    <MailOutlined style={{ color: token.colorInfo }} />
                    <a href={`mailto:${email}`} style={{ color: token.colorPrimary }}>
                      {email}
                    </a>
                  </span>
                ) : null}
              </div>
            </Col>

            <Col xs={24} md={10}>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Space wrap>
                  <Button
                    type="primary"
                    size="large"
                    icon={<ArrowRightOutlined />}
                    onClick={() => setVisible(true)}
                    style={{ borderRadius: 999 }}
                  >
                    {tCTAButton}
                  </Button>

                  {externalHref ? (
                    <Button
                      size="large"
                      icon={<GlobalOutlined />}
                      href={externalHref}
                      target="_blank"
                      rel="noreferrer"
                      style={{ borderRadius: 999 }}
                    >
                      Open map
                    </Button>
                  ) : null}
                </Space>
              </div>
            </Col>
          </Row>

          {/* Modal */}
          <Modal
            title={tModal}
            open={visible}
            onCancel={() => setVisible(false)}
            footer={null}
            destroyOnClose
            width={720}
            styles={{ body: { paddingTop: token.paddingLG } }}
          >
            <Form form={form} layout="vertical" onFinish={handleSendEmail}>
              <Row gutter={token.sizeLG}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={tYourName}
                    name="name"
                    rules={[{ required: true, message: tYourNameReq }]}
                  >
                    <Input autoComplete="name" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label={tYourPhone}
                    name="phone"
                    rules={[{ ...phoneRule, message: tYourPhoneReq } as any]}
                  >
                    <Input placeholder="+66987654321" autoComplete="tel" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label={tYourEmail}
                name="email"
                rules={[
                  { required: true, message: tYourEmailReq },
                  { type: "email", message: tYourEmailReq },
                ]}
              >
                <Input autoComplete="email" />
              </Form.Item>

              <Form.Item label={tSubject} name="subject" rules={[{ required: true, message: tSubjectReq }]}>
                <Input />
              </Form.Item>

              <Form.Item label={tMessage} name="message" rules={[{ required: true, message: tMessageReq }]}>
                <Input.TextArea rows={5} />
              </Form.Item>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <Button onClick={() => setVisible(false)} style={{ borderRadius: 10 }}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={sending} style={{ borderRadius: 10 }}>
                  {tSend}
                </Button>
              </div>
            </Form>
          </Modal>
        </div>
      </div>
    );
  }

  // ===== FULL VARIANT (only for Contact page / Home) =====
  const panelHeight = "clamp(380px, 52vh, 660px)";
  const shellBorder = `1px solid ${token.colorBorderSecondary}`;
  const shellShadow = "0 12px 34px rgba(15, 23, 42, 0.06)";

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", paddingInline: token.paddingLG }}>
      <div
        style={{
          borderRadius: token.borderRadiusLG,
          border: shellBorder,
          background: token.colorBgContainer,
          boxShadow: shellShadow,
          overflow: "hidden",
        }}
      >
        <Row gutter={[0, 0]} wrap>
          <Col xs={24} md={11}>
            <div
              style={{
                padding: token.paddingXL,
                minHeight: panelHeight,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div>
                <Title level={3} style={{ margin: 0, lineHeight: 1.15 }}>
                  {tCTAHeader}
                </Title>
                <Text
                  style={{
                    display: "block",
                    marginTop: token.marginSM,
                    color: token.colorTextSecondary,
                    fontSize: 15,
                    lineHeight: 1.65,
                    maxWidth: 520,
                  }}
                >
                  {tCTASub}
                </Text>

                <Space size={10} style={{ marginTop: token.marginLG, flexWrap: "wrap" }}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<ArrowRightOutlined />}
                    onClick={() => setVisible(true)}
                    style={{ borderRadius: 999 }}
                  >
                    {tCTAButton}
                  </Button>

                  {externalHref ? (
                    <Button
                      size="large"
                      icon={<GlobalOutlined />}
                      href={externalHref}
                      target="_blank"
                      rel="noreferrer"
                      style={{ borderRadius: 999 }}
                    >
                      Open map
                    </Button>
                  ) : null}
                </Space>
              </div>

              <div
                style={{
                  marginTop: token.marginXL,
                  paddingTop: token.paddingLG,
                  borderTop: `1px solid ${token.colorSplit}`,
                  display: "grid",
                  gap: token.sizeLG,
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <EnvironmentOutlined style={{ fontSize: 18, color: token.colorWarning, marginTop: 2 }} />
                  <div style={{ minWidth: 0 }}>
                    <Text strong>{tAddress}</Text>
                    <div style={{ marginTop: 4, color: token.colorTextSecondary, fontSize: 14, wordBreak: "break-word" }}>
                      {address}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <PhoneOutlined style={{ fontSize: 18, color: token.colorSuccess, marginTop: 2 }} />
                  <div>
                    <Text strong>{tPhone}</Text>
                    <div style={{ marginTop: 4 }}>
                      {!isPlaceholder(phone) ? (
                        <a href={`tel:${String(phone).replace(/\s+/g, "")}`} style={{ color: token.colorPrimary }}>
                          {phone}
                        </a>
                      ) : (
                        <span style={{ color: token.colorTextSecondary }}>{phone}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <MailOutlined style={{ fontSize: 18, color: token.colorInfo, marginTop: 2 }} />
                  <div>
                    <Text strong>{tEmail}</Text>
                    <div style={{ marginTop: 4 }}>
                      {!isPlaceholder(email) ? (
                        <a href={`mailto:${email}`} style={{ color: token.colorPrimary }}>
                          {email}
                        </a>
                      ) : (
                        <span style={{ color: token.colorTextSecondary }}>{email}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={0} md={1}>
            <div style={{ width: "100%", height: "100%", background: token.colorSplit }} />
          </Col>

          <Col xs={24} md={12}>
            <div style={{ minHeight: panelHeight, display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  padding: `${token.paddingLG}px ${token.paddingXL}px`,
                  borderBottom: `1px solid ${token.colorSplit}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: token.sizeMD,
                }}
              >
                <Text strong>Location</Text>
                {externalHref ? (
                  <Button
                    size="middle"
                    icon={<GlobalOutlined />}
                    href={externalHref}
                    target="_blank"
                    rel="noreferrer"
                    style={{ borderRadius: 999 }}
                  >
                    Open
                  </Button>
                ) : (
                  <span />
                )}
              </div>

              <div style={{ position: "relative", flex: 1, background: token.colorBgLayout }}>
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
                      padding: token.paddingXL,
                      background: token.colorFillQuaternary,
                    }}
                  >
                    <div>
                      <EnvironmentOutlined style={{ fontSize: 28, color: token.colorTextQuaternary }} />
                      <div style={{ marginTop: token.marginSM, color: token.colorTextSecondary, fontSize: 14 }}>
                        {tMapNote}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <Modal
        title={tModal}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        destroyOnClose
        width={720}
        styles={{ body: { paddingTop: token.paddingLG } }}
      >
        <Form form={form} layout="vertical" onFinish={handleSendEmail}>
          <Row gutter={token.sizeLG}>
            <Col xs={24} md={12}>
              <Form.Item label={tYourName} name="name" rules={[{ required: true, message: tYourNameReq }]}>
                <Input autoComplete="name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label={tYourPhone} name="phone" rules={[{ ...phoneRule, message: tYourPhoneReq } as any]}>
                <Input placeholder="+66987654321" autoComplete="tel" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={tYourEmail}
            name="email"
            rules={[{ required: true, message: tYourEmailReq }, { type: "email", message: tYourEmailReq }]}
          >
            <Input autoComplete="email" />
          </Form.Item>

          <Form.Item label={tSubject} name="subject" rules={[{ required: true, message: tSubjectReq }]}>
            <Input />
          </Form.Item>

          <Form.Item label={tMessage} name="message" rules={[{ required: true, message: tMessageReq }]}>
            <Input.TextArea rows={5} />
          </Form.Item>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button onClick={() => setVisible(false)} style={{ borderRadius: 10 }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={sending} style={{ borderRadius: 10 }}>
              {tSend}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ClickToAction;
