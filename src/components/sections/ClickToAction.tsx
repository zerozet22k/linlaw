"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
  Card,
} from "antd";
import type { InputRef } from "antd";
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
import { IDS } from "@/app/pageid";


const { Title, Text } = Typography;

type BusinessInfo = GLOBAL_SETTINGS_TYPES[typeof GK.BUSINESS_INFO];

type Props = {
  variant?: "footer" | "full";
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

function toRgba(color: string, a: number) {
  const c = String(color || "").trim();

  if (c.startsWith("rgba(")) return c.replace(/,\s*[\d.]+\s*\)$/, `, ${a})`);
  if (c.startsWith("rgb("))
    return c.replace("rgb(", "rgba(").replace(")", `, ${a})`);

  if (c.startsWith("#")) {
    const hex = c.slice(1);
    const full = hex.length === 3 ? hex.split("").map((x) => x + x).join("") : hex;
    const n = parseInt(full, 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  return c;
}

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
  const [tutorialOn, setTutorialOn] = useState(false);
  const [form] = Form.useForm();
  const nameRef = useRef<InputRef>(null);
  const tutorialTimerRef = useRef<number | null>(null);

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

  const glowStrong = useMemo(() => toRgba(token.colorPrimary, 0.58), [token.colorPrimary]);
  const glowSoft = useMemo(() => toRgba(token.colorPrimary, 0.18), [token.colorPrimary]);

  const clearHash = () => {
    const url = window.location.pathname + window.location.search;
    window.history.replaceState(null, "", url);
  };

  const startTutorial = () => {
    setTutorialOn(true);
    setVisible(true);

    if (tutorialTimerRef.current) window.clearTimeout(tutorialTimerRef.current);
    tutorialTimerRef.current = window.setTimeout(() => setTutorialOn(false), 5200);

    window.setTimeout(() => {
      nameRef.current?.focus?.();
    }, 250);

    window.setTimeout(() => clearHash(), 350);
  };

  useEffect(() => {
    const run = () => {
      if (window.location.hash === `#${IDS.CONTACT}`) startTutorial();
    };

    run();
    window.addEventListener("hashchange", run);
    return () => {
      window.removeEventListener("hashchange", run);
      if (tutorialTimerRef.current) window.clearTimeout(tutorialTimerRef.current);
    };
  }, []);

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

  const CTAButtonWithSpotlight = (btnSize: "middle" | "large") => (
    <span
      className={`ctaBtnWrap ${tutorialOn ? "ctaBtnWrapOn" : ""}`}
      style={
        {
          ["--cta-glow-strong" as any]: glowStrong,
          ["--cta-glow-soft" as any]: glowSoft,
        } as React.CSSProperties
      }
    >
      {tutorialOn ? (
        <>
          <span className="ctaHalo" aria-hidden />
          <span className="ctaSweep" aria-hidden />
        </>
      ) : null}

      <Button
        type="primary"
        size={btnSize}
        icon={<ArrowRightOutlined />}
        onClick={() => setVisible(true)}
        style={{ borderRadius: 999 }}
      >
        {tCTAButton}
      </Button>
    </span>
  );

  const ContactModal = (
    <Modal
      title={tModal}
      open={visible}
      onCancel={() => !sending && setVisible(false)}
      footer={null}
      destroyOnClose
      width={920}
      maskClosable={!sending}
      styles={{ body: { paddingTop: token.paddingMD } }}
    >
      <Row gutter={[token.sizeLG, token.sizeLG]}>
        <Col xs={24} md={14}>
          <Form form={form} layout="vertical" onFinish={handleSendEmail}>
            <Row gutter={token.sizeLG}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={tYourName}
                  name="name"
                  rules={[{ required: true, message: tYourNameReq }]}
                >
                  <Input ref={nameRef} autoComplete="name" />
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
              <Button
                onClick={() => setVisible(false)}
                disabled={sending}
                style={{ borderRadius: 10 }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={sending}
                style={{ borderRadius: 10 }}
              >
                {tSend}
              </Button>
            </div>
          </Form>
        </Col>

        <Col xs={24} md={10}>
          <Card
            size="small"
            styles={{
              header: { paddingInline: token.paddingMD },
              body: { padding: token.paddingMD },
            }}
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <EnvironmentOutlined style={{ color: token.colorPrimary }} />
                <span>Location</span>
              </div>
            }
            extra={
              externalHref ? (
                <Button
                  size="small"
                  icon={<GlobalOutlined />}
                  href={externalHref}
                  target="_blank"
                  rel="noreferrer"
                  style={{ borderRadius: 999 }}
                >
                  Open
                </Button>
              ) : null
            }
          >
            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ display: "grid", gap: 6 }}>
                <Text strong style={{ fontSize: 13 }}>
                  {tAddress}
                </Text>
                <Text style={{ color: token.colorTextSecondary, fontSize: 13, wordBreak: "break-word" }}>
                  {address}
                </Text>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 6 }}>
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

              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: 260,
                  borderRadius: token.borderRadiusLG,
                  overflow: "hidden",
                  border: `1px solid ${token.colorBorderSecondary}`,
                  background: token.colorBgLayout,
                }}
              >
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
                      padding: token.paddingMD,
                      background: token.colorFillQuaternary,
                    }}
                  >
                    <div>
                      <EnvironmentOutlined style={{ fontSize: 28, color: token.colorTextQuaternary }} />
                      <div style={{ marginTop: 10, color: token.colorTextSecondary, fontSize: 13.5 }}>
                        {tMapNote}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </Modal>
  );

  if (variant === "footer") {
    const padY = tight ? token.paddingXS : token.paddingSM;
    const padX = token.paddingLG;

    return (
      <>
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
                    {CTAButtonWithSpotlight(tight ? "middle" : "large")}
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

        <style jsx>{spotlightCss}</style>
      </>
    );
  }

  const panelHeight = "clamp(320px, 44vh, 560px)";
  const shellBorder = `1px solid ${token.colorBorderSecondary}`;
  const shellShadow = "0 10px 28px rgba(15, 23, 42, 0.06)";
  const padY = token.paddingLG;
  const padX = tight ? token.paddingLG : token.paddingXL;

  return (
    <>
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
                    {CTAButtonWithSpotlight("large")}
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
                    <EnvironmentOutlined
                      style={{ fontSize: 18, color: token.colorWarning, marginTop: 2 }}
                    />
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
                    <PhoneOutlined
                      style={{ fontSize: 18, color: token.colorSuccess, marginTop: 2 }}
                    />
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
                    <MailOutlined
                      style={{ fontSize: 18, color: token.colorInfo, marginTop: 2 }}
                    />
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
                        <EnvironmentOutlined
                          style={{ fontSize: 28, color: token.colorTextQuaternary }}
                        />
                        <div
                          style={{
                            marginTop: token.marginSM,
                            color: token.colorTextSecondary,
                            fontSize: 14,
                          }}
                        >
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

      <style jsx>{spotlightCss}</style>
    </>
  );
};

