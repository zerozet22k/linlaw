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
}

type Viewport = "mobile" | "tablet" | "desktop";

const clean = (s: unknown) => String(s ?? "").replace(/\s+/g, " ").trim();
const tt = (lang: string, v: any, fallback = "") => clean(t(lang, v, fallback));

const pick = (...candidates: Array<string | undefined>) =>
  candidates.find(Boolean) ?? "";

function getViewportFromWidth(w: number): Viewport {
  if (w >= 1024) return "desktop";
  if (w >= 768) return "tablet";
  return "mobile";
}

export default function HeroSliderSection({
  slides,
  delay,
  sizes,
}: HeroSliderProps) {
  const { language } = useLanguage();

  const [vp, setVp] = useState<Viewport>("desktop");

  useEffect(() => {
    const update = () => {
      setVp(getViewportFromWidth(window.innerWidth));
    };

    update();
    window.addEventListener("resize", update, { passive: true });
    window.addEventListener("orientationchange", update);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
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

  const usableSlides = useMemo(() => {
    const pickSrc = (img: Slide["images"]) => {
      if (vp === "desktop") return pick(img.desktop, img.tablet, img.mobile);
      if (vp === "tablet") return pick(img.tablet, img.desktop, img.mobile);
      return pick(img.mobile, img.tablet, img.desktop);
    };

    return (slides ?? [])
      .map((slide, index) => {
        const src = pickSrc(slide.images);

        const headerText = tt(language, slide.header, "");
        const descText = slide.description ? tt(language, slide.description, "") : "";
        const altText = clean(slide.alt) || headerText || `Slide ${index + 1}`;

        return {
          key: `${src || "slide"}:${index}`,
          src,
          headerText,
          descText,
          altText,
          textAlign: slide.textAlign,
          isFirst: index === 0,
        };
      })
      .filter((s) => !!s.src);
  }, [slides, language, vp]);

  if (!usableSlides.length) return null;

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
        a11y={{
          enabled: true,
          prevSlideMessage: tt(language, "common.prevSlide", "Previous slide"),
          nextSlideMessage: tt(language, "common.nextSlide", "Next slide"),
          paginationBulletMessage: tt(
            language,
            "common.goToSlide",
            "Go to slide {{index}}"
          ),
        }}
        modules={[EffectFade, Navigation, Pagination, Autoplay, A11y, Keyboard]}
      >
        {usableSlides.map((s) => (
          <SwiperSlide key={s.key}>
            <div className="heroSlide">
              {/* ✅ media ALWAYS fills slide height */}
              <div className="heroMedia" aria-hidden="true">
                <Image
                  src={s.src}
                  alt={s.altText}
                  fill
                  priority={s.isFirst}
                  sizes={sizesAttr}
                  quality={70}
                  style={{ objectFit: "cover" }}
                />
                <div className="heroOverlay" aria-hidden="true" />
              </div>

              <div className={`heroContent ${s.textAlign}`}>
                <div className="heroContentInner">
                  <h2 className="heroTitle">{s.headerText}</h2>
                  {!!s.descText && <p className="heroDesc">{s.descText}</p>}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
