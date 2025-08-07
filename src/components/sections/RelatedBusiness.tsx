"use client";

import React, { useState } from "react";
import {
  Card,
  Typography,
  Tag,
  Button,
  Modal,
  Space,
  List,
  Divider,
} from "antd";
import {
  PhoneOutlined,
  GlobalOutlined,
  InfoCircleOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  FacebookFilled,
  InstagramFilled,
  TwitterCircleFilled,
  LinkedinFilled,
} from "@ant-design/icons";

import { getTranslatedText } from "@/utils/getTranslatedText";
import { useLanguage } from "@/hooks/useLanguage";
import { commonTranslations } from "@/translations";
import {
  HOME_PAGE_SETTINGS_KEYS,
  HOME_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/HOME_PAGE_SETTINGS";

const { Title, Text, Paragraph } = Typography;

/* ───────── types ───────── */
type BusinessItem =
  HOME_PAGE_SETTINGS_TYPES[typeof HOME_PAGE_SETTINGS_KEYS.RELATED_BUSINESS]["items"][number];

const platformIcons: Record<string, React.ReactNode> = {
  facebook:  <FacebookFilled />,
  instagram: <InstagramFilled />,
  twitter:   <TwitterCircleFilled />,
  linkedin:  <LinkedinFilled />,
};

/* ────────────────────────────────────────────────────────────── */
const RelatedBusiness: React.FC<{ business?: BusinessItem }> = ({ business }) => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  if (!business) return null;

  /* i18n labels */
  const tWebsite      = "Website";
  const tViewDetails  = getTranslatedText(commonTranslations.details, language) || "View Details";
  const tOperatingHrs = "Operating Hours";
  const tSocialLinks  = "Social Links";
  const tMapLocation  = "Map Location";

  /* helpers */
  const hasContacts = Array.isArray(business.contacts)       && business.contacts.length       > 0;
  const hasHours    = Array.isArray(business.operatingHours) && business.operatingHours.length > 0;
  const hasSocial   = Array.isArray(business.socialLinks)    && business.socialLinks.length    > 0;

  /* contact array ready for <List> */
  const contactItems: { icon: React.ReactNode; content: React.ReactNode }[] = [];
  if (business.address)
    contactItems.push({ icon: <EnvironmentOutlined />, content: business.address });
  if (business.email)
    contactItems.push({
      icon: <MailOutlined />,
      content: <a href={`mailto:${business.email}`}>{business.email}</a>,
    });
  if (hasContacts)
    contactItems.push({
      icon: <PhoneOutlined />,
      content: (
        <>
          {business.contacts!.map((c, i) => (
            <div key={i}>
              <Text strong>{c.name}: </Text>
              <a href={`tel:${c.number}`}>{c.number}</a>
            </div>
          ))}
        </>
      ),
    });

  /* ───────────────────────── UI ───────────────────────── */
  return (
    <>
      {/* ── Compact card on the page ─────────────────── */}
      <Card
        hoverable
        cover={
          business.image && (
            <div
              style={{
                width: "100%",
                paddingTop: "56.25%",              /* 16 : 9 */
                background: `url(${business.image}) center/cover no-repeat`,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              }}
            />
          )
        }
        style={{ maxWidth: 500, margin: "auto", borderRadius: 12 }}
        bodyStyle={{ padding: 20 }}
      >
        <Title level={4}>{getTranslatedText(business.title, language)}</Title>

        {business.subtitle && (
          <Text type="secondary">
            {getTranslatedText(business.subtitle, language)}
          </Text>
        )}

        {Array.isArray(business.tags) && business.tags.length > 0 && (
          <div style={{ margin: "8px 0 12px" }}>
            {business.tags.map((t, i) => (
              <Tag key={i}>{t.value}</Tag>
            ))}
          </div>
        )}

        <Paragraph ellipsis={{ rows: 3 }}>
          {getTranslatedText(business.description, language)}
        </Paragraph>

        <Space size="middle">
          {business.website && (
            <Button
              type="link"
              icon={<GlobalOutlined />}
              href={business.website}
              target="_blank"
            >
              {tWebsite}
            </Button>
          )}
          <Button icon={<InfoCircleOutlined />} onClick={() => setOpen(true)}>
            {tViewDetails}
          </Button>
        </Space>
      </Card>

      {/* ── FULL-SCREEN OVERLAY ─────────────────────── */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width="100vw"
        centered={false}
        style={{ top: 0, padding: 0 }}                 /* no offset, no side-gutter */
        bodyStyle={{ padding: 0 }}
        title={getTranslatedText(business.title, language)}
      >
        {/* single scroll zone */}
        <div
          style={{
            height: "calc(100vh - 100px)",             /* 55 ≈ header height */
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* banner/logo full-width */}
          {business.image && (
            <div
              style={{
                width: "100%",
                paddingTop: "56%",
                background: `url(${business.image}) center/contain no-repeat`,
              }}
            />
          )}

          {/* content column */}
          <div style={{ maxWidth: 960, margin: "0 auto", padding: 32 }}>
            {business.subtitle && (
              <Title level={5}>
                {getTranslatedText(business.subtitle, language)}
              </Title>
            )}

            <Paragraph style={{ fontSize: 16 }}>
              {getTranslatedText(business.description, language)}
            </Paragraph>

            {/* contacts */}
            {contactItems.length > 0 && (
              <List
                itemLayout="horizontal"
                dataSource={contactItems}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={item.icon}
                      description={item.content}
                    />
                  </List.Item>
                )}
              />
            )}

            {/* hours */}
            {hasHours && (
              <>
                <Divider>{tOperatingHrs}</Divider>
                <List
                  dataSource={business.operatingHours}
                  renderItem={(h) => (
                    <List.Item>
                      <ClockCircleOutlined style={{ marginRight: 8 }} />
                      <Text>
                        {h.day}: {h.open} – {h.close}
                      </Text>
                    </List.Item>
                  )}
                />
              </>
            )}

            {/* socials */}
            {hasSocial && (
              <>
                <Divider>{tSocialLinks}</Divider>
                <Space size="large" wrap>
                  {business.socialLinks!.map((s, i) => (
                    <a
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      {platformIcons[s.platform] || <GlobalOutlined />}
                      <span>{s.platform}</span>
                    </a>
                  ))}
                </Space>
              </>
            )}

            {/* map */}
            {business.mapLink && (
              <>
                <Divider>{tMapLocation}</Divider>
                <iframe
                  src={business.mapLink}
                  style={{
                    width: "100%",
                    height: 320,
                    border: 0,
                    borderRadius: 8,
                  }}
                  allowFullScreen
                  loading="lazy"
                />
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RelatedBusiness;
