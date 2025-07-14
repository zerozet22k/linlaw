"use client";

import React, { useEffect, useState } from "react";
import { Spin, Alert, Typography, theme } from "antd";
import { useParams } from "next/navigation";
import apiClient from "@/utils/api/apiClient";
import { UserAPI } from "@/models/UserModel";
import { rgba } from "polished";

const { Title, Paragraph } = Typography;
const { useToken } = theme;

const TeamMemberPage: React.FC = () => {
  const [user, setUser] = useState<UserAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams<{ id: string }>();
  const userId = params?.id;

  const { token } = useToken();

  useEffect(() => {
    if (!userId) return;

    (async () => {
      try {
        const { data } = await apiClient.get<UserAPI>(`/team/${userId}`);
        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user.");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  if (loading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "40px auto" }} />
    );
  }

  if (error || !user) {
    return (
      <Alert
        message="Error"
        description={error ?? "User not found"}
        type="error"
        showIcon
        style={{ margin: 40 }}
      />
    );
  }

  const glass = rgba(token.colorBgContainer, 0.2);

  return (
    <div
      style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}
    >
      <svg
        viewBox="0 0 1440 320"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "auto",
          zIndex: -1,
        }}
      >
        <path
          fill={token.colorTextBase}
          fillOpacity="0.03"
          d="M0,224L48,224C96,224,192,224,288,202.7C384,181,480,139,576,138.7C672,139,768,181,864,186.7C960,192,1056,160,1152,165.3C1248,171,1344,213,1392,234.7L1440,256V320H0Z"
        />
      </svg>

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          color: token.colorTextBase,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "90%",
            maxWidth: 1200,
            borderRadius: 20,
            overflow: "hidden",
            backgroundColor: glass,
            backdropFilter: "blur(10px)",
          }}
        >
          {/* hero / cover */}
          <div
            style={{
              flex: "1 1 40%",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <img
              src={user.cover_image ?? "/images/default-cover.jpg"}
              alt={`${user.name ?? user.username} cover`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.5s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
          </div>

          {/* details */}
          <div
            style={{
              flex: "1 1 60%",
              padding: 40,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
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
    </div>
  );
};

export default TeamMemberPage;
