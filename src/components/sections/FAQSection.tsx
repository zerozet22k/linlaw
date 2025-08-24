/* components/sections/FAQSection.tsx */
"use client";

import React, { useState } from "react";
import { Collapse, Card, Button } from "antd";
import { getTranslatedText } from "@/utils/getTranslatedText";
import {
  HOME_PAGE_SETTINGS_KEYS as K,
  HOME_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/HOME_PAGE_SETTINGS";
import { commonTranslations } from "@/translations";

const { Panel } = Collapse;

type FAQData = HOME_PAGE_SETTINGS_TYPES[typeof K.FAQS_SECTION];

interface FAQSectionProps {
  data: FAQData;
  language: string;
}

const FAQSection: React.FC<FAQSectionProps> = ({ data, language }) => {
  const [expandedBodies, setExpandedBodies] = useState<Set<number>>(new Set());
  const [activeKey, setActiveKey] = useState<string | undefined>();

  const items = Array.isArray(data?.items) ? data.items : [];
  if (items.length === 0) return null;

  const tReadMore =
    getTranslatedText(commonTranslations.readMore, language) || "Read More";
  const tReadLess =
    getTranslatedText(commonTranslations.readLess, language) || "Read Less";

  const toggleBody = (idx: number) => {
    setExpandedBodies((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  return (
    <Card
      bordered={false}
      style={{
        width: "100%",
        maxWidth: 1000,
        margin: "0 auto",
        borderRadius: 12,
        boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
      }}
      styles={{ body: { padding: 0 } }}
    >
      <Collapse
        accordion
        bordered={false}
        style={{ borderRadius: 12, overflow: "hidden" }}
        activeKey={activeKey}
        onChange={(key) => setActiveKey(Array.isArray(key) ? key[0] : key)}
      >
        {items.map((faq, index) => {
          const q = getTranslatedText(faq.question, language) || "";
          const a = getTranslatedText(faq.answer, language) || "";
          const isBodyExpanded = expandedBodies.has(index);
          const preview = a.length > 120 ? `${a.substring(0, 120)}...` : a;

          return (
            <Panel
              key={String(index)}
              header={<span style={{ fontSize: 16, fontWeight: 500 }}>{q}</span>}
              style={{
                borderBottom: "1px solid #f0f0f0",
                padding: "16px 24px",
                background: "#fafafa",
              }}
            >
              <div style={{ padding: "4px 0 0 0" }}>
                <p style={{ fontSize: 15, color: "#555", marginBottom: 8 }}>
                  {isBodyExpanded ? a : preview}
                </p>
                {a.length > 120 && (
                  <Button
                    type="link"
                    onClick={() => toggleBody(index)}
                    style={{ padding: 0, fontSize: 14 }}
                  >
                    {isBodyExpanded ? tReadLess : tReadMore}
                  </Button>
                )}
              </div>
            </Panel>
          );
        })}
      </Collapse>
    </Card>
  );
};

export default FAQSection;
