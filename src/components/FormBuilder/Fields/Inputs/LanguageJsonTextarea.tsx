// components/Fields/LanguageJson/LanguageJsonTextarea.tsx
"use client";
import React from "react";
import { Input, theme } from "antd";
import { lighten, darken } from "polished";
import { useLanguage } from "@/hooks/useLanguage";
import { getFlagUrl } from "@/config/navigations/IconMapper";
import { languageInputWrapperStyle, languageInputStyle } from "../../InputStyle";
import { languageFlags, languageNames } from "@/models/languages";
import Image from "next/image";

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
        const nice = languageNames[lang] ?? lang.toUpperCase();

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
            <div
              style={{
                width: 28,
                height: 18,
                marginTop: 8,
                borderRadius: 4,
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                flex: "0 0 auto",
              }}
            >
              <Image
                src={flagUrl}
                alt={lang}
                fill
                sizes="28px"
                style={{ objectFit: "cover" }}
              />
            </div>

            <Input.TextArea
              placeholder={`Write ${nice} translation`}
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
