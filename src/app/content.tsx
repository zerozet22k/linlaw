"use client";

import React from "react";
import { Layout, Card, Row, Col, Typography } from "antd";
import HeroSliderSection from "@/components/sections/HeroSliderSection";
import FAQSection from "@/components/sections/FAQSection";
import InfoCards from "@/components/sections/InfoCards";
import RelatedBusinesses from "@/components/sections/RelatedBusinesses";
import {
  HOME_PAGE_SETTINGS_KEYS,
  HOME_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/HOME_PAGE_SETTINGS";
import SendMailForm from "@/components/sections/SendMailForm";
import Testimonials from "@/components/sections/TestimonialsSection";
import NewsletterSection from "@/components/sections/NewsletterSection";

const { Content } = Layout;
const { Title, Text } = Typography;

type HomePageContentProps = {
  data: HOME_PAGE_SETTINGS_TYPES;
};

const HomePageContent: React.FC<HomePageContentProps> = ({ data }) => {
  const heroSlides = data[HOME_PAGE_SETTINGS_KEYS.HERO_BANNER] || [];

  const faqs = data[HOME_PAGE_SETTINGS_KEYS.FAQS] || [];
  const ads = data[HOME_PAGE_SETTINGS_KEYS.ADS] || [];
  const infoCards = data[HOME_PAGE_SETTINGS_KEYS.CARDS] || [];
  const testimonials = data[HOME_PAGE_SETTINGS_KEYS.TESTIMONIALS] || [];
  return (
    <Layout style={{ width: "100%", maxWidth: "100%", padding: "0px" }}>
      <Content style={{ margin: 0, minHeight: 380 }}>
        <HeroSliderSection slides={heroSlides} delay={5000} />
        <div style={{ width: "100%" }}>
          <InfoCards cards={infoCards} />
          <RelatedBusinesses cards={ads} />
          <Row
            gutter={[16, 16]}
            justify="center"
            style={{ width: "100%", margin: "0 auto" }}
          >
            <Col xs={24} lg={12}>
              <FAQSection faqs={faqs} />
            </Col>
            <Col sm={24} lg={12}>
              <NewsletterSection />
            </Col>
          </Row>
          <Testimonials testimonials={testimonials} />
          <div style={{ width: "100%" }}>
            <SendMailForm />
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default HomePageContent;
