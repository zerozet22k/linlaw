import type { CSSProperties } from "react";
import {
  FlexAlignItems,
  FlexAlignItemsValue,
  FlexJustifyContent,
  FlexJustifyContentValue,
  TextAlign,
  TextAlignValue,
  BgMode,
  BgModeValue,
  BoxSides,
} from "@/config/CMS/settings";

/* ===================== existing stuff ===================== */

export const ALIGN_ITEMS_MAP: Record<FlexAlignItemsValue, CSSProperties["alignItems"]> = {
  [FlexAlignItems.START]: "flex-start",
  [FlexAlignItems.CENTER]: "center",
  [FlexAlignItems.END]: "flex-end",
  [FlexAlignItems.STRETCH]: "stretch",
  [FlexAlignItems.BASELINE]: "baseline",
};

export const JUSTIFY_CONTENT_MAP: Record<
  FlexJustifyContentValue,
  CSSProperties["justifyContent"]
> = {
  [FlexJustifyContent.START]: "flex-start",
  [FlexJustifyContent.CENTER]: "center",
  [FlexJustifyContent.END]: "flex-end",
  [FlexJustifyContent.SPACE_BETWEEN]: "space-between",
  [FlexJustifyContent.SPACE_AROUND]: "space-around",
  [FlexJustifyContent.SPACE_EVENLY]: "space-evenly",
};

export function mapAlignItems(
  v?: FlexAlignItemsValue | null
): CSSProperties["alignItems"] | undefined {
  return v ? ALIGN_ITEMS_MAP[v] : undefined;
}

export function mapJustifyContent(
  v?: FlexJustifyContentValue | null
): CSSProperties["justifyContent"] | undefined {
  return v ? JUSTIFY_CONTENT_MAP[v] : undefined;
}

export function textAlignToFlexAlign(a: TextAlignValue): CSSProperties["alignItems"] {
  return a === TextAlign.CENTER ? "center" : a === TextAlign.RIGHT ? "flex-end" : "flex-start";
}

export function normalizeBgMode(v?: string | BgModeValue): BgMode | undefined {
  if (!v) return undefined;
  const s = String(v).toLowerCase() as BgMode;
  return (Object.values(BgMode) as string[]).includes(s) ? s : undefined;
}

export function normalizeSize(v?: string | number, fallback?: string | number): string | undefined {
  const pick = v ?? fallback;
  if (pick == null || pick === "") return undefined;
  if (typeof pick === "number") return `${pick}px`;
  const s = String(pick).trim().replace(/\s+(?=[a-z%]+$)/i, "");
  return /^\d+$/.test(s) ? `${s}px` : s;
}

export const hexToRgba = (hex: string, alpha: number) => {
  const h = hex?.trim();
  if (!h) return `rgba(0,0,0,${alpha})`;
  const full = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
  const short = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(h);
  let r = 0,
    g = 0,
    b = 0;
  if (full) {
    r = parseInt(full[1], 16);
    g = parseInt(full[2], 16);
    b = parseInt(full[3], 16);
  } else if (short) {
    r = parseInt(short[1] + short[1], 16);
    g = parseInt(short[2] + short[2], 16);
    b = parseInt(short[3] + short[3], 16);
  }
  const a = Number.isFinite(alpha) ? alpha : 0.4;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

/* ===================== new helpers ===================== */

/**
 * CSS-safe url(...) builder.
 * JSON.stringify handles quotes/backslashes safely.
 */
export const cssUrl = (input?: unknown): string | undefined => {
  if (input == null) return undefined;
  const url = String(input).trim();
  if (!url) return undefined;
  return `url(${JSON.stringify(url)})`;
};

export const boxSidesToPaddingStyle = (
  box?: BoxSides | null
): Pick<CSSProperties, "paddingTop" | "paddingRight" | "paddingBottom" | "paddingLeft"> => ({
  paddingTop: normalizeSize(box?.top),
  paddingRight: normalizeSize(box?.right),
  paddingBottom: normalizeSize(box?.bottom),
  paddingLeft: normalizeSize(box?.left),
});

type OverlayLike = {
  overlayEnabled?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
};

export const resolveOverlayCss = (
  explicitOverlayCss?: string,
  overlay?: OverlayLike | null
): string | undefined => {
  if (explicitOverlayCss) return explicitOverlayCss;
  if (!overlay?.overlayEnabled) return undefined;

  const color = overlay.overlayColor || "#000000";
  const alpha = typeof overlay.overlayOpacity === "number" ? overlay.overlayOpacity : 0.4;

  return `linear-gradient(${hexToRgba(color, alpha)}, ${hexToRgba(color, alpha)})`;
};

export const buildBackgroundImageCss = (args: {
  mode: BgMode;
  bgImage?: string;
  gradientFrom?: string;
  gradientTo?: string;
  gradientAngle?: number;
  overlayCss?: string;
}): string | undefined => {
  const { mode, bgImage, gradientFrom, gradientTo, gradientAngle, overlayCss } = args;

  let base: string | undefined;

  if (mode === BgMode.IMAGE && bgImage) {
    base = cssUrl(bgImage);
  } else if (mode === BgMode.GRADIENT && gradientFrom && gradientTo) {
    const angle = Number.isFinite(gradientAngle as number) ? (gradientAngle as number) : 135;
    base = `linear-gradient(${angle}deg, ${gradientFrom}, ${gradientTo})`;
  }

  if (mode !== BgMode.VIDEO && overlayCss) {
    return base ? `${overlayCss}, ${base}` : overlayCss;
  }

  return base;
};

export const backgroundStyleFromCss = (args: {
  mode: BgMode;
  backgroundImageCss?: string;
  bgSize?: string;
  bgPos?: string;
  bgRepeat?: string;
  bgAttach?: string;
}): Pick<
  CSSProperties,
  "backgroundImage" | "backgroundSize" | "backgroundPosition" | "backgroundRepeat" | "backgroundAttachment"
> => {
  const { mode, backgroundImageCss, bgSize, bgPos, bgRepeat, bgAttach } = args;

  if (mode === BgMode.VIDEO || !backgroundImageCss) return {};

  return {
    backgroundImage: backgroundImageCss,
    backgroundSize: bgSize ?? "cover",
    backgroundPosition: bgPos ?? "center",
    backgroundRepeat: bgRepeat ?? "no-repeat",
    ...(bgAttach ? { backgroundAttachment: bgAttach as any } : {}),
  };
};
