// components/FormBuilder/Fields/Inputs/BoxSidesInput.tsx
"use client";

import React, { CSSProperties } from "react";
import { Button, Divider, InputNumber, Select, Space, Tooltip, Typography, theme } from "antd";
import { ColumnWidthOutlined, ColumnHeightOutlined, ClearOutlined } from "@ant-design/icons";
import type { BoxSides } from "@/config/CMS/settings";

type Unit = "px" | "em" | "rem" | "%" | "vh" | "vw" | "ch";
const UNITS: Unit[] = ["px", "em", "rem", "%", "vh", "vw", "ch"];

const parseSize = (raw?: string): { n: number | undefined; u: Unit } => {
    if (!raw) return { n: undefined, u: "px" };
    const m = String(raw).trim().match(/^(-?\d+(?:\.\d+)?)\s*([a-z%]+)?$/i);
    if (!m) return { n: undefined, u: "px" };
    const n = Number(m[1]); const u = ((m[2]?.toLowerCase() as Unit) || "px");
    return { n: Number.isFinite(n) ? n : undefined, u: (UNITS.includes(u) ? u : "px") as Unit };
};
const fmt = (n?: number, u: Unit = "px") => (n === undefined ? undefined : `${n}${u}`);

const SizeCell: React.FC<{
    label: string; value?: string; onChange: (v?: string) => void; style?: CSSProperties;
}> = ({ label, value, onChange, style }) => {
    const p = parseSize(value);
    const [num, setNum] = React.useState<number | undefined>(p.n);
    const [unit, setUnit] = React.useState<Unit>(p.u);

    React.useEffect(() => { const q = parseSize(value); setNum(q.n); setUnit(q.u); }, [value]);

    return (
        <div style={{ display: "grid", gap: 6, minWidth: 170, ...style }}>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>{label}</Typography.Text>
            <div style={{ display: "flex", gap: 8 }}>
                <InputNumber
                    value={num}
                    onChange={(v) => { setNum(v ?? undefined); onChange(fmt(v ?? undefined, unit)); }}
                    style={{ width: 110 }}
                    placeholder="e.g. 16"
                />
                <Select
                    value={unit}
                    options={UNITS.map(u => ({ label: u, value: u }))}
                    style={{ width: 80 }}
                    onChange={(u: Unit) => { setUnit(u); onChange(fmt(num, u)); }}
                />
            </div>
        </div>
    );
};

export interface BoxSidesInputProps {
    value?: BoxSides;
    onChange?: (v: BoxSides) => void;
    label?: string;
    style?: CSSProperties;
}

const BoxSidesInput: React.FC<BoxSidesInputProps> = ({ value, onChange, label = "Sides", style }) => {
    const v = value ?? {};
    const { token } = theme.useToken();
    const [linkX, setLinkX] = React.useState<boolean>( true);
    const [linkY, setLinkY] = React.useState<boolean>( true);

    // keep flags in sync if value was loaded from DB
    React.useEffect(() => { setLinkX(!!v._linkX); setLinkY(!!v._linkY); }, [v._linkX, v._linkY]);

    const emit = (patch: Partial<BoxSides>) => onChange?.({ ...v, ...patch });

    const setTop = (val?: string) => {
        if (linkY) emit({ top: val, bottom: val, _linkY: true });
        else emit({ top: val });
    };
    const setBottom = (val?: string) => {
        if (linkY) emit({ bottom: val, top: val, _linkY: true });
        else emit({ bottom: val });
    };
    const setRight = (val?: string) => {
        if (linkX) emit({ right: val, left: val, _linkX: true });
        else emit({ right: val });
    };
    const setLeft = (val?: string) => {
        if (linkX) emit({ left: val, right: val, _linkX: true });
        else emit({ left: val });
    };

    const toggleX = () => {
        const next = !linkX;
        setLinkX(next);
        emit({ _linkX: next, ...(next && v.right ? { left: v.right } : {}) });
    };
    const toggleY = () => {
        const next = !linkY;
        setLinkY(next);
        emit({ _linkY: next, ...(next && v.top ? { bottom: v.top } : {}) });
    };

    const clear = () => emit({ top: undefined, right: undefined, bottom: undefined, left: undefined });

    return (
        <div style={{ border: `1px dashed ${token.colorBorder}`, borderRadius: 8, padding: 12, background: token.colorBgContainer, ...style }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography.Text strong>{label}</Typography.Text>
                <Space>
                    <Tooltip title="Link Left/Right (X)">
                        <Button type={linkX ? "primary" : "default"} icon={<ColumnWidthOutlined />} onClick={toggleX} />
                    </Tooltip>
                    <Tooltip title="Link Top/Bottom (Y)">
                        <Button type={linkY ? "primary" : "default"} icon={<ColumnHeightOutlined />} onClick={toggleY} />
                    </Tooltip>
                    <Tooltip title="Clear">
                        <Button icon={<ClearOutlined />} onClick={clear} />
                    </Tooltip>
                </Space>
            </div>

            <Divider style={{ margin: "12px 0" }} />

            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                <SizeCell label="Top" value={v.top} onChange={setTop} />
                <SizeCell label="Right" value={v.right} onChange={setRight} />
                <SizeCell label="Bottom" value={v.bottom} onChange={setBottom} />
                <SizeCell label="Left" value={v.left} onChange={setLeft} />
            </div>
        </div>
    );
};

export default BoxSidesInput;
