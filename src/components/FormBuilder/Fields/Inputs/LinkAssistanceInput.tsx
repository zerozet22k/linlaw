"use client";

import React, { CSSProperties, useEffect, useMemo, useState } from "react";
import { AutoComplete, Input, Segmented, Typography } from "antd";
import {
  GlobalOutlined,
  LinkOutlined,
  MailOutlined,
  PhoneOutlined,
  ApiOutlined,
} from "@ant-design/icons";
import { ROUTES } from "@/config/navigations/routes";
import {
  defaultInputStyle,
  defaultWrapperStyle,
  flexColumnStyle,
} from "../../InputStyle";

type AssistedLinkMode = "internal" | "website" | "email" | "phone" | "custom";

type LinkAssistanceInputProps = {
  value: string;
  onChange: (value: string) => void;
  style?: CSSProperties;
  mode?: "mixed" | "external";
};

const HTTP_LINK_PATTERN = /^https?:\/\//i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[\d\s().-]{5,}$/;
const PROTOCOL_PATTERN = /^[a-z][a-z0-9+.-]*:/i;

const isWebsiteLink = (href: string) => HTTP_LINK_PATTERN.test(String(href || "").trim());

const isEmailValue = (href: string) => {
  const trimmed = String(href || "").trim();
  return trimmed.startsWith("mailto:") || EMAIL_PATTERN.test(trimmed);
};

const isPhoneValue = (href: string) => {
  const trimmed = String(href || "").trim();
  return trimmed.startsWith("tel:") || PHONE_PATTERN.test(trimmed);
};

const isInternalPath = (href: string) => {
  const trimmed = String(href || "").trim();
  return trimmed.startsWith("/") || trimmed.startsWith("#");
};

const normalizeInternalPath = (href: string) => {
  const trimmed = String(href || "").trim();

  if (!trimmed) return "";
  if (trimmed.startsWith("/#")) return trimmed;
  if (trimmed.startsWith("#")) return `/${trimmed}`;
  if (trimmed.startsWith("/")) return trimmed;

  return `/${trimmed.replace(/^\/+/, "")}`;
};

