import React, { useMemo } from "react";
import { Select, Typography, theme } from "antd";
import Image from "next/image";

import { useLanguage } from "@/hooks/useLanguage";
import { getFlagUrl } from "@/config/navigations/IconMapper";
import { languageFlags, languageNames } from "@/i18n/languages";

const { Text } = Typography;

type LangOption = {
  value: string;
  label: React.ReactNode; 
  pill: React.ReactNode;  
};

const Flag: React.FC<{ url: string; alt: string; w?: number; h?: number }> = ({
  url,
  alt,
  w = 20,
  h = 14,
}) => (
  <span
    style={{
      width: w,
      height: h,
      borderRadius: 3,
      overflow: "hidden",
      position: "relative",
      display: "inline-block",
      flex: "0 0 auto",
    }}
  >
    <Image src={url} alt={alt} fill sizes={`${w}px`} style={{ objectFit: "cover" }} />
  </span>
);

const LanguageSelection: React.FC = () => {
  const { language, setLanguage, supportedLanguages } = useLanguage();
  const { token } = theme.useToken();

  const options: LangOption[] = useMemo(() => {
    return (supportedLanguages || []).map((lang) => {
      const code = lang.toUpperCase();
      const countryCode = languageFlags[lang] || "un";
      const flagUrl = getFlagUrl(countryCode, 40);
      const nice = languageNames[lang] ?? code;

      const pill = (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <Flag url={flagUrl} alt={nice} />
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "rgba(255,255,255,0.92)",
          }}
        >
          {code}
        </span>
      </span>
    );


      const label = (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 6px" }}>
          <Flag url={flagUrl} alt={nice} w={24} h={16} />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
            <Text style={{ color: token.colorText, fontSize: 13, fontWeight: 600 }}>{nice}</Text>
            <Text style={{ color: token.colorTextSecondary, fontSize: 12 }}>{code}</Text>
          </div>
        </div>
      );

      return { value: lang, label, pill };
    });
  }, [supportedLanguages, token.colorText, token.colorTextSecondary]);

  return (
    <Select
      value={language}
      onChange={setLanguage}
      options={options}
      optionLabelProp="pill" 
      showSearch={false}
      suffixIcon={null}
      variant="borderless"
      placement="bottomRight"
      popupMatchSelectWidth={false}
      getPopupContainer={() => document.body} 
      style={{
        height: 30,
        minWidth: 72,
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        paddingInline: 8,
        background: "rgba(255,255,255,0.10)",
        border: "1px solid rgba(255,255,255,0.25)",
        cursor: "pointer",
      }}
      dropdownStyle={{
        minWidth: 220,
        padding: 6,
        borderRadius: 12,
        background: token.colorBgContainer,
        zIndex: 3000,
      }}
    />
  );
};

export default LanguageSelection;