const spotlightCss = `
  .ctaBtnWrap {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    isolation: isolate;
  }

  .ctaHalo {
    position: absolute;
    inset: -24px;
    border-radius: 999px;
    background: radial-gradient(circle, var(--cta-glow-soft) 0%, transparent 62%);
    animation: ctaPulse 1.55s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }

  .ctaSweep {
    position: absolute;
    inset: -12px;
    border-radius: 999px;
    background: conic-gradient(
      from 0deg,
      transparent 0deg,
      transparent 258deg,
      var(--cta-glow-strong) 320deg,
      transparent 360deg
    );
    -webkit-mask: radial-gradient(
      farthest-side,
      transparent calc(100% - 10px),
      #000 calc(100% - 10px)
    );
    mask: radial-gradient(
      farthest-side,
      transparent calc(100% - 10px),
      #000 calc(100% - 10px)
    );
    animation: ctaRotate 0.95s linear infinite;
    pointer-events: none;
    z-index: 1;
    filter: drop-shadow(0 0 12px var(--cta-glow-strong));
  }

  .ctaBtnWrapOn :global(.ant-btn) {
    box-shadow:
      0 0 0 7px var(--cta-glow-soft),
      0 14px 32px rgba(15, 23, 42, 0.20);
    animation: ctaNudge 0.85s ease-in-out infinite;
  }

  @keyframes ctaRotate {
    to { transform: rotate(360deg); }
  }

  @keyframes ctaPulse {
    0%, 100% { transform: scale(0.98); opacity: 0.58; }
    50% { transform: scale(1.05); opacity: 1; }
  }

  @keyframes ctaNudge {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-2px); }
  }

  @media (prefers-reduced-motion: reduce) {
    .ctaHalo, .ctaSweep, .ctaBtnWrapOn :global(.ant-btn) { animation: none; }
  }
`;

export default ClickToAction;