const normalizeWebsiteValue = (href: string) => {
  const trimmed = String(href || "").trim();
  if (!trimmed) return "";
  if (PROTOCOL_PATTERN.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

const toEmailTarget = (href: string) => String(href || "").trim().replace(/^mailto:/i, "");

const normalizeEmailValue = (href: string) => {
  const trimmed = toEmailTarget(href);
  return trimmed ? `mailto:${trimmed}` : "";
};

const toPhoneTarget = (href: string) =>
  String(href || "")
    .trim()
    .replace(/^tel:/i, "")
    .replace(/(?!^\+)[^\d]/g, "")
    .replace(/(?!^)\+/g, "");

const normalizePhoneValue = (href: string) => {
  const trimmed = toPhoneTarget(href);
  return trimmed ? `tel:${trimmed}` : "";
};

const getAllowedModes = (mode: LinkAssistanceInputProps["mode"]) =>
  mode === "external"
    ? (["website", "email", "phone", "custom"] as const)
    : (["internal", "website", "email", "phone", "custom"] as const);

const getDefaultMode = (mode: LinkAssistanceInputProps["mode"]): AssistedLinkMode =>
  mode === "external" ? "website" : "internal";

const getModeFromValue = (
  href: string,
  allowedModes: readonly AssistedLinkMode[]
): AssistedLinkMode => {
  const trimmed = String(href || "").trim();

  if (!trimmed) return allowedModes[0] ?? "website";
  if (allowedModes.includes("email") && isEmailValue(trimmed)) return "email";
  if (allowedModes.includes("phone") && isPhoneValue(trimmed)) return "phone";
  if (allowedModes.includes("website") && isWebsiteLink(trimmed)) return "website";
  if (allowedModes.includes("internal") && isInternalPath(trimmed)) return "internal";
  if (allowedModes.includes("custom") && PROTOCOL_PATTERN.test(trimmed)) return "custom";

  return getDefaultMode(allowedModes.includes("internal") ? "mixed" : "external");
};

const routeSuggestions = Array.from(
  new Map(
    Object.values(ROUTES)
      .filter((route) => route.path.startsWith("/") && !route.path.includes(":"))
      .sort((left, right) => left.path.localeCompare(right.path))
      .map((route) => [
        route.path,
        {
          value: route.path,
          label: `${route.path} (${route.key})`,
        },
      ])
  ).values()
);

const LinkAssistanceInput: React.FC<LinkAssistanceInputProps> = ({
  value,
  onChange,
  style = {},
  mode = "mixed",
}) => {
  const normalizedValue = String(value || "");
  const allowedModes = useMemo(() => getAllowedModes(mode), [mode]);
  const [selectedMode, setSelectedMode] = useState<AssistedLinkMode>(
    getModeFromValue(normalizedValue, allowedModes)
  );

  useEffect(() => {
    setSelectedMode(getModeFromValue(normalizedValue, allowedModes));
  }, [allowedModes, normalizedValue]);

  const internalValue = useMemo(
    () => (selectedMode === "internal" ? normalizeInternalPath(normalizedValue) : ""),
    [normalizedValue, selectedMode]
  );

  const websiteValue = useMemo(
    () => (selectedMode === "website" ? normalizedValue : ""),
    [normalizedValue, selectedMode]
  );

  const emailValue = useMemo(
    () => (selectedMode === "email" ? toEmailTarget(normalizedValue) : ""),
    [normalizedValue, selectedMode]
  );

  const phoneValue = useMemo(
    () => (selectedMode === "phone" ? toPhoneTarget(normalizedValue) : ""),
    [normalizedValue, selectedMode]
  );

  const customValue = useMemo(
    () => (selectedMode === "custom" ? normalizedValue : ""),
    [normalizedValue]
  );

  const handleModeChange = (nextValue: string | number) => {
    const nextMode = nextValue as AssistedLinkMode;
    setSelectedMode(nextMode);

    if (nextMode !== getModeFromValue(normalizedValue, allowedModes)) {
      onChange("");
    }
  };

  const segmentOptions = allowedModes.map((allowedMode) => {
    switch (allowedMode) {
      case "internal":
        return {
          label: (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <LinkOutlined />
              In-app
            </span>
          ),
          value: allowedMode,
        };
      case "website":
        return {
          label: (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <GlobalOutlined />
              Website
            </span>
          ),
          value: allowedMode,
        };
      case "email":
        return {
          label: (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <MailOutlined />
              Email
            </span>
          ),
          value: allowedMode,
        };
      case "phone":
        return {
          label: (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <PhoneOutlined />
              Phone
            </span>
          ),
          value: allowedMode,
        };
      case "custom":
      default:
        return {
          label: (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <ApiOutlined />
              Other
            </span>
          ),
          value: allowedMode,
        };
    }
  });

  return (
    <div
      style={{
        ...defaultWrapperStyle,
        ...flexColumnStyle,
        alignItems: "stretch",
        minHeight: "unset",
        gap: 10,
        ...style,
      }}
    >
      {segmentOptions.length > 1 ? (
        <Segmented
          block
          value={selectedMode}
          onChange={handleModeChange}
          options={segmentOptions}
        />
      ) : null}

      {selectedMode === "internal" ? (
        <>
          <AutoComplete
            value={internalValue}
            options={routeSuggestions}
            onChange={(nextValue) => onChange(normalizeInternalPath(nextValue))}
            onSelect={(nextValue) => onChange(normalizeInternalPath(String(nextValue)))}
            filterOption={(inputValue, option) =>
              String(option?.value || "")
                .toLowerCase()
                .includes(inputValue.toLowerCase()) ||
              String(option?.label || "")
                .toLowerCase()
                .includes(inputValue.toLowerCase())
            }
          >
            <Input
              placeholder="/newsletters or /#about"
              style={defaultInputStyle}
            />
          </AutoComplete>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Choose an existing route or type a custom internal path. Language prefixes are added automatically.
          </Typography.Text>
        </>
      ) : null}

      {selectedMode === "website" ? (
        <>
          <Input
            type="url"
            value={websiteValue}
            onChange={(e) => onChange(normalizeWebsiteValue(e.target.value))}
            placeholder="https://example.com"
            style={defaultInputStyle}
          />
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Enter a website address. If you omit the protocol, it will be saved as https://...
          </Typography.Text>
        </>
      ) : null}

      {selectedMode === "email" ? (
        <>
          <Input
            type="email"
            value={emailValue}
            onChange={(e) => onChange(normalizeEmailValue(e.target.value))}
            placeholder="name@example.com"
            style={defaultInputStyle}
          />
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Enter an email address. It will be saved as mailto:...
          </Typography.Text>
        </>
      ) : null}

      {selectedMode === "phone" ? (
        <>
          <Input
            type="tel"
            value={phoneValue}
            onChange={(e) => onChange(normalizePhoneValue(e.target.value))}
            placeholder="+123456789"
            style={defaultInputStyle}
          />
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Enter a phone number. It will be saved as tel:...
          </Typography.Text>
        </>
      ) : null}

      {selectedMode === "custom" ? (
        <>
          <Input
            value={customValue}
            onChange={(e) => onChange(String(e.target.value || "").trim())}
            placeholder="sms:+123456789 or whatsapp://send?..."
            style={defaultInputStyle}
          />
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Use this only for uncommon protocols or custom link formats.
          </Typography.Text>
        </>
      ) : null}
    </div>
  );
};

export default LinkAssistanceInput;