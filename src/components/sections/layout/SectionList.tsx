// components/sections/layout/SectionList.tsx
"use client";

import React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { getTranslatedText, LanguageJson } from "@/utils/getTranslatedText";
import {
    sectionOuterStyle,
    sectionWrapperStyle,
    sectionTitleStyle,
    sectionDescriptionStyle,
} from "../sectionStyles";

export type SectionListItem = {
    id: string;
    node: React.ReactNode;

    title?: LanguageJson | string;
    description?: LanguageJson | string;

    show?: boolean;

    // visual overrides
    background?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
    overlay?: string;

    renderHeader?: boolean;
    requireItems?: boolean;
    itemsKey?: string | string[];
};

type SectionListProps = {
    items: SectionListItem[];
    zebra?: boolean;
    zebraLight?: string;
    zebraDark?: string;
};

const SectionList: React.FC<SectionListProps> = ({
    items,
    zebra = true,
    zebraLight = "#ffffff",
    zebraDark = "#f5f5f5",
}) => {
    const { language } = useLanguage();

    const resolveText = (val?: LanguageJson | string) => {
        if (!val) return "";
        if (typeof val === "string") return val.trim();
        return getTranslatedText(val, language) || "";
    };

    const extractPayload = (node: React.ReactNode): any | undefined => {
        if (!React.isValidElement(node)) return undefined;
        const props: any = node.props ?? {};
        return props.data ?? props.section ?? undefined;
    };

    const hasOwn = (o: unknown, k: string): boolean =>
        !!o && typeof o === "object" && Object.prototype.hasOwnProperty.call(o, k);

    const arrLen = (v: unknown) => (Array.isArray(v) ? v.length : 0);

    const ensureNonEmpty = (payload: any, keys: string[]): boolean => {
        for (const k of keys) {
            if (!hasOwn(payload, k)) return false;
            const v = payload[k];
            if (Array.isArray(v)) {
                if (v.length === 0) return false;
            } else if (v == null) {
                return false;
            }
        }
        return true;
    };

    const autoShouldShow = (item: SectionListItem): boolean => {
        if (typeof item.show === "boolean") return item.show;

        const payload = extractPayload(item.node);
        if (!payload) return true;

        if (item.requireItems) {
            const keys = Array.isArray(item.itemsKey)
                ? item.itemsKey
                : [item.itemsKey ?? "items"];
            return ensureNonEmpty(payload, keys);
        }

        // fallback: if a known collection key exists, require it to be non-empty
        const known = ["items", "slides"];
        for (const k of known) {
            if (hasOwn(payload, k)) return arrLen(payload[k]) > 0;
        }
        return true;
    };

    const deriveSectionMeta = (
        item: SectionListItem
    ): {
        titleText: string;
        descText: string;
        align: "left" | "center" | "right";
        sectionBg?: string;
    } => {
        let titleText = resolveText(item.title);
        let descText = resolveText(item.description);
        let align: "left" | "center" | "right" = "center";
        let sectionBg: string | undefined;

        const payload = extractPayload(item.node);
        const cfg = payload?.section ?? payload;

        if (cfg) {
            if (!titleText) titleText = resolveText(cfg.title);
            if (!descText) descText = resolveText(cfg.description);
            if (cfg.align === "left" || cfg.align === "right" || cfg.align === "center") {
                align = cfg.align;
            }
            sectionBg = cfg.backgroundImage;
        }

        return { titleText, descText, align, sectionBg };
    };

    const visibleItems = items.filter(autoShouldShow);

    return (
        <>
            {visibleItems.map((it, idx) => {
                const { titleText, descText, align, sectionBg } = deriveSectionMeta(it);

                const bgImage: string | undefined = it.backgroundImage ?? sectionBg ?? undefined;
                const zebraColor = zebra ? (idx % 2 === 0 ? zebraLight : zebraDark) : undefined;
                const bgColor = it.background ?? (!bgImage ? zebraColor : undefined);
                const bgImageCss =
                    it.overlay && bgImage
                        ? `${it.overlay}, url(${bgImage})`
                        : bgImage
                            ? `url(${bgImage})`
                            : it.overlay
                                ? it.overlay
                                : undefined;

                const style: React.CSSProperties = {
                    ...sectionOuterStyle,
                    backgroundColor: bgColor,
                };

                if (bgImageCss) {
                    style.backgroundImage = bgImageCss;
                    style.backgroundSize = it.backgroundSize ?? "cover";
                    style.backgroundPosition = it.backgroundPosition ?? "center";
                    style.backgroundRepeat = it.backgroundRepeat ?? "no-repeat";
                }

                const shouldRenderTop = (it.renderHeader ?? true) && (titleText || descText);

                const headerWrapStyle: React.CSSProperties = {
                    ...sectionWrapperStyle,
                    textAlign: align,
                };
                const descStyle: React.CSSProperties = {
                    ...sectionDescriptionStyle,
                    maxWidth: 720,
                    margin: align === "center" ? "0 auto" : "0",
                };

                return (
                    <section key={it.id} id={it.id} style={style}>
                        {shouldRenderTop && (
                            <div style={headerWrapStyle}>
                                {titleText && <h2 style={sectionTitleStyle}>{titleText}</h2>}
                                {descText && <p style={descStyle}>{descText}</p>}
                            </div>
                        )}
                        {it.node}
                    </section>
                );
            })}
        </>
    );
};

export default SectionList;
