// app/(site)/home/HomePageContent.tsx
"use client";

import React from "react";
import { Layout } from "antd";

import HeroSliderSection from "@/components/sections/HeroSliderSection";
import FAQSection from "@/components/sections/FAQSection";
import ServicesSection from "@/components/sections/ServicesSection";
import AboutUsSection from "@/components/sections/AboutUsSection";
import ClickToAction from "@/components/sections/ClickToAction";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import NewsletterSection from "@/components/sections/NewsletterSection";

import {
  HOME_PAGE_SETTINGS_KEYS as K,
  HOME_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/HOME_PAGE_SETTINGS";

import { useLanguage } from "@/hooks/useLanguage";
import SectionList, { SectionListItem } from "@/components/sections/layout/SectionList";
import RelatedBusinessesSection from "@/components/sections/RelatedBusinessesSection";
import PromoShowcaseSection from "@/components/sections/PromoShowcaseSection";
import { IDS } from "./pageid";

const { Content } = Layout;

;

type Props = { data: HOME_PAGE_SETTINGS_TYPES };

const HomePageContent: React.FC<Props> = ({ data }) => {
  const { language } = useLanguage();

  const heroSlides = data[K.HERO_BANNER] ?? [];
  const promoShowcase = data[K.PROMO_SHOWCASE] ?? {};
  const relatedBusinesses = data[K.RELATED_BUSINESS] ?? {};
  const services = data[K.SERVICES_SECTION] ?? {};
  const aboutUs = data[K.ABOUT_US_SECTION] ?? {};
  const faq = data[K.FAQS_SECTION] ?? {};
  const testimonials = data[K.TESTIMONIALS_SECTION] ?? {};
  const newsletters = data[K.NEWSLETTER_SECTION] ?? {};

  const sections: SectionListItem[] = [
    { id: IDS.PROMO_SHOWCASE, node: <PromoShowcaseSection data={promoShowcase} /> },
    { id: IDS.RELATED_BUSINESSES, node: <RelatedBusinessesSection section={relatedBusinesses.section} limit={6} /> },
    { id: IDS.SERVICES, node: <ServicesSection data={services} language={language} /> },
    { id: IDS.ABOUT, node: <AboutUsSection data={aboutUs} language={language} /> },
    { id: IDS.NEWSLETTERS, node: <NewsletterSection data={newsletters} language={language} /> },
    { id: IDS.FAQ, node: <FAQSection data={faq} language={language} /> },
    { id: IDS.TESTIMONIALS, node: <TestimonialsSection data={testimonials} language={language} /> },
    { id: IDS.CONTACT, node: <ClickToAction /> },
  ];


  return (
    <Layout style={{ width: "100%", padding: 0 }}>
      <Content style={{ margin: 0 }}>
        <HeroSliderSection slides={heroSlides} delay={5000} />
        <SectionList sections={sections} zebra />
      </Content>
    </Layout>
  );
};

export default HomePageContent;
