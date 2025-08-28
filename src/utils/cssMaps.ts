
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
} from "@/config/CMS/settings";

export const ALIGN_ITEMS_MAP: Record<FlexAlignItemsValue, CSSProperties["alignItems"]> = {
    [FlexAlignItems.START]: "flex-start",
    [FlexAlignItems.CENTER]: "center",
    [FlexAlignItems.END]: "flex-end",
    [FlexAlignItems.STRETCH]: "stretch",
    [FlexAlignItems.BASELINE]: "baseline",
};

export const JUSTIFY_CONTENT_MAP: Record<FlexJustifyContentValue, CSSProperties["justifyContent"]> = {
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

export function textAlignToFlexAlign(
    a: TextAlignValue
): CSSProperties["alignItems"] {
    return a === TextAlign.CENTER ? "center" : a === TextAlign.RIGHT ? "flex-end" : "flex-start";
}

export function normalizeBgMode(
    v?: string | BgModeValue
): BgMode | undefined {
    if (!v) return undefined;
    const s = String(v).toLowerCase() as BgMode;
    return (Object.values(BgMode) as string[]).includes(s) ? s : undefined;
}

export function normalizeSize(
    v?: string | number,
    fallback?: string | number
): string | undefined {
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