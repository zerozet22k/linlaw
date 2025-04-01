"use client";

import React from "react";
import { Card } from "antd";
import { getTranslatedText } from "@/utils/getTranslatedText";
import { useLanguage } from "@/hooks/useLanguage";
import {
  newsletterTitle,
  newsletterSubtitle,
  newsletterTagline,
} from "@/translations";

const NewsletterSection: React.FC = () => {
  const { language } = useLanguage();

  return (
    <Card
      title={getTranslatedText(newsletterTitle, language)}
      bordered={false}
      style={{ textAlign: "center", padding: "20px" }}
    >
      <h2>{getTranslatedText(newsletterSubtitle, language)}</h2>
      <p>{getTranslatedText(newsletterTagline, language)}</p>
    </Card>
  );
};

export default NewsletterSection;
