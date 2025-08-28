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
  const maxMembers = teamSection.maxMembersCount ?? 0;

  const [blocks, setBlocks] = useState<TeamBlockAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data: apiBlocks } = await apiClient.get<TeamBlockAPI[]>(
          "/team"
        );

        if (maxMembers > 0) {
          let remaining = maxMembers;
          const cappedBlocks: TeamBlockAPI[] = [];

          for (const blk of apiBlocks) {
            if (remaining <= 0) break;
            const take = Math.min(blk.members.length, remaining);
            cappedBlocks.push({
              ...blk,
              members: blk.members.slice(0, take),
            });
            remaining -= take;
          }

          setBlocks(cappedBlocks);
        } else {
          setBlocks(apiBlocks);
        }
      } catch (err) {
        console.error("Failed to fetch team blocks:", err);
        setError("Unable to load team members. Please try again later.");
      } finally {
        setLoading(false);
      }
    })();
  }, [maxMembers]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <Spin size="large" tip="Loading team members..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "60px 20px" }}>
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  if (blocks.length === 0) return null;

  return (
    <section style={{ padding: "60px 0", backgroundColor: "rgb(0, 21, 41)" }}>
      <Title
        level={2}
        style={{ textAlign: "center", color: "#fff", marginBottom: 40 }}
      >
        Meet Our Team
      </Title>

      {blocks.map((block) => (
        <div key={block.teamName} style={{ marginBottom: 64 }}>
          {/* Team name sub‑heading */}
          <Title
            level={3}
            style={{ textAlign: "center", color: "#fff", marginBottom: 24 }}
          >
            {block.teamName}
          </Title>

          <div style={{ margin: "0 auto", maxWidth: 1200 }}>
            <CustomCarousel autoplay slidesToShow={3} dots infinite>
              {block.members.map((m) => (
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

                  {/* Still show their position */}
                  {m.position && (
                    <Text
                      style={{ color: "#ccc", fontSize: 12, marginBottom: 8 }}
                    >
                      {m.position}
                    </Text>
                  )}

                  <Text style={{ color: "#fff", fontSize: 14 }}>
                    {m.bio || "No bio available."}
                  </Text>
                </div>
              ))}
            </CustomCarousel>
          </div>
        </div>
      ))}
    </section>
  );
};

export default TeamSection;
