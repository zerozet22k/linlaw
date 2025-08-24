"use client";

import React from "react";
import { Row, Col } from "antd";
import RelatedBusiness from "./RelatedBusiness";
import { motion } from "framer-motion";
import {
  HOME_PAGE_SETTINGS_KEYS as K,
  HOME_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/HOME_PAGE_SETTINGS";

type RelatedBusinessData =
  HOME_PAGE_SETTINGS_TYPES[typeof K.RELATED_BUSINESS];

type RelatedBusinessesProps = {
  data: RelatedBusinessData;
};

const variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

const RelatedBusinesses: React.FC<RelatedBusinessesProps> = ({ data }) => {
  const items = Array.isArray(data?.items) ? data.items : [];
  if (items.length === 0) return null;

  return (
    <Row gutter={[24, 24]} justify="center">
      {items.map((business, index) => (
        <Col
          key={business.website ?? business.image ?? String(index)}
          xs={24}
          sm={12}
          md={8}
          lg={6}
          style={{ display: "flex" }}
        >
          <motion.div
            initial={variants.initial}
            animate={variants.animate}
            transition={{ duration: 0.4 + index * 0.1 }}
            style={{ width: "100%", height: "100%" }}
          >
            <RelatedBusiness business={business} />
          </motion.div>
        </Col>
      ))}
    </Row>
  );
};

export default RelatedBusinesses;
