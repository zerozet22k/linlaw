"use client";

import React, { CSSProperties } from "react";
import { Avatar, Select, Tag, theme } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { defaultWrapperStyle, defaultSelectStyle } from "../../InputStyle";
import { getFlagUrl } from "@/config/navigations/IconMapper";

const { Option } = Select;

interface Props {
  value?: string[];
  onChange?: (v: string[]) => void;
  style?: CSSProperties;
  inputStyle?: CSSProperties;
}

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
export const languageNames: Record<string, string> = {
  en: "English",
  fr: "French",
  de: "German",
  es: "Spanish",
  zh: "Chinese",
  ja: "Japanese",
  ko: "Korean",
  th: "Thai",
  my: "Burmese",
};
const SupportedLanguageSelector: React.FC<Props> = ({
  value = [],
  onChange,
  style = {},
  inputStyle = {},
}) => {
  const { token } = theme.useToken();

  const selected = Array.from(new Set(["en", ...value]));

  const handleChange = (langs: string[]) => {
    onChange?.(Array.from(new Set(["en", ...langs])));
  };

  const tagRender = (props: any) => {
    const { value: langValue, closable, onClose } = props;
    const lang = typeof langValue === "string" ? langValue : "";
    const flag = getFlagUrl(languageFlags[lang] ?? "un", 20);

    return (
      <Tag
        style={{
          display: "flex",
          alignItems: "center",
          paddingInline: 8,
          paddingBlock: 4,
          borderRadius: 18,
          background: token.colorFillSecondary,
          border: "none",
          margin: 4,
        }}
        closable={closable && lang !== "en"}
        closeIcon={<CloseOutlined style={{ fontSize: 12, opacity: 0.6 }} />}
        onClose={onClose}
      >
        <Avatar
          src={flag}
          size={16}
          shape="square"
          style={{ marginRight: 6 }}
        />
        {lang.toUpperCase()}
      </Tag>
    );
  };

  return (
    <div
      style={{
        ...defaultWrapperStyle,
        ...style,
        width: "100%",
        display: "block",
      }}
    >
      <Select
        mode="multiple"
        size="large"
        value={selected}
        onChange={handleChange}
        placeholder="Select supported languages"
        tagRender={tagRender}
        popupMatchSelectWidth={false}
        style={{
          ...defaultSelectStyle,
          ...inputStyle,
          width: "100%",
          minHeight: 44,
        }}
      >
        {Object.keys(languageFlags).map((lang) => (
          <Option key={lang} value={lang} disabled={lang === "en"}>
            <Avatar
              src={getFlagUrl(languageFlags[lang] ?? "un", 20)}
              size={16}
              shape="square"
              style={{ marginRight: 8 }}
            />
            {lang.toUpperCase()}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default SupportedLanguageSelector;
