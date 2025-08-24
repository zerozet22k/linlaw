"use client";

import React, { useEffect, useState } from "react";
import { Card, Typography, Tag, Button, List, Divider, Space } from "antd";
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
  CloseOutlined,
} from "@ant-design/icons";
import { createPortal } from "react-dom";

import { getTranslatedText } from "@/utils/getTranslatedText";
import { useLanguage } from "@/hooks/useLanguage";
import { commonTranslations } from "@/translations";
import {
  HOME_PAGE_SETTINGS_KEYS,
  HOME_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/HOME_PAGE_SETTINGS";

const { Title, Text, Paragraph } = Typography;

type BusinessItem =
  HOME_PAGE_SETTINGS_TYPES[typeof HOME_PAGE_SETTINGS_KEYS.RELATED_BUSINESS]["items"][number];

const platformIcons: Record<string, React.ReactNode> = {
  facebook: <FacebookFilled />,
  instagram: <InstagramFilled />,
  twitter: <TwitterCircleFilled />,
  linkedin: <LinkedinFilled />,
};

const useBodyLock = (locked: boolean) => {
  useEffect(() => {
    const original = document.body.style.overflow;
    if (locked) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
};

const RelatedBusiness: React.FC<{ business?: BusinessItem }> = ({ business }) => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useBodyLock(open);
  useEffect(() => setMounted(true), []);

  if (!business) return null;

  const tWebsite = "Website";
  const tViewDetails =
    getTranslatedText(commonTranslations.details, language) || "View Details";
  const tOperatingHrs = "Operating Hours";
  const tSocialLinks = "Social Links";
  const tMapLocation = "Map Location";

  const hasContacts =
    Array.isArray(business.contacts) && business.contacts.length > 0;
  const hasHours =
    Array.isArray(business.operatingHours) && business.operatingHours.length > 0;
  const hasSocial =
    Array.isArray(business.socialLinks) && business.socialLinks.length > 0;

  const contactItems: { icon: React.ReactNode; content: React.ReactNode }[] = [];
  if (business.address)
    contactItems.push({
      icon: <EnvironmentOutlined />,
      content: business.address,
    });
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

  const card = (
    <Card
      hoverable
      cover={
        business.image && (
          <div
            style={{
              width: "100%",
              paddingTop: "56.25%",
              background: `url(${business.image}) center/cover no-repeat`,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
          />
        )
      }
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
      }}
      styles={{
        body: {
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          height: "100%",
        },
      }}
    >
      <Title level={4} style={{ margin: 0 }}>
        {getTranslatedText(business.title, language)}
      </Title>

      {business.subtitle && (
        <Text type="secondary">
          {getTranslatedText(business.subtitle, language)}
        </Text>
      )}

      {Array.isArray(business.tags) && business.tags.length > 0 && (
        <div style={{ marginTop: 4 }}>
          {business.tags.map((t, i) => (
            <Tag key={i}>{t.value}</Tag>
          ))}
        </div>
      )}

      <Paragraph ellipsis={{ rows: 3 }} style={{ margin: 0, flexGrow: 1 }}>
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
  );

  const overlay =
    open && mounted
      ? createPortal(
          <div
            style={{
              width: "100vw",
              height: "100vh",
              position: "fixed",
              inset: 0,
              zIndex: 1300,
              background: "#fff",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Button
              shape="circle"
              icon={<CloseOutlined />}
              onClick={() => setOpen(false)}
              style={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}
              aria-label="Close details"
            />

            <div
              style={{
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {business.image && (
                <div
                  style={{
                    width: "100%",
                    height: "min(60vh, 420px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#fff",
                  }}
                >
                  <img
                    src={business.image}
                    alt={getTranslatedText(business.title, language) || "logo"}
                    style={{
                      maxWidth: "90%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </div>
              )}

              <div
                style={{
                  maxWidth: 960,
                  margin: "0 auto",
                  padding: "24px 16px 40px",
                  boxSizing: "border-box",
                }}
              >
                {business.subtitle && (
                  <Title level={5} style={{ marginTop: 0 }}>
                    {getTranslatedText(business.subtitle, language)}
                  </Title>
                )}

                <Paragraph style={{ fontSize: 16 }}>
                  {getTranslatedText(business.description, language)}
                </Paragraph>

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

                {hasHours && (
                  <>
                    <Divider>Operating Hours</Divider>
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

                {hasSocial && (
                  <>
                    <Divider>Social Links</Divider>
                    <Space size="large" wrap>
                      {business.socialLinks!.map((s) => (
                        <a
                          key={s.platform}
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

                {business.mapLink && (
                  <>
                    <Divider>Map Location</Divider>
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
          </div>,
          document.body
        )
      : null;

  return (
    <>
      {card}
      {overlay}
    </>
  );
};

export default RelatedBusiness;
