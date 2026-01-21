"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Empty, Skeleton, Card, theme } from "antd";
import apiClient from "@/utils/api/apiClient";
import { RelatedBusinessAPI } from "@/models/RelatedBusinessModel";
import RelatedBusinessCard from "@/components/RelatedBusinessCard";
import type { SectionProps } from "@/config/CMS/fields/SECTION_SETTINGS";

const { useToken } = theme;

const getEn = (obj: any) => String(obj?.en ?? "").trim();

type Props = {
    limit?: number;
    section?: SectionProps;
};

const RelatedBusinessesSection: React.FC<Props> = ({ limit = 6 }) => {
    const { token } = useToken();

    const [items, setItems] = useState<RelatedBusinessAPI[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        (async () => {
            setLoading(true);
            try {
                const res = await apiClient.get(`/related-businesses?search=&page=1&limit=50&includeInactive=0`);

                const list = Array.isArray(res.data?.businesses)
                    ? res.data.businesses
                    : Array.isArray(res.data)
                        ? res.data
                        : [];

                if (mounted) setItems(list);
            } catch (e) {
                console.error("Failed to fetch related businesses:", e);
                if (mounted) setItems([]);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    const top = useMemo(() => {
        const arr = Array.isArray(items) ? [...items] : [];
        arr
            .filter(Boolean)
            .sort((a, b) => {
                const aActive = a.isActive ? 1 : 0;
                const bActive = b.isActive ? 1 : 0;
                if (bActive !== aActive) return bActive - aActive;

                const ao = typeof a.order === "number" ? a.order : 0;
                const bo = typeof b.order === "number" ? b.order : 0;
                if (ao !== bo) return ao - bo;

                return getEn(a.title).localeCompare(getEn(b.title));
            });

        return arr.slice(0, Math.max(1, limit));
    }, [items, limit]);

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
};

export default RelatedBusinessesSection;
