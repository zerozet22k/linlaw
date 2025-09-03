"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, Row, Col, Typography, Tag, Divider, theme, Empty, Button } from "antd";
import {
    ApartmentOutlined,
    EnvironmentOutlined,
    IdcardOutlined,
    DollarOutlined,
    CalendarOutlined,
    CloseOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import PageWrapper from "@/components/ui/PageWrapper";
import {
    CAREER_PAGE_SETTINGS_KEYS as K,
    CAREER_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/CAREER_PAGE_SETTINGS";
import { useLanguage } from "@/hooks/useLanguage";
import { getTranslatedText } from "@/utils/getTranslatedText";
import { commonTranslations } from "@/translations";

const { Title, Paragraph } = Typography;

type Props = { data: CAREER_PAGE_SETTINGS_TYPES };


const text = (v: any, lang: string) => getTranslatedText(v, lang) || "";

const formatYmd = (s?: string) => {
    if (!s) return "";
    const [y, m, d] = s.split("-").map(Number);
    if (!y || !m || !d) return s;
    const dt = new Date(Date.UTC(y, m - 1, d));
    return new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "numeric" }).format(dt);
};

const useBodyLock = (locked: boolean) => {
    useEffect(() => {
        const original = document.body.style.overflow;
        if (locked) document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = original; };
    }, [locked]);
};

const variants = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };

const dedup = (arr: string[]) => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const s of arr) {
        const k = s.trim().toLowerCase();
        if (k && !seen.has(k)) { seen.add(k); out.push(s); }
    }
    return out;
};


const EMP_TYPE_LABEL: Record<string, string> = {
    fullTime: "Full-time",
    partTime: "Part-time",
    contract: "Contract",
    internship: "Internship",
    temporary: "Temporary",
    freelance: "Freelance",
    remote: "Remote",
    hybrid: "Hybrid",
    onsite: "On-site",
};
const labelOfType = (t?: string) => (t ? EMP_TYPE_LABEL[t] : undefined);


const CURRENCY_SYMBOL: Record<string, string> = {
    USD: "$", EUR: "€", GBP: "£", JPY: "¥", CNY: "¥", THB: "฿",
    SGD: "S$", MYR: "RM", IDR: "Rp", VND: "₫", AUD: "A$", CAD: "C$",
    MMK: "MMK",
};
const nf0 = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });

const toNum = (x: unknown): number | undefined => {
    if (typeof x === "number") return Number.isFinite(x) ? x : undefined;
    if (typeof x === "string") {
        const n = Number(x.replace(/[,\s]/g, ""));
        return Number.isFinite(n) ? n : undefined;
    }
    return undefined;
};


const currencySuffix = (raw?: string): string => {
    if (!raw) return "";
    const up = String(raw).trim().toUpperCase();
    return /^[A-Z]{3}$/.test(up) ? ` ${up}` : "";
};

const salaryText = (
    j: CAREER_PAGE_SETTINGS_TYPES[typeof K.JOBS_SECTION]["items"][number]
) => {
    const s = j.salary;
    if (!s) return "";

    const code = currencySuffix((s as any).currency);
    const unit = s.period ? ` per ${s.period}` : "";

    const min = toNum((s as any).min);
    const max = toNum((s as any).max);

    if (min != null && max != null) {
        if (min === max) return `${nf0.format(min)}${code}${unit}`;

        return `${nf0.format(min)}–${nf0.format(max)}${code}${unit}`;
    }
    if (min != null) return `from ${nf0.format(min)}${code}${unit}`;
    if (max != null) return `up to ${nf0.format(max)}${code}${unit}`;
    return "";
};


const metaChips = (
    j: CAREER_PAGE_SETTINGS_TYPES[typeof K.JOBS_SECTION]["items"][number]
) => {
    const chips: Array<{ key: string; label: React.ReactNode }> = [];

    if (j.department) chips.push({ key: "dept", label: <Tag icon={<ApartmentOutlined />}>{j.department}</Tag> });
    if (j.location) chips.push({ key: "loc", label: <Tag icon={<EnvironmentOutlined />}>{j.location}</Tag> });

    const et = labelOfType(j.employmentType as any);
    if (et) chips.push({ key: "type", label: <Tag icon={<IdcardOutlined />}>{et}</Tag> });

    const sal = salaryText(j);
    if (sal) chips.push({ key: "sal", label: <Tag icon={<DollarOutlined />}>{sal}</Tag> });

    if (j.postedAt) chips.push({ key: "posted", label: <Tag icon={<CalendarOutlined />}>Posted {formatYmd(j.postedAt)}</Tag> });
    if (j.closingDate) chips.push({ key: "closes", label: <Tag icon={<CalendarOutlined />}>Closes {formatYmd(j.closingDate)}</Tag> });

    const hideSet = new Set([j.department, j.location, et].filter(Boolean).map(s => String(s).trim().toLowerCase()));
    const extra = dedup((j.tags ?? []).map(t => t.value)).filter(v => !hideSet.has(v.trim().toLowerCase()));
    for (const v of extra) chips.push({ key: `tag-${v}`, label: <Tag>{v}</Tag> });

    return chips;
};

