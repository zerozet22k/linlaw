"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Typography } from "antd";
import { useLayout } from "@/hooks/useLayout";
import LanguageSelection from "@/components/inputs/standalone/LanguageSelection";
import {
  GLOBAL_SETTINGS_KEYS as G,
  GLOBAL_SETTINGS_TYPES,
} from "@/config/CMS/settings/keys/GLOBAL_SETTINGS_KEYS";

const { Text } = Typography;

/** ── Tunables ─────────────────────────────────────────────── */
const RIGHT_OFFSET_DESKTOP = 18;
const RIGHT_OFFSET_MOBILE = 10;

const BG = "#000";
const TXT = "#fff";
const FONT_SIZE = 14;

// Replace shorthand padding strings with explicit numbers
const PAD_DESK_TOP = 5;
const PAD_DESK_BOTTOM = 5;
const PAD_DESK_LEFT = 20;
const PAD_DESK_RIGHT_BASE = 20;

const PAD_MOB_TOP = 8;
const PAD_MOB_BOTTOM = 8;
const PAD_MOB_LEFT = 10;
const PAD_MOB_RIGHT_BASE = 10;
/** ─────────────────────────────────────────────────────────── */

type BusinessInfo = GLOBAL_SETTINGS_TYPES[typeof G.BUSINESS_INFO];
interface Props {
  businessInfo: BusinessInfo;
}

const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const normalizeHours = (opens?: string, closes?: string) => {
  const o = (opens ?? "").trim();
  const c = (closes ?? "").trim();
  if (!o && !c) return "Closed";
  if (/closed/i.test(o) || /closed/i.test(c)) return "Closed";
  return `${o || "—"} – ${c || "—"}`;
};

const buildHoursSummary = (biz: BusinessInfo): string | null => {
  const list = biz.openingHours;
  if (!Array.isArray(list) || list.length === 0) return null;

  const map = new Map<string, string>();
  for (const d of DAY_ORDER) {
    const row = list.find((r) => r?.day === d);
    const val = row ? normalizeHours(row.opens, row.closes) : "Closed";
    map.set(d, val);
  }

  type Group = { startIdx: number; endIdx: number; label: string };
  const groups: Group[] = [];
  let start = 0;
  let current = map.get(DAY_ORDER[0])!;

  for (let i = 1; i < DAY_ORDER.length; i++) {
    const v = map.get(DAY_ORDER[i])!;
    if (v !== current) {
      groups.push({ startIdx: start, endIdx: i - 1, label: current });
      start = i;
      current = v;
    }
  }
  groups.push({ startIdx: start, endIdx: DAY_ORDER.length - 1, label: current });

  const labelRange = (g: Group) =>
    g.startIdx === g.endIdx
      ? DAY_ORDER[g.startIdx]
      : `${DAY_ORDER[g.startIdx]}–${DAY_ORDER[g.endIdx]}`;

  return groups.map((g) => `${labelRange(g)}: ${g.label}`).join(" · ");
};

