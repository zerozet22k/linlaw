"use client";
import React, { useState, useEffect } from "react";
import { InputNumber, Select, Space } from "antd";
import {
  defaultWrapperStyle,
  defaultInputStyle,
  defaultSelectStyle,
} from "../../InputStyle";

interface TextSizeInputProps {
  value?: string;
  onChange?: (size: string) => void;
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
}

const unitOptions = ["px", "em", "rem", "%", "vh", "vw"];

const SizeInput: React.FC<TextSizeInputProps> = ({
  value = "1em",
  onChange,
  style = {},
  inputStyle = {},
}) => {
  const [size, setSize] = useState<number>(parseFloat(value) || 1);
  const [unit, setUnit] = useState<string>(
    unitOptions.includes(value.replace(/[0-9.]/g, ""))
      ? value.replace(/[0-9.]/g, "")
      : "em"
  );

  const commonHeight = 32; // Assuming a default commonHeight

  useEffect(() => {
    onChange?.(`${size}${unit}`);
  }, [size, unit]);

  return (
    <div style={{ ...defaultWrapperStyle, ...style }}>
      <Space.Compact>
        <InputNumber
          min={0}
          step={0.1}
          value={size}
          onChange={(val) => setSize(val ?? 0)}
          style={{
            ...defaultInputStyle,
            ...inputStyle,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            width: "100%",
          }}
          controls={false}
        />
        <Select
          value={unit}
          onChange={(val) => setUnit(val)}
          style={{
            ...defaultSelectStyle,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderLeft: "none",
          }}
        >
          {unitOptions.map((unit) => (
            <Select.Option key={unit} value={unit}>
              {unit}
            </Select.Option>
          ))}
        </Select>
      </Space.Compact>
    </div>
  );
};

export default SizeInput;
