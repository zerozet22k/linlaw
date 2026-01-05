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

  if (/google\.[^/]+\/maps\/embed/i.test(trimmed))
    return { embedSrc: trimmed, externalHref: trimmed };
  if (/openstreetmap\.org\/export\/embed\.html/i.test(trimmed))
    return { embedSrc: trimmed, externalHref: trimmed };

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

const makePhoneValidator = (msg: string) => ({
  validator(_: any, value: string) {
    if (!value) return Promise.resolve();

    const okChars = /^[\d+\-\s()]+$/.test(String(value));
    if (!okChars) return Promise.reject(new Error(msg));

    const digits = String(value).replace(/\D/g, "");
    if (digits.length < 7 || digits.length > 15)
      return Promise.reject(new Error(msg));

    return Promise.resolve();
  },
});

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
  const tCTAHeader =
    getTranslatedText(contactTranslations.clickToActionHeader, language) ||
    "Need Legal Assistance?";
  const tCTASub =
    getTranslatedText(contactTranslations.subheader, language) ||
    "Contact us today for a consultation and let us help you navigate your legal matters with confidence.";
  const tCTAButton =
    getTranslatedText(contactTranslations.buttonLabel, language) || "Get in Touch";

  const tAddress = getTranslatedText(contactTranslations.address, language) || "Address";
  const tPhone =
    getTranslatedText(contactTranslations.phoneNumber, language) || "Phone Number";
  const tEmail = getTranslatedText(contactTranslations.email, language) || "Email";
  const tMapNote =
    getTranslatedText(contactTranslations.mapNotice, language) ||
    "Map will appear here once available.";

  const tModal = getTranslatedText(contactTranslations.modalTitle, language) || "Contact Form";
  const tYourName = getTranslatedText(contactTranslations.yourName, language) || "Your Name";
  const tYourNameReq =
    getTranslatedText(contactTranslations.yourNameRequired, language) || "Name is required";
  const tYourPhone =
    getTranslatedText(contactTranslations.yourPhoneNumber, language) || "Your Phone Number";
  const tYourPhoneReq =
    getTranslatedText(contactTranslations.yourPhoneNumberRequired, language) ||
    "Enter a valid phone number";
  const tYourEmail = getTranslatedText(contactTranslations.yourEmail, language) || "Your Email";
  const tYourEmailReq =
    getTranslatedText(contactTranslations.yourEmailRequired, language) || "Valid email required";
  const tSubject = getTranslatedText(contactTranslations.subject, language) || "Subject";
  const tSubjectReq =
    getTranslatedText(contactTranslations.subjectRequired, language) || "Subject is required";
  const tMessage = getTranslatedText(contactTranslations.message, language) || "Message";
  const tMessageReq =
    getTranslatedText(contactTranslations.messageRequired, language) || "Message is required";
  const tSend = getTranslatedText(contactTranslations.sendEmail, language) || "Send";

  const tOk = getTranslatedText(contactTranslations.notifSuccess, language) || "Message sent!";
  const tBad =
    getTranslatedText(contactTranslations.notifFailure, language) || "Failed to send message.";
  const tErr =
    getTranslatedText(contactTranslations.notifGenericFailure, language) ||
    "Something went wrong.";

  const phoneRule = useMemo(() => makePhoneValidator(tYourPhoneReq), [tYourPhoneReq]);

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

  // shared modal
  const ContactModal = (
    <Modal
      title={tModal}
      open={visible}
      onCancel={() => !sending && setVisible(false)}
      footer={null}
      destroyOnClose
      width={720}
      maskClosable={!sending}
      styles={{ body: { paddingTop: token.paddingMD } }}
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
            <Form.Item label={tYourPhone} name="phone" rules={[phoneRule as any]}>
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

        <Form.Item
          label={tSubject}
          name="subject"
          rules={[{ required: true, message: tSubjectReq }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={tMessage}
          name="message"
          rules={[{ required: true, message: tMessageReq }]}
        >
          <Input.TextArea rows={5} />
        </Form.Item>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Button onClick={() => setVisible(false)} disabled={sending} style={{ borderRadius: 10 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={sending} style={{ borderRadius: 10 }}>
            {tSend}
          </Button>
        </div>
      </Form>
    </Modal>
  );

  // ================= FOOTER VARIANT =================
  if (variant === "footer") {
    // MUCH smaller vertical padding
    const padY = tight ? token.paddingXS : token.paddingSM;
    const padX = token.paddingLG;

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
            padding: `${padY}px ${padX}px`,
            boxSizing: "border-box",
          }}
        >
          <Row gutter={[token.sizeLG, token.sizeSM]} align="middle">
            <Col xs={24} md={15}>
              <div style={{ display: "flex", flexDirection: "column", gap: tight ? 4 : 6 }}>
                <Title level={tight ? 5 : 4} style={{ margin: 0, lineHeight: 1.15 }}>
                  {tCTAHeader}
                </Title>

                <Text
                  style={{
                    display: "block",
                    color: token.colorTextSecondary,
                    fontSize: 13.5,
                    lineHeight: 1.55,
                    maxWidth: 760,
                  }}
                >
                  {tCTASub}
                </Text>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: tight ? 10 : 14,
                    marginTop: tight ? 2 : token.marginXS,
                    color: token.colorTextSecondary,
                    fontSize: 13,
                  }}
                >
                  {!isPlaceholder(address) ? (
                    <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                      <EnvironmentOutlined style={{ color: token.colorWarning }} />
                      <span>
                        <Text strong style={{ fontSize: 13 }}>
                          {tAddress}:
                        </Text>{" "}
                        {address}
                      </span>
                    </span>
                  ) : null}

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

                  {!isPlaceholder(email) ? (
                    <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                      <MailOutlined style={{ color: token.colorInfo }} />
                      <a href={`mailto:${email}`} style={{ color: token.colorPrimary }}>
                        {email}
                      </a>
                    </span>
                  ) : null}
                </div>
              </div>
            </Col>

            <Col xs={24} md={9}>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Space wrap>
                  <Button
                    type="primary"
                    size={tight ? "middle" : "large"}
                    icon={<ArrowRightOutlined />}
                    onClick={() => setVisible(true)}
                    style={{ borderRadius: 999 }}
                  >
                    {tCTAButton}
                  </Button>

                  {externalHref ? (
                    <Button
                      size={tight ? "middle" : "large"}
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

          {ContactModal}
        </div>
      </div>
    );
  }

  // ================= FULL VARIANT =================
  // Reduce vertical padding everywhere (no more XL top/bottom)
  const panelHeight = "clamp(320px, 44vh, 560px)";
  const shellBorder = `1px solid ${token.colorBorderSecondary}`;
  const shellShadow = "0 10px 28px rgba(15, 23, 42, 0.06)";

  const padY = tight ? token.paddingLG : token.paddingLG; // keep modest even when not tight
  const padX = tight ? token.paddingLG : token.paddingXL;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
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
                padding: `${padY}px ${padX}px`,
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
                    marginTop: token.marginXS,
                    color: token.colorTextSecondary,
                    fontSize: 14.5,
                    lineHeight: 1.65,
                    maxWidth: 540,
                  }}
                >
                  {tCTASub}
                </Text>

                <Space size={10} style={{ marginTop: token.marginMD, flexWrap: "wrap" }}>
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
                  marginTop: token.marginLG,
                  paddingTop: token.paddingMD,
                  borderTop: `1px solid ${token.colorSplit}`,
                  display: "grid",
                  gap: token.sizeMD,
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <EnvironmentOutlined style={{ fontSize: 18, color: token.colorWarning, marginTop: 2 }} />
                  <div style={{ minWidth: 0 }}>
                    <Text strong>{tAddress}</Text>
                    <div
                      style={{
                        marginTop: 4,
                        color: token.colorTextSecondary,
                        fontSize: 14,
                        wordBreak: "break-word",
                      }}
                    >
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
                        <a
                          href={`tel:${String(phone).replace(/\s+/g, "")}`}
                          style={{ color: token.colorPrimary }}
                        >
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
                  padding: `${token.paddingMD}px ${padX}px`,
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
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      border: "none",
                      display: "block",
                    }}
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
                      padding: token.paddingLG,
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

      {ContactModal}
    </div>
  );
};

export default ClickToAction;
