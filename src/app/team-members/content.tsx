"use client";

import React, { useEffect, useState } from "react";
import { Card, Avatar, Row, Col, Spin, Alert, theme } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import apiClient from "@/utils/api/apiClient";
import { rgba } from "polished";
import PageWrapper from "@/components/PageWrapper";
import { getTranslatedText } from "@/utils/getTranslatedText";
import {
  TEAM_PAGE_SETTINGS_KEYS,
  TEAM_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/TEAM_PAGE_SETTINGS";
import { useLanguage } from "@/hooks/useLanguage";
import { UserAPI } from "@/models/UserModel";
import { motion } from "framer-motion";

type TeamContentProps = {
  data: TEAM_PAGE_SETTINGS_TYPES;
};

const TeamContent: React.FC<TeamContentProps> = ({ data }) => {
  const { language } = useLanguage();
  const pageContent = data[TEAM_PAGE_SETTINGS_KEYS.PAGE_CONTENT];
  const teamSection = data[TEAM_PAGE_SETTINGS_KEYS.SECTIONS];
  const design = data[TEAM_PAGE_SETTINGS_KEYS.DESIGN] || {};
  const typography = design.typography || {};
  const gridGutter = parseInt(design.gridGutter) || 24;
  const animationType = design.animation || "none";

  const [teamMembers, setTeamMembers] = useState<UserAPI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { token } = theme.useToken();

  // Map the design.animation value to Framer Motion variants.
  const getAnimationVariants = (animation: string) => {
    switch (animation) {
      case "fade-in":
        return { initial: { opacity: 0 }, animate: { opacity: 1 } };
      case "slide-up":
        return { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };
      case "scale-in":
        return { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } };
      default:
        return { initial: {}, animate: {} };
    }
  };

  const variants = getAnimationVariants(animationType);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await apiClient.get<UserAPI[]>("/team");
        if (response.data && Array.isArray(response.data)) {
          // Limit the number of members based on the CMS setting.
          const members = response.data.slice(0, teamSection.maxMembersCount);
          setTeamMembers(members);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        console.error("Error fetching team members:", err);
        setError("Failed to load team members.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [teamSection.maxMembersCount]);

  const glassBackground = rgba(token.colorBgContainer, 0.2);

  return (
    <PageWrapper pageContent={pageContent}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 20px",
          color: token.colorTextBase,
        }}
      >
        {loading && (
          <Spin size="large" style={{ display: "block", margin: "40px auto" }} />
        )}
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: "40px" }}
          />
        )}
        <Row gutter={[gridGutter, gridGutter]} justify="center">
          {teamMembers.map((member) => (
            <Col xs={24} sm={12} md={8} lg={6} key={member._id}>
              <Link href={`/team-members/${member._id}`} style={{ textDecoration: "none" }}>
                <motion.div
                  initial={variants.initial}
                  animate={variants.animate}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  style={{ width: "100%", height: "100%" }}
                >
                  <Card
                    hoverable
                    style={{
                      borderRadius: design.borderRadius || "16px",
                      overflow: "hidden",
                      transition: "transform 0.3s",
                      height: "100%",
                      backgroundColor: glassBackground,
                      backdropFilter: "blur(6px)",
                      boxShadow:
                        design.cardStyle === "shadow"
                          ? "0px 6px 16px rgba(0, 0, 0, 0.12)"
                          : "none",
                    }}
                    bodyStyle={{
                      padding: "20px",
                      textAlign: design.textAlign || "center",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    }}
                  >
                    {/* Conditional rendering: show image if enabled; fallback to icon if enabled */}
                    {design.showImages && member.avatar ? (
                      <Avatar
                        size={96}
                        src={member.avatar}
                        style={{ margin: "0 auto", display: "block" }}
                      />
                    ) : design.showIcons ? (
                      <Avatar
                        size={96}
                        icon={<UserOutlined />}
                        style={{ margin: "0 auto", display: "block" }}
                      />
                    ) : null}
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                      <h2
                        style={{
                          fontSize: typography.titleSize || "22px",
                          marginBottom: "8px",
                          color: typography.color || "inherit",
                        }}
                      >
                        {member.name}
                      </h2>
                      <p
                        style={{
                          fontSize: typography.descriptionSize || "16px",
                          marginBottom: 0,
                          color: typography.color || "inherit",
                        }}
                      >
                        {member.roles.map((role) => role.name).join(", ")}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </PageWrapper>
  );
};

export default TeamContent;
