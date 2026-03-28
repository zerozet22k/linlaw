/* components/sections/AboutUsSection.tsx */
"use client";

import React, { useMemo } from "react";
import { theme, Grid, Typography, Button } from "antd";
import { motion, useReducedMotion } from "framer-motion";
import { DynamicIcon } from "@/config/navigations/IconMapper";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/i18n";
import { hrefLang } from "@/i18n/path";

import {
  HOME_PAGE_SETTINGS_KEYS as K,
  HOME_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/HOME_PAGE_SETTINGS";

const { Text } = Typography;

type AboutData = HOME_PAGE_SETTINGS_TYPES[typeof K.ABOUT_US_SECTION];

type Props = {
  data: AboutData;
  language: string; // kept for compatibility, but we’ll use hook if present
};

const clean = (s: string) => (s || "").replace(/\s+/g, " ").trim();
const tt = (lang: string, v: any, fallback = "") => clean(t(lang, v, fallback));

export default function AboutUsSection({ data, language: propLanguage }: Props) {
  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();
  const reduceMotion = useReducedMotion();

  // prefer hook language; fall back to prop
  const { language: hookLang } = useLanguage();
  const language = hookLang || propLanguage || "en";

  const lead = data?.lead;
  const panel = data?.panel;
  const stats = Array.isArray(data?.stats) ? data.stats : [];
  const ctas = Array.isArray(data?.ctas) ? data.ctas : [];
  const pillars = Array.isArray(data?.pillars) ? data.pillars : [];

  const leadTitle = useMemo(() => tt(language, lead?.title), [language, lead?.title]);
  const leadSubtitle = useMemo(() => tt(language, lead?.subtitle), [language, lead?.subtitle]);
  const leadDesc = useMemo(() => clean(t(language, lead?.description, "")), [language, lead?.description]);
  const leadAccent = lead?.iconColor || token.colorPrimary;

  const panelTitle = useMemo(() => tt(language, panel?.title), [language, panel?.title]);
  const panelDesc = useMemo(() => clean(t(language, panel?.description, "")), [language, panel?.description]);
  const panelAccent = panel?.panelAccentColor || token.colorPrimary;
  const panelBgImage = panel?.panelBgImage;

  const hasAny =
    !!(leadTitle || leadSubtitle || leadDesc) ||
    !!(panelTitle || panelDesc || panelBgImage) ||
    stats.length > 0 ||
    ctas.length > 0 ||
    pillars.length > 0;

  if (!hasAny) return null;

  const contentMax = 1400;
  const padInline = !screens.sm ? 12 : token.paddingLG;
  const border = `1px solid ${token.colorBorderSecondary}`;

  const gridCols = !screens.md ? 1 : !screens.lg ? 2 : pillars.length >= 6 ? 3 : 2;
  const cardPad = !screens.sm ? 14 : 18;

  return (
    <section
      style={{
        width: "100%",
        maxWidth: contentMax,
        margin: "0 auto",
        paddingInline: padInline,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: !screens.md ? "block" : "grid",
          gridTemplateColumns: !screens.md ? undefined : "1.2fr 0.8fr",
          gap: !screens.sm ? 14 : 22,
          alignItems: "stretch",
        }}
      >
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.38, ease: "easeOut" }}
          style={{
            borderRadius: token.borderRadiusLG,
            border,
            background: token.colorBgContainer,
            overflow: "hidden",
            boxShadow: "none",
          }}
        >
          <div style={{ padding: !screens.sm ? 18 : 24 }}>
            <div
              aria-hidden
              style={{
                height: 3,
                width: 54,
                borderRadius: 999,
                background: leadAccent,
                opacity: 0.9,
                marginBottom: 14,
              }}
            />

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {lead?.icon ? (
                <div
                  aria-hidden
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: token.colorFillTertiary,
                    border,
                    flex: "0 0 auto",
                  }}
                >
                  <DynamicIcon
                    name={lead.icon}
                    style={{ color: leadAccent, fontSize: 22, lineHeight: 1 }}
                  />
                </div>
              ) : null}

              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: !screens.sm ? 22 : 28,
                    fontWeight: 900,
                    lineHeight: 1.15,
                    letterSpacing: -0.3,
                    color: token.colorText,
                  }}
                >
                  {leadTitle || t(language, "aboutUs.title", "About Us")}
                </div>

                {!!leadSubtitle && (
                  <div style={{ marginTop: 6 }}>
                    <Text style={{ color: token.colorTextSecondary, fontSize: 13.5 }}>
                      {leadSubtitle}
                    </Text>
                  </div>
                )}
              </div>
            </div>

            {leadDesc ? (
              <div style={{ marginTop: 14 }}>
                <Text
                  style={{
                    display: "block",
                    color: token.colorTextSecondary,
                    fontSize: 15.2,
                    lineHeight: 1.8,
                    whiteSpace: "pre-line",
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                    hyphens: "auto",
                  }}
                >
                  {leadDesc}
                </Text>
              </div>
            ) : null}

            {stats.length ? (
              <div
                style={{
                  marginTop: 18,
                  display: "grid",
                  gridTemplateColumns: !screens.sm ? "1fr" : "1fr 1fr 1fr",
                  gap: 10,
                }}
              >
                {stats.slice(0, 3).map((s, i) => {
                  const value = String(s.statValue || "").trim();
                  const label = tt(language, s.statLabel);
                  if (!value && !label) return null;

                  return (
                    <div
                      key={(s as any)._id || (s as any).id || `stat-${i}`}
                      style={{
                        borderRadius: token.borderRadiusLG,
                        border,
                        background: token.colorBgLayout,
                        padding: 12,
                        boxShadow: "none",
                      }}
                    >
                      {value && (
                        <div style={{ fontWeight: 900, color: token.colorText, fontSize: 16 }}>
                          {value}
                        </div>
                      )}
                      {label && (
                        <div style={{ marginTop: 4, fontSize: 12.5, color: token.colorTextSecondary }}>
                          {label}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : null}

            {ctas.length ? (
              <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
                {ctas.slice(0, 3).map((c, i) => {
                  const href = String(c.ctaHref || "").trim();
                  const text = tt(language, c.ctaText);
                  if (!href || !text) return null;

                  const variant = c.ctaVariant === "primary" ? "primary" : "default";
                  const localizedHref = hrefLang(href, language as any);

                  return (
                    <Button
                      key={(c as any)._id || (c as any).id || `cta-${i}`}
                      type={variant === "primary" ? "primary" : "default"}
                      href={localizedHref}
                      style={{ height: 40, paddingInline: 16, borderRadius: 10, fontWeight: 800 }}
                    >
                      {text}
                    </Button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.38, ease: "easeOut", delay: 0.05 }}
          style={{
            borderRadius: token.borderRadiusLG,
            border,
            overflow: "hidden",
            background: token.colorFillSecondary,
            boxShadow: "none",
            minHeight: !screens.md ? 200 : 320,
            position: "relative",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background: panelBgImage
                ? `linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.35) 100%), url("${String(
                    panelBgImage
                  ).replace(/"/g, '\\"')}")`
                : `linear-gradient(135deg, ${token.colorFillTertiary} 0%, ${token.colorFillSecondary} 55%, rgba(0,0,0,0.08) 100%)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "flex-end",
              padding: !screens.sm ? 16 : 20,
            }}
          >
            <div style={{ color: "rgba(255,255,255,0.92)" }}>
              {panelTitle && <div style={{ fontWeight: 900, fontSize: 16 }}>{panelTitle}</div>}
              {panelDesc && <div style={{ marginTop: 6, fontSize: 13.5, opacity: 0.9 }}>{panelDesc}</div>}
            </div>
          </div>

          <div
            aria-hidden
            style={{
              position: "absolute",
              left: 16,
              right: 16,
              bottom: 12,
              height: 3,
              borderRadius: 999,
              background: panelAccent,
              opacity: 0.85,
            }}
          />
        </motion.div>
      </div>

      {pillars.length ? (
        <div style={{ marginTop: !screens.sm ? 14 : 22 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
              gap: !screens.sm ? 12 : 16,
            }}
          >
            {pillars.map((p: any, idx: number) => {
              const title = tt(language, p.title);
              const desc = clean(t(language, p.description, ""));
              if (!title && !desc) return null;

              const accent = p.iconColor || token.colorPrimary;

              return (
                <motion.div
                  key={p._id || p.id || `${title}-${idx}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.32, ease: "easeOut", delay: Math.min(0.2, idx * 0.04) }}
                  whileHover={reduceMotion ? {} : { y: -1 }}
                  className="aboutPillar"
                  style={{
                    borderRadius: token.borderRadiusLG,
                    border,
                    background: token.colorBgContainer,
                    boxShadow: "none",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ padding: cardPad }}>
                    <div
                      aria-hidden
                      style={{
                        height: 3,
                        width: 54,
                        borderRadius: 999,
                        background: accent,
                        opacity: 0.85,
                        marginBottom: 12,
                      }}
                    />

                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div
                        aria-hidden
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 14,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: token.colorFillTertiary,
                          border,
                          flex: "0 0 auto",
                        }}
                      >
                        {p.icon ? (
                          <DynamicIcon name={p.icon} style={{ color: accent, fontSize: 21, lineHeight: 1 }} />
                        ) : null}
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 16, fontWeight: 850, lineHeight: 1.2, color: token.colorText }}>
                          {title}
                        </div>

                        {desc ? (
                          <Text
                            style={{
                              display: "block",
                              marginTop: 8,
                              color: token.colorTextSecondary,
                              fontSize: 14.6,
                              lineHeight: 1.75,
                              whiteSpace: "pre-line",
                              overflowWrap: "anywhere",
                              wordBreak: "break-word",
                              hyphens: "auto",
                            }}
                          >
                            {desc}
                          </Text>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : null}

      <style jsx global>{`
        .aboutPillar,
        .aboutPillar:hover {
          box-shadow: none !important;
        }
      `}</style>
    </section>
  );
}
