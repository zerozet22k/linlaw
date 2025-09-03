"use client";

import React, { CSSProperties } from "react";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import { defaultWrapperStyle } from "../../InputStyle";

dayjs.extend(customParseFormat);
dayjs.extend(utc);

export interface DateTimeInputProps {
    value?: string | null;
    onChange?: (v?: string) => void;
    style?: CSSProperties;
    disabled?: boolean;
    placeholder?: string;
}

const parseIso = (v?: string | null): Dayjs | undefined => {
    if (!v || v === "Invalid Date") return undefined;
    const d = dayjs(v);
    return d.isValid() ? d : undefined;
};

const DateTimeInput: React.FC<DateTimeInputProps> = ({
    value,
    onChange,
    style = {},
    disabled = false,
    placeholder = "Select date & time",
}) => {
    const parsed = parseIso(value);

    return (
        <div style={{ ...defaultWrapperStyle, ...style }}>
            <DatePicker
                showTime
                value={parsed}
                onChange={(d) => onChange?.(d ? d.toDate().toISOString() : undefined)}
                allowClear
                disabled={disabled}
                placeholder={placeholder}
                inputReadOnly
                style={{ width: "100%" }}
            />
        </div>
    );
};

export default DateTimeInput;
