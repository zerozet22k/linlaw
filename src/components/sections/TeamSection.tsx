"use client";

import React, { useEffect, useState } from "react";
import { Spin, Alert, Typography } from "antd";
import ImageComponent from "@/components/ui/ImageComponent";
import apiClient from "@/utils/api/apiClient";
import CustomCarousel from "@/components/sections/CustomCarousel";
import {
  TEAM_PAGE_SETTINGS_KEYS,
  TEAM_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/TEAM_PAGE_SETTINGS";
import { UserAPI } from "@/models/UserModel";
import { TeamBlockAPI } from "@/models/TeamBlock";

const { Title, Text } = Typography;

type TeamSectionProps = {
  teamSection: TEAM_PAGE_SETTINGS_TYPES[typeof TEAM_PAGE_SETTINGS_KEYS.SECTIONS];
};

const TeamSection: React.FC<TeamSectionProps> = ({ teamSection }) => {
  const maxMembers = teamSection?.maxMembersCount ?? 5;

  const [members, setMembers] = useState<UserAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data: blocks } = await apiClient.get<TeamBlockAPI[]>("/team");
        const flat = blocks.flatMap((b) => b.members);
        setMembers(maxMembers > 0 ? flat.slice(0, maxMembers) : flat);
      } catch (err) {
        console.error("Failed to fetch team members:", err);
        setError("Unable to load team members. Please try again later.");
      } finally {
        setLoading(false);
      }
    })();
  }, [maxMembers]);

  if (!loading && !error && members.length === 0) return null;

  return (
    <section style={{ padding: "60px 0", backgroundColor: "rgb(0, 21, 41)" }}>
      <Title
        level={2}
        style={{ textAlign: "center", color: "#fff", marginBottom: 40 }}
      >
        Meet Our Team
      </Title>

      {loading && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <Spin size="large" tip="Loading team members..." />
        </div>
      )}

      {error && (
        <div style={{ padding: "60px 20px" }}>
          <Alert message="Error" description={error} type="error" showIcon />
        </div>
      )}

      {members.length > 0 && (
        <div style={{ margin: "0 auto", maxWidth: 1200 }}>
          <CustomCarousel autoplay slidesToShow={3} dots infinite>
            {members.map((m) => (
              <div
                key={m._id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: 20,
                  height: 300,
                }}
              >
                <ImageComponent
                  src={m.avatar || "/images/default-avatar.webp"}
                  alt={m.name || m.username}
                  width={120}
                  height={120}
                  objectFit="cover"
                  style={{
                    borderRadius: "50%",
                    border: "4px solid #1890ff",
                    marginBottom: 10,
                  }}
                  priority
                />
                <Title
                  level={4}
                  style={{ color: "#fff", margin: "10px 0 5px" }}
                >
                  {m.name || m.username}
                </Title>
                <Text style={{ color: "#fff", fontSize: 14 }}>
                  {m.bio || "No bio available."}
                </Text>
              </div>
            ))}
          </CustomCarousel>
        </div>
      )}
    </section>
  );
};

export default TeamSection;
