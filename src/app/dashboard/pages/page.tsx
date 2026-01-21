"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Tabs, Button, message, Space, Spin } from "antd";
import apiClient from "@/utils/api/apiClient";
import CombinedField from "@/components/FormBuilder/CombinedField";
import { useLanguageContext } from "@/contexts/LanguageContext";
import {
  PAGE_SETTINGS_GUIDE,
  pageGroupedKeys,
  PagesInterface,
  pageTabLabels,
} from "@/config/CMS/pages/pageKeys";

function updateByPath<T extends object>(obj: T, path: string, value: any): T {
  const keys = path.split(".");
  const root: any = { ...(obj as any) };
  let cur: any = root;

  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];

    if (i === keys.length - 1) {
      cur[k] = value;
      break;
    }

    const next = cur[k];
    cur[k] = next && typeof next === "object" ? { ...next } : {};
    cur = cur[k];
  }

  return root;
}

const PagesContent: React.FC = () => {
  const [pages, setPages] = useState<PagesInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("HomePage");

  const { setCurrentSupportedLanguages, supportedLanguages } =
    useLanguageContext();

  const fetchPages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<PagesInterface>("/pages");
      setPages(response.data);
      setCurrentSupportedLanguages(supportedLanguages);
      setDirty(false);
    } catch (error) {
      console.error("Failed to fetch pages:", error);
      message.error("Failed to load pages.");
    } finally {
      setLoading(false);
    }
  }, [setCurrentSupportedLanguages, supportedLanguages]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const handleInputChange = useCallback((path: string, value: any) => {
    setDirty(true);
    setPages((prev) => (prev ? updateByPath(prev, path, value) : prev));
  }, []);

  const renderTabContent = useCallback(
    (keys: (keyof PagesInterface)[]) => {
      if (!pages) return <p>No data available for these pages.</p>;

      return keys.map((key) => {
        const value = pages[key];
        const config = PAGE_SETTINGS_GUIDE[key];
        if (!config) return null;

        return (
          <CombinedField
            key={String(key)}
            keyPrefix={String(key)}
            config={config}
            values={value as Record<string, any>}
            onChange={handleInputChange}
          />
        );
      });
    },
    [pages, handleInputChange]
  );

  const tabsItems = useMemo(() => {
    return Object.entries(pageGroupedKeys).map(([tabKey, keys]) => ({
      key: tabKey,
      label: pageTabLabels[tabKey],
      children: tabKey === activeTab ? renderTabContent(keys) : null,
    }));
  }, [activeTab, renderTabContent]);

  const handleSaveAll = useCallback(async () => {
    if (!pages) return;

    setSaving(true);
    try {
      await apiClient.put("/pages", { pages });
      setDirty(false);
      message.success("All changes saved successfully!");
    } catch (error) {
      console.error("Failed to save page content:", error);
      message.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }, [pages]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 50, height: "100vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabsItems}
        destroyInactiveTabPane
        animated={false}
      />

      <Space style={{ marginTop: 20 }}>
        <Button
          type="primary"
          onClick={handleSaveAll}
          disabled={!dirty || saving}
          loading={saving}
        >
          Save All Changes
        </Button>
      </Space>
    </div>
  );
};

export default PagesContent;