const OverlayBar: React.FC<Props> = ({ businessInfo }) => {
  const { isMobile } = useLayout();

  const items = useMemo(() => {
    const arr: { id: string; icon: string; text: string; link?: string }[] = [];

    if (businessInfo.phoneNumber) {
      arr.push({
        id: "phone",
        icon: "📞",
        text: businessInfo.phoneNumber,
        link: `tel:${businessInfo.phoneNumber.trim()}`,
      });
    }
    
    if (businessInfo.email) {
      arr.push({
        id: "mail",
        icon: "✉️",
        text: businessInfo.email,
        link: `mailto:${businessInfo.email.trim()}`,
      });
    }

    const summary = buildHoursSummary(businessInfo);
    if (summary) arr.push({ id: "hours", icon: "🕒", text: summary });

    return arr;
  }, [businessInfo]);

  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  const [needsScroll, setNeedsScroll] = useState(false);
  const [distance, setDistance] = useState(0); // px
  const [duration, setDuration] = useState(20); // s

  // Reserve right padding for the pill (measured)
  const [pillPadRight, setPillPadRight] = useState<number>(isMobile ? 52 : 84);

  useEffect(() => {
    const measure = () => {
      const vw = viewportRef.current?.offsetWidth ?? 0;
      const cw = contentRef.current?.offsetWidth ?? 0;

      setNeedsScroll(cw > vw);
      setDistance(cw);

      const pxPerSec = isMobile ? 60 : 100;
      setDuration(Math.max(12, Math.round(cw / pxPerSec)));

      // Reserve exactly pill width + breathing room
      const pillW = pillRef.current?.offsetWidth ?? 0;
      const extra = isMobile ? 16 : 24;
      setPillPadRight(pillW + extra);
    };

    measure();

    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    if (contentRef.current) ro.observe(contentRef.current);
    if (pillRef.current) ro.observe(pillRef.current);

    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [items, isMobile]);

  const segment = (it: (typeof items)[number], i: number, last: boolean) => {
    const content = (
      <>
        <span aria-hidden style={{ marginRight: 6 }}>
          {it.icon}
        </span>
        <span>{it.text}</span>
      </>
    );

    return (
      <span
        key={`${it.id}-${i}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          marginRight: last ? 0 : 28,
          whiteSpace: "nowrap",
        }}
      >
        {it.link ? (
          <a href={it.link} style={{ color: TXT, textDecoration: "none" }}>
            <Text style={{ color: TXT }}>{content}</Text>
          </a>
        ) : (
          <Text style={{ color: TXT }}>{content}</Text>
        )}
        {!last && (
          <span aria-hidden style={{ opacity: 0.4, marginLeft: 12 }}>
            •
          </span>
        )}
      </span>
    );
  };

  // ✅ base padding (no shorthand)
  const baseTop = isMobile ? PAD_MOB_TOP : PAD_DESK_TOP;
  const baseBottom = isMobile ? PAD_MOB_BOTTOM : PAD_DESK_BOTTOM;
  const baseLeft = isMobile ? PAD_MOB_LEFT : PAD_DESK_LEFT;
  const baseRightMin = isMobile ? PAD_MOB_RIGHT_BASE : PAD_DESK_RIGHT_BASE;

  // ✅ final right padding = max(baseRight, pillPadRight) + safe-area inset
  const rightPx = Math.max(baseRightMin, pillPadRight);
  const paddingRightCss = `calc(${rightPx}px + env(safe-area-inset-right, 0px))`;

  return (
    <div
      style={{
        width: "100%",
        background: BG,
        color: TXT,
        fontSize: FONT_SIZE,

        // ✅ no shorthand padding
        paddingTop: baseTop,
        paddingBottom: baseBottom,
        paddingLeft: baseLeft,
        paddingRight: paddingRightCss,

        position: "relative",
        zIndex: 999,
        overflow: "hidden",
        minHeight: 40,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        ref={pillRef}
        style={{
          position: "absolute",
          right: isMobile ? RIGHT_OFFSET_MOBILE : RIGHT_OFFSET_DESKTOP,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        <div className="lang-compact" style={{ pointerEvents: "auto" }}>
          <LanguageSelection />
        </div>
      </div>

      <div
        ref={viewportRef}
        style={{ width: "100%", overflow: "hidden", whiteSpace: "nowrap" }}
      >
        <div
          style={{
            display: "inline-block",
            willChange: needsScroll ? "transform" : undefined,
            animation: needsScroll
              ? `overlayTicker ${duration}s linear infinite`
              : undefined,
            ["--scroll-distance" as any]: `${distance}px`,
          }}
        >
          <div ref={contentRef} style={{ display: "inline-block" }}>
            {items.map((it, i) => segment(it, i, i === items.length - 1))}
          </div>

          {needsScroll && (
            <div aria-hidden style={{ display: "inline-block", marginLeft: 28 }}>
              {items.map((it, i) => segment(it, i, i === items.length - 1))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes overlayTicker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-1 * var(--scroll-distance))); }
        }

        .lang-compact .ant-select { width: auto !important; }
        .lang-compact .ant-select-selector {
          min-width: auto !important;
          inline-size: auto !important;
          padding: 2px 6px !important;
          min-height: 26px;
          border-radius: 999px !important;
          background: rgba(255,255,255,0.10) !important;
          border: 1px solid rgba(255,255,255,0.25) !important;
          display: inline-flex;
          align-items: center;
          gap: 0;
        }
        .lang-compact .ant-select-arrow { display: none !important; }
        .lang-compact .ant-select-selection-search { display: none !important; }

        .lang-compact .ant-select-selection-item {
          display: inline-flex;
          align-items: center;
          font-size: 0 !important;
          padding-inline-end: 0 !important;
          line-height: 0 !important;
        }
        .lang-compact .ant-select-selection-item img {
          width: 20px;
          height: 14px;
          display: block;
        }

        .lang-compact .ant-select-selection-item,
        .lang-compact .ant-select-selection-item * {
          color: ${TXT} !important;
        }
      `}</style>
    </div>
  );
};

export default OverlayBar;
