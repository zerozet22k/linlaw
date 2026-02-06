"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/i18n";
import {
  sectionOuterStyle,
  sectionWrapperStyle,
  sectionDescriptionStyle,
  sectionTitleStyle,
} from "@/components/sections/layout/sectionStyles";

import {
  TextAlign,
  VerticalAlign,
  BgMode,
  OverflowMode,
  BoxSides,
  FlexAlignItems,
  FlexJustifyContent,
} from "@/config/CMS/settings";

import {
  mapAlignItems,
  mapJustifyContent,
  textAlignToFlexAlign,
  normalizeBgMode,
  normalizeSize,
  hexToRgba,
} from "@/utils/components/cssMaps";
import { SectionProps } from "@/config/CMS/fields/SECTION_SETTINGS";
import { cssUrl } from "@/utils/components/cssUrl";

export type LanguageJson = Record<string, string>;

export type SectionListItem = {
  id: string; // "services" or "#services" or "/#services"
  node: React.ReactNode;

  title?: LanguageJson | string;
  description?: LanguageJson | string;

  show?: boolean;

  background?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  overlay?: string;
};

type SectionListProps = {
  sections: SectionListItem[];
  zebra?: boolean;
  zebraLight?: string;
  zebraDark?: string;

  // offset for fixed header when jumping
  scrollMarginTop?: number | string;

  // ✅ key feature: when scrolling, keep URL hash synced to active section
  syncHashOnScroll?: boolean;
};

const isBoxSides = (v: unknown): v is BoxSides =>
  !!v && typeof v === "object" && !Array.isArray(v);

const extractPayload = (node: React.ReactNode): any | undefined => {
  if (!React.isValidElement(node)) return undefined;
  const props: any = node.props ?? {};
  return props.data ?? props.section ?? undefined;
};

const resolveEffectiveSource = (
  bgMode: BgMode,
  section: Partial<SectionProps>,
  bgImage?: string,
  gradientFrom?: string,
  gradientTo?: string
) => {
  let effectiveSource = bgMode;

  if (effectiveSource === BgMode.AUTO) {
    if (section.background?.video?.videoUrl) effectiveSource = BgMode.VIDEO;
    else if (bgImage) effectiveSource = BgMode.IMAGE;
    else if (gradientFrom && gradientTo) effectiveSource = BgMode.GRADIENT;
    else if (section.background?.color?.backgroundColor) effectiveSource = BgMode.COLOR;
    else effectiveSource = BgMode.NONE;
  }

  return effectiveSource;
};

const clean = (s: string) => (s || "").replace(/\s+/g, " ").trim();

const normalizeDomId = (raw: string) => {
  const s = String(raw ?? "").trim();
  if (!s) return "";

  let x = s.replace(/^\/?#/, "").replace(/^#/, "");
  x = x.split("?")[0].split("&")[0];

  x = x
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-_:.]/g, "");

  return x;
};

