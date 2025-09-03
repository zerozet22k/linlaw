"use client";

import React, { CSSProperties } from "react";
import { TimePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { defaultWrapperStyle } from "../../InputStyle";

dayjs.extend(customParseFormat);

export interface TimeInputProps {
    value?: string | null;
    onChange?: (v?: string) => void;
    style?: CSSProperties;
    disabled?: boolean;
    placeholder?: string;
}

const parseTime = (v?: string | null): Dayjs | undefined => {
    if (!v || v === "Invalid Date") return undefined;
    let d = dayjs(String(v), "HH:mm:ss", true);
    if (!d.isValid()) d = dayjs(String(v), "HH:mm", true);
    return d.isValid() ? d : undefined;
};

const TimeInput: React.FC<TimeInputProps> = ({
    value,
    onChange,
    style = {},
    disabled = false,
    placeholder = "HH:mm",
}) => {
    const parsed = parseTime(value);

    return (
        <div style={{ ...defaultWrapperStyle, ...style }}>
            <TimePicker
                value={parsed}
                onChange={(d) => onChange?.(d ? d.format("HH:mm:ss") : undefined)}
                allowClear
                disabled={disabled}
                placeholder={placeholder}
                inputReadOnly
                style={{ width: "100%" }}
                format="HH:mm"
            />
        </div>
    );
};

export default TimeInput;
