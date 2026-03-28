"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, theme, Grid } from "antd";
import type { ButtonProps } from "antd";
import { motion, useReducedMotion } from "framer-motion";
import { t } from "@/i18n";
import { hrefLang } from "@/i18n/path";
import {
  HOME_PAGE_SETTINGS_KEYS as K,
  HOME_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/HOME_PAGE_SETTINGS";

const { useToken } = theme;
const { useBreakpoint } = Grid;

type Data = HOME_PAGE_SETTINGS_TYPES[typeof K.PROMO_SHOWCASE];

type PromoShowcaseSectionProps = {
  data: Data;
  language: string;
};

const isExternalHref = (href?: string) => !!href && /^https?:\/\//i.test(href);

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

const normalizeOpacity = (value: unknown, fallback = 0.5) => {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  const v = value > 1 ? value / 100 : value; // support 0.45 OR 45
  return clamp01(v);
};

const toNumber = (value: unknown, fallback: number) => {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string") {
    const n = parseFloat(value);
    if (!Number.isNaN(n)) return n;
  }
  return fallback;
};

const clean = (s: string) => (s || "").replace(/\s+/g, " ").trim();
const tt = (lang: string, v: any, fallback = "") => clean(t(lang, v, fallback));

const PromoShowcaseSection: React.FC<PromoShowcaseSectionProps> = ({ data, language }) => {
  const { token } = useToken();
  const bp = useBreakpoint();
  const reduceMotion = useReducedMotion();

  const isMobile = !bp.md;
  const rows = Array.isArray(data?.items) ? data.items : [];
  if (!rows.length) return null;

  const outerRadius = token.borderRadiusLG;
  const border = `1px solid ${token.colorBorderSecondary}`;

  return (
    <div style={{ width: "100%", marginBottom: 48 }}>
      <div
        style={{
          width: "100%",
          maxWidth: "min(1600px, calc(100vw - 48px))",
          margin: "0 auto",
          borderRadius: outerRadius,
          overflow: "hidden",
          border,
          background: token.colorBgContainer,
        }}
      >
        {rows.map((row, i) => {
          const forcedSide = row.imageSide;
          const imageLeft =
            forcedSide === "left" ? true : forcedSide === "right" ? false : i % 2 === 0;

          const minHDesktop = toNumber(row.minHeightDesktop, 360);
          const minHMobile = toNumber(row.minHeightMobile, 240);
          const minH = isMobile ? minHMobile : minHDesktop;

          const dir =
            row.overlayDirection === "ltr"
              ? "ltr"
              : row.overlayDirection === "rtl"
                ? "rtl"
                : imageLeft
                  ? "ltr"
                  : "rtl";

          const overlayOpacity = normalizeOpacity(row.overlayOpacity, 0.5);

          const overlay =
            dir === "ltr"
              ? `linear-gradient(90deg, rgba(0,0,0,${overlayOpacity}) 0%, rgba(0,0,0,0.20) 62%, rgba(0,0,0,0.00) 100%)`
              : `linear-gradient(270deg, rgba(0,0,0,${overlayOpacity}) 0%, rgba(0,0,0,0.20) 62%, rgba(0,0,0,0.00) 100%)`;

          const accent = row.accentColor || token.colorPrimary;

          const panelBg =
            row.panelBg?.trim() ||
            "linear-gradient(135deg, rgba(8,8,10,0.96) 0%, rgba(12,12,14,0.92) 55%, rgba(0,0,0,0.88) 100%)";

          const panelTextColor = row.panelTextColor || "rgba(255,255,255,0.96)";
          const panelBodyColor = row.panelTextColor ? row.panelTextColor : "rgba(255,255,255,0.78)";

          const panelAlign = row.panelAlign ?? (isMobile ? "left" : "center");
          const ctaJustify =
            panelAlign === "left" ? "flex-start" : panelAlign === "right" ? "flex-end" : "center";

          const imageTitle = tt(language, row.imageTitle, "");
          const panelTitle = tt(language, row.panelTitle, "");
          const panelText = tt(language, row.panelText, "");
          const buttonText = tt(language, row.buttonText, "View");
          const localizedHref = hrefLang(String(row.link || "").trim(), language as any);

          const cardRowStyle: React.CSSProperties = {
            borderTop: i === 0 ? "none" : `1px solid ${token.colorBorderSecondary}`,
            display: isMobile ? "block" : "grid",
            gridTemplateColumns: isMobile ? undefined : "1fr 1fr",
          };

          const ImageBlock = (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              style={{
                position: "relative",
                minHeight: minH,
                overflow: "hidden",
                background: token.colorFillSecondary,
              }}
            >
              {row.image ? (
                <motion.div
                  style={{ position: "absolute", inset: 0 }}
                  whileHover={reduceMotion ? {} : { scale: 1.02 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <Image
                    src={row.image}
                    alt={imageTitle || panelTitle || `promo-${i}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                    priority={i === 0}
                  />
                </motion.div>
              ) : (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(135deg, ${token.colorFillTertiary} 0%, ${token.colorFillSecondary} 60%, rgba(0,0,0,0.08) 100%)`,
                  }}
                />
              )}

              <div aria-hidden style={{ position: "absolute", inset: 0, background: overlay }} />

              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.00) 42%)",
                  mixBlendMode: "overlay",
                  pointerEvents: "none",
                }}
              />

              {imageTitle ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: isMobile ? token.paddingLG : token.paddingXL,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      color: "rgba(255,255,255,0.96)",
                      fontSize: "clamp(2.2rem, 4.8vw, 3.7rem)",
                      fontWeight: 850,
                      lineHeight: 1.02,
                      letterSpacing: -0.8,
                      textShadow: "0 10px 30px rgba(0,0,0,0.35)",
                      maxWidth: 680,
                    }}
                  >
                    {imageTitle}
                  </div>
                </div>
              ) : null}

              <div
                aria-hidden
                style={{
                  position: "absolute",
                  left: 18,
                  right: 18,
                  bottom: 14,
                  height: 3,
                  borderRadius: 999,
                  background: accent,
                  opacity: 0.85,
                }}
              />
            </motion.div>
          );

          const PanelBlock = (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.35, ease: "easeOut", delay: 0.03 }}
              style={{
                position: "relative",
                background: panelBg,
                color: panelTextColor,
                minHeight: isMobile ? "auto" : minH,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: isMobile ? token.paddingLG : token.paddingXL,
                textAlign: panelAlign as React.CSSProperties["textAlign"],
              }}
            >
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  top: 18,
                  left: 18,
                  width: 56,
                  height: 3,
                  borderRadius: 999,
                  background: accent,
                  opacity: 0.9,
                }}
              />

              <div style={{ maxWidth: 560, width: "100%" }}>
                {panelTitle ? (
                  <div
                    style={{
                      fontSize: isMobile ? 20 : 24,
                      fontWeight: 850,
                      lineHeight: 1.2,
                      letterSpacing: -0.3,
                      color: panelTextColor,
                    }}
                  >
                    {panelTitle}
                  </div>
                ) : null}

                {panelText ? (
                  <div
                    style={{
                      marginTop: 12,
                      fontSize: 14.8,
                      lineHeight: 1.8,
                      color: panelBodyColor,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {panelText}
                  </div>
                ) : null}

                {localizedHref ? (
                  <div style={{ marginTop: 18, display: "flex", justifyContent: ctaJustify }}>
                    {(() => {
                      const variant = (row.buttonVariant || "primary") as ButtonProps["type"];
                      const target = row.linkTarget || "same_tab";
                      const openNewTab = target === "new_tab";

                      if (isExternalHref(localizedHref)) {
                        return (
                          <Button
                            type={variant}
                            href={localizedHref}
                            target={openNewTab ? "_blank" : undefined}
                            rel={openNewTab ? "noreferrer" : undefined}
                            style={{ height: 42, paddingInline: 18, borderRadius: 12, fontWeight: 800 }}
                          >
                            {buttonText}
                          </Button>
                        );
                      }

                      if (openNewTab) {
                        return (
                          <Link href={localizedHref} target="_blank" rel="noreferrer">
                            <Button
                              type={variant}
                              style={{ height: 42, paddingInline: 18, borderRadius: 12, fontWeight: 800 }}
                            >
                              {buttonText}
                            </Button>
                          </Link>
                        );
                      }

                      return (
                        <Link href={localizedHref}>
                          <Button
                            type={variant}
                            style={{ height: 42, paddingInline: 18, borderRadius: 12, fontWeight: 800 }}
                          >
                            {buttonText}
                          </Button>
                        </Link>
                      );
                    })()}
                  </div>
                ) : null}
              </div>
            </motion.div>
          );

          return (
            <motion.div
              key={i}
              style={cardRowStyle}
              whileHover={reduceMotion ? {} : { y: -1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {isMobile ? (
                <>
                  {ImageBlock}
                  {PanelBlock}
                </>
              ) : imageLeft ? (
                <>
                  {ImageBlock}
                  {PanelBlock}
                </>
              ) : (
                <>
                  {PanelBlock}
                  {ImageBlock}
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PromoShowcaseSection;
