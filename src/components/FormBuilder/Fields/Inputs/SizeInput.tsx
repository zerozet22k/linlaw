"use client";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Dropdown, InputNumber } from "antd";
import type { MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { defaultWrapperStyle, defaultInputStyle } from "../../InputStyle";

interface TextSizeInputProps {
  value?: string;
  onChange?: (size: string) => void;
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
}

const unitOptions = ["px", "em", "rem", "%", "vh", "vw"] as const;
type Unit = (typeof unitOptions)[number];

function parseSize(v?: string) {
  const raw = (v ?? "1em").trim();
  const num = Number.parseFloat(raw);
  const unit = raw.replace(/[0-9.\s]/g, "") as Unit;

  return {
    num: Number.isFinite(num) ? num : 1,
    unit: (unitOptions as readonly string[]).includes(unit)
      ? unit
      : ("em" as Unit),
  };
}

const SizeInput: React.FC<TextSizeInputProps> = ({
  value = "1em",
  onChange,
  style = {},
  inputStyle = {},
}) => {
  const parsed = useMemo(() => parseSize(value), [value]);
  const [size, setSize] = useState<number>(parsed.num);
  const [unit, setUnit] = useState<Unit>(parsed.unit);

  // keep local state in sync if parent updates `value`
  useEffect(() => {
    setSize(parsed.num);
    setUnit(parsed.unit);
  }, [parsed.num, parsed.unit]);

  // commit ONLY from user actions (prevents update-depth loops)
  const commit = useCallback(
    (nextSize: number, nextUnit: Unit) => {
      const next = `${nextSize}${nextUnit}`;
      if (next === value) return; // blocks redundant parent updates
      onChange?.(next);
    },
    [onChange, value]
  );

  const menuItems: MenuProps["items"] = unitOptions.map((u) => ({
    key: u,
    label: u,
  }));

  return (
    <div style={{ ...defaultWrapperStyle, ...style }}>
      <InputNumber
        min={0}
        step={0.1}
        value={size}
        onChange={(val) => {
          const nextSize = val ?? 0;
          setSize(nextSize);
          commit(nextSize, unit);
        }}
        controls={false}
        style={{ ...defaultInputStyle, ...inputStyle, width: "100%" }}
        // IMPORTANT: make suffix clickable
        styles={{
          suffix: {
            pointerEvents: "auto",
            paddingInline: 8,
          },
        }}
        suffix={
          <Dropdown
            trigger={["click"]}
            placement="bottomRight"
            getPopupContainer={() => document.body}
            styles={{
              root: {
                zIndex: 3000, // if you're inside a Modal/Drawer, this often matters
              },
            }}
            menu={{
              items: menuItems,
              selectable: true,
              selectedKeys: [unit],
              onClick: ({ key }) => {
                const nextUnit = key as Unit;
                setUnit(nextUnit);
                commit(size, nextUnit);
              },
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                cursor: "pointer",
                userSelect: "none",
                pointerEvents: "auto",
              }}
              onMouseDown={(e) => {
                e.preventDefault();
              }}
            >
              {unit}
              <DownOutlined style={{ fontSize: 10, opacity: 0.65 }} />
            </span>
          </Dropdown>
        }
      />
    </div>
  );
};

export default SizeInput;
