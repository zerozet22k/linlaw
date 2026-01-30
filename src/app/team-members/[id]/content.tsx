"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Spin, Alert, Typography, theme } from "antd";
import { useParams } from "next/navigation";
import apiClient from "@/utils/api/apiClient";
import { UserAPI } from "@/models/UserModel";
import { rgba } from "polished";
import Image from "next/image";

import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/i18n";

import "./content.css";

const { Title, Paragraph } = Typography;
const { useToken } = theme;

const TeamMemberClient: React.FC = () => {
  const [user, setUser] = useState<UserAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id: userId } = useParams<{ id: string }>() ?? {};
  const { token } = useToken();

  const { language } = useLanguage();

  const tError = useMemo(() => t(language, "common.error"), [language]);
  const tFailedToLoad = useMemo(() => t(language, "team.failedToLoadUser"), [language]);
  const tNotFound = useMemo(() => t(language, "team.userNotFound"), [language]);
  const tNoBio = useMemo(() => t(language, "team.noBiography"), [language]);
  const tCoverAltSuffix = useMemo(() => t(language, "team.coverAltSuffix"), [language]);

  useEffect(() => {
    if (!userId) return;

    (async () => {
      try {
        const { data } = await apiClient.get<UserAPI>(`/team/${userId}`);
        setUser(data);
      } catch (e) {
        console.error(e);
        setError(tFailedToLoad);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId, tFailedToLoad]);

  if (loading) return <Spin size="large" style={{ display: "block", margin: 40 }} />;

  if (error || !user)
    return (
      <Alert
        message={tError}
        description={error ?? tNotFound}
        type="error"
        showIcon
        style={{ margin: 40 }}
      />
    );

  const glass = rgba(token.colorBgContainer, 0.2);

  const coverSrc = user.cover_image ?? "/images/default-cover.jpg";

  const who = String(user.name ?? user.username ?? "").trim();
  const alt = who ? `${who} ${tCoverAltSuffix}` : tCoverAltSuffix;

  const displayName = user.name ?? user.username;

  return (
    <div className="tm-page" style={{ color: token.colorTextBase }}>
      <svg viewBox="0 0 1440 320" className="tm-wave">
        <path
          fill={token.colorTextBase}
          fillOpacity="0.03"
          d="M0,224L48,224C96,224,192,224,288,202.7C384,181,480,139,576,138.7C672,139,768,181,864,186.7C960,192,1056,160,1152,165.3C1248,171,1344,213,1392,234.7L1440,256V320H0Z"
        />
      </svg>

      <div className="tm-card" style={{ background: glass }}>
        <div className="tm-cover" style={{ position: "relative" }}>
          <Image
            src={coverSrc}
            alt={alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 900px"
            style={{ objectFit: "cover" }}
          />
        </div>

        <div className="tm-details">
          <Title level={2} style={{ marginBottom: 8, color: token.colorTextHeading }}>
            {displayName}
          </Title>

          {user.position && (
            <Title level={4} style={{ marginBottom: 16, color: token.colorTextDescription }}>
              {user.position}
            </Title>
          )}

          <Paragraph style={{ fontSize: 16, lineHeight: 1.6 }}>
            {user.bio || tNoBio}
          </Paragraph>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberClient;
