"use client";

import React, { useEffect, useRef, useState } from "react";
import { Typography } from "antd";
import { useLayout } from "@/hooks/useLayout";
import LanguageSelection from "@/components/inputs/standalone/LanguageSelection";

import {
  GLOBAL_SETTINGS_KEYS as G,
  GLOBAL_SETTINGS_TYPES,
} from "@/config/CMS/settings/keys/GLOBAL_SETTINGS_KEYS";

const { Text } = Typography;

/* ── visual tokens ──────────────────────────────── */
const BG = "#000";
const TXT = "#fff";
const PAD_DESK = "5px 20px";
const PAD_MOB = "8px 10px";
const FONT_SIZE = 14;
const CYCLE_MS = 3000;
const FADE_MS = 400;

/* ── strong CMS type ─────────────────────────────── */
type BusinessInfo = GLOBAL_SETTINGS_TYPES[typeof G.BUSINESS_INFO];

/* ── component ───────────────────────────────────── */
interface Props {
  businessInfo: BusinessInfo;
}

const OverlayBar: React.FC<Props> = ({ businessInfo }) => {
  const { isMobile } = useLayout();

  /* Build items: include only if the value exists */
  const items = [
    businessInfo.phoneNumber && {
      id: "phone",
      icon: "📞",
      text: businessInfo.phoneNumber,
      link: `tel:${businessInfo.phoneNumber.trim()}`,
    },
    businessInfo.email && {
      id: "mail",
      icon: "✉️",
      text: businessInfo.email,
      link: `mailto:${businessInfo.email.trim()}`,
    },
  ].filter(Boolean) as {
    id: string;
    icon: string;
    text: string;
    link?: string;
  }[];

  /* Mobile carousel --------------------------------------------------- */
  const [idx, setIdx] = useState(0);
  const raf = useRef<number | null>(null);
  const start = useRef(performance.now());

  useEffect(() => {
    if (!isMobile || items.length <= 1) return;

    const step = (t: number) => {
      if (t - start.current >= CYCLE_MS) {
        start.current = t;
        setIdx((i) => (i + 1) % items.length);
      }
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);

    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, [isMobile, items.length]);

  /* Render helper ----------------------------------------------------- */
  const render = ({ id, icon, text, link }: (typeof items)[number]) => {
    const content = (
      <>
        <span aria-hidden style={{ marginRight: 4 }}>
          {icon}
        </span>
        {text}
      </>
    );
    return link ? (
      <a key={id} href={link} style={{ color: TXT, textDecoration: "none" }}>
        <Text style={{ color: TXT }}>{content}</Text>
      </a>
    ) : (
      <Text key={id} style={{ color: TXT }}>
        {content}
      </Text>
    );
  };

  /* JSX --------------------------------------------------------------- */
  return (
    <div
      style={{
        width: "100%",
        background: BG,
        color: TXT,
        fontSize: FONT_SIZE,
        padding: isMobile ? PAD_MOB : PAD_DESK,
        display: "flex",
        alignItems: "center",
        justifyContent: isMobile ? "center" : "space-evenly",
        position: "relative",
        zIndex: 999,
      }}
    >
      {/* Desktop: both items inline */}
      {!isMobile && items.map(render)}

      {/* Mobile: single fading item */}
      {isMobile && items.length > 0 && (
        <div
          key={items[idx].id}
          style={{ transition: `opacity ${FADE_MS}ms`, whiteSpace: "nowrap" }}
        >
          {render(items[idx])}
        </div>
      )}

      {/* Language picker */}
      <div
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <LanguageSelection />
      </div>
    </div>
  );
};

export default OverlayBar;