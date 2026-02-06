"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card, Row, Col, Typography, Tag, Divider, theme, Empty, Button, Modal } from "antd";
import {
  ApartmentOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
  DollarOutlined,
  CalendarOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { motion, useReducedMotion } from "framer-motion";

import PageWrapper from "@/components/ui/PageWrapper";
import { CAREER_PAGE_SETTINGS_KEYS as K, CAREER_PAGE_SETTINGS_TYPES } from "@/config/CMS/pages/keys/CAREER_PAGE_SETTINGS";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/i18n";
import { formatYmd } from "@/utils/timeUtil";
import { dedupStrings, normalizeKey, shortText } from "@/utils/textUtils";
import { formatSalaryText, labelOfEmploymentType } from "@/utils/careerUtil";

const { Title, Paragraph } = Typography;

type Props = { data: CAREER_PAGE_SETTINGS_TYPES };
type JobItem = CAREER_PAGE_SETTINGS_TYPES[typeof K.JOBS_SECTION]["items"][number];

const cardVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

const text = (v: any, lang: string) => t(lang, v, "");

function jobKey(j: JobItem, idx: number): React.Key {
  // If your schema has a stable id/slug, prefer it here.
  return String((j as any).id ?? (j as any).jobId ?? (j as any).slug ?? idx);
}

function metaChips(j: JobItem, lang: string) {
  const chips: Array<{ key: string; label: React.ReactNode }> = [];

  if ((j as any).department) chips.push({ key: "dept", label: <Tag icon={<ApartmentOutlined />}>{(j as any).department}</Tag> });
  if ((j as any).location) chips.push({ key: "loc", label: <Tag icon={<EnvironmentOutlined />}>{(j as any).location}</Tag> });

  const et = labelOfEmploymentType((j as any).employmentType);
  if (et) chips.push({ key: "type", label: <Tag icon={<IdcardOutlined />}>{et}</Tag> });

  const sal = formatSalaryText((j as any).salary, lang);
  if (sal) chips.push({ key: "sal", label: <Tag icon={<DollarOutlined />}>{sal}</Tag> });

  const tPosted = t(lang, "career.posted");
  const tCloses = t(lang, "career.closes");

  if ((j as any).postedAt) {
    chips.push({
      key: "posted",
      label: (
        <Tag icon={<CalendarOutlined />}>
          {tPosted} {formatYmd((j as any).postedAt)}
        </Tag>
      ),
    });
  }

  if ((j as any).closingDate) {
    chips.push({
      key: "closes",
      label: (
        <Tag icon={<CalendarOutlined />}>
          {tCloses} {formatYmd((j as any).closingDate)}
        </Tag>
      ),
    });
  }

  const hideSet = new Set(
    [(j as any).department, (j as any).location, et].filter(Boolean).map((s) => normalizeKey(s))
  );

  const rawTags = (((j as any).tags ?? []) as Array<{ value?: string }>).map((tg) => tg?.value ?? "");
  const extra = dedupStrings(rawTags).filter((v) => !hideSet.has(normalizeKey(v)));

  for (const v of extra) chips.push({ key: `tag-${normalizeKey(v)}`, label: <Tag>{v}</Tag> });

  return chips;
}

const CareersContent: React.FC<Props> = ({ data }) => {
  const pageContent = data[K.PAGE_CONTENT];
  const jobsSection = data[K.JOBS_SECTION];

  const items = useMemo(() => (Array.isArray(jobsSection?.items) ? (jobsSection.items as JobItem[]) : []), [jobsSection]);

  const { token } = theme.useToken();
  const { language } = useLanguage();
  const reduceMotion = useReducedMotion();

  const [active, setActive] = useState<JobItem | null>(null);
  const open = !!active;

  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const openJob = useCallback((j: JobItem) => {
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    setActive(j);
  }, []);

  const closeJob = useCallback(() => {
    setActive(null);
  }, []);

  useEffect(() => {
    if (!open) return;
    // Focus close button for keyboard users
    const id = window.setTimeout(() => closeBtnRef.current?.focus(), 0);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (open) return;
    restoreFocusRef.current?.focus?.();
  }, [open]);

  const tNoData = t(language, "common.noData");
  const tClose = t(language, "common.close");
  const tPositionFallback = t(language, "career.position");
  const tUntitledPosition = t(language, "career.untitledPosition");
  const tResponsibilities = t(language, "career.responsibilities");
  const tRequirements = t(language, "career.requirements");
  const tBenefits = t(language, "career.benefits");

  // Precompute chips once per language/items change (less work during rendering)
  const chipLists = useMemo(() => items.map((j) => metaChips(j, language)), [items, language]);
  const activeChips = useMemo(() => (active ? metaChips(active, language) : []), [active, language]);

  return (
    <PageWrapper pageContent={pageContent}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
        {items.length === 0 ? (
          <Card style={{ borderRadius: 12 }}>
            <Empty description={tNoData} />
          </Card>
        ) : (
          <Row gutter={[24, 24]}>
            {items.map((j, idx) => {
              const chips = chipLists[idx] ?? [];
              const title = text((j as any).title, language) || tUntitledPosition;
              const summary = shortText(text((j as any).summary, language), 180);

              return (
                <Col xs={24} sm={12} md={8} key={jobKey(j, idx)}>
                  <motion.div
                    initial={reduceMotion ? false : "initial"}
                    animate="animate"
                    variants={cardVariants}
                    transition={{ duration: reduceMotion ? 0 : 0.25, delay: reduceMotion ? 0 : idx * 0.04 }}
                  >
                    <Card
                      hoverable
                      role="button"
                      tabIndex={0}
                      onClick={() => openJob(j)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") openJob(j);
                        if (e.key === " ") {
                          e.preventDefault(); // prevent page scroll
                          openJob(j);
                        }
                      }}
                      style={{
                        borderRadius: 16,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        cursor: "pointer",
                      }}
                      styles={{
                        body: {
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                          flex: 1,
                        },
                      }}
                    >
                      <Title level={4} style={{ marginBottom: 0 }}>
                        {title}
                      </Title>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {chips.map((c) => (
                          <span key={c.key}>{c.label}</span>
                        ))}
                      </div>

                      {!!summary && <Paragraph style={{ marginTop: 4, marginBottom: 0 }}>{summary}</Paragraph>}
                    </Card>
                  </motion.div>
                </Col>
              );
            })}
          </Row>
        )}
      </div>

      <Modal
        open={open}
        onCancel={closeJob}
        footer={null}
        closable={false}
        destroyOnHidden
        keyboard
        width="100%"
        style={{ top: 0, paddingBottom: 0, maxWidth: "100vw" }}
        mask={false}
        styles={{
      
          body: { height: "100vh", padding: 0, background: token.colorBgBase, overflow: "auto" },
        }}
      >
        {active && (
          <div style={{ position: "relative" }}>
            <Button
              ref={closeBtnRef}
              shape="circle"
              icon={<CloseOutlined />}
              onClick={closeJob}
              style={{ position: "fixed", top: 16, right: 16, zIndex: 10 }}
              aria-label={tClose}
            />

            <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 16px 56px", boxSizing: "border-box" }}>
              <Title level={2} style={{ marginTop: 8 }}>
                {text((active as any).title, language) || tPositionFallback}
              </Title>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                {activeChips.map((c) => (
                  <span key={c.key}>{c.label}</span>
                ))}
              </div>

              {(active as any).summary && (
                <Paragraph style={{ fontSize: 16 }}>{text((active as any).summary, language)}</Paragraph>
              )}

              {(active as any).description && (
                <>
                  <Divider />
                  <Paragraph style={{ whiteSpace: "pre-line" }}>{text((active as any).description, language)}</Paragraph>
                </>
              )}

              {!!(active as any).responsibilities?.length && (
                <>
                  <Divider />
                  <Title level={4}>{tResponsibilities}</Title>
                  <ul style={{ paddingLeft: 18, marginTop: 6 }}>
                    {(active as any).responsibilities.map((r: any, i: number) => (
                      <li key={i}>
                        <Paragraph style={{ marginBottom: 6 }}>{text(r?.text, language)}</Paragraph>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {!!(active as any).requirements?.length && (
                <>
                  <Divider />
                  <Title level={4}>{tRequirements}</Title>
                  <ul style={{ paddingLeft: 18, marginTop: 6 }}>
                    {(active as any).requirements.map((r: any, i: number) => (
                      <li key={i}>
                        <Paragraph style={{ marginBottom: 6 }}>{text(r?.text, language)}</Paragraph>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {!!(active as any).benefits?.length && (
                <>
                  <Divider />
                  <Title level={4}>{tBenefits}</Title>
                  <ul style={{ paddingLeft: 18, marginTop: 6 }}>
                    {(active as any).benefits.map((b: any, i: number) => (
                      <li key={i}>
                        <Paragraph style={{ marginBottom: 6 }}>{text(b?.text, language)}</Paragraph>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    </PageWrapper>
  );
};

export default CareersContent;
