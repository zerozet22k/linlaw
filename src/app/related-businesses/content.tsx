"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Typography, Spin, Alert, theme } from "antd";

import apiClient from "@/utils/api/apiClient";
import PageWrapper from "@/components/ui/PageWrapper";
import { useLanguage } from "@/hooks/useLanguage";
import { getTranslatedText } from "@/utils/getTranslatedText";
import { commonTranslations } from "@/translations";

import RelatedBusinessCard from "@/components/RelatedBusinessCard";
import { RelatedBusinessAPI } from "@/models/RelatedBusinessModel";

import {
  RELATED_BUSINESSES_PAGE_SETTINGS_KEYS as K,
  RELATED_BUSINESSES_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/RELATED_BUSINESSES_PAGE_SETTINGS";

type Props = {
  data: RELATED_BUSINESSES_PAGE_SETTINGS_TYPES;
};

const RelatedBusinessesContent: React.FC<Props> = ({ data }) => {
  const { language } = useLanguage();
  const { token } = theme.useToken();

  const pageContent = data?.[K.PAGE_CONTENT];
  const sections = data?.[K.SECTIONS];

  const tLoading =
    getTranslatedText(commonTranslations.loading, language) || "Loading...";
  const tError =
    getTranslatedText(commonTranslations.error, language) || "Error";
  const tNoData =
    getTranslatedText(commonTranslations.noData, language) || "No Data";

  // allow 0 = unlimited? your settings guide doesn't say that, so keep safe default
  const limit = Math.max(1, Number(sections?.maxBusinessesCount ?? 50));
  const includeInactive = Number(sections?.includeInactive ?? 0) === 1;

  const [items, setItems] = useState<RelatedBusinessAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchAll = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await apiClient.get(
          `/related-businesses?search=&page=1&limit=${limit}&includeInactive=${
            includeInactive ? 1 : 0
          }`
        );

        const list = Array.isArray(res.data?.businesses)
          ? res.data.businesses
          : Array.isArray(res.data)
          ? res.data
          : [];

        if (mounted) setItems(list);
      } catch (e) {
        console.error("Failed to fetch related businesses:", e);
        if (mounted) {
          setItems([]);
          setError("Failed to load related businesses.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAll();
    return () => {
      mounted = false;
    };
  }, [limit, includeInactive]);

  const sorted = useMemo(() => {
    const arr = Array.isArray(items) ? [...items] : [];

    const titleForSort = (it: any) => {
      const localized = getTranslatedText(it?.title, language);
      if (localized) return localized.trim().toLowerCase();
      const en = getTranslatedText(it?.title, "en");
      return (en || "").trim().toLowerCase();
    };

    arr.sort((a, b) => {
      const aActive = a.isActive ? 1 : 0;
      const bActive = b.isActive ? 1 : 0;
      if (bActive !== aActive) return bActive - aActive;

      const ao = typeof a.order === "number" ? a.order : 0;
      const bo = typeof b.order === "number" ? b.order : 0;
      if (ao !== bo) return ao - bo;

      return titleForSort(a).localeCompare(titleForSort(b));
    });

    return arr;
  }, [items, language]);

  return (
    <PageWrapper pageContent={pageContent}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "40px 20px",
          color: token.colorTextBase,
        }}
      >
        {loading && (
          <Spin
            size="large"
            tip={tLoading}
            style={{ display: "block", margin: "40px auto" }}
          />
        )}

        {error && (
          <Alert
            message={tError}
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 40 }}
          />
        )}

        {!loading && !error && sorted.length === 0 && (
          <Typography.Paragraph style={{ textAlign: "center", marginTop: 32 }}>
            {tNoData}
          </Typography.Paragraph>
        )}

        {!loading && !error && sorted.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {sorted.map((item) => (
              <div key={item._id} style={{ display: "flex" }}>
                <div style={{ width: "100%" }}>
                  <RelatedBusinessCard item={item} variant="directory" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default RelatedBusinessesContent;
