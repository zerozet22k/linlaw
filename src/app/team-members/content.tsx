"use client";

import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spin, Alert, theme, Typography } from "antd";
import Link from "next/link";
import apiClient from "@/utils/api/apiClient";
import PageWrapper from "@/components/ui/PageWrapper";
import {
  TEAM_PAGE_SETTINGS_KEYS,
  TEAM_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/TEAM_PAGE_SETTINGS";
import { TeamBlockAPI } from "@/models/TeamBlock";
import { motion } from "framer-motion";

const { Title } = Typography;

type TeamContentProps = { data: TEAM_PAGE_SETTINGS_TYPES };

const TeamContent: React.FC<TeamContentProps> = ({ data }) => {
  /* CMS options */
  const pageContent = data[TEAM_PAGE_SETTINGS_KEYS.PAGE_CONTENT];
  const teamSection = data[TEAM_PAGE_SETTINGS_KEYS.SECTIONS];

  /* theming */
  const { token } = theme.useToken();
  const cardRadius = data[TEAM_PAGE_SETTINGS_KEYS.DESIGN]?.borderRadius ?? 16;
  const gridGutter = parseInt(
    data[TEAM_PAGE_SETTINGS_KEYS.DESIGN]?.gridGutter ?? "24",
    10
  );

  /* state */
  const [blocks, setBlocks] = useState<TeamBlockAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* fetch */
  useEffect(() => {
    (async () => {
      try {
        const { data: apiBlocks } = await apiClient.get<TeamBlockAPI[]>(
          "/team"
        );

        if (teamSection.maxMembersCount && teamSection.maxMembersCount > 0) {
          let remaining = teamSection.maxMembersCount;
          const trimmed: TeamBlockAPI[] = [];
          for (const blk of apiBlocks) {
            if (remaining <= 0) break;
            const slice =
              blk.members.length > remaining
                ? blk.members.slice(0, remaining)
                : blk.members;
            trimmed.push({ ...blk, members: slice });
            remaining -= slice.length;
          }
          setBlocks(trimmed);
        } else {
          setBlocks(apiBlocks);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load team members.");
      } finally {
        setLoading(false);
      }
    })();
  }, [teamSection.maxMembersCount]);

  /* animation variants */
  const variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  };

  /* styles */
  const overlayGradient =
    "linear-gradient(to top, rgba(0,0,0,0.65) 30%, rgba(0,0,0,0.0) 100%)";
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
          <Spin
            size="large"
            style={{ display: "block", margin: "40px auto" }}
          />
        )}

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 40 }}
          />
        )}

        {/*  grouped rendering  */}
        {blocks.map((block) => (
          <section key={block.position} style={{ marginBottom: 64 }}>
            <Title
              level={2}
              style={{
                textAlign: "center",
                marginBottom: 32,
                position: "relative",
              }}
            >
              {block.position}
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
                  <Link href={`/team-members/${member._id}`} legacyBehavior>
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

                              {/* overlay */}
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
                              {/* name / position */}
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
                                <div
                                  style={{
                                    fontSize: 14,
                                    opacity: 0.85,
                                    textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                                  }}
                                >
                                  {member.position}
                                </div>
                              </div>
                            </div>
                          }
                          style={{
                            borderRadius: cardRadius,
                            overflow: "hidden",
                            background: token.colorBgContainer,
                            boxShadow:
                              data[TEAM_PAGE_SETTINGS_KEYS.DESIGN]
                                ?.cardStyle === "shadow"
                                ? "0 6px 16px rgba(0,0,0,0.15)"
                                : "none",
                          }}
                          bodyStyle={{ display: "none" }} // hide default padding
                        />
                      </motion.div>
                    </a>
                  </Link>
                </Col>
              ))}
            </Row>
          </section>
        ))}
      </div>
    </PageWrapper>
  );
};

export default TeamContent;
