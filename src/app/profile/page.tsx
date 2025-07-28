"use client";

import React, { useState, useEffect } from "react";
import { Button, Card, Descriptions, Alert } from "antd";
import ProfileUpdateForm from "@/components/forms/ProfileUpdateForm";
import { useRouter } from "next/navigation";
import SubLoader from "@/components/loaders/SubLoader";
import { useUser } from "@/hooks/useUser";
import { useLanguage } from "@/hooks/useLanguage";
import { getTranslatedText } from "@/utils/getTranslatedText";
import { commonTranslations } from "@/translations";
import { contactTranslations } from "@/translations/";

const UserProfile: React.FC = () => {
  const { user, refreshUser, initialLoading } = useUser();
  const router = useRouter();
  const { language } = useLanguage();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!user && !initialLoading) {
      router.push("/login?redirect=/profile");
    }
  }, [user, initialLoading, router]);

  const tLoading =
    getTranslatedText(commonTranslations.loading, language) || "Loading...";
  const tUserNotFound =
    getTranslatedText(commonTranslations.notFound, language) ||
    "User Not Found";
  const tNoData =
    getTranslatedText(commonTranslations.noData, language) ||
    "No user data available.";
  const tEdit =
    getTranslatedText(commonTranslations.edit, language) || "Edit Profile";
  const tUserProfile =
    getTranslatedText(commonTranslations.profile, language) || "User Profile";
  const tName = getTranslatedText(contactTranslations.name, language) || "Name";
  const tUsername =
    getTranslatedText(contactTranslations.username, language) || "Username";
  const tEmail =
    getTranslatedText(contactTranslations.email, language) || "Email";
  const tRoles =
    getTranslatedText(contactTranslations.roles, language) || "Roles";
  const tNA = getTranslatedText(commonTranslations.empty, language) || "N/A";

  if (initialLoading) {
    return <SubLoader tip={tLoading} />;
  }

  if (!user) {
    return (
      <div style={{ maxWidth: 600, margin: "50px auto" }}>
        <Alert
          message={tUserNotFound}
          description={tNoData}
          type="warning"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <Card
        title={tUserProfile}
        extra={
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            {tEdit}
          </Button>
        }
        style={{
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Descriptions column={1} bordered>
          <Descriptions.Item label={tName}>{user.name}</Descriptions.Item>
          <Descriptions.Item label={tUsername}>
            {user.username}
          </Descriptions.Item>
          <Descriptions.Item label={tEmail}>{user.email}</Descriptions.Item>
          <Descriptions.Item label={tRoles}>
            {user.roles?.length
              ? user.roles.map((role) => role.name).join(", ")
              : tNA}
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
