"use client";

import React, { useMemo } from "react";
import { Empty, Skeleton, Card, theme } from "antd";
import type { RelatedBusinessAPI } from "@/models/RelatedBusinessModel";
import RelatedBusinessCard from "@/components/RelatedBusinessCard";
import type { SectionProps } from "@/config/CMS/fields/SECTION_SETTINGS";

const { useToken } = theme;

type Props = {
    limit?: number;
    section?: SectionProps;
    items?: RelatedBusinessAPI[];
    loading?: boolean;
};

export default function RelatedBusinessesSection({
    limit = 6,
    items = [],
    loading = false,
}: Props) {
    const { token } = useToken();

    // Server already sorted/limited; but keep a safety slice.
    const top = useMemo(
        () => (Array.isArray(items) ? items.slice(0, Math.max(1, limit)) : []),
        [items, limit]
    );

    const gridStyle: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: token.sizeLG,
        width: "100%",
    };

    if (loading) {
        return (
            <div style={gridStyle}>
                {Array.from({ length: Math.min(6, limit) }).map((_, i) => (
                    <Card
                        key={i}
                        variant="outlined"
                        style={{
                            borderRadius: 16,
                            borderColor: token.colorBorderSecondary,
                            background: token.colorBgContainer,
                        }}
                        styles={{ body: { padding: token.paddingLG } }}
                    >
                        <Skeleton active title paragraph={{ rows: 3 }} />
                    </Card>
                ))}
            </div>
        );
    }

    if (top.length === 0) {
        return <Empty description="No partners found." style={{ width: "100%" }} />;
    }

    return (
        <div style={gridStyle}>
            {top.map((item) => (
                <RelatedBusinessCard key={item._id} item={item} variant="widget" />
            ))}
        </div>
    );
}
