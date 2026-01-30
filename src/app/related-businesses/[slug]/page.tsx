"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Typography, Button, Space, Tag, Row, Col, Divider, List, Result, theme } from "antd";
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
import { t } from "@/i18n";
import { normalizeUrl, isEmbeddableMapUrl, platformLabel } from "@/utils/urlUtils";

const { Title, Text, Paragraph } = Typography;

const RelatedBusinessSlugPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const { token } = theme.useToken();

  const slug = String((params as any)?.slug || "").trim();
  const [item, setItem] = useState<RelatedBusinessAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tLoadingProfile = useMemo(() => t(language, "relatedBusinesses.loadingProfile"), [language]);
  const tInvalidSlug = useMemo(() => t(language, "relatedBusinesses.invalidSlug"), [language]);
  const tNotFound = useMemo(() => t(language, "common.notFound"), [language]);
  const tError = useMemo(() => t(language, "common.error"), [language]);
  const tFailedToLoadProfile = useMemo(() => t(language, "relatedBusinesses.failedToLoadProfile"), [language]);

  const tBackToDirectory = useMemo(() => t(language, "relatedBusinesses.backToDirectory"), [language]);

  const tPartnerProfile = useMemo(() => t(language, "relatedBusinesses.partnerProfile"), [language]);

  const tWebsiteLabel = useMemo(() => t(language, "common.website"), [language]);
  const tEmailLabel = useMemo(() => t(language, "contact.email"), [language]);
  const tAddressLabel = useMemo(() => t(language, "common.address"), [language]);
  const tPhoneLabel = useMemo(() => t(language, "contact.phone"), [language]);

  const tVisitWebsite = useMemo(() => t(language, "relatedBusinesses.visitWebsite"), [language]);
  const tOpenMap = useMemo(() => t(language, "relatedBusinesses.openMap"), [language]);

  const tOverview = useMemo(() => t(language, "relatedBusinesses.overview"), [language]);
  const tNoDescription = useMemo(() => t(language, "relatedBusinesses.noDescription"), [language]);

  const tSocialLinks = useMemo(() => t(language, "relatedBusinesses.socialLinks"), [language]);
  const tOperatingHours = useMemo(() => t(language, "relatedBusinesses.operatingHours"), [language]);
  const tMapLocation = useMemo(() => t(language, "relatedBusinesses.mapLocation"), [language]);

  const tContactDetails = useMemo(() => t(language, "relatedBusinesses.contactDetails"), [language]);
  const tNoContactDetails = useMemo(() => t(language, "relatedBusinesses.noContactDetails"), [language]);

  const tInactivePartner = useMemo(() => t(language, "relatedBusinesses.inactivePartner"), [language]);

  useEffect(() => {
    if (!slug) {
      setError(tInvalidSlug);
      setLoading(false);
      return;
    }

    const fetchBySlug = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await apiClient.get(`/related-businesses/slug/${encodeURIComponent(slug)}`);

        if (res.status === 200 && res.data) {
          setItem(res.data);
          return;
        }

        setError(tNotFound);
        setItem(null);
      } catch (e) {
        const status = (e as any)?.response?.status;
        if (status === 404) {
          setError(tNotFound);
          setItem(null);
        } else {
          console.error("Failed to fetch business:", e);
          setError(tFailedToLoadProfile);
          setItem(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBySlug();
  }, [slug, tInvalidSlug, tNotFound, tFailedToLoadProfile]);

  const title = useMemo(() => {
    if (!item) return "";
    return t(language, item.title, item.slug);
  }, [item, language]);

  const subtitle = useMemo(() => {
    if (!item?.subtitle) return "";
    return t(language, item.subtitle, "");
  }, [item, language]);

  const desc = useMemo(() => {
    if (!item?.description) return "";
    return t(language, item.description, "");
  }, [item, language]);

  const tags = useMemo(() => {
    const raw = Array.isArray(item?.tags) ? item!.tags : [];
    return raw.map((x) => String(x?.value || "").trim()).filter(Boolean);
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

  if (loading) return <SubLoader tip={tLoadingProfile} />;

  if (error) {
    const isNotFound = error === tNotFound;

    return (
      <div style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: 20 }}>
        <Card
          style={{
            borderRadius: 16,
            maxWidth: 560,
            width: "100%",
            background: token.colorBgContainer,
            border: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <Result
            status={isNotFound ? "404" : "error"}
            title={isNotFound ? tNotFound : tError}
            subTitle={error}
            extra={
              <Button type="primary" onClick={() => router.push("/related-businesses")}>
                {tBackToDirectory}
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
        <Card
          style={{
            borderRadius: 16,
            maxWidth: 560,
            width: "100%",
            background: token.colorBgContainer,
            border: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <Result
            status="404"
            title={tNotFound}
            subTitle={t(language, "relatedBusinesses.profileDoesNotExist")}
            extra={
              <Button type="primary" onClick={() => router.push("/related-businesses")}>
                {tBackToDirectory}
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
      label: tWebsiteLabel,
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
      label: tEmailLabel,
      value: <a href={`mailto:${email}`}>{email}</a>,
    });
  }

  if (address) {
    contactRows.push({
      icon: <EnvironmentOutlined />,
      label: tAddressLabel,
      value: <div style={{ whiteSpace: "pre-line" }}>{address}</div>,
    });
  }

  if (Array.isArray(item.contacts) && item.contacts.length > 0) {
    contactRows.push({
      icon: <PhoneOutlined />,
      label: tPhoneLabel,
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
    <div style={{ width: "100%", background: token.colorBgBase }}>
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
            {tBackToDirectory}
          </Button>

          <Row gutter={[20, 20]} align="middle">
            <Col xs={24} md={16}>
              <Text style={{ letterSpacing: 2, fontSize: 12, color: "rgba(15,23,42,0.65)" }}>{tPartnerProfile}</Text>

              <Title style={{ margin: "6px 0 6px", fontSize: 40, lineHeight: 1.1 }}>{title}</Title>

              {!!subtitle && (
                <Text type="secondary" style={{ fontSize: 16, lineHeight: 1.5 }}>
                  {subtitle}
                </Text>
              )}

              {tags.length > 0 && (
                <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {tags.map((x, i) => (
                    <Tag
                      key={`${x}-${i}`}
                      style={{
                        borderRadius: 999,
                        padding: "4px 12px",
                        background: "rgba(15,23,42,0.04)",
                        border: "1px solid rgba(15,23,42,0.10)",
                      }}
                    >
                      {x}
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
                      style={{ borderRadius: 999, background: "#0f172a", borderColor: "#0f172a" }}
                    >
                      {tVisitWebsite}
                    </Button>
                  )}

                  {mapUrl && (
                    <Button icon={<EnvironmentOutlined />} href={mapUrl} target="_blank" rel="noreferrer" style={{ borderRadius: 999 }}>
                      {tOpenMap}
                    </Button>
                  )}
                </Space>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <Card style={{ borderRadius: 18, border: "1px solid rgba(15,23,42,0.08)" }} styles={{ body: { padding: 14 } }}>
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
            <Card style={{ borderRadius: 18, border: "1px solid rgba(15,23,42,0.08)" }} styles={{ body: { padding: 22 } }}>
              <Title level={4} style={{ marginTop: 0 }}>
                {tOverview}
              </Title>

              {!!desc ? (
                <Paragraph style={{ fontSize: 16, color: "rgba(15,23,42,0.82)" }}>{desc}</Paragraph>
              ) : (
                <Text type="secondary">{tNoDescription}</Text>
              )}

              {socialLinks.length > 0 && (
                <>
                  <Divider style={{ margin: "18px 0" }} />
                  <Title level={5} style={{ marginTop: 0 }}>
                    {tSocialLinks}
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
                    {tOperatingHours}
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

              {mapUrl && isEmbeddableMapUrl(mapUrl) && (
                <>
                  <Divider style={{ margin: "18px 0" }} />
                  <Title level={5} style={{ marginTop: 0 }}>
                    {tMapLocation}
                  </Title>

                  <iframe
                    src={mapUrl}
                    style={{ width: "100%", height: 340, border: 0, borderRadius: 14, background: "#fff" }}
                    loading="lazy"
                    allowFullScreen
                  />
                </>
              )}
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card style={{ borderRadius: 18, border: "1px solid rgba(15,23,42,0.08)" }} styles={{ body: { padding: 18 } }}>
              <Title level={5} style={{ marginTop: 0, marginBottom: 10 }}>
                {tContactDetails}
              </Title>

              {contactRows.length === 0 ? (
                <Text type="secondary">{tNoContactDetails}</Text>
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

              {mapUrl && !isEmbeddableMapUrl(mapUrl) && (
                <div style={{ marginTop: 12 }}>
                  <Button icon={<EnvironmentOutlined />} href={mapUrl} target="_blank" rel="noreferrer" style={{ borderRadius: 999 }} block>
                    {tOpenMap}
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
                  {tInactivePartner}
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
