"use client";

import React, { useMemo } from "react";
import { Typography, Empty, Card, theme, Grid, Button } from "antd";
import Link from "next/link";
import { hrefLang } from "@/i18n/path";

import type { INewsletterAPI } from "@/models/Newsletter";
import { t } from "@/i18n";

import {
  HOME_PAGE_SETTINGS_KEYS as K,
  HOME_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/HOME_PAGE_SETTINGS";

const { Text } = Typography;
const { useToken } = theme;

type NewsletterData = HOME_PAGE_SETTINGS_TYPES[typeof K.NEWSLETTER_SECTION];

type Props = {
  data?: NewsletterData;
  language: string;
  items?: INewsletterAPI[];
};

function resolveLocalized(val: any, language: string): string {
  if (!val) return "";
  if (typeof val === "string") return val.trim();
  if (typeof val === "object") return String(val?.[language] ?? val?.en ?? "").trim();
  return "";
}

function extractPreview(item: any, language: string): string {
  const candidates = [item?.excerpt, item?.summary, item?.description, item?.content, item?.body];
  for (const c of candidates) {
    const v = resolveLocalized(c, language);
    if (v) return v;
  }
  return "";
}

function clampText(s: string, max = 140) {
  const tt2 = (s || "").replace(/\s+/g, " ").trim();
  if (!tt2) return "";
  return tt2.length > max ? `${tt2.slice(0, max).trim()}…` : tt2;
}

function formatDotDate(d?: string | number | Date) {
  if (!d) return "";
  try {
    const date = d instanceof Date ? d : new Date(d);
    const yyyy = String(date.getFullYear());
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd}.`;
  } catch {
    return "";
  }
}

function getCategoryLabel(item: any, language: string) {
  return (
    resolveLocalized(item?.category, language) ||
    resolveLocalized(item?.type, language) ||
    resolveLocalized(item?.tag, language) ||
    "Newsletter"
  );
}

function getCategoryKey(item: any) {
  return String(item?.category ?? item?.type ?? item?.tag ?? "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

const NewsletterSection: React.FC<Props> = ({ language, items }) => {
  const { token } = useToken();
  const screens = Grid.useBreakpoint();
  const isLgUp = !!screens.lg;
  const isMdUp = !!screens.md;

  const tReadMore = useMemo(() => t(language, "common.readMore"), [language]);
  const tViewAll = useMemo(() => t(language, "newsletter.viewAll"), [language]);
  const tNoData = useMemo(() => t(language, "common.noData"), [language]);

  const sorted = useMemo(() => {
    const arr = Array.isArray(items) ? [...items] : [];
    arr.sort((a: any, b: any) => {
      const ad = a?.createdAt ? new Date(a.createdAt as any).getTime() : 0;
      const bd = b?.createdAt ? new Date(b.createdAt as any).getTime() : 0;
      return bd - ad;
    });
    return arr;
  }, [items]);

  // 2 big + up to 3 small
  const { bigLeft, bigRight, small } = useMemo(() => {
    const arr = sorted;

    const lin = arr.find((x) => getCategoryKey(x) === "lin news");
    const news = arr.find((x) => getCategoryKey(x) === "newsletter");

    const left = lin ?? arr[0];
    const right = news ?? arr.find((x) => x?._id !== left?._id) ?? arr[1];

    const rest = arr
      .filter((x) => x?._id !== left?._id && x?._id !== right?._id)
      .slice(0, 3);

    return { bigLeft: left, bigRight: right, small: rest };
  }, [sorted]);

  if (!bigLeft) {
    // Keep it silent if no newsletters configured / exist
    return (
      <div data-component="NewsletterSection" aria-busy="false" style={{ width: "100%" }}>
        <Empty description={tNoData} />
      </div>
    );
  }

  const containerStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 980,
    margin: "0 auto",
    paddingInline: isMdUp ? 0 : token.paddingMD,
  };

  const gridTopStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMdUp ? "1fr 1fr" : "1fr",
    gap: token.sizeLG,
    alignItems: "stretch",
  };

  const gridBottomStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isLgUp ? "1fr 1fr 1fr" : isMdUp ? "1fr 1fr" : "1fr",
    gap: token.sizeLG,
    alignItems: "stretch",
    marginTop: token.marginLG,
  };

  const darkCardStyle: React.CSSProperties = {
    borderRadius: token.borderRadiusLG,
    border: "1px solid rgba(255,255,255,0.28)",
    overflow: "hidden",
    height: isMdUp ? 260 : "auto",
    background: "rgba(10, 20, 30, 0.45)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    transition: "transform 160ms ease, box-shadow 160ms ease",
  };

  const lightCardStyle: React.CSSProperties = {
    borderRadius: token.borderRadiusLG,
    border: "1px solid rgba(255,255,255,0.18)",
    overflow: "hidden",
    height: isMdUp ? 210 : "auto",
    background: "rgba(255, 255, 255, 0.72)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    transition: "transform 160ms ease, box-shadow 160ms ease",
  };

  const labelStyleDark: React.CSSProperties = {
    display: "inline-block",
    fontWeight: 700,
    textDecoration: "underline",
    textUnderlineOffset: 3,
    color: "#fff",
    opacity: 0.95,
    marginBottom: 10,
  };

  const labelStyleLight: React.CSSProperties = {
    display: "inline-block",
    fontWeight: 700,
    textDecoration: "underline",
    textUnderlineOffset: 3,
    color: token.colorText,
    opacity: 0.9,
    marginBottom: 10,
  };

  const dateStyleDark: React.CSSProperties = {
    marginTop: "auto",
    fontWeight: 700,
    color: "#fff",
    opacity: 0.9,
  };

  const dateStyleLight: React.CSSProperties = {
    marginTop: "auto",
    fontWeight: 700,
    color: token.colorTextSecondary,
  };

  const renderBigCard = (item: any) => {
    if (!item) return null;

    const id = item?._id;
    const title = resolveLocalized(item?.title, language) || t(language, "newsletter.untitled");
    const preview = clampText(extractPreview(item, language), 170);
    const date = formatDotDate(item?.createdAt);
    const cat = getCategoryLabel(item, language);

    return (
      <Link
        href={hrefLang(`/newsletters/${id}`, language as any)}
        style={{ textDecoration: "none", display: "block" }}
        aria-label={`${t(language, "common.open")} newsletter: ${title}`}
      >
        <Card
          className="nlCard nlCardDark"
          variant="borderless"
          hoverable
          style={darkCardStyle}
          styles={{ body: { padding: 0, height: "100%" } }}
        >
          <div
            style={{
              padding: 26,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <Text style={labelStyleDark}>{cat}</Text>

            <div
              style={{
                fontSize: isMdUp ? 28 : 22,
                fontWeight: 850,
                lineHeight: 1.15,
                color: "#fff",
                letterSpacing: -0.2,
              }}
            >
              {title}
            </div>

            {preview && (
              <Text style={{ color: "#fff", opacity: 0.92, lineHeight: 1.65, fontSize: 14.5 }}>
                {preview}
              </Text>
            )}

            <Text style={dateStyleDark}>{date}</Text>

            <Text
              style={{
                marginTop: 6,
                color: "#fff",
                opacity: 0.9,
                fontWeight: 700,
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              {tReadMore}
            </Text>
          </div>
        </Card>
      </Link>
    );
  };

  const renderSmallCard = (item: any) => {
    if (!item) return null;

    const id = item?._id;
    const title = resolveLocalized(item?.title, language) || t(language, "newsletter.untitled");
    const preview = clampText(extractPreview(item, language), 95);
    const date = formatDotDate(item?.createdAt);
    const cat = getCategoryLabel(item, language);

    return (
      <Link
        href={hrefLang(`/newsletters/${id}`, language as any)}
        style={{ textDecoration: "none", display: "block" }}
        aria-label={`${t(language, "common.open")} newsletter: ${title}`}
      >
        <Card
          className="nlCard nlCardLight"
          variant="borderless"
          hoverable
          style={lightCardStyle}
          styles={{ body: { padding: 24, height: "100%" } }}
        >
          <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
            <Text style={labelStyleLight}>{cat}</Text>

            <div style={{ fontSize: 20, fontWeight: 850, lineHeight: 1.2, color: token.colorText }}>
              {title}
            </div>

            {preview && (
              <Text style={{ color: token.colorTextSecondary, lineHeight: 1.6, fontSize: 14 }}>
                {preview}
              </Text>
            )}

            <Text style={dateStyleLight}>{date}</Text>
          </div>
        </Card>
      </Link>
    );
  };

  return (
    <div data-component="NewsletterSection" aria-busy="false" style={containerStyle}>
      <div style={gridTopStyle}>
        {renderBigCard(bigLeft)}
        {renderBigCard(bigRight)}
      </div>

      <div style={gridBottomStyle}>
        {small.map((it, idx) => (
          <React.Fragment key={`${String(it?._id || "newsletter")}-${idx}`}>
            {renderSmallCard(it)}
          </React.Fragment>
        ))}
      </div>

      <div style={{ marginTop: token.marginLG, display: "flex", justifyContent: "center" }}>
        <Link href={hrefLang("/newsletters", language as any)} style={{ textDecoration: "none" }}>
          <Button
            size="large"
            type="primary"
            style={{
              borderRadius: token.borderRadiusLG,
              fontWeight: 800,
              paddingInline: 22,
              height: 46,
            }}
          >
            {tViewAll}
          </Button>
        </Link>
      </div>

      <style jsx global>{`
        .ant-card-hoverable {
          cursor: pointer;
        }
        .nlCard:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};

export default NewsletterSection;
