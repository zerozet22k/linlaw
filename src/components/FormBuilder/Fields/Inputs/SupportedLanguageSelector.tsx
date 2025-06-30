"use client";
import React, { CSSProperties } from "react";
import { Select, theme } from "antd";
import { lighten } from "polished";
import { defaultWrapperStyle, defaultSelectStyle } from "../../InputStyle";
import { getFlagUrl } from "@/config/navigations/IconMapper";

interface SupportedLanguageSelectorProps {
  value?: string[];
  onChange?: (languages: string[]) => void;
  style?: CSSProperties;
  inputStyle?: CSSProperties;
}

const { Option } = Select;

export const languageFlags: Record<string, string> = {
  en: "us",
  fr: "fr",
  de: "de",
  es: "es",
  zh: "cn",
  ja: "jp",
  ko: "kr",
  th: "th",
  my: "mm",
};

const SupportedLanguageSelector: React.FC<SupportedLanguageSelectorProps> = ({
  value = [],
  onChange,
  style = {},
  inputStyle = {},
}) => {
  const { token } = theme.useToken();
  const lightShade = lighten(0.03, token.colorBgContainer);

  // Always ensure 'en' is included
  const selectedLanguages = Array.from(new Set(["en", ...(value || [])]));

  const handleChange = (languages: string[]) => {
    const updatedLanguages = Array.from(new Set(["en", ...languages]));
    onChange?.(updatedLanguages);
  };

  return (
    <div
      style={{
        ...defaultWrapperStyle,
        ...style,
      }}
    >
      <Select
        mode="multiple"
        value={selectedLanguages}
        onChange={handleChange}
        placeholder="Select supported languages"
        style={{
          ...defaultSelectStyle,
          ...inputStyle,
          backgroundColor: token.colorBgElevated,
          border: `1px solid ${token.colorBorder}`,
        }}
        optionLabelProp="label"
      >
        {Object.keys(languageFlags).map((lang) => {
          const countryCode = languageFlags[lang] || "un";
          const flagUrl = getFlagUrl(countryCode, 40);
          const label = (
            <span style={{ display: "flex", alignItems: "center" }}>
              <img
                src={flagUrl}
                alt={lang}
                style={{ width: 20, height: 14, marginRight: 8 }}
              />
              <span>{lang.toUpperCase()}</span>
            </span>
          );
          return (
            <Option
              key={lang}
              value={lang}
              disabled={lang === "en"}
              label={label}
            >
              {label}
            </Option>
          );
        })}
      </Select>
    </div>
  );
};

export default SupportedLanguageSelector;
