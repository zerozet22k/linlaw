"use client";

import React, { useEffect, useRef, useState } from "react";
import { message, Button, Modal, Spin } from "antd";
import { CameraOutlined } from "@ant-design/icons";
import Image from "next/image";

import ImageCropper from "./ImageCropper";
import apiClient from "@/utils/api/apiClient";
import { UserAPI } from "@/models/UserModel";

interface ProfileAvatarProps {
  user?: UserAPI;
  onAvatarChange?: (avatarUrl: string) => void;
  onCoverChange?: (coverUrl: string) => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  user,
  onAvatarChange,
  onCoverChange,
}) => {
  const defaultAvatar = "/images/default-avatar.webp";
  const defaultCover = "/images/default-cover.jpg";

  const [avatarUrl, setAvatarUrl] = useState<string>(
    user?.avatar || defaultAvatar
  );
  const [coverUrl, setCoverUrl] = useState<string>(
    user?.cover_image || defaultCover
  );

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
    setCoverUrl(user?.cover_image || defaultCover);
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
        setAvatarUrl(newImageUrl);
        onAvatarChange?.(newImageUrl);
      } else {
        setCoverUrl(newImageUrl);
        onCoverChange?.(newImageUrl);
      }

      message.success(`Updated ${type} successfully!`);
    } catch (error) {
      console.error(error);
      message.error(`Failed to update ${type}.`);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 400,
        borderRadius: 8,
        backgroundColor: "#f0f0f0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        marginBottom: 60,
        overflow: "hidden",
      }}
    >
      {/* Cover image uses next/image for LCP-friendly optimization */}
      <Image
        src={coverUrl}
        alt="Cover"
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover" }}
        onError={() => setCoverUrl(defaultCover)}
      />

      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "rgba(0, 0, 0, 0.5)",
          borderRadius: "50%",
          padding: 8,
          cursor: "pointer",
          zIndex: 2,
        }}
        onClick={() => openFilePicker("cover")}
      >
        <CameraOutlined style={{ color: "#fff", fontSize: 18 }} />
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 0,
          transform: "translate(-50%, 50%)",
          width: 120,
          height: 120,
          borderRadius: "50%",
          border: "4px solid white",
          overflow: "hidden",
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          cursor: "pointer",
          zIndex: 2,
        }}
        onClick={() => openFilePicker("avatar")}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <Image
            src={avatarUrl}
            alt="Avatar"
            fill
            sizes="120px"
            style={{ objectFit: "cover" }}
            onError={() => setAvatarUrl(defaultAvatar)}
          />
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            background: "rgba(0,0,0,0.5)",
            textAlign: "center",
            padding: "4px 0",
          }}
        >
          <CameraOutlined style={{ color: "#fff", fontSize: 16 }} />
        </div>
      </div>

      <input
        type="file"
        accept="image/png, image/jpeg"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <Modal
        open={modalVisible}
        title={`Crop Your ${uploadingFor === "avatar" ? "Avatar" : "Cover (Portrait)"}`}
        onCancel={() => setModalVisible(false)}
        width="90vw"
        style={{ top: 20 }}
        styles={{
          body: {
            height: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 0,
          },
        }}
        maskClosable={false}
        destroyOnHidden
        footer={[
          <Button
            key="cancel"
            onClick={() => setModalVisible(false)}
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
            aspectRatio={uploadingFor === "avatar" ? 1 : 3 / 4}
          />
        )}
      </Modal>
    </div>
  );
};

export default ProfileAvatar;
