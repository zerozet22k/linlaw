"use client";

import React, { CSSProperties, useMemo } from "react";
import { Space, Switch, Typography } from "antd";
import { defaultWrapperStyle } from "../../InputStyle";

const { Text } = Typography;

export type SwitchInputProps = {
    value?: boolean;
    onChange?: (value: boolean) => void;

    style?: CSSProperties;        // wrapper
    inputStyle?: CSSProperties;   // switch itself
    labelStyle?: CSSProperties;   // Enabled/Disabled text

    size?: "small" | "default";
    showLabel?: boolean;
    labels?: {
        on?: React.ReactNode;
        off?: React.ReactNode;
    };

    disabled?: boolean;
};

const SwitchInput: React.FC<SwitchInputProps> = ({
    value,
    onChange,

    style = {},
    inputStyle = {},
    labelStyle = {},

    size = "default",
    showLabel = true,
    labels,

    disabled = false,
}) => {
    const checked = !!value;

    const text = useMemo(() => {
        if (!showLabel) return null;
        const onText = labels?.on ?? "Enabled";
        const offText = labels?.off ?? "Disabled";
        return checked ? onText : offText;
    }, [checked, labels, showLabel]);

    return (
        <div style={{ ...defaultWrapperStyle, ...style }}>
            <Space align="center" size={10}>
                <Switch
                    size={size}
                    checked={checked}
                    disabled={disabled}
                    onChange={(v) => onChange?.(v)}
                    style={inputStyle}
                />

                {showLabel && (
                    <Text style={{ opacity: 0.85, ...labelStyle }}>{text}</Text>
                )}
            </Space>
        </div>
    );
};

export default SwitchInput;
