"use client";
import React from "react";
import { Input, theme } from "antd";
import { useLanguage } from "@/hooks/useLanguage";
import { lighten, darken } from "polished";
import { getFlagUrl } from "@/config/navigations/IconMapper";
import { languageFlags, languageNames } from "@/models/languages";
import { languageInputWrapperStyle, defaultInputStyle } from "../../InputStyle";
import Image from "next/image";

interface LanguageJsonTextInputProps {
  value?: Record<string, string>;
  onChange?: (value: Record<string, string>) => void;
}

const LanguageJsonTextInput: React.FC<LanguageJsonTextInputProps> = ({
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
        const nice = languageNames[lang] ?? lang.toUpperCase();

        const prefixNode = (
          <span
            style={{
              width: 24,
              height: 16,
              borderRadius: 4,
              overflow: "hidden",
              position: "relative",
              display: "inline-block",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              flex: "0 0 auto",
            }}
          >
            <Image
              src={flagUrl}
              alt={lang}
              fill
              sizes="24px"
              style={{ objectFit: "cover" }}
            />
          </span>
        );

        return (
          <Input
            key={lang}
            value={value[lang] || ""}
            placeholder={`Enter ${nice} translation`}
            onChange={(e) => handleChange(lang, e.target.value)}
            prefix={prefixNode}
            style={{
              ...defaultInputStyle,
              border: `1px solid ${token.colorBorder}`,
              backgroundColor: token.colorBgElevated,
            }}
          />
        );
      })}
    </div>
  );
};

export default LanguageJsonTextInput;
