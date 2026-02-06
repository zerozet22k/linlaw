"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import "./HeroSliderSection.css";

import {
  EffectFade,
  Navigation,
  Pagination,
  Autoplay,
  A11y,
  Keyboard,
} from "swiper/modules";

import { useLanguage } from "@/hooks/useLanguage";
import { TextAlign } from "@/config/CMS/settings";
import { t } from "@/i18n";
import type { LanguageJson } from "@/i18n/types";

export interface Slide {
  images: {
    desktop?: string;
    tablet?: string;
    mobile?: string;
  };
  header: LanguageJson;
  description?: LanguageJson;
  textAlign: TextAlign;
  alt?: string;
}

interface HeroSliderProps {
  slides: Slide[];
  delay: number;
  sizes?: {
    desktop?: string;
    tablet?: string;
    mobile?: string;
  };
  aspectRatio?: number;
}

const clean = (s: string) => (s || "").replace(/\s+/g, " ").trim();
const tt = (lang: string, v: any, fallback = "") => clean(t(lang, v, fallback));

const pick = (...candidates: Array<string | undefined>) =>
  candidates.find(Boolean) ?? "";

export default function HeroSliderSection({
  slides,
  delay,
  sizes,
  aspectRatio = 16 / 9,
}: HeroSliderProps) {
  const { language } = useLanguage();

  // ✅ MOBILE DETECTION: disable aspect-ratio on mobile so image can fill full slide height
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);

    update();

    if (mq.addEventListener) mq.addEventListener("change", update);
    else mq.addListener(update);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", update);
      else mq.removeListener(update);
    };
  }, []);

  const desktopSize = sizes?.desktop ?? "100vw";
  const tabletSize = sizes?.tablet ?? "100vw";
  const mobileSize = sizes?.mobile ?? "100vw";

  const sizesAttr = useMemo(
    () =>
      `(min-width: 1024px) ${desktopSize}, (min-width: 768px) ${tabletSize}, ${mobileSize}`,
    [desktopSize, tabletSize, mobileSize]
  );

  const ariaLabel = useMemo(
    () => tt(language, "common.heroSlider", "Hero slider"),
    [language]
  );

  const normalized = useMemo(() => {
    return (slides ?? []).map((slide, index) => {
      const src = pick(slide.images.desktop, slide.images.tablet, slide.images.mobile);

      const headerText = tt(language, slide.header, "");
      const descText = slide.description ? tt(language, slide.description, "") : "";

      const altText =
        clean(String(slide.alt ?? "")) ||
        headerText ||
        tt(language, "common.slideAltFallback", `Slide ${index + 1}`);

      return {
        key: `${src || "slide"}:${index}`,
        src,
        headerText,
        descText,
        altText,
        textAlign: slide.textAlign,
        isFirst: index === 0,
      };
    });
  }, [slides, language]);

  if (!normalized.length) return null;

  return (
    <section className="heroSlider no-select" aria-label={ariaLabel}>
      <Swiper
        className="heroSwiper"
        slidesPerView={1}
        loop
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={750}
        autoplay={{
          delay,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation
        pagination={{ clickable: true }}
        keyboard={{ enabled: true }}
        a11y={{ enabled: true }}
        modules={[EffectFade, Navigation, Pagination, Autoplay, A11y, Keyboard]}
      >
        {normalized.map((s) => {
          if (!s.src) return null;

          return (
            <SwiperSlide key={s.key}>
              <div className="heroSlide">
                {/* ✅ apply aspectRatio only on non-mobile */}
                <div className="heroMedia" style={isMobile ? undefined : { aspectRatio }}>
                  <Image
                    src={s.src}
                    alt={s.altText}
                    fill
                    priority={s.isFirst}
                    sizes={sizesAttr}
                    quality={70}
                    style={{ objectFit: "cover" }}
                  />
                  <div className="heroOverlay" />
                </div>

                <div className={`heroContent ${s.textAlign}`}>
                  <div className="heroContentInner">
                    <h2 className="heroTitle">{s.headerText}</h2>
                    {!!s.descText && <p className="heroDesc">{s.descText}</p>}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
