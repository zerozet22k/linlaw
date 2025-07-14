"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Tabs, Button, message, Space, Spin } from "antd";
import { debounce } from "lodash";
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

const SettingsPage: React.FC = () => {
  /* ---------------- state ---------------- */
  const [settings, setSettings] = useState<SettingsInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modified, setModified] = useState<
    Partial<Record<keyof SettingsInterface, any>>
  >({});

  const { setCurrentSupportedLanguages } = useLanguageContext();

  /* ---------------- data fetch ---------------- */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get<SettingsInterface>("/settings");
        setSettings(data);
      } catch (e) {
        console.error(e);
        message.error("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* sync supported-languages to LanguageProvider (after render) */
  useEffect(() => {
    const langs =
      modified[LANGUAGE_SETTINGS_KEYS.SUPPORTED_LANGUAGES] ??
      settings?.[LANGUAGE_SETTINGS_KEYS.SUPPORTED_LANGUAGES];

    if (langs && Array.isArray(langs)) {
      setCurrentSupportedLanguages(langs);
    }
  }, [modified, settings, setCurrentSupportedLanguages]);

  /* ---------------- on-change handler ---------------- */
  const debouncedHandleInputChange = useMemo(
    () =>
      debounce((key: string, value: any) => {
        /* merge into local “modified” map */
        setModified((prev) => ({ ...prev, [key]: value }));

        /* update live preview in UI */
        setSettings((prev) => {
          if (!prev) return null;
          const updated = { ...prev };
          const parts = key.split(".") as (keyof SettingsInterface)[];
          let tgt: any = updated;
          parts.forEach((p, idx) => {
            if (idx === parts.length - 1) {
              tgt[p] = value;
            } else {
              tgt[p] ??= {};
              tgt = tgt[p];
            }
          });
          return updated;
        });
      }, 50),
    []
  );

  /* ---------------- save ---------------- */
  const handleSaveAll = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await apiClient.put("/settings", {
        settings: { ...settings, ...modified },
      });
      setModified({});
      message.success("All changes saved!");
    } catch (e) {
      console.error(e);
      message.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- ui helpers ---------------- */
  const renderTabContent = (keys: (keyof SettingsInterface)[]) =>
    settings ? (
      keys.map((k) => {
        const cfg = SETTINGS_GUIDE[k];
        if (!cfg) return null;
        return (
          <CombinedField
            key={k}
            keyPrefix={k}
            config={cfg}
            values={settings[k] as Record<string, any>}
            onChange={debouncedHandleInputChange}
          />
        );
      })
    ) : (
      <p>No data</p>
    );

  const tabs = Object.entries(settingGroupedKeys).map(([k, keys]) => ({
    key: k,
    label: settingTabLabels[k],
    children: renderTabContent(keys),
  }));

  /* ---------------- render ---------------- */
  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 50, height: "100vh" }}>
        <Spin size="large" />
      </div>
    );

  return (
    <div style={{ padding: 24 }}>
      <Tabs defaultActiveKey="Global" items={tabs} />

      <Space style={{ marginTop: 20 }}>
        <Button
          type="primary"
          onClick={handleSaveAll}
          disabled={!Object.keys(modified).length || saving}
          loading={saving}
        >
          Save All Changes
        </Button>
      </Space>
    </div>
  );
};

export default SettingsPage;
