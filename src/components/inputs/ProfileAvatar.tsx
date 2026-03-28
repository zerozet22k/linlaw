"use client";

import React, { useEffect, useRef, useState } from "react";
import { message, Button, Modal, Spin, Card, Grid, Typography, theme } from "antd";
import { CameraOutlined } from "@ant-design/icons";
import Image from "next/image";

import ImageCropper from "./ImageCropper";
import apiClient from "@/utils/api/apiClient";
import { UserAPI } from "@/models/UserModel";

const { Text, Title } = Typography;

interface ProfileAvatarProps {
  user?: UserAPI;
  onAvatarChange?: (avatarUrl: string) => void;
  onCoverChange?: (coverUrl: string) => void;
}

const getInitials = (user?: UserAPI) => {
  const base = String(user?.name || user?.username || "").trim();
  if (!base) return "U";
  return base
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "U";
};

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  user,
  onAvatarChange,
  onCoverChange,
}) => {
  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  const defaultAvatar = "/images/default-avatar.webp";
  const fallbackInitials = getInitials(user);

  const [avatarUrl, setAvatarUrl] = useState<string>(
    user?.avatar || defaultAvatar
  );
  const [coverUrl, setCoverUrl] = useState<string>(
    user?.cover_image || ""
  );
  const [avatarBroken, setAvatarBroken] = useState(false);
  const [coverBroken, setCoverBroken] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadingFor, setUploadingFor] = useState<"avatar" | "cover">("avatar");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const cropRef = useRef<any>(null);
  const uploadingForRef = useRef<"avatar" | "cover">("avatar");
  useEffect(() => {
    setAvatarUrl(user?.avatar || defaultAvatar);
    setCoverUrl(user?.cover_image || "");
    setAvatarBroken(false);
    setCoverBroken(false);
  }, [user?.avatar, user?.cover_image]);
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const openFilePicker = (type: "avatar" | "cover") => {
    uploadingForRef.current = type;
    setUploadingFor(type);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    e.target.value = "";

    setModalVisible(true);
  };

  const handleSaveCroppedImage = async () => {
    if (!cropRef.current || !imageRef.current) return;

    try {
      const croppedImage = await cropRef.current.getCroppedImg();
      if (!croppedImage) {
        message.error("Please crop the image before saving.");
        return;
      }
      await uploadToServer(croppedImage, uploadingFor);
    } catch (error) {
      console.error(error);
      message.error("Failed to process cropped image.");
    }
  };

  const uploadToServer = async (imageDataUrl: string, type: "avatar" | "cover") => {
    if (!user?._id) {
      message.error("User not found. Please sign in again.");
      return;
    }

    setUploading(true);

    const contentType = imageDataUrl.startsWith("data:image/png")
      ? "image/png"
      : "image/jpeg";

    try {
      const response = await apiClient.post(
        `/users/${user._id}/getSignedUrl?type=${type}`,
        { contentType }
      );

      if (response.status !== 200) throw new Error("Upload URL fetch failed");

      const uploadUrl: string = response.data.uploadUrl;

      const base64Data = imageDataUrl.split(",")[1];
      const bytes = atob(base64Data)
        .split("")
        .map((c) => c.charCodeAt(0));
      const imageBlob = new Blob([new Uint8Array(bytes)], { type: contentType });

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: imageBlob,
        headers: { "Content-Type": contentType },
      });

      if (!uploadResponse.ok) throw new Error("Upload failed");

      const publicUrl = uploadUrl.split("?")[0];
      await updateUserImage(publicUrl, type);

      setModalVisible(false);
      setPreviewUrl(null);
    } catch (error) {
      console.error(error);
      message.error("Upload error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const updateUserImage = async (newImageUrl: string, type: "avatar" | "cover") => {
    if (!user?._id) return;

    try {
      const fieldKey = type === "avatar" ? "avatar" : "cover_image";
      await apiClient.put(`/users/${user._id}`, { [fieldKey]: newImageUrl });

      if (type === "avatar") {
        setAvatarBroken(false);
        setAvatarUrl(newImageUrl);
        onAvatarChange?.(newImageUrl);
      } else {
        setCoverBroken(false);
        setCoverUrl(newImageUrl);
        onCoverChange?.(newImageUrl);
      }

      message.success(`Updated ${type} successfully!`);
    } catch (error) {
      console.error(error);
      message.error(`Failed to update ${type}.`);
    }
  };

  const closeCropModal = () => {
    setModalVisible(false);
    setPreviewUrl(null);
  };

  const displayName = String(user?.name || user?.username || "User").trim();
  const username = String(user?.username || "").trim();
  const email = String(user?.email || "").trim();
  const position = String(user?.position || "").trim();
  const avatarSrc = avatarBroken ? defaultAvatar : avatarUrl || defaultAvatar;
  const showCoverImage = !!coverUrl && !coverBroken;
  const mediaHint =
    "Use a square avatar and a wide cover image for the cleanest profile layout.";
  const avatarSize = isMobile ? 92 : 110;
  const coverHeight = isMobile ? 280 : 360;
  const detailChips = [position, email].filter(Boolean);
  const coverAccent =
    "linear-gradient(135deg, rgba(13,27,62,0.96) 0%, rgba(18,86,121,0.82) 48%, rgba(228,176,74,0.72) 100%)";
  const coverOverlay =
    "linear-gradient(180deg, rgba(6,12,22,0.12) 0%, rgba(6,12,22,0.35) 45%, rgba(6,12,22,0.88) 100%)";

  return (
    <>
      <Card
        bordered
        style={{
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
        }}
        styles={{ body: { padding: 0 } }}
      >
        <div
          style={{
            position: "relative",
            minHeight: coverHeight,
            background: coverAccent,
          }}
        >
          {showCoverImage ? (
            <Image
              src={coverUrl}
              alt="Profile cover"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{ objectFit: "cover" }}
              onError={() => setCoverBroken(true)}
            />
          ) : (
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: isMobile ? 42 : 56,
                fontWeight: 800,
                letterSpacing: 2,
                color: "rgba(255,255,255,0.24)",
                textTransform: "uppercase",
              }}
            >
              {fallbackInitials}
            </div>
          )}

          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background: coverOverlay,
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: isMobile ? 18 : 22,
              zIndex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.14)",
                  backdropFilter: "blur(10px)",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              >
                Profile Media
              </div>

              <Button
                htmlType="button"
                icon={<CameraOutlined />}
                onClick={() => openFilePicker("cover")}
                style={{
                  borderRadius: 999,
                  borderColor: "rgba(255,255,255,0.28)",
                  background: "rgba(9, 18, 35, 0.34)",
                  color: "#fff",
                  boxShadow: "none",
                }}
              >
                {showCoverImage ? "Change Cover" : "Add Cover"}
              </Button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "flex-start" : "flex-end",
                gap: 16,
              }}
            >
              <button
                type="button"
                onClick={() => openFilePicker("avatar")}
                style={{
                  appearance: "none",
                  border: "none",
                  padding: 0,
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: avatarSize,
                    height: avatarSize,
                    borderRadius: "50%",
                    border: "4px solid rgba(255,255,255,0.95)",
                    overflow: "hidden",
                    background: "#fff",
                    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.28)",
                  }}
                >
                  <Image
                    src={avatarSrc}
                    alt="Avatar"
                    fill
                    sizes={`${avatarSize}px`}
                    style={{ objectFit: "cover" }}
                    onError={() => setAvatarBroken(true)}
                  />

                  <div
                    style={{
                      position: "absolute",
                      right: 6,
                      bottom: 6,
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(7, 15, 28, 0.72)",
                      color: "#fff",
                      boxShadow: "0 8px 20px rgba(15, 23, 42, 0.25)",
                    }}
                  >
                    <CameraOutlined />
                  </div>
                </div>
              </button>

              <div style={{ minWidth: 0, flex: 1 }}>
                <Title
                  level={isMobile ? 4 : 3}
                  style={{
                    margin: 0,
                    color: "#fff",
                    lineHeight: 1.1,
                  }}
                >
                  {displayName}
                </Title>

                {username && (
                  <Text
                    style={{
                      display: "block",
                      marginTop: 6,
                      color: "rgba(255,255,255,0.78)",
                      fontSize: 15,
                    }}
                  >
                    @{username}
                  </Text>
                )}

                {detailChips.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      marginTop: 12,
                    }}
                  >
                    {detailChips.map((chip) => (
                      <span
                        key={chip}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          maxWidth: "100%",
                          padding: "7px 11px",
                          borderRadius: 999,
                          background: "rgba(255,255,255,0.14)",
                          color: "rgba(255,255,255,0.92)",
                          fontSize: 12.5,
                          lineHeight: 1.2,
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <span
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {chip}
                        </span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            padding: isMobile ? 18 : 22,
            background: token.colorBgContainer,
          }}
        >
          <Text
            style={{
              display: "block",
              color: token.colorTextSecondary,
              lineHeight: 1.6,
            }}
          >
            {mediaHint}
          </Text>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 16,
            }}
          >
            <Button htmlType="button" icon={<CameraOutlined />} onClick={() => openFilePicker("avatar")}>
              Change Avatar
            </Button>
            <Button htmlType="button" icon={<CameraOutlined />} onClick={() => openFilePicker("cover")}>
              Change Cover
            </Button>
          </div>
        </div>
      </Card>

      <input
        type="file"
        accept="image/png, image/jpeg"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <Modal
        open={modalVisible}
        title={uploadingFor === "avatar" ? "Crop Avatar" : "Crop Cover Image"}
        onCancel={closeCropModal}
        width={isMobile ? "96vw" : 1080}
        style={{ top: 20 }}
        styles={{
          body: {
            minHeight: "min(80vh, 720px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
          },
        }}
        maskClosable={false}
        destroyOnHidden
        footer={[
          <Button
            key="cancel"
            onClick={closeCropModal}
            disabled={uploading}
          >
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={handleSaveCroppedImage}
            disabled={uploading}
          >
            Save
          </Button>,
        ]}
      >
        {uploading && (
          <Spin size="large" style={{ position: "absolute", zIndex: 1 }} />
        )}

        {previewUrl && (
          <ImageCropper
            ref={cropRef}
            imageUrl={previewUrl}
            imageRef={imageRef}
            aspectRatio={uploadingFor === "avatar" ? 1 : 16 / 9}
          />
        )}
      </Modal>
    </>
  );
};

export default ProfileAvatar;
