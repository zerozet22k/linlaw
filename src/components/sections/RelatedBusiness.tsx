"use client";

import React, { useState } from "react";
import {
  Card,
  Typography,
  Divider,
  Tag,
  Button,
  Modal,
  Space,
  List,
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
import {
  HOME_PAGE_SETTINGS_TYPES,
  HOME_PAGE_SETTINGS_KEYS,
} from "@/config/CMS/pages/keys/HOME_PAGE_SETTINGS";

const { Title, Text, Paragraph } = Typography;

type BusinessItem =
  HOME_PAGE_SETTINGS_TYPES[typeof HOME_PAGE_SETTINGS_KEYS.RELATED_BUSINESS][number];

const platformIcons: Record<string, React.ReactNode> = {
  facebook: <FacebookFilled />,
  instagram: <InstagramFilled />,
  twitter: <TwitterCircleFilled />,
  linkedin: <LinkedinFilled />,
};

const RelatedBusiness: React.FC<{ business?: BusinessItem }> = ({
  business,
}) => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  if (!business) return null;

  const hasContacts =
    Array.isArray(business.contacts) && business.contacts.length > 0;
  const hasHours =
    Array.isArray(business.operatingHours) &&
    business.operatingHours.length > 0;
  const hasSocial =
    Array.isArray(business.socialLinks) && business.socialLinks.length > 0;

  return (
    <>
      {/* Compact Card */}
      <Card
        hoverable
        cover={
          business.image && (
            <div
              style={{
                width: "100%",
                paddingTop: "56.25%",
                background: `url(${business.image}) center/cover no-repeat`,
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
          <div style={{ margin: "8px 0" }}>
            {business.tags.map((t, i) => (
              <Tag key={i}>{t.value}</Tag>
            ))}
          </div>
        )}
        <Paragraph ellipsis={{ rows: 3 }}>
          {getTranslatedText(business.description, language)}
        </Paragraph>
        <Space size="middle" style={{ marginTop: 16 }}>
          {business.website && (
            <Button
              type="link"
              icon={<GlobalOutlined />}
              href={business.website}
              target="_blank"
            >
              Website
            </Button>
          )}
          <Button icon={<InfoCircleOutlined />} onClick={() => setOpen(true)}>
            View Details
          </Button>
        </Space>
      </Card>

      {/* Full-Screen Modal */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width="100%"
        style={{ top: 0, padding: 0 }}
        bodyStyle={{ padding: 32 }}
        title={getTranslatedText(business.title, language)}
      >
        <div style={{ maxWidth: 960, margin: "auto" }}>
          {/* Banner */}
          {business.image && (
            <div
              style={{
                width: "100%",
                paddingTop: "45%",
                background: `url(${business.image}) center/cover no-repeat`,
                borderRadius: 8,
                marginBottom: 24,
              }}
            />
          )}

          {/* Basic Info */}
          {business.subtitle && (
            <Title level={5}>
              {getTranslatedText(business.subtitle, language)}
            </Title>
          )}
          <Paragraph style={{ fontSize: 16, marginBottom: 24 }}>
            {getTranslatedText(business.description, language)}
          </Paragraph>

          {/* Contact Info */}
          <List
            itemLayout="horizontal"
            dataSource={[
              business.address && {
                icon: <EnvironmentOutlined />,
                content: <Text>{business.address}</Text>,
              },
              business.email && {
                icon: <MailOutlined />,
                content: (
                  <a href={`mailto:${business.email}`}>
                    <Text>{business.email}</Text>
                  </a>
                ),
              },
              hasContacts && {
                icon: <PhoneOutlined />,
                content: (
                  <div>
                    {business.contacts.map((c, i) => (
                      <div key={i}>
                        <Text strong>{c.name}:</Text>{" "}
                        <a href={`tel:${c.number}`}>{c.number}</a>
                      </div>
                    ))}
                  </div>
                ),
              },
            ].filter(Boolean)}
            renderItem={(item: any) => (
              <List.Item>
                <List.Item.Meta avatar={item.icon} description={item.content} />
              </List.Item>
            )}
          />

          {/* Operating Hours */}
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

          {/* Social Links */}
          {hasSocial && (
            <>
              <Divider>Social Links</Divider>
              <Space size="middle">
                {business.socialLinks?.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noreferrer">
                    {platformIcons[s.platform] || <GlobalOutlined />}{" "}
                    <Text>{s.platform}</Text>
                  </a>
                ))}
              </Space>
            </>
          )}

          {/* Map */}
          {business.mapLink && (
            <>
              <Divider>Map Location</Divider>
              <iframe
                src={business.mapLink}
                style={{ width: "100%", height: 300, border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default RelatedBusiness;
