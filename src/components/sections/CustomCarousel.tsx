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
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState<number>(0);


  const carouselStyles = {
    "--arrow-color": arrowColor,
    "--dot-color": dotColor,
    "--dot-active-color": dotActiveColor,
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


  const sideGutter = 12;
  const effectiveW = Math.max(0, containerW - sideGutter * 2);


  const slidePx = useMemo(() => {
    if (!effectiveW) return 0;
    return Math.floor(effectiveW / show);
  }, [effectiveW, show]);


  const initialSlide = Math.max(0, Math.floor(show / 2));


  const slides = useMemo(
    () =>
      React.Children.toArray(children).map((child, i) => (
        <div key={i} style={{ width: slidePx || "auto" }}>{child}</div>
      )),
    [children, slidePx]
  );

  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        width: "100%",
        paddingTop: 50,
        paddingRight: sideGutter,
        paddingBottom: 50,
        paddingLeft: sideGutter,
        ...carouselStyles,
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

        responsive={defaultResponsiveSettings.map((s) => ({
          breakpoint: s.breakpoint,
          settings: { slidesToShow: Math.min(s.slidesToShow, totalChildren), initialSlide: Math.floor(Math.min(s.slidesToShow, totalChildren) / 2) },
        }))}
        style={{ padding: 0 }}
      >
        {slides}
      </Carousel>
    </div>
  );
};

export default CustomCarousel;
