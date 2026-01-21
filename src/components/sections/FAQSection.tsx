/* components/sections/FAQSection.tsx */
"use client";

import React, { useMemo, useState } from "react";
import { Collapse, Button, theme, Typography } from "antd";
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

type NormalizedFaq = {
  key: string;
  q: string;
  a: string;
  perks: string[];
};

const clean = (s: string) => (s || "").replace(/\s+/g, " ").trim();
const clamp = (s: string, n: number) =>
  s.length > n ? `${s.slice(0, n).trim()}…` : s;

const FAQSection: React.FC<{ data: FAQData; language: string }> = ({
  data,
  language,
}) => {
  const { token } = theme.useToken();

  const [activeKey, setActiveKey] = useState<string>();
  const [expandedBodies, setExpandedBodies] = useState<Set<string>>(
    () => new Set()
  );

  const rawItems = useMemo(
    () => (Array.isArray((data as any)?.items) ? (data as any).items : []),
    [data]
  );

  const faqs = useMemo<NormalizedFaq[]>(() => {
    return rawItems
      .map((faq: any, index: number): NormalizedFaq => {
        const q = clean(getTranslatedText(faq.question, language) || "");
        const a = clean(getTranslatedText(faq.answer, language) || "");
        const perks = Array.isArray(faq.list)
          ? faq.list
              .map((li: any) =>
                clean(getTranslatedText(li?.answer, language) || "")
              )
              .filter(Boolean)
          : [];
        const key = String(faq._id || faq.id || index);
        return { key, q, a, perks };
      })
      .filter((f: any) => !!f.q || !!f.a || f.perks.length > 0);
  }, [rawItems, language]);

  const tReadMore = clean(
    getTranslatedText(commonTranslations.readMore, language) || "Read More"
  );
  const tReadLess = clean(
    getTranslatedText(commonTranslations.readLess, language) || "Read Less"
  );

  const toggleBody = (key: string) => {
    setExpandedBodies((prev) => {
      const next = new Set(prev);

      // ESLint-friendly: no ternary side-effects
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }

      return next;
    });
  };

  const items = useMemo<NonNullable<CollapseProps["items"]>>(() => {
    const border = `1px solid ${token.colorBorderSecondary}`;

    return faqs.map((f) => {
      const isOpen = activeKey === f.key;
      const isBodyExpanded = expandedBodies.has(f.key);

      const preview = clamp(f.a, 200);
      const showToggle = f.a.length > 200;

      const label = (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
            padding: "16px 18px",
            width: "100%",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 15.5,
                fontWeight: 750,
                lineHeight: 1.35,
                color: token.colorText,
                wordBreak: "break-word",
              }}
            >
              {f.q}
            </div>
          </div>

          <span
            aria-hidden
            style={{
              width: 32,
              height: 32,
              borderRadius: 12,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: token.colorFillTertiary,
              border,
              color: token.colorTextSecondary,
              flex: "0 0 auto",
            }}
          >
            {isOpen ? <MinusOutlined /> : <PlusOutlined />}
          </span>
        </div>
      );

      const children = (
        <div style={{ padding: "0 18px 16px" }}>
          {f.a ? (
            <Text
              style={{
                display: "block",
                fontSize: 14.8,
                lineHeight: 1.8,
                color: token.colorTextSecondary,
                whiteSpace: "pre-line",
                marginBottom: f.perks.length || showToggle ? 10 : 0,
              }}
            >
              {isBodyExpanded ? f.a : preview}
            </Text>
          ) : null}

          {f.perks.length ? (
            <ul
              style={{
                margin: 0,
                paddingLeft: 18,
                color: token.colorTextSecondary,
                lineHeight: 1.8,
              }}
            >
              {f.perks.slice(0, 8).map((p, i) => (
                <li key={`${f.key}-perk-${i}`}>{p}</li>
              ))}
            </ul>
          ) : null}

          {showToggle ? (
            <Button
              type="link"
              onClick={(e) => {
                e.stopPropagation();
                toggleBody(f.key);
              }}
              style={{
                padding: 0,
                height: "auto",
                fontSize: 14,
                fontWeight: 650,
              }}
            >
              {isBodyExpanded ? tReadLess : tReadMore}
            </Button>
          ) : null}
        </div>
      );

      return {
        key: f.key,
        label,
        children,
        style: {
          background: token.colorBgContainer,
          border,
          borderRadius: token.borderRadiusLG,
          marginBottom: 12,
          overflow: "hidden",
        },
      };
    });
  }, [faqs, token, activeKey, expandedBodies, tReadMore, tReadLess]);

  if (!items.length) return null;

  const shellBorder = `1px solid ${token.colorBorderSecondary}`;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 980,
        margin: "0 auto",
        borderRadius: token.borderRadiusLG,
        border: shellBorder,
        background: token.colorBgContainer,
        overflow: "hidden",
      }}
    >
      <Collapse
        className="faq-clean"
        accordion
        bordered={false}
        items={items}
        activeKey={activeKey}
        onChange={(key) => setActiveKey(Array.isArray(key) ? key[0] : key)}
        expandIcon={() => null}
        style={{ background: "transparent" }}
      />

      <style jsx global>{`
        .faq-clean.ant-collapse > .ant-collapse-item {
          border-bottom: 0 !important;
        }
        .faq-clean.ant-collapse > .ant-collapse-item > .ant-collapse-header {
          padding: 0 !important;
        }
        .faq-clean.ant-collapse
          > .ant-collapse-item
          > .ant-collapse-content
          > .ant-collapse-content-box {
          padding: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default FAQSection;
