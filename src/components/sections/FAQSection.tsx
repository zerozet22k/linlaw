"use client";

import React, { useState } from "react";
import { Collapse, Card, Button } from "antd";
import { getTranslatedText, LanguageJson } from "@/utils/getTranslatedText";
import { useLanguage } from "@/hooks/useLanguage";

const { Panel } = Collapse;

interface FAQItem {
  question: LanguageJson;
  answer: LanguageJson;
}

interface FAQSectionProps {
  section: {
    title?: LanguageJson;
    description?: LanguageJson;
    backgroundImage?: string;
    items: FAQItem[]; // 🔁 renamed
  };
}

const FAQSection: React.FC<FAQSectionProps> = ({ section }) => {
  const { language } = useLanguage();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const { title, description, backgroundImage, items = [] } = section || {}; // 🔁 renamed

  const toggleReadMore = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (!items || items.length === 0) return null; // 🔁 renamed

  return (
    <section
      style={{
        padding: "60px 20px",
        width: "100%",
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h2 style={{ fontSize: "2.25em", fontWeight: 600, color: "#222" }}>
          {getTranslatedText(title, language) || "FAQs"}
        </h2>

        {description && (
          <p style={{ fontSize: 16, color: "#555", marginTop: 8 }}>
            {getTranslatedText(description, language)}
          </p>
        )}
      </div>

      <Card
        bordered={false}
        style={{
          width: "100%",
          maxWidth: 1000,
          margin: "0 auto",
          borderRadius: 12,
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.06)",
        }}
        bodyStyle={{ padding: 0 }}
      >
        <Collapse
          accordion
          bordered={false}
          style={{ borderRadius: 12, overflow: "hidden" }}
        >
          {items.map((faq, index) => {
            const translatedQuestion = getTranslatedText(
              faq.question,
              language
            );
            const translatedAnswer = getTranslatedText(faq.answer, language);
            const isExpanded = expandedIndex === index;
            const previewText =
              translatedAnswer.length > 120
                ? `${translatedAnswer.substring(0, 120)}...`
                : translatedAnswer;

            return (
              <Panel
                key={index}
                header={
                  <span style={{ fontSize: 16, fontWeight: 500 }}>
                    {translatedQuestion}
                  </span>
                }
                style={{
                  borderBottom: "1px solid #f0f0f0",
                  padding: "16px 24px",
                  background: "#fafafa",
                }}
              >
                <div style={{ padding: "4px 0 0 0" }}>
                  <p style={{ fontSize: 15, color: "#555", marginBottom: 8 }}>
                    {isExpanded ? translatedAnswer : previewText}
                  </p>
                  {translatedAnswer.length > 120 && (
                    <Button
                      type="link"
                      onClick={() => toggleReadMore(index)}
                      style={{ padding: 0, fontSize: 14 }}
                    >
                      {isExpanded ? "Read Less" : "Read More"}
                    </Button>
                  )}
                </div>
              </Panel>
            );
          })}
        </Collapse>
      </Card>
    </section>
  );
};

export default FAQSection;
