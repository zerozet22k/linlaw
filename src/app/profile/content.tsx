"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Descriptions, Alert, theme } from "antd";
import ProfileUpdateForm from "@/components/forms/ProfileUpdateForm";
import { useRouter } from "next/navigation";
import SubLoader from "@/components/loaders/SubLoader";
import { useUser } from "@/hooks/useUser";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/i18n";

const UserProfile: React.FC = () => {
  const { user, refreshUser, initialLoading } = useUser();
  const router = useRouter();
  const { language } = useLanguage();
  const { token } = theme.useToken();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!user && !initialLoading) {
      router.push("/login?redirect=/profile");
    }
  }, [user, initialLoading, router]);

  const tLoading = useMemo(() => t(language, "common.loading"), [language]);
  const tUserNotFound = useMemo(() => t(language, "common.notFound"), [language]);
  const tNoData = useMemo(() => t(language, "common.noData"), [language]);
  const tEdit = useMemo(() => t(language, "common.edit"), [language]);
  const tUserProfile = useMemo(() => t(language, "common.profile"), [language]);
  const tName = useMemo(() => t(language, "contact.name"), [language]);
  const tUsername = useMemo(() => t(language, "contact.username"), [language]);
  const tEmail = useMemo(() => t(language, "contact.email"), [language]);
  const tRoles = useMemo(() => t(language, "contact.roles"), [language]);
  const tNA = useMemo(() => t(language, "common.empty"), [language]);

  if (initialLoading) {
    return <SubLoader tip={tLoading} />;
  }

  if (!user) {
    return (
      <div style={{ maxWidth: 600, margin: "50px auto" }}>
        <Alert title={tUserNotFound} description={tNoData} type="warning" showIcon />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <Card
        title={tUserProfile}
        extra={
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            {tEdit}
          </Button>
        }
        style={{
          borderRadius: 10,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          background: token.colorBgContainer,
          border: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Descriptions column={1} bordered>
          <Descriptions.Item label={tName}>{user.name}</Descriptions.Item>
          <Descriptions.Item label={tUsername}>{user.username}</Descriptions.Item>
          <Descriptions.Item label={tEmail}>{user.email}</Descriptions.Item>
          <Descriptions.Item label={tRoles}>
            {user.roles?.length ? user.roles.map((role) => role.name).join(", ") : tNA}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <ProfileUpdateForm
        user={user}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSuccess={refreshUser}
      />
    </div>
  );
};

export default UserProfile;
