"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  Typography,
  Button,
  Space,
  Tag,
  Row,
  Col,
  Divider,
  List,
  Result,
} from "antd";
import {
  ArrowLeftOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  LinkOutlined,
} from "@ant-design/icons";

import apiClient from "@/utils/api/apiClient";
import SubLoader from "@/components/loaders/SubLoader";
import { RelatedBusinessAPI } from "@/models/RelatedBusinessModel";
import { useLanguage } from "@/hooks/useLanguage";
import { getTranslatedText } from "@/utils/getTranslatedText";

const { Title, Text, Paragraph } = Typography;

const platformLabel = (p: string) => {
  const x = String(p || "").toLowerCase().trim();
  if (x === "facebook") return "Facebook";
  if (x === "instagram") return "Instagram";
  if (x === "twitter") return "Twitter / X";
  if (x === "linkedin") return "LinkedIn";
  return p?.trim() || "Link";
};

const getEn = (obj: any) => String(obj?.en ?? "").trim();

const normalizeUrl = (url?: string) => {
  const u = String(url || "").trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u}`;
};

const isEmbeddableMapUrl = (url?: string) => {
  const u = String(url || "").trim();
  if (!u) return false;
  return /google\.com\/maps\/embed/i.test(u);
};

const RelatedBusinessSlugPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();

  const slug = String((params as any)?.slug || "").trim();
  const [item, setItem] = useState<RelatedBusinessAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("Invalid slug.");
      setLoading(false);
      return;
    }

    const fetchBySlug = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await apiClient.get(
          `/related-businesses/slug/${encodeURIComponent(slug)}`
        );

        if (res.status === 200 && res.data) {
          setItem(res.data);
          return;
        }

        setError("Not found.");
        setItem(null);
      } catch (e) {
        // If your slug route returns 404 via catch, treat as not found
        // Otherwise show generic error
        const status = (e as any)?.response?.status;
        if (status === 404) {
          setError("Not found.");
          setItem(null);
        } else {
          console.error("Failed to fetch business:", e);
          setError("Failed to load profile.");
          setItem(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBySlug();
  }, [slug]);

  const title = useMemo(() => {
    if (!item) return "";
    return getTranslatedText(item.title, language) || getEn(item.title) || item.slug;
  }, [item, language]);

  const subtitle = useMemo(() => {
    if (!item?.subtitle) return "";
    return getTranslatedText(item.subtitle, language) || "";
  }, [item, language]);

  const desc = useMemo(() => {
    if (!item?.description) return "";
    return getTranslatedText(item.description, language) || "";
  }, [item, language]);

  const tags = useMemo(() => {
    const raw = Array.isArray(item?.tags) ? item!.tags : [];
    return raw.map((t) => String(t?.value || "").trim()).filter(Boolean);
  }, [item]);

  const socialLinks = useMemo(() => {
    const raw = Array.isArray(item?.socialLinks) ? item!.socialLinks : [];
    return raw
      .map((s) => ({
        platform: String(s?.platform || "").trim(),
        url: normalizeUrl(s?.url),
      }))
      .filter((s) => !!s.url);
  }, [item]);

  const hours = useMemo(() => {
    const raw = Array.isArray(item?.operatingHours) ? item!.operatingHours : [];
    return raw.filter((h) => String(h?.day || "").trim());
  }, [item]);

  if (loading) return <SubLoader tip="Loading profile..." />;

  if (error) {
    return (
      <div style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: 20 }}>
        <Card style={{ borderRadius: 16, maxWidth: 560, width: "100%" }}>
          <Result
            status={error === "Not found." ? "404" : "error"}
            title={error === "Not found." ? "Not Found" : "Error"}
            subTitle={error}
            extra={
              <Button type="primary" onClick={() => router.push("/related-businesses")}>
                Back to directory
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  if (!item) {
    return (
      <div style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: 20 }}>
        <Card style={{ borderRadius: 16, maxWidth: 560, width: "100%" }}>
          <Result
            status="404"
            title="Not Found"
            subTitle="This profile does not exist."
            extra={
              <Button type="primary" onClick={() => router.push("/related-businesses")}>
                Back to directory
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  const websiteUrl = normalizeUrl(item.website);
  const mapUrl = normalizeUrl(item.mapLink);
  const address = String(item.address || "").trim();

  const contactRows: { icon: React.ReactNode; label: string; value: React.ReactNode }[] = [];

  if (websiteUrl) {
    contactRows.push({
      icon: <GlobalOutlined />,
      label: "Website",
      value: (
        <a href={websiteUrl} target="_blank" rel="noreferrer">
          {websiteUrl.replace(/^https?:\/\//i, "")}
        </a>
      ),
    });
  }

  if (item.email) {
    const email = String(item.email).trim();
    contactRows.push({
      icon: <MailOutlined />,
      label: "Email",
      value: <a href={`mailto:${email}`}>{email}</a>,
    });
  }

  if (address) {
    contactRows.push({
      icon: <EnvironmentOutlined />,
      label: "Address",
      value: <div style={{ whiteSpace: "pre-line" }}>{address}</div>,
    });
  }

  if (Array.isArray(item.contacts) && item.contacts.length > 0) {
    contactRows.push({
      icon: <PhoneOutlined />,
      label: "Phone",
      value: (
        <Space direction="vertical" size={4}>
          {item.contacts.map((c, i) => {
            const name = String(c?.name || "").trim();
            const number = String(c?.number || "").trim().replace(/\s+/g, "");
            if (!number) return null;
            return (
              <div key={`${number}-${i}`}>
                {!!name && <Text strong>{name}: </Text>}
                <a href={`tel:${number}`}>{number}</a>
              </div>
            );
          })}
        </Space>
      ),
    });
  }

  return (
    <div style={{ width: "100%", background: "#fff" }}>
      {/* HERO */}
      <div
        style={{
          background:
            "radial-gradient(900px 260px at 18% 0%, rgba(15,23,42,0.09) 0%, rgba(15,23,42,0) 60%), linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
          borderBottom: "1px solid rgba(15,23,42,0.08)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px 26px" }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push("/related-businesses")}
            style={{ borderRadius: 999, marginBottom: 14 }}
          >
            Back to directory
          </Button>

          <Row gutter={[20, 20]} align="middle">
            <Col xs={24} md={16}>
              <Text style={{ letterSpacing: 2, fontSize: 12, color: "rgba(15,23,42,0.65)" }}>
                PARTNER PROFILE
              </Text>

              <Title style={{ margin: "6px 0 6px", fontSize: 40, lineHeight: 1.1 }}>
                {title}
              </Title>

              {!!subtitle && (
                <Text type="secondary" style={{ fontSize: 16, lineHeight: 1.5 }}>
                  {subtitle}
                </Text>
              )}

              {tags.length > 0 && (
                <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {tags.map((t, i) => (
                    <Tag
                      key={`${t}-${i}`}
                      style={{
                        borderRadius: 999,
                        padding: "4px 12px",
                        background: "rgba(15,23,42,0.04)",
                        border: "1px solid rgba(15,23,42,0.10)",
                      }}
                    >
                      {t}
                    </Tag>
                  ))}
                </div>
              )}

              <div style={{ marginTop: 16 }}>
                <Space wrap>
                  {websiteUrl && (
                    <Button
                      type="primary"
                      icon={<GlobalOutlined />}
                      href={websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        borderRadius: 999,
                        background: "#0f172a",
                        borderColor: "#0f172a",
                      }}
                    >
                      Visit website
                    </Button>
                  )}
                  {mapUrl && (
                    <Button
                      icon={<EnvironmentOutlined />}
                      href={mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ borderRadius: 999 }}
                    >
                      Open map
                    </Button>
                  )}
                </Space>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <Card
                style={{
                  borderRadius: 18,
                  border: "1px solid rgba(15,23,42,0.08)",
                }}
                styles={{ body: { padding: 14 } }}
              >
                <div
                  style={{
                    width: "100%",
                    paddingTop: "62%",
                    borderRadius: 14,
                    background: item.image
                      ? `url(${item.image}) center/contain no-repeat, linear-gradient(135deg, rgba(15,23,42,0.10), rgba(15,23,42,0.03))`
                      : "linear-gradient(135deg, rgba(15,23,42,0.10), rgba(15,23,42,0.03))",
                  }}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* BODY */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "22px 20px 70px" }}>
        <Row gutter={[18, 18]}>
          <Col xs={24} md={16}>
            <Card
              style={{ borderRadius: 18, border: "1px solid rgba(15,23,42,0.08)" }}
              styles={{ body: { padding: 22 } }}
            >
              <Title level={4} style={{ marginTop: 0 }}>
                Overview
              </Title>

              {!!desc ? (
                <Paragraph style={{ fontSize: 16, color: "rgba(15,23,42,0.82)" }}>
                  {desc}
                </Paragraph>
              ) : (
                <Text type="secondary">No description provided.</Text>
              )}

              {socialLinks.length > 0 && (
                <>
                  <Divider style={{ margin: "18px 0" }} />
                  <Title level={5} style={{ marginTop: 0 }}>
                    Social links
                  </Title>

                  <List
                    dataSource={socialLinks}
                    renderItem={(s) => (
                      <List.Item>
                        <Space>
                          <LinkOutlined />
                          <a href={s.url} target="_blank" rel="noreferrer">
                            {platformLabel(s.platform)}
                          </a>
                        </Space>
                      </List.Item>
                    )}
                  />
                </>
              )}

              {hours.length > 0 && (
                <>
                  <Divider style={{ margin: "18px 0" }} />
                  <Title level={5} style={{ marginTop: 0 }}>
                    Operating hours
                  </Title>

                  <List
                    dataSource={hours}
                    renderItem={(h) => (
                      <List.Item>
                        <Space>
                          <ClockCircleOutlined />
                          <Text>
                            <Text strong>{h.day}:</Text> {h.open} – {h.close}
                          </Text>
                        </Space>
                      </List.Item>
                    )}
                  />
                </>
              )}

              {/* Embed only if it's an embed URL; otherwise don't iframe it */}
              {mapUrl && isEmbeddableMapUrl(mapUrl) && (
                <>
                  <Divider style={{ margin: "18px 0" }} />
                  <Title level={5} style={{ marginTop: 0 }}>
                    Map location
                  </Title>

                  <iframe
                    src={mapUrl}
                    style={{
                      width: "100%",
                      height: 340,
                      border: 0,
                      borderRadius: 14,
                      background: "#fff",
                    }}
                    loading="lazy"
                    allowFullScreen
                  />
                </>
              )}
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card
              style={{ borderRadius: 18, border: "1px solid rgba(15,23,42,0.08)" }}
              styles={{ body: { padding: 18 } }}
            >
              <Title level={5} style={{ marginTop: 0, marginBottom: 10 }}>
                Contact details
              </Title>

              {contactRows.length === 0 ? (
                <Text type="secondary">No contact details provided.</Text>
              ) : (
                <List
                  itemLayout="horizontal"
                  dataSource={contactRows}
                  renderItem={(r) => (
                    <List.Item style={{ paddingLeft: 0, paddingRight: 0 }}>
                      <List.Item.Meta
                        avatar={<div style={{ fontSize: 18, color: "rgba(15,23,42,0.70)" }}>{r.icon}</div>}
                        title={<Text strong>{r.label}</Text>}
                        description={<div style={{ color: "rgba(15,23,42,0.82)" }}>{r.value}</div>}
                      />
                    </List.Item>
                  )}
                />
              )}

              {/* If map is not embeddable, at least show a clear action here too */}
              {mapUrl && !isEmbeddableMapUrl(mapUrl) && (
                <div style={{ marginTop: 12 }}>
                  <Button
                    icon={<EnvironmentOutlined />}
                    href={mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ borderRadius: 999 }}
                    block
                  >
                    Open map
                  </Button>
                </div>
              )}
            </Card>

            {!item.isActive && (
              <Card
                style={{
                  marginTop: 14,
                  borderRadius: 18,
                  border: "1px solid rgba(239,68,68,0.25)",
                  background: "rgba(239,68,68,0.04)",
                }}
              >
                <Text strong style={{ color: "rgba(185,28,28,1)" }}>
                  This partner is currently marked as inactive.
                </Text>
              </Card>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default RelatedBusinessSlugPage;
