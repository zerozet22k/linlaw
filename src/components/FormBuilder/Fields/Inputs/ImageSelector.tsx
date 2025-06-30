"use client";
import React, { CSSProperties } from "react";
import { Button, Input, Tooltip, Space } from "antd";
import { PictureOutlined, SyncOutlined } from "@ant-design/icons";
import { useFile } from "@/hooks/useFile";

import {
  defaultInputStyle,
  defaultSyncButtonStyle,
  defaultChooseImageButtonStyle,
  previewImageStyle,
  flexColumnStyle,
} from "../../InputStyle";
import { FileType } from "@/models/FileModel";

interface ImageSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  style?: CSSProperties;
  zIndex?: number;
  preview?: boolean;
  previewContainerStyle?: CSSProperties;
  previewImageStyle?: CSSProperties;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
  value = "",
  onChange,
  style = {},
  zIndex = 1000,
  preview = false,
  previewContainerStyle = {},
  previewImageStyle: customPreviewImageStyle = {},
}) => {
  const { openModal, syncFiles, loading } = useFile();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const handleOpenModal = () => {
    openModal(
      (selectedFileUrl) => {
        onChange?.(selectedFileUrl);
      },
      "image" as FileType,
      zIndex + 1
    );
  };

  return (
    <div
      style={{
        ...flexColumnStyle,
        ...style,
      }}
    >
      {preview && value && (
        <div
          style={{
            textAlign: "left",
            ...previewContainerStyle,
          }}
        >
          <img
            src={value}
            alt="Preview"
            style={{
              ...previewImageStyle,
              ...customPreviewImageStyle,
            }}
          />
        </div>
      )}

      <Space.Compact style={{ width: "100%" }}>
        <Input
          value={value}
          placeholder="Image URL"
          onChange={handleInputChange}
          style={{
            ...defaultInputStyle,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          }}
        />
        <Tooltip title="Sync Images">
          <Button
            icon={<SyncOutlined />}
            onClick={syncFiles}
            loading={loading}
            style={{
              ...defaultSyncButtonStyle,
              borderRadius: 0,
              borderLeft: "none",
            }}
          />
        </Tooltip>
        <Tooltip title="Choose Image">
          <Button
            icon={<PictureOutlined />}
            onClick={handleOpenModal}
            style={{
              ...defaultChooseImageButtonStyle,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              borderTopRightRadius: 8,
              borderBottomRightRadius: 8,
              borderLeft: "none",
            }}
          />
        </Tooltip>
      </Space.Compact>
    </div>
  );
};

export default ImageSelector;
