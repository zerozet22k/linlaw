"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Tabs, Button, message, Space, Spin } from "antd";
import apiClient from "@/utils/api/apiClient";
import CombinedField from "@/components/FormBuilder/CombinedField";
import {
  settingGroupedKeys,
  SETTINGS_GUIDE,
  SettingsInterface,
  settingTabLabels,
} from "@/config/CMS/settings/settingKeys";
import { LANGUAGE_SETTINGS_KEYS } from "@/config/CMS/settings/keys/LANGUAGE_SETTINGS_KEYS";
import { useLanguageContext } from "@/contexts/LanguageContext";

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

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SettingsInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const firstTabKey = useMemo(
    () => Object.keys(settingGroupedKeys)[0] || "Global",
    []
  );
  const [activeTab, setActiveTab] = useState<string>(firstTabKey);

  const { setCurrentSupportedLanguages } = useLanguageContext();

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get<SettingsInterface>("/settings");
      setSettings(data);
      setDirty(false);

      const langs = (data as any)?.[LANGUAGE_SETTINGS_KEYS.SUPPORTED_LANGUAGES];
      if (Array.isArray(langs)) setCurrentSupportedLanguages(langs);
    } catch (e) {
      console.error(e);
      message.error("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  }, [setCurrentSupportedLanguages]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Keep LanguageProvider in sync whenever supported languages change
  useEffect(() => {
    const langs = (settings as any)?.[LANGUAGE_SETTINGS_KEYS.SUPPORTED_LANGUAGES];
    if (Array.isArray(langs)) setCurrentSupportedLanguages(langs);
  }, [settings, setCurrentSupportedLanguages]);

  const handleInputChange = useCallback((path: string, value: any) => {
    setDirty(true);
    setSettings((prev) => (prev ? updateByPath(prev, path, value) : prev));
  }, []);

  const renderTabContent = useCallback(
    (keys: (keyof SettingsInterface)[]) => {
      if (!settings) return <p>No data</p>;

      return keys.map((key) => {
        const cfg = SETTINGS_GUIDE[key];
        if (!cfg) return null;

        const value = settings[key];

        return (
          <CombinedField
            key={String(key)}
            keyPrefix={String(key)}
            config={cfg}
            values={value as Record<string, any>}
            onChange={handleInputChange}
          />
        );
      });
    },
    [settings, handleInputChange]
  );

  const tabsItems = useMemo(() => {
    return Object.entries(settingGroupedKeys).map(([tabKey, keys]) => ({
      key: tabKey,
      label: settingTabLabels[tabKey],
      children: tabKey === activeTab ? renderTabContent(keys) : null,
    }));
  }, [activeTab, renderTabContent]);

  const handleSaveAll = useCallback(async () => {
    if (!settings) return;

    setSaving(true);
    try {
      await apiClient.put("/settings", { settings });
      setDirty(false);
      message.success("All changes saved!");
    } catch (e) {
      console.error(e);
      message.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }, [settings]);

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

export default SettingsPage;
