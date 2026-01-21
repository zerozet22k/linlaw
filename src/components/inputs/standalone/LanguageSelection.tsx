import React from "react";
import { Select, theme } from "antd";
import { useLanguage } from "@/hooks/useLanguage";
import { getFlagUrl } from "@/config/navigations/IconMapper";
import { languageFlags, languageNames } from "@/models/languages";
import Image from "next/image";

const { Option } = Select;

const LanguageSelection: React.FC = () => {
  const { language, setLanguage, supportedLanguages } = useLanguage();
  const { token } = theme.useToken();

  return (
    <Select
      value={language}
      onChange={setLanguage}
      variant="borderless"
      style={{
        display: "flex",
        padding: 4,
        background: "transparent",
        border: "none",
        color: token.colorText,
      }}
      dropdownStyle={{
        background: token.colorBgContainer,
        color: token.colorText,
      }}
    >
      {supportedLanguages.map((lang) => {
        const countryCode = languageFlags[lang] || "un";
        const flagUrl = getFlagUrl(countryCode, 40);
        const nice = languageNames[lang] ?? lang.toUpperCase();

        return (
          <Option key={lang} value={lang}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  width: 24,
                  height: 16,
                  borderRadius: 3,
                  overflow: "hidden",
                  position: "relative",
                  display: "inline-block",
                  flex: "0 0 auto",
                }}
              >
                <Image
                  src={flagUrl}
                  alt={nice}
                  fill
                  sizes="24px"
                  style={{ objectFit: "cover" }}
                />
              </span>

              <span style={{ fontSize: 12, color: token.colorText }}>
                {lang.toUpperCase()}
              </span>
            </div>
          </Option>
        );
      })}
    </Select>
  );
};

export default LanguageSelection;