const CareersContent: React.FC<Props> = ({ data }) => {
    const pageContent = data[K.PAGE_CONTENT];
    const jobsSection = data[K.JOBS_SECTION];
    const design = data[K.DESIGN];

    const items = Array.isArray(jobsSection?.items) ? jobsSection.items : [];

    const { token } = theme.useToken();
    const cardRadius = (design as any)?.borderRadius ?? 16;
    const gridGutter = parseInt((design as any)?.gridGutter ?? "24", 10);

    const { language } = useLanguage();
    const tNoData = getTranslatedText(commonTranslations.noData, language) || "No Data";


    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [active, setActive] = useState<typeof items[number] | null>(null);
    useEffect(() => setMounted(true), []);
    useBodyLock(open);

    const handleOpen = (j: typeof items[number]) => { setActive(j); setOpen(true); };
    const handleClose = () => setOpen(false);
    useEffect(() => {
        const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
        if (open) window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, [open]);

    const overlay = useMemo(() => {
        if (!open || !mounted || !active) return null;
        const chips = metaChips(active);

        return createPortal(
            <div
                role="dialog"
                aria-modal="true"
                style={{
                    position: "fixed",
                    inset: 0,
                    width: "100vw",
                    height: "100vh",
                    zIndex: 1300,
                    background: token.colorBgBase,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Button
                    shape="circle"
                    icon={<CloseOutlined />}
                    onClick={handleClose}
                    style={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}
                    aria-label="Close"
                />

                <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch" }}>
                    <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 16px 56px", boxSizing: "border-box" }}>
                        <Title level={2} style={{ marginTop: 8 }}>
                            {text(active.title, language) || "Position"}
                        </Title>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                            {chips.map((c) => <span key={c.key}>{c.label}</span>)}
                        </div>

                        {active.summary && (
                            <Paragraph style={{ fontSize: 16 }}>
                                {text(active.summary, language)}
                            </Paragraph>
                        )}

                        {active.description && (
                            <>
                                <Divider />
                                <Paragraph style={{ whiteSpace: "pre-line" }}>
                                    {text(active.description, language)}
                                </Paragraph>
                            </>
                        )}

                        {!!active.responsibilities?.length && (
                            <>
                                <Divider />
                                <Title level={4}>Responsibilities</Title>
                                <ul style={{ paddingLeft: 18, marginTop: 6 }}>
                                    {active.responsibilities.map((r, i) => (
                                        <li key={i}>
                                            <Paragraph style={{ marginBottom: 6 }}>{text(r.text, language)}</Paragraph>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}

                        {!!active.requirements?.length && (
                            <>
                                <Divider />
                                <Title level={4}>Requirements</Title>
                                <ul style={{ paddingLeft: 18, marginTop: 6 }}>
                                    {active.requirements.map((r, i) => (
                                        <li key={i}>
                                            <Paragraph style={{ marginBottom: 6 }}>{text(r.text, language)}</Paragraph>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}

                        {!!active.benefits?.length && (
                            <>
                                <Divider />
                                <Title level={4}>Benefits</Title>
                                <ul style={{ paddingLeft: 18, marginTop: 6 }}>
                                    {active.benefits.map((b, i) => (
                                        <li key={i}>
                                            <Paragraph style={{ marginBottom: 6 }}>{text(b.text, language)}</Paragraph>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                </div>
            </div>,
            document.body
        );
    }, [open, mounted, active, language, token.colorBgBase]);

    return (
        <PageWrapper pageContent={pageContent}>
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
                {items.length === 0 ? (
                    <Card style={{ borderRadius: 12 }}>
                        <Empty description={tNoData} />
                    </Card>
                ) : (
                    <Row gutter={[gridGutter, gridGutter]}>
                        {items.map((j, idx) => {
                            const chips = metaChips(j);

                            return (
                                <Col xs={24} sm={12} md={8} key={idx}>
                                    <motion.div
                                        initial={variants.initial}
                                        animate={variants.animate}
                                        transition={{ duration: 0.3 + idx * 0.05 }}
                                    >
                                        <Card
                                            hoverable
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => handleOpen(j)}
                                            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleOpen(j); }}
                                            style={{
                                                borderRadius: cardRadius,
                                                height: "100%",
                                                display: "flex",
                                                flexDirection: "column",
                                                cursor: "pointer",
                                            }}
                                            styles={{ body: { display: "flex", flexDirection: "column", gap: 8, flex: 1 } }}
                                        >
                                            <Title level={4} style={{ marginBottom: 0 }}>
                                                {text(j.title, language) || "Untitled Position"}
                                            </Title>

                                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                                {chips.map((c) => <span key={c.key}>{c.label}</span>)}
                                            </div>

                                            {j.summary && (
                                                <Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
                                                    {text(j.summary, language)}
                                                </Paragraph>
                                            )}
                                        </Card>
                                    </motion.div>
                                </Col>
                            );
                        })}
                    </Row>
                )}
            </div>

            {overlay}
        </PageWrapper>
    );
};

export default CareersContent;
