"use client";

import React, { useEffect, useState } from "react";
import { Spin, Alert, Typography, theme } from "antd";
import { useParams } from "next/navigation";
import apiClient from "@/utils/api/apiClient";
import { UserAPI } from "@/models/UserModel";
import { rgba } from "polished";

import "./TeamMemberPage.css";

const { Title, Paragraph } = Typography;
const { useToken } = theme;

const TeamMemberPage: React.FC = () => {
  const [user, setUser] = useState<UserAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id: userId } = useParams<{ id: string }>() ?? {};
  const { token } = useToken();

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const { data } = await apiClient.get<UserAPI>(`/team/${userId}`);
        setUser(data);
      } catch (e) {
        console.error(e);
        setError("Failed to load user.");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);


  if (loading)
    return <Spin size="large" style={{ display: "block", margin: 40 }} />;
  if (error || !user)
    return (
      <Alert
        message="Error"
        description={error ?? "User not found"}
        type="error"
        showIcon
        style={{ margin: 40 }}
      />
    );

  const glass = rgba(token.colorBgContainer, 0.2);


  return (
    <div className="tm-page" style={{ color: token.colorTextBase }}>
      {/* decorative wave */}
      <svg viewBox="0 0 1440 320" className="tm-wave">
        <path
          fill={token.colorTextBase}
          fillOpacity="0.03"
          d="M0,224L48,224C96,224,192,224,288,202.7C384,181,480,139,576,138.7C672,139,768,181,864,186.7C960,192,1056,160,1152,165.3C1248,171,1344,213,1392,234.7L1440,256V320H0Z"
        />
      </svg>

      {/* card */}
      <div className="tm-card" style={{ background: glass }}>
        <div className="tm-cover">
          <img
            src={user.cover_image ?? "/images/default-cover.jpg"}
            alt={`${user.name ?? user.username} cover`}
          />
        </div>

        <div className="tm-details">
          <Title
            level={2}
            style={{ marginBottom: 8, color: token.colorTextHeading }}
          >
            {user.name ?? user.username}
          </Title>

          {user.position && (
            <Title
              level={4}
              style={{ marginBottom: 16, color: token.colorTextDescription }}
            >
              {user.position}
            </Title>
          )}

          <Paragraph style={{ fontSize: 16, lineHeight: 1.6 }}>
            {user.bio || "No biography available."}
          </Paragraph>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberPage;
