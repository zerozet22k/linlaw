"use client";

import React from "react";
import { Layout } from "antd";
import HeroSliderSection from "@/components/sections/HeroSliderSection";
import FAQSection from "@/components/sections/FAQSection";
import RelatedBusinesses from "@/components/sections/RelatedBusinesses";
import ServicesSection from "@/components/sections/ServicesSection";
import AboutUsSection from "@/components/sections/AboutUsSection";
import ContactUsForm from "@/components/sections/ContactUsForm";
import Testimonials from "@/components/sections/TestimonialsSection";
import NewsletterSection from "@/components/sections/NewsletterSection";
import {
  HOME_PAGE_SETTINGS_KEYS,
  HOME_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/HOME_PAGE_SETTINGS";
import { useLanguage } from "@/hooks/useLanguage";
import SectionWrapper from "@/components/sections/SectionWrapper";

const { Content } = Layout;

type HomePageContentProps = {
  data: HOME_PAGE_SETTINGS_TYPES;
};

const HomePageContent: React.FC<HomePageContentProps> = ({ data }) => {
  const { language } = useLanguage();

  const heroSlides = data[HOME_PAGE_SETTINGS_KEYS.HERO_BANNER] || [];
  const faqSection = data[HOME_PAGE_SETTINGS_KEYS.FAQS_SECTION] || [];
  const ads = data[HOME_PAGE_SETTINGS_KEYS.RELATED_BUSINESS] || [];
  const testimonialSection =
    data[HOME_PAGE_SETTINGS_KEYS.TESTIMONIALS_SECTION] || [];
  const services = data[HOME_PAGE_SETTINGS_KEYS.SERVICES_SECTION] || [];
  const aboutUs = data[HOME_PAGE_SETTINGS_KEYS.ABOUT_US_SECTION] ?? [];

  return (
    <Layout style={{ width: "100%", maxWidth: "100%", padding: 0 }}>
      <Content style={{ margin: 0, minHeight: 380 }}>
        <HeroSliderSection slides={heroSlides} delay={5000} />

        <SectionWrapper index={0}>
          <RelatedBusinesses cards={ads} />
        </SectionWrapper>

        <SectionWrapper index={1}>
          <ServicesSection section={services} language={language} />
        </SectionWrapper>

        <SectionWrapper index={2}>
          <AboutUsSection section={aboutUs} language={language} />
        </SectionWrapper>

        <SectionWrapper index={3}>
          <FAQSection section={faqSection} />
        </SectionWrapper>

        <SectionWrapper index={4}>
          <NewsletterSection />
        </SectionWrapper>

        <SectionWrapper index={5}>
          <Testimonials section={testimonialSection} />
        </SectionWrapper>

        <SectionWrapper index={6}>
          <ContactUsForm />
        </SectionWrapper>
      </Content>
    </Layout>
  );
};

export default HomePageContent;
