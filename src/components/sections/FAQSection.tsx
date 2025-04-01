"use client";

import React, { useState } from "react";
import { Collapse, Card, Button } from "antd";
import { getTranslatedText, LanguageJson } from "@/utils/getTranslatedText";
import { useLanguage } from "@/hooks/useLanguage";
import { faqTranslations } from "@/translations";

const { Panel } = Collapse;

interface FAQItem {
  question: LanguageJson;
  answer: LanguageJson;
}

interface FAQSectionProps {
  faqs: FAQItem[];
}

const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
  const { language } = useLanguage();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleReadMore = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Card title={getTranslatedText(faqTranslations.faqTitle, language)}>
      <Collapse accordion>
        {faqs.map((faq, index) => {
          const translatedAnswer = getTranslatedText(faq.answer, language);
          const isExpanded = expandedIndex === index;
          const previewText =
            translatedAnswer.length > 100
              ? `${translatedAnswer.substring(0, 100)}...`
              : translatedAnswer;

          return (
            <Panel
              header={getTranslatedText(faq.question, language)}
              key={index}
            >
              <p>{isExpanded ? translatedAnswer : previewText}</p>
              {translatedAnswer.length > 100 && (
                <Button type="link" onClick={() => toggleReadMore(index)}>
                  {isExpanded
                    ? getTranslatedText(faqTranslations.readLess, language)
                    : getTranslatedText(faqTranslations.readMore, language)}
                </Button>
              )}
            </Panel>
          );
        })}
      </Collapse>
    </Card>
  );
};

export default FAQSection;
