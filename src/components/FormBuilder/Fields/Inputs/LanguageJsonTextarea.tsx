"use client";
import React from "react";
import { Input, theme } from "antd";
import { lighten, darken } from "polished";
import { useLanguage } from "@/hooks/useLanguage";
import { getFlagUrl } from "@/config/navigations/IconMapper";
import { languageFlags } from "./SupportedLanguageSelector";
import { languageInputWrapperStyle, languageInputStyle } from "../../InputStyle";

interface LanguageJsonTextareaProps {
  value?: Record<string, string>;
  onChange?: (value: Record<string, string>) => void;
}

const LanguageJsonTextarea: React.FC<LanguageJsonTextareaProps> = ({
  value = {},
  onChange,
}) => {
  const { currentSupportedLanguages } = useLanguage();
  const { token } = theme.useToken();

  const baseColor = token.colorBgContainer;
  const lightShade = lighten(0.03, baseColor);
  const darkShade = darken(0.08, baseColor);

  const handleChange = (lang: string, text: string) => {
    onChange?.({ ...value, [lang]: text });
  };

  return (
    <div
      style={{
        ...languageInputWrapperStyle,
        backgroundColor: lightShade,
        border: `2px dashed ${darkShade}`,
      }}
    >
      {currentSupportedLanguages.map((lang) => {
        const flagUrl = getFlagUrl(languageFlags[lang] || "un", 40);

        return (
          <div
            key={lang}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              width: "100%",
            }}
          >
            <img
              src={flagUrl}
              alt={lang}
              style={{
                width: 28,
                height: 18,
                marginTop: 8,
                borderRadius: 4,
                objectFit: "cover",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              }}
            />
            <Input.TextArea
              placeholder={`Enter text for ${lang.toUpperCase()}`}
              value={value[lang] || ""}
              onChange={(e) => handleChange(lang, e.target.value)}
              rows={6}
              style={{
                ...languageInputStyle,
                border: `1px solid ${token.colorBorder}`,
                backgroundColor: token.colorBgElevated,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default LanguageJsonTextarea;
