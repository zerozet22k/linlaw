"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Carousel } from "antd";

interface CustomCarouselProps {
  children: React.ReactNode;
  slidesToShow?: number;
  autoplay?: boolean;
  autoplaySpeed?: number;
  infinite?: boolean;
  dots?: boolean;
  arrowColor?: string;
  dotColor?: string;
  dotActiveColor?: string;

  gapPx?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingInline?: number;
}

const defaultResponsiveSettings = [
  { breakpoint: 1024, slidesToShow: 3 },
  { breakpoint: 768, slidesToShow: 2 },
  { breakpoint: 576, slidesToShow: 1 },
];

const CustomCarousel: React.FC<CustomCarouselProps> = ({
  children,
  slidesToShow = 3,
  autoplay = true,
  autoplaySpeed = 2000,
  infinite = true,
  dots = true,
  arrowColor = "black",
  dotColor = "#d9d9d9",
  dotActiveColor = "red",

  gapPx = 24,
  paddingTop = 36,
  paddingBottom = 36,
  paddingInline = 12,
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState<number>(0);

  const carouselVars = {
    "--arrow-color": arrowColor,
    "--dot-color": dotColor,
    "--dot-active-color": dotActiveColor,
    "--slide-gap": `${gapPx}px`,
  } as React.CSSProperties;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width || el.clientWidth || 0;
      setContainerW(Math.max(0, Math.floor(w)));
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const totalChildren = React.Children.count(children);
  const show = Math.min(slidesToShow, Math.max(1, totalChildren));

  const effectiveW = Math.max(0, containerW - paddingInline * 2);

  // keep this math (it matches "show cards with (show-1) gaps")
  const slidePx = useMemo(() => {
    if (!effectiveW) return 0;
    const gapsTotal = Math.max(0, show - 1) * gapPx;
    return Math.floor((effectiveW - gapsTotal) / show);
  }, [effectiveW, show, gapPx]);

  const initialSlide = Math.max(0, Math.floor(show / 2));

  const slides = useMemo(
    () =>
      React.Children.toArray(children).map((child, i) => (
        <div key={i} className="ccSlide" style={{ width: slidePx || "auto" }}>
          {child}
        </div>
      )),
    [children, slidePx]
  );

  return (
    <div
      ref={wrapRef}
      className="ccWrap"
      style={{
        position: "relative",
        width: "100%",
        paddingTop,
        paddingRight: paddingInline,
        paddingBottom,
        paddingLeft: paddingInline,
        boxSizing: "border-box",
        ...carouselVars,
      }}
    >
      <Carousel
        draggable
        variableWidth
        centerMode
        centerPadding="0px"
        initialSlide={initialSlide}
        autoplay={autoplay}
        autoplaySpeed={autoplaySpeed}
        dots={dots}
        infinite={infinite}
        slidesToShow={show}
        swipeToSlide
        responsive={defaultResponsiveSettings.map((s) => {
          const sShow = Math.min(s.slidesToShow, totalChildren);
          return {
            breakpoint: s.breakpoint,
            settings: {
              slidesToShow: sShow,
              initialSlide: Math.floor(sShow / 2),
            },
          };
        })}
        style={{ padding: 0 }}
      >
        {slides}
      </Carousel>

      <style jsx global>{`
        /* ✅ DO NOT use gap on slick-track (breaks centering math) */
        .ccWrap .slick-track {
          display: flex !important;
          align-items: stretch;
        }

        /* ✅ gap implementation that slick DOES account for */
        .ccWrap .slick-list {
          margin: 0 calc(var(--slide-gap) / -2);
        }
        .ccWrap .slick-slide {
          padding: 0 calc(var(--slide-gap) / 2);
          height: auto !important;
          box-sizing: border-box;
        }

        .ccWrap .slick-slide > div {
          height: 100%;
        }
        .ccWrap .ccSlide {
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default CustomCarousel;
