"use client";
import React, { CSSProperties, useMemo, useState } from "react";
import { Button, theme } from "antd";
import { darken } from "polished";

import {
  JsonDesign,
  JsonFunctionality,
  NestedJsonField,
  ChildNestedJsonField,
  RenderSurface,
  OpenInModalPlacement,
} from "@/config/CMS/settings";
import JsonDesignRenderer from "./JsonDesignRenderer";
import JsonChildDesignRenderer from "./JsonChildDesignRenderer";
import CombinedField from "../CombinedField";
import JSON5 from "json5";
import { mergeJsonByConfig } from "@/config/CMS/settings";

type SlotsShape = {
  body?: string[];
  extra?: string[];
  hidden?: string[];
};

type JsonFieldRendererProps = {
  config: (NestedJsonField | ChildNestedJsonField) & {
    slots?: SlotsShape;
    openInModalPlacement?: OpenInModalPlacement;
  };
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  style?: CSSProperties;
  zIndex?: number;
  surface?: RenderSurface;
};

const JsonFieldRenderer: React.FC<JsonFieldRendererProps> = ({
  config,
  value,
  onChange,
  style = {},
  zIndex = 1000,
  surface = "body",
}) => {
  const { token } = theme.useToken();
  const [activeItemKey, setActiveItemKey] = useState<string | null>(null);

  const modalBehavior = config.modalBehavior || {};
  const design: JsonDesign = config.design || JsonDesign.CARD;
  const functionalities: JsonFunctionality[] = config.jsonFunctionalities || [];
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);

  const fields = config.fields ?? {};
  const slots: SlotsShape | undefined = (config as any).slots;

  const openInModalPlacement = (config as any)
    .openInModalPlacement as OpenInModalPlacement | undefined;

  const { bodyKeys, extraKeys } = useMemo(() => {
    const allKeys = Object.keys(fields);

    const hiddenSet = new Set((slots?.hidden ?? []).filter((k) => k in fields));
    const extra = (slots?.extra ?? []).filter((k) => k in fields && !hiddenSet.has(k));

    const body = (() => {
      if (slots?.body) {
        return slots.body.filter((k) => k in fields && !hiddenSet.has(k));
      }
      const extraSet = new Set(extra);
      return allKeys.filter((k) => !extraSet.has(k) && !hiddenSet.has(k));
    })();

    return { bodyKeys: body, extraKeys: extra };
  }, [fields, slots]);

  const hasBody = bodyKeys.length > 0;

  const parseKeyValueFormat = (text: string): Record<string, any> => {
    const lines = text.split(/\r?\n/);
    const result: Record<string, any> = {};
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const match = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
      if (match) {
        const raw = match[2].trim();
        let val: string | number;
        if (
          (raw.startsWith('"') && raw.endsWith('"')) ||
          (raw.startsWith("'") && raw.endsWith("'"))
        ) {
          val = raw.slice(1, -1);
        } else if (!isNaN(Number(raw))) {
          val = Number(raw);
        } else {
          val = raw;
        }
        result[match[1]] = val;
      }
    }
    return result;
  };

  const handlePasteJson = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      let parsed;
      try {
        parsed = JSON5.parse(clipboardText);
      } catch {
        parsed = parseKeyValueFormat(clipboardText);
      }
      if (typeof parsed === "object" && parsed !== null) {
        const mergedValue = mergeJsonByConfig(value, parsed, config);
        onChange(mergedValue);
      }
    } catch (error) {
      console.error("Failed to paste JSON or JSON5", error);
    }
  };

  const handleFieldChange = (key: string, fieldValue: any) => {
    onChange({ ...value, [key]: fieldValue });
  };

  const renderItem = () => {
    if (!hasBody) return null;

    return (
      <>
        {bodyKeys.map((fieldKey) => {
          const fieldConfig: any = (fields as any)[fieldKey];
          return (
            <JsonChildDesignRenderer
              key={fieldKey}
              label={fieldConfig?.label}
              itemKey={fieldKey}
              config={fieldConfig}
              values={value?.[fieldKey]}
              handleFieldChange={handleFieldChange}
              modalBehavior={modalBehavior}
              childModalState={[activeItemKey, setActiveItemKey]}
              zIndex={zIndex}
            />
          );
        })}
      </>
    );
  };

  const intelligentButton =
    functionalities.includes(JsonFunctionality.INTELLIGENT) ? (
      <Button
        onClick={handlePasteJson}
        style={{
          backgroundColor: token.colorPrimary,
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          padding: "6px 12px",
          boxShadow: `0 2px 6px ${darken(0.1, token.colorBgContainer)}`,
        }}
      >
        Paste JSON
      </Button>
    ) : null;

  const headerFields =
    extraKeys.length > 0 ? (
      <>
        {extraKeys.map((k) => {
          const cfg: any = (fields as any)[k];
          return (
            <CombinedField
              key={k}
              keyPrefix={k}
              config={cfg}
              values={value?.[k]}
              onChange={(_, v) => handleFieldChange(k, v)}
              zIndex={zIndex + 1}
              surface="header"
            />
          );
        })}
      </>
    ) : null;

  const extraNode =
    headerFields || intelligentButton ? (
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        {headerFields}
        {intelligentButton}
      </div>
    ) : undefined;

  return (
    <JsonDesignRenderer
      design={design}
      label={config.label}
      guide={config.guide}
      value={value}
      renderItem={renderItem}
      style={style}
      modalBehavior={modalBehavior}
      modalState={[isJsonModalOpen, setIsJsonModalOpen]}
      zIndex={zIndex}
      extra={extraNode}
      surface={surface}
      hasBody={hasBody}
      openInModalPlacement={openInModalPlacement}
    />
  );
};

export default JsonFieldRenderer;