const parsePx = (v: number | string | undefined) => {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  const n = parseInt(String(v).replace(/[^\d-]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
};

const SectionList: React.FC<SectionListProps> = ({
  sections,
  zebra = true,
  zebraLight = "#ffffff",
  zebraDark = "#f5f5f5",
  scrollMarginTop = 96,
  syncHashOnScroll = true,
}) => {
  const { language } = useLanguage();

  const resolveText = (val?: LanguageJson | string) => {
    if (!val) return "";
    return clean(t(language, val as any, ""));
  };

  const autoShouldShow = (item: SectionListItem): boolean => {
    if (typeof item.show === "boolean") return item.show;

    const payload = extractPayload(item.node);
    if (!payload) return true;

    const sectionLike = (payload?.section ?? payload) as any;
    if (typeof sectionLike?.enabled === "boolean" && sectionLike.enabled === false) return false;

    const items = (payload as any)?.items;
    if (Array.isArray(items) && items.length === 0) return false;

    const slides = (payload as any)?.slides;
    if (Array.isArray(slides) && slides.length === 0) return false;

    return true;
  };

  const visible = useMemo(() => sections.filter(autoShouldShow), [sections]);

  const idList = useMemo(() => {
    return visible.map((it) => normalizeDomId(it.id)).filter(Boolean);
  }, [visible]);

  // ✅ 1) On initial load with #hash, ensure we land on it (even if sections mount late)
  const didInitialHashScroll = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (didInitialHashScroll.current) return;

    const raw = (window.location.hash || "").replace(/^#/, "").trim();
    if (!raw) return;

    const targetId = normalizeDomId(raw);
    if (!targetId) return;

    const tryScroll = () => {
      const el = document.getElementById(targetId);
      if (!el) return false;
      el.scrollIntoView({ behavior: "auto", block: "start" });
      didInitialHashScroll.current = true;
      return true;
    };

    if (tryScroll()) return;

    const raf = requestAnimationFrame(() => {
      tryScroll();
    });

    return () => cancelAnimationFrame(raf);
  }, [idList.join("|")]);

  // ✅ 2) Scroll-spy: update URL hash when active section changes (NO jump)
  const lastHashRef = useRef<string>("");
  useEffect(() => {
    if (!syncHashOnScroll) return;
    if (typeof window === "undefined") return;
    if (!idList.length) return;

    const topOffset = parsePx(scrollMarginTop);
    const thresholds = [0.2, 0.35, 0.5, 0.65];

    const getCurrentHashId = () => normalizeDomId(window.location.hash || "");

    const setHashSilently = (id: string) => {
      const cur = getCurrentHashId();
      if (cur === id) return;

      const url = new URL(window.location.href);
      url.hash = `#${id}`;

      // replaceState avoids scroll jump and avoids spamming history
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
      lastHashRef.current = id;
    };

    // initialize "last"
    lastHashRef.current = getCurrentHashId();

    const elements = idList
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    if (!elements.length) return;

    let raf = 0;

    const obs = new IntersectionObserver(
      (entries) => {
        const candidates = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0));

        if (!candidates.length) return;

        const best = candidates[0].target as HTMLElement;
        if (!best?.id) return;

        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => setHashSilently(best.id));
      },
      {
        root: null,
        // top negative margin accounts for fixed header; bottom keeps it from switching too early
        rootMargin: `-${topOffset + 8}px 0px -55% 0px`,
        threshold: thresholds,
      }
    );

    elements.forEach((el) => obs.observe(el));

    return () => {
      cancelAnimationFrame(raf);
      obs.disconnect();
    };
  }, [idList.join("|"), scrollMarginTop, syncHashOnScroll]);

  return (
    <>
      {visible.map((it, idx) => {
        const payload = extractPayload(it.node);
        const section = (payload?.section ?? payload ?? {}) as Partial<SectionProps>;

        const domId = normalizeDomId(it.id) || `section-${idx}`;

        const titleText = resolveText(it.title ?? (section as any).content?.title);
        const descText = resolveText(it.description ?? (section as any).content?.description);

        const align =
          section.content?.align === TextAlign.LEFT ||
          section.content?.align === TextAlign.RIGHT ||
          section.content?.align === TextAlign.CENTER
            ? section.content.align
            : TextAlign.CENTER;

        const textColor = section.content?.textColor || undefined;
        const bgMode = normalizeBgMode(section.background?.mode) || BgMode.AUTO;

        const bgColor =
          (it.background as string) ?? section.background?.color?.backgroundColor ?? undefined;

        const bgImage = it.backgroundImage ?? section.background?.image?.backgroundImage ?? undefined;
        const bgSize = it.backgroundSize ?? section.background?.image?.backgroundSize ?? undefined;
        const bgPos = it.backgroundPosition ?? section.background?.image?.backgroundPosition ?? undefined;
        const bgRepeat = it.backgroundRepeat ?? section.background?.image?.backgroundRepeat ?? undefined;
        const bgAttach = section.background?.image?.backgroundAttachment ?? undefined;

        const gradientFrom = section.background?.gradient?.gradientFrom ?? undefined;
        const gradientTo = section.background?.gradient?.gradientTo ?? undefined;
        const gradientAngle =
          typeof section.background?.gradient?.gradientAngle === "number"
            ? section.background?.gradient?.gradientAngle
            : undefined;

        let overlayCss = it.overlay as string | undefined;
        if (!overlayCss && section.overlay?.overlayEnabled) {
          const color = section.overlay.overlayColor || "#000000";
          const alpha =
            typeof section.overlay.overlayOpacity === "number" ? section.overlay.overlayOpacity : 0.4;
          overlayCss = `linear-gradient(${hexToRgba(color, alpha)}, ${hexToRgba(color, alpha)})`;
        }

        const minHeight =
          section.layout?.height?.minHeightEnabled && section.layout?.height?.minHeight
            ? normalizeSize(section.layout.height.minHeight)
            : undefined;

        const maxHeight =
          section.layout?.height?.maxHeightEnabled && section.layout?.height?.maxHeight
            ? normalizeSize(section.layout.height.maxHeight)
            : undefined;

        const overflowMode = section.layout?.height?.maxHeightEnabled
          ? section.layout?.overflow?.overflowMode ?? OverflowMode.CLIP
          : undefined;

        const verticalAlign = section.layout?.height?.verticalAlign ?? VerticalAlign.TOP;

        const paddingBox: BoxSides | undefined = isBoxSides(section.layout?.spacing?.padding)
          ? section.layout?.spacing?.padding
          : undefined;

        const paddingTop = normalizeSize(paddingBox?.top);
        const paddingRight = normalizeSize(paddingBox?.right);
        const paddingBottom = normalizeSize(paddingBox?.bottom);
        const paddingLeft = normalizeSize(paddingBox?.left);

        const itemsAlign = section.layout?.items?.align as FlexAlignItems | undefined;
        const itemsJustify = section.layout?.items?.justify as FlexJustifyContent | undefined;
        const itemsWrap = section.layout?.items?.wrap ?? undefined;
        const itemsGap = normalizeSize(section.layout?.items?.gap);

        const effectiveSource = resolveEffectiveSource(bgMode, section, bgImage, gradientFrom, gradientTo);

        let backgroundImageCss: string | undefined;
        if (effectiveSource === BgMode.IMAGE && bgImage) {
          backgroundImageCss = cssUrl(bgImage);
        } else if (effectiveSource === BgMode.GRADIENT && gradientFrom && gradientTo) {
          const angle = Number.isFinite(gradientAngle as number) ? (gradientAngle as number) : 135;
          backgroundImageCss = `linear-gradient(${angle}deg, ${gradientFrom}, ${gradientTo})`;
        }

        if (effectiveSource !== BgMode.VIDEO && overlayCss) {
          backgroundImageCss = backgroundImageCss ? `${overlayCss}, ${backgroundImageCss}` : overlayCss;
        }

        const zebraColor = zebra ? (idx % 2 === 0 ? zebraLight : zebraDark) : undefined;
        const bgColorStyle =
          bgColor ?? (!backgroundImageCss && effectiveSource !== BgMode.VIDEO ? zebraColor : undefined);

        const style: React.CSSProperties = {
          ...sectionOuterStyle,
          position: "relative",
          boxSizing: "border-box",
          width: "100%",
          maxWidth: "100%",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent:
            verticalAlign === VerticalAlign.CENTER
              ? "center"
              : verticalAlign === VerticalAlign.BOTTOM
              ? "flex-end"
              : "flex-start",
          backgroundColor: bgColorStyle,
          color: textColor,
          minHeight,
          maxHeight,
          overflow: maxHeight && overflowMode === OverflowMode.CLIP ? "hidden" : undefined,
          overflowY: maxHeight && overflowMode === OverflowMode.SCROLL ? "auto" : undefined,
          paddingTop,
          paddingRight,
          paddingBottom,
          paddingLeft,
          gap: itemsGap ?? undefined,

          // lets anchor landing respect fixed header
          scrollMarginTop:
            typeof scrollMarginTop === "number" ? `${scrollMarginTop}px` : scrollMarginTop,
        };

        if (effectiveSource !== BgMode.VIDEO && backgroundImageCss) {
          style.backgroundImage = backgroundImageCss;
          style.backgroundSize = bgSize ?? "cover";
          style.backgroundPosition = bgPos ?? "center";
          style.backgroundRepeat = bgRepeat ?? "no-repeat";
          if (bgAttach) style.backgroundAttachment = bgAttach as any;
        }

        const shouldRenderTop = !!(titleText || descText);

        const headerWrapStyle: React.CSSProperties = {
          ...sectionWrapperStyle,
          textAlign: align,
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
          paddingBlock: 32,
          ...(textColor ? { color: textColor } : {}),
          marginTop: "20px",
        };

        const titleStyle: React.CSSProperties = {
          ...sectionTitleStyle,
          display: "block",
          ...(textColor ? { color: textColor } : {}),
        };

        const descStyle: React.CSSProperties = {
          ...sectionDescriptionStyle,
          width: "100%",
          margin: align === TextAlign.CENTER ? "0 auto" : "0",
          whiteSpace: "normal",
          wordBreak: "normal",
          overflowWrap: "break-word",
          writingMode: "horizontal-tb",
          lineHeight: 1.6,
          letterSpacing: "normal",
          display: "block",
          padding: "0 20px",
          ...(textColor ? { color: textColor } : {}),
        };

        const innerContentStyle: React.CSSProperties = {
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
          overflowX: "hidden",
        };

        const hasItemsLayout = Boolean(
          section.layout?.items?.align ||
            section.layout?.items?.justify ||
            typeof section.layout?.items?.wrap === "boolean" ||
            section.layout?.items?.gap != null
        );

        const effectiveItemsAlign = mapAlignItems(itemsAlign) ?? textAlignToFlexAlign(align);
        const effectiveItemsJustify =
          mapJustifyContent(itemsJustify) ??
          (align === TextAlign.CENTER ? "center" : align === TextAlign.RIGHT ? "flex-end" : "flex-start");

        const rowBase: React.CSSProperties = {
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          overflowX: "hidden",
          display: "flex",
          justifyContent: effectiveItemsJustify,
          alignItems: effectiveItemsAlign,
          gap: itemsGap ?? undefined,
        };

        const itemsWrapStyle: React.CSSProperties = hasItemsLayout
          ? { ...rowBase, flexWrap: itemsWrap ? "wrap" : "nowrap" }
          : { ...rowBase, flexWrap: "wrap" };

        const videoLayer =
          effectiveSource === BgMode.VIDEO && section.background?.video?.videoUrl ? (
            <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
              <video
                src={section.background.video.videoUrl}
                poster={section.background.video.videoPoster || undefined}
                autoPlay={!!section.background.video.videoAutoplay}
                muted={section.background.video.videoMuted !== false}
                loop={!!section.background.video.videoLoop}
                playsInline={section.background.video.videoPlaysInline !== false}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: bgPos || "center",
                }}
              />
              {overlayCss && <div style={{ position: "absolute", inset: 0, backgroundImage: overlayCss }} />}
            </div>
          ) : null;

        return (
          <section key={domId} id={domId} data-section-id={domId} style={style}>
            {videoLayer}

            <div style={innerContentStyle}>
              {shouldRenderTop && (
                <div style={headerWrapStyle}>
                  {titleText && <h2 style={titleStyle}>{titleText}</h2>}
                  {descText && <p style={descStyle}>{descText}</p>}
                </div>
              )}

              <div style={itemsWrapStyle}>{it.node}</div>
            </div>
          </section>
        );
      })}
    </>
  );
};

export default SectionList;
