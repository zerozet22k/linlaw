/*  components/pages/HomePageContent.tsx  */
"use client";

import React from "react";
import { Layout } from "antd";

import HeroSliderSection from "@/components/sections/HeroSliderSection";
import FAQSection from "@/components/sections/FAQSection";
import RelatedBusinesses from "@/components/sections/RelatedBusinesses";
import ServicesSection from "@/components/sections/ServicesSection";
import AboutUsSection from "@/components/sections/AboutUsSection";
import ContactUsForm from "@/components/sections/ContactUsForm";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import NewsletterSection from "@/components/sections/NewsletterSection";
import SectionWrapper from "@/components/sections/SectionWrapper";

import {
  HOME_PAGE_SETTINGS_KEYS as K,
  HOME_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/HOME_PAGE_SETTINGS";
import { useLanguage } from "@/hooks/useLanguage";

const { Content } = Layout;

/* ---------- map section-names → anchor ids (and keep in one place) ---------- */
const IDS = {
  ADS: "ads",
  SERVICES: "services",
  ABOUT: "about",
  FAQ: "faq",
  NEWSLETTERS: "news",
  TESTIMONIALS: "testimonials",
  CONTACT: "contact",
} as const;

type Props = { data: HOME_PAGE_SETTINGS_TYPES };

const HomePageContent: React.FC<Props> = ({ data }) => {
  const { language } = useLanguage();

  const heroSlides = data[K.HERO_BANNER] ?? [];
  const ads = data[K.RELATED_BUSINESS] ?? [];
  const services = data[K.SERVICES_SECTION] ?? {};
  const aboutUs = data[K.ABOUT_US_SECTION] ?? {};
  const faq = data[K.FAQS_SECTION] ?? {};
  const testimonials = data[K.TESTIMONIALS_SECTION] ?? {};

  let zebra = 0;
  const wrap = (show: boolean, id: string, jsx: React.ReactNode) =>
    show ? (
      <SectionWrapper key={id} index={zebra++} id={id}>
        {jsx}
      </SectionWrapper>
    ) : null;

  const hasAds = ads.filter(Boolean).length > 0;
  const hasSrv = services.items?.length > 0;
  const hasAbout = aboutUs.items?.length > 0;
  const hasFAQ = faq.items?.length > 0;
  const hasTest = testimonials.testimonials?.length > 0;

  return (
    <Layout style={{ width: "100%", padding: 0 }}>
      <Content style={{ margin: 0 }}>
        {/* hero never wrapped (full-bleed) */}
        <HeroSliderSection slides={heroSlides} delay={5000} />

        {wrap(hasAds, IDS.ADS, <RelatedBusinesses cards={ads} />)}
        {wrap(
          hasSrv,
          IDS.SERVICES,
          <ServicesSection section={services} language={language} />
        )}
        {wrap(
          hasAbout,
          IDS.ABOUT,
          <AboutUsSection section={aboutUs} language={language} />
        )}
        {wrap(hasFAQ, IDS.FAQ, <FAQSection section={faq} />)}
        {wrap(true, IDS.NEWSLETTERS, <NewsletterSection />)}

        {wrap(
          hasTest,
          IDS.TESTIMONIALS,
          <TestimonialsSection section={testimonials} />
        )}
        {wrap(true, IDS.CONTACT, <ContactUsForm />)}
      </Content>
    </Layout>
  );
};

export default HomePageContent;
