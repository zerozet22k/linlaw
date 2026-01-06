/* components/sections/FAQSection.tsx */
"use client";

import React, { useMemo, useState } from "react";
import { Collapse, Card, Button, theme, Typography } from "antd";
import type { CollapseProps } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { getTranslatedText } from "@/utils/getTranslatedText";
import {
  HOME_PAGE_SETTINGS_KEYS as K,
  HOME_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/HOME_PAGE_SETTINGS";
import { commonTranslations } from "@/translations";

const { Text } = Typography;

type FAQData = HOME_PAGE_SETTINGS_TYPES[typeof K.FAQS_SECTION];

interface FAQSectionProps {
  data: FAQData;
  language: string;
}

const clampText = (s: string, n: number) => {
  const t = (s || "").trim();
  if (!t) return "";
  return t.length > n ? `${t.slice(0, n).trim()}…` : t;
};

const FAQSection: React.FC<FAQSectionProps> = ({ data, language }) => {
  const { token } = theme.useToken();

  // track which answers are expanded (for Read More / Read Less)
  const [expandedBodies, setExpandedBodies] = useState<Set<string>>(new Set());

  // accordion open key
  const [activeKey, setActiveKey] = useState<string | undefined>();

  const rawItems = useMemo(
    () => (Array.isArray((data as any)?.items) ? (data as any).items : []),
    [data]
  );

  const tReadMore =
    getTranslatedText(commonTranslations.readMore, language) || "Read More";
  const tReadLess =
    getTranslatedText(commonTranslations.readLess, language) || "Read Less";

  const toggleBody = (itemKey: string) => {
    setExpandedBodies((prev) => {
      const next = new Set(prev);
      if (next.has(itemKey)) next.delete(itemKey);
      else next.add(itemKey);
      return next;
    });
  };

  const baseShadow =
    (token as any).boxShadowSecondary || "0 8px 24px rgba(0,0,0,0.06)";

  const collapseItems = useMemo<NonNullable<CollapseProps["items"]>>(() => {
    if (!rawItems || rawItems.length === 0) return [];

    const built: NonNullable<CollapseProps["items"]> = [];

    rawItems.forEach((faq: any, index: number) => {
      const q = (getTranslatedText(faq.question, language) || "").trim();
      const a = (getTranslatedText(faq.answer, language) || "").trim();
      if (!q && !a) return;

      const itemKey = String(faq._id || faq.id || index);
      const isOpen = activeKey === itemKey;

      const isBodyExpanded = expandedBodies.has(itemKey);
      const preview = clampText(a, 160);
      const showToggle = a.length > 160;

      const label = (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            width: "100%",
            padding: "18px 22px",
          }}
        >
          <span
            aria-hidden
            style={{
              width: 28,
              height: 28,
              borderRadius: 10,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: token.colorFillTertiary,
              border: `1px solid ${token.colorBorderSecondary}`,
              color: token.colorTextSecondary,
              flex: "0 0 auto",
              marginTop: 1,
            }}
          >
            {isOpen ? <MinusOutlined /> : <PlusOutlined />}
          </span>

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                lineHeight: 1.35,
                color: token.colorText,
                wordBreak: "break-word",
              }}
            >
              {q}
            </div>
          </div>
        </div>
      );

      const children = (
        <div style={{ padding: "0 22px 18px 62px" }}>
          <Text
            style={{
              display: "block",
              fontSize: 15,
              lineHeight: 1.75,
              color: token.colorTextSecondary,
              whiteSpace: "pre-line",
              marginBottom: showToggle ? 8 : 0,
            }}
          >
            {isBodyExpanded ? a : preview}
          </Text>

          {showToggle && (
            <Button
              type="link"
              onClick={(e) => {
                e.stopPropagation(); // avoid accordion toggling
                toggleBody(itemKey);
              }}
              style={{
                padding: 0,
                height: "auto",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {isBodyExpanded ? tReadLess : tReadMore}
            </Button>
          )}
        </div>
      );

      built.push({
        key: itemKey,
        label,
        children,
        style: {
          background: "transparent",
          borderBottom: `1px solid ${token.colorSplit}`,
        },
      });
    });

    return built;
  }, [rawItems, language, token, activeKey, expandedBodies, tReadMore, tReadLess]);

  // ✅ safe early return AFTER all hooks
  if (rawItems.length === 0 || collapseItems.length === 0) return null;

  return (
    <Card
      bordered={false}
      style={{
        width: "100%",
        maxWidth: 1000,
        margin: "0 auto",
        borderRadius: token.borderRadiusLG,
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        boxShadow: baseShadow,
        overflow: "hidden",
      }}
      styles={{ body: { padding: 0 } }}
    >
      <Collapse
        className="faq-collapse"
        accordion
        bordered={false}
        items={collapseItems}
        activeKey={activeKey}
        onChange={(key) => setActiveKey(Array.isArray(key) ? key[0] : key)}
        expandIcon={() => null}
        style={{ background: "transparent" }}
      />

      <style jsx global>{`
        .faq-collapse.ant-collapse > .ant-collapse-item > .ant-collapse-header {
          padding: 0 !important;
        }
        .faq-collapse.ant-collapse
          > .ant-collapse-item
          > .ant-collapse-content
          > .ant-collapse-content-box {
          padding: 0 !important;
        }
      `}</style>
    </Card>
  );
};

export default FAQSection;
