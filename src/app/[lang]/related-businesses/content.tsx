"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Typography, Spin, Alert, theme } from "antd";

import apiClient from "@/utils/api/apiClient";
import PageWrapper from "@/components/ui/PageWrapper";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/i18n";

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

  const tLoading = useMemo(() => t(language, "common.loading"), [language]);
  const tError = useMemo(() => t(language, "common.error"), [language]);
  const tNoData = useMemo(() => t(language, "common.noData"), [language]);
  const tFailedToLoad = useMemo(() => t(language, "relatedBusinesses.failedToLoad"), [language]);

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
          `/related-businesses?search=&page=1&limit=${limit}&includeInactive=${includeInactive ? 1 : 0}`
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
          setError(tFailedToLoad);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAll();
    return () => {
      mounted = false;
    };
  }, [limit, includeInactive, tFailedToLoad]);

  const sorted = useMemo(() => {
    const arr = Array.isArray(items) ? [...items] : [];

    const titleForSort = (it: any) => {
      const localized = t(language, it?.title);
      if (localized) return localized.trim().toLowerCase();
      const en = t("en", it?.title);
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
          <div style={{ display: "flex", justifyContent: "center", margin: "40px auto" }}>
            <Spin size="large" tip={tLoading} fullscreen={false}>
              <div style={{ width: 100, height: 48 }} />
            </Spin>
          </div>
        )}

        {error && (
          <Alert title={tError} description={error} type="error" showIcon style={{ marginBottom: 40 }} />
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
