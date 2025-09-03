"use client";

import React, { CSSProperties } from "react";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { defaultWrapperStyle } from "../../InputStyle";

dayjs.extend(customParseFormat);

export interface DateInputProps {
  value?: string | null;               // expects "YYYY-MM-DD"
  onChange?: (v?: string) => void;     // emits "YYYY-MM-DD" or undefined
  style?: CSSProperties;
  disabled?: boolean;
  placeholder?: string;
}

const strictParse = (v?: string | null, fmt = "YYYY-MM-DD"): Dayjs | undefined => {
  if (!v || v === "Invalid Date") return undefined;
  const d = dayjs(String(v), fmt, true);
  return d.isValid() ? d : undefined;
};

const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  style = {},
  disabled = false,
  placeholder = "YYYY-MM-DD",
}) => {
  const parsed = strictParse(value);

  return (
    <div style={{ ...defaultWrapperStyle, ...style }}>
      <DatePicker
        value={parsed}
        onChange={(d) => onChange?.(d ? d.format("YYYY-MM-DD") : undefined)}
        allowClear
        disabled={disabled}
        placeholder={placeholder}
        inputReadOnly
        style={{ width: "100%" }}
      />
    </div>
  );
};

export default DateInput;
