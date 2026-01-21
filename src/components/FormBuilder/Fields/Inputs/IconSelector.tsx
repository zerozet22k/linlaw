"use client";
import React, { CSSProperties } from "react";
import { Select } from "antd";
import { DynamicIcon, IconKeys } from "@/config/navigations/IconMapper";
import { defaultWrapperStyle, defaultSelectStyle } from "../../InputStyle";

interface IconSelectorProps {
  value?: string;
  onChange?: (iconName?: string) => void; // allow empty -> undefined
  style?: CSSProperties;
  inputStyle?: CSSProperties;
  allowEmpty?: boolean;
  emptyLabel?: string;
}

const IconSelector: React.FC<IconSelectorProps> = ({
  value,
  onChange,
  style = {},
  inputStyle = {},
  allowEmpty = true,
  emptyLabel = "None",
}) => {
  return (
    <div style={{ ...defaultWrapperStyle, ...style }}>
      <Select
        allowClear
        placeholder="Select an icon"
        value={value}
        onChange={(v) => onChange?.(v || undefined)}
        optionLabelProp="label"
        style={{ ...defaultSelectStyle, ...inputStyle }}
        showSearch={{
          filterOption: (input, option) =>
            String(option?.value ?? "")
              .toLowerCase()
              .includes(input.toLowerCase()),
        }}
      >
        {allowEmpty && (
          <Select.Option key="__empty__" value="" label={emptyLabel}>
            {emptyLabel}
          </Select.Option>
        )}

        {IconKeys.map((icon) => (
          <Select.Option
            key={icon}
            value={icon}
            label={
              <span style={{ display: "flex", alignItems: "center" }}>
                <DynamicIcon name={icon} />
                <span style={{ marginLeft: 8 }}>{icon}</span>
              </span>
            }
          >
            <div style={{ display: "flex", alignItems: "center", padding: "4px 8px" }}>
              <DynamicIcon name={icon} />
              <span style={{ marginLeft: 8 }}>{icon}</span>
            </div>
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default IconSelector;
