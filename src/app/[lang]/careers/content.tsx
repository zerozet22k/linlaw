"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, Col, Divider, Empty, Modal, Row, Tag, Typography, theme } from "antd";
import {
  ApartmentOutlined,
  CalendarOutlined,
  CloseOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { motion, useReducedMotion } from "framer-motion";

import PageWrapper from "@/components/ui/PageWrapper";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/i18n";
import type { SharedPageContentType } from "@/config/CMS/pages/keys/shared/sharedPageTypes";
import type { CareerAPI } from "@/models/CareerModel";
import { formatYmd } from "@/utils/timeUtil";
import { dedupStrings, normalizeKey, shortText } from "@/utils/textUtils";
import { formatSalaryText, labelOfEmploymentType } from "@/utils/careerUtil";

const { Title, Paragraph } = Typography;

type Props = {
  pageContent?: SharedPageContentType;
  jobs: CareerAPI[];
};

const cardVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

const text = (value: any, lang: string) => t(lang, value, "");

function jobKey(job: CareerAPI, index: number): React.Key {
  return String(job._id || index);
}

function metaChips(job: CareerAPI, lang: string) {
  const chips: Array<{ key: string; label: React.ReactNode }> = [];

  if (job.department) {
    chips.push({
      key: "department",
      label: <Tag icon={<ApartmentOutlined />}>{job.department}</Tag>,
    });
  }

  if (job.location) {
    chips.push({
      key: "location",
      label: <Tag icon={<EnvironmentOutlined />}>{job.location}</Tag>,
    });
  }

  const employmentType = labelOfEmploymentType(job.employmentType);
  if (employmentType) {
    chips.push({
      key: "employmentType",
      label: <Tag icon={<IdcardOutlined />}>{employmentType}</Tag>,
    });
  }

  const salary = formatSalaryText(job.salary, lang);
  if (salary) {
    chips.push({
      key: "salary",
      label: <Tag icon={<DollarOutlined />}>{salary}</Tag>,
    });
  }

  const postedLabel = t(lang, "career.posted");
  const closesLabel = t(lang, "career.closes");

  if (job.postedAt) {
    chips.push({
      key: "postedAt",
      label: (
        <Tag icon={<CalendarOutlined />}>
          {postedLabel} {formatYmd(job.postedAt)}
        </Tag>
      ),
    });
  }

  if (job.closingDate) {
    chips.push({
      key: "closingDate",
      label: (
        <Tag icon={<CalendarOutlined />}>
          {closesLabel} {formatYmd(job.closingDate)}
        </Tag>
      ),
    });
  }

  const hideSet = new Set(
    [job.department, job.location, employmentType]
      .filter(Boolean)
      .map((value) => normalizeKey(value))
  );

  const rawTags = (job.tags ?? []).map((tag) => tag?.value ?? "");
  const extraTags = dedupStrings(rawTags).filter(
    (value) => !hideSet.has(normalizeKey(value))
  );

  for (const tag of extraTags) {
    chips.push({
      key: `tag-${normalizeKey(tag)}`,
      label: <Tag>{tag}</Tag>,
    });
  }

  return chips;
}

const CareersContent: React.FC<Props> = ({ pageContent, jobs }) => {
  const items = useMemo(
    () =>
      Array.isArray(jobs)
        ? [...jobs].sort((a, b) => {
            const ao = typeof a.order === "number" ? a.order : 0;
            const bo = typeof b.order === "number" ? b.order : 0;
            if (ao !== bo) return ao - bo;

            const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return bd - ad;
          })
        : [],
    [jobs]
  );

  const { token } = theme.useToken();
  const { language } = useLanguage();
  const reduceMotion = useReducedMotion();

  const [active, setActive] = useState<CareerAPI | null>(null);
  const isOpen = !!active;

  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const openJob = useCallback((job: CareerAPI) => {
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    setActive(job);
  }, []);

  const closeJob = useCallback(() => {
    setActive(null);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const timeoutId = window.setTimeout(() => closeBtnRef.current?.focus(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) return;
    restoreFocusRef.current?.focus?.();
  }, [isOpen]);

  const emptyLabel = t(language, "common.noData");
  const closeLabel = t(language, "common.close");
  const positionFallback = t(language, "career.position");
  const untitledPosition = t(language, "career.untitledPosition");
  const responsibilitiesLabel = t(language, "career.responsibilities");
  const requirementsLabel = t(language, "career.requirements");
  const benefitsLabel = t(language, "career.benefits");

  const chipLists = useMemo(
    () => items.map((job) => metaChips(job, language)),
    [items, language]
  );
  const activeChips = useMemo(
    () => (active ? metaChips(active, language) : []),
    [active, language]
  );

  return (
    <PageWrapper pageContent={pageContent}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
        {items.length === 0 ? (
          <Card style={{ borderRadius: 12 }}>
            <Empty description={emptyLabel} />
          </Card>
        ) : (
          <Row gutter={[24, 24]}>
            {items.map((job, index) => {
              const chips = chipLists[index] ?? [];
              const title = text(job.title, language) || untitledPosition;
              const summary = shortText(text(job.summary, language), 180);

              return (
                <Col xs={24} sm={12} md={8} key={jobKey(job, index)}>
                  <motion.div
                    initial={reduceMotion ? false : "initial"}
                    animate="animate"
                    variants={cardVariants}
                    transition={{
                      duration: reduceMotion ? 0 : 0.25,
                      delay: reduceMotion ? 0 : index * 0.04,
                    }}
                  >
                    <Card
                      hoverable
                      role="button"
                      tabIndex={0}
                      onClick={() => openJob(job)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") openJob(job);
                        if (event.key === " ") {
                          event.preventDefault();
                          openJob(job);
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
                        {chips.map((chip) => (
                          <span key={chip.key}>{chip.label}</span>
                        ))}
                      </div>

                      {!!summary && (
                        <Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
                          {summary}
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

      <Modal
        open={isOpen}
        onCancel={closeJob}
        footer={null}
        closable={false}
        destroyOnHidden
        keyboard
        width="100%"
        style={{ top: 0, paddingBottom: 0, maxWidth: "100vw" }}
        mask={false}
        styles={{
          body: {
            height: "100vh",
            padding: 0,
            background: token.colorBgBase,
            overflow: "auto",
          },
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
              aria-label={closeLabel}
            />

            <div
              style={{
                maxWidth: 960,
                margin: "0 auto",
                padding: "32px 16px 56px",
                boxSizing: "border-box",
              }}
            >
              <Title level={2} style={{ marginTop: 8 }}>
                {text(active.title, language) || positionFallback}
              </Title>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                {activeChips.map((chip) => (
                  <span key={chip.key}>{chip.label}</span>
                ))}
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
                  <Title level={4}>{responsibilitiesLabel}</Title>
                  <ul style={{ paddingLeft: 18, marginTop: 6 }}>
                    {active.responsibilities.map((item, index) => (
                      <li key={`${index}-${item.text?.en ?? "responsibility"}`}>
                        <Paragraph style={{ marginBottom: 6 }}>
                          {text(item?.text, language)}
                        </Paragraph>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {!!active.requirements?.length && (
                <>
                  <Divider />
                  <Title level={4}>{requirementsLabel}</Title>
                  <ul style={{ paddingLeft: 18, marginTop: 6 }}>
                    {active.requirements.map((item, index) => (
                      <li key={`${index}-${item.text?.en ?? "requirement"}`}>
                        <Paragraph style={{ marginBottom: 6 }}>
                          {text(item?.text, language)}
                        </Paragraph>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {!!active.benefits?.length && (
                <>
                  <Divider />
                  <Title level={4}>{benefitsLabel}</Title>
                  <ul style={{ paddingLeft: 18, marginTop: 6 }}>
                    {active.benefits.map((item, index) => (
                      <li key={`${index}-${item.text?.en ?? "benefit"}`}>
                        <Paragraph style={{ marginBottom: 6 }}>
                          {text(item?.text, language)}
                        </Paragraph>
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
