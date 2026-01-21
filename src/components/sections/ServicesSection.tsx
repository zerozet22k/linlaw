"use client";

import React, { useMemo } from "react";
import { Card, theme } from "antd";
import { motion, useReducedMotion } from "framer-motion";
import { DynamicIcon } from "@/config/navigations/IconMapper";
import { getTranslatedText } from "@/utils/getTranslatedText";
import {
  HOME_PAGE_SETTINGS_KEYS as K,
  HOME_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/HOME_PAGE_SETTINGS";

type ServicesData = HOME_PAGE_SETTINGS_TYPES[typeof K.SERVICES_SECTION];

type ServicesSectionProps = {
  data: ServicesData;
  language: string;
};

const ServicesSection: React.FC<ServicesSectionProps> = ({ data, language }) => {
  const { token } = theme.useToken();
  const reduceMotion = useReducedMotion();

  const items = useMemo(
    () => (Array.isArray(data?.items) ? data.items : []).filter(Boolean),
    [data?.items]
  );

  if (items.length === 0) return null;

  const baseShadow =
    (token as any).boxShadowSecondary || "0 8px 24px rgba(0,0,0,0.06)";
  const hoverShadow =
    (token as any).boxShadowTertiary || "0 14px 40px rgba(0,0,0,0.10)";

  const outerStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    paddingInline: token.paddingLG,
    paddingBlock: token.paddingXL,
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: token.sizeLG,
    width: "100%",
    maxWidth: 1200,
    marginInline: "auto",
    alignItems: "stretch",
    gridAutoFlow: "dense",
  };

  const getSpanStyle = (descLen: number): React.CSSProperties => {
    if (descLen > 420) return { gridColumn: "1 / -1" };
    if (descLen > 220) return { gridColumn: "span 2" };
    return { gridColumn: "span 1" };
  };

  return (
    <div style={outerStyle}>
      <div style={gridStyle}>
        {items.map((service: any, index: number) => {
          const title = (getTranslatedText(service.title, language) || "").trim();
          const desc = (getTranslatedText(service.description, language) || "").trim();
          if (!title && !desc) return null;

          const key = service._id || service.id || `${title}-${index}`;
          const accentColor = service.iconColor || token.colorPrimary;

          return (
            <motion.div
              key={key}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.45,
                ease: "easeOut",
                delay: index * 0.06,
              }}
              whileHover={reduceMotion ? {} : { y: -4 }}
              style={{
                width: "100%",
                height: "100%",
                minWidth: 0,
                ...getSpanStyle(desc.length),
              }}
            >
              <Card
                variant="borderless"
                hoverable
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: token.borderRadiusLG,
                  background: token.colorBgContainer,
                  border: `1px solid ${token.colorBorderSecondary}`,
                  boxShadow: baseShadow,
                  overflow: "hidden",
                  transition: "box-shadow 180ms ease, transform 180ms ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = hoverShadow;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = baseShadow;
                }}
                styles={{
                  body: {
                    padding: token.paddingLG,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  },
                }}
              >
                <div
                  aria-hidden
                  style={{
                    height: 3,
                    width: "100%",
                    background: accentColor,
                    borderRadius: 999,
                    opacity: 0.85,
                  }}
                />

                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: token.colorFillTertiary,
                      border: `1px solid ${token.colorBorderSecondary}`,
                      flex: "0 0 auto",
                    }}
                  >
                    {service.icon ? (
                      <DynamicIcon
                        name={service.icon}
                        style={{ color: accentColor, fontSize: 22, lineHeight: 1 }}
                      />
                    ) : null}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 650,
                        color: token.colorText,
                        lineHeight: 1.2,
                        marginTop: 2,
                      }}
                    >
                      {title}
                    </div>
                  </div>
                </div>

                {desc && (
                  <p
                    style={{
                      margin: 0,
                      color: token.colorTextSecondary,
                      fontSize: 15,
                      lineHeight: 1.7,
                      whiteSpace: "pre-line",
                      flexGrow: 1,

                    }}
                  >
                    {desc}
                  </p>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ServicesSection;
