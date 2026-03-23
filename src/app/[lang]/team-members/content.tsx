"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, Row, Col, Spin, Alert, theme, Typography } from "antd";
import Link from "next/link";
import apiClient from "@/utils/api/apiClient";
import PageWrapper from "@/components/ui/PageWrapper";
import { TEAM_PAGE_SETTINGS_KEYS, TEAM_PAGE_SETTINGS_TYPES } from "@/config/CMS/pages/keys/TEAM_PAGE_SETTINGS";
import { TeamBlockAPI } from "@/models/TeamBlock";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/i18n";
import { ROUTE_KEYS } from "@/config/navigations/routes";
import { hrefLang } from "@/i18n/path";

const { Title } = Typography;

type TeamContentProps = {
  data: TEAM_PAGE_SETTINGS_TYPES;
};

const TeamContent: React.FC<TeamContentProps> = ({ data }) => {
  const pageContent = data[TEAM_PAGE_SETTINGS_KEYS.PAGE_CONTENT];
  const teamSection = data[TEAM_PAGE_SETTINGS_KEYS.SECTIONS];

  const { token } = theme.useToken();
  const cardRadius = 16;
  const gridGutter = 24;
  const useShadow = true;

  const { language } = useLanguage();

  const tLoading = useMemo(() => t(language, "common.loading"), [language]);
  const tError = useMemo(() => t(language, "common.error"), [language]);
  const tNoData = useMemo(() => t(language, "common.noData"), [language]);
  const tFailedToLoad = useMemo(() => t(language, "team.failedToLoad"), [language]);
  const tTeamNameFallback = useMemo(() => t(language, "team.teamNameFallback"), [language]);

  const [blocks, setBlocks] = useState<TeamBlockAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data: apiBlocks } = await apiClient.get<TeamBlockAPI[]>("/team");

        const max = Number(teamSection?.maxMembersCount ?? 0);
        if (max > 0) {
          let remaining = max;
          const trimmed: TeamBlockAPI[] = [];
          for (const blk of apiBlocks) {
            if (remaining <= 0) break;
            const members = Array.isArray(blk.members) ? blk.members : [];
            const slice = members.length > remaining ? members.slice(0, remaining) : members;
            trimmed.push({ ...blk, members: slice });
            remaining -= slice.length;
          }
          setBlocks(trimmed);
        } else {
          setBlocks(apiBlocks);
        }
      } catch (err) {
        console.error(err);
        setError(tFailedToLoad);
      } finally {
        setLoading(false);
      }
    })();
  }, [teamSection?.maxMembersCount, tFailedToLoad]);

  const variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  };

  const overlayGradient = "linear-gradient(to top, rgba(0,0,0,0.65) 30%, rgba(0,0,0,0.0) 100%)";
  const placeholder = "/images/default-avatar.webp";

  return (
    <PageWrapper pageContent={pageContent}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "40px 20px",
          color: token.colorTextBase,
        }}
      >
        {loading && (
          <div style={{ display: "flex", justifyContent: "center", margin: "40px auto" }}>
            <Spin size="large" tip={tLoading} fullscreen={false}>
              <div style={{ width: 100, height: 48 }} />
            </Spin>
          </div>
        )}

        {error && (
          <Alert title={tError} description={error} type="error" showIcon style={{ marginBottom: 40 }} />
        )}

        {!loading && !error && blocks.length === 0 && (
          <Typography.Paragraph style={{ textAlign: "center", marginTop: 32 }}>{tNoData}</Typography.Paragraph>
        )}

        {blocks.map((block) => {
          const teamName = String(block.teamName || "").trim() || tTeamNameFallback;

          return (
            <section key={teamName} style={{ marginBottom: 64 }}>
              <Title
                level={2}
                style={{
                  textAlign: "center",
                  marginBottom: 32,
                  position: "relative",
                }}
              >
                {teamName}
                <span
                  style={{
                    content: "''",
                    display: "block",
                    width: 60,
                    height: 4,
                    borderRadius: 2,
                    background: token.colorPrimary,
                    margin: "8px auto 0",
                  }}
                />
              </Title>

              <Row gutter={[gridGutter, gridGutter]} justify="center">
                {block.members.map((member) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={member._id}>
                    <Link
                      href={hrefLang(
                        `/${ROUTE_KEYS.TEAM_MEMBERS}/${encodeURIComponent(member.username || member._id)}`,
                        language as any
                      )}
                      legacyBehavior
                    >
                      <a style={{ textDecoration: "none" }}>
                        <motion.div
                          initial={variants.initial}
                          animate={variants.animate}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          whileHover={{ scale: 1.04, y: -4 }}
                        >
                          <Card
                            hoverable
                            cover={
                              <div style={{ position: "relative" }}>
                                <img
                                  src={member.avatar || placeholder}
                                  alt={member.name || member.username}
                                  style={{
                                    width: "100%",
                                    height: 240,
                                    objectFit: "cover",
                                    borderTopLeftRadius: cardRadius,
                                    borderTopRightRadius: cardRadius,
                                  }}
                                />

                                <div
                                  style={{
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: "60%",
                                    background: overlayGradient,
                                    borderBottomLeftRadius: cardRadius,
                                    borderBottomRightRadius: cardRadius,
                                  }}
                                />

                                <div
                                  style={{
                                    position: "absolute",
                                    bottom: 16,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    color: "#fff",
                                    textAlign: "center",
                                    padding: "0 12px",
                                    width: "90%",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontWeight: 600,
                                      fontSize: 18,
                                      lineHeight: 1.2,
                                      marginBottom: 4,
                                      textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                                    }}
                                  >
                                    {member.name}
                                  </div>

                                  {member.position && (
                                    <div
                                      style={{
                                        fontSize: 14,
                                        opacity: 0.85,
                                        textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                                      }}
                                    >
                                      {member.position}
                                    </div>
                                  )}
                                </div>
                              </div>
                            }
                            style={{
                              borderRadius: cardRadius,
                              overflow: "hidden",
                              background: token.colorBgContainer,
                              boxShadow: useShadow ? "0 6px 16px rgba(0,0,0,0.15)" : "none",
                            }}
                            styles={{ body: { display: "none" } }}
                          />
                        </motion.div>
                      </a>
                    </Link>
                  </Col>
                ))}
              </Row>
            </section>
          );
        })}
      </div>
    </PageWrapper>
  );
};

export default TeamContent;
