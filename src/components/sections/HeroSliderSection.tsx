"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "./HeroSliderSection.css";

import { EffectCube, Navigation, Pagination, Autoplay } from "swiper/modules";
import { LanguageJson, getTranslatedText } from "@/utils/getTranslatedText";
import { useLanguage } from "@/hooks/useLanguage";
import { TextAlign } from "@/config/CMS/settings";

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

const HeroSliderSection: React.FC<HeroSliderProps> = ({
  slides,
  delay,
  sizes,
}) => {
  const { language } = useLanguage();


  const desktopSize = sizes?.desktop ?? "100vw";
  const tabletSize = sizes?.tablet ?? "100vw";
  const mobileSize = sizes?.mobile ?? "100vw";


  const pick = (...candidates: Array<string | undefined>) =>
    candidates.find(Boolean) ?? "";


  const sizesAttr = `(min-width: 1024px) ${desktopSize}, (min-width: 768px) ${tabletSize}, ${mobileSize}`;

  return (
    <div className="swiper-wrapper no-select">
      <Swiper
        grabCursor
        centeredSlides
        slidesPerView={1}
        autoplay={{ delay, disableOnInteraction: false }}
        loop
        navigation
        pagination={{ clickable: true }}
        modules={[EffectCube, Navigation, Pagination, Autoplay]}
        className="swiper-container"


      >
        {slides.map((slide, index) => {
          const isFirst = index === 0;


          const desktopSrc = pick(
            slide.images.desktop,
            slide.images.tablet,
            slide.images.mobile
          );
          const tabletSrc = pick(
            slide.images.tablet,
            slide.images.desktop,
            slide.images.mobile
          );
          const mobileSrc = pick(
            slide.images.mobile,
            slide.images.tablet,
            slide.images.desktop
          );

          const altText =
            slide.alt ??
            (typeof slide.header === "string"
              ? slide.header
              : getTranslatedText(slide.header, language));

          return (
            <SwiperSlide key={index}>
              <div className="slide-content">
                <picture>
                  <source
                    media="(min-width: 1024px)"
                    srcSet={desktopSrc}
                    sizes={desktopSize}
                  />
                  <source
                    media="(min-width: 768px)"
                    srcSet={tabletSrc}
                    sizes={tabletSize}
                  />
                  <source
                    media="(max-width: 767px)"
                    srcSet={mobileSrc}
                    sizes={mobileSize}
                  />
                  {/* Fallback <img>. Keep sizes for correct selection if UA ignores <source> */}
                  <img
                    src={mobileSrc}
                    alt={String(altText ?? `Slide ${index + 1}`)}
                    className="slide-image"
                    loading={isFirst ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={isFirst ? "high" : "auto"}
                    sizes={sizesAttr}
                  />
                </picture>

                <div className={`slide-info ${slide.textAlign}`}>
                  <h2>{getTranslatedText(slide.header, language)}</h2>
                  {slide.description && (
                    <p>{getTranslatedText(slide.description, language)}</p>
                  )}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default HeroSliderSection;
