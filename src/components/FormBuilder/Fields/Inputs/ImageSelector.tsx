"use client";
import React, { CSSProperties } from "react";
import { Button, Input, Tooltip, Space } from "antd";
import { PictureOutlined, SyncOutlined } from "@ant-design/icons";
import { useFile } from "@/hooks/useFile";

import {
  defaultInputStyle,
  defaultWrapperStyle,
  defaultSyncButtonStyle,
  defaultChooseImageButtonStyle,
} from "../../InputStyle";
import { FileType } from "@/models/FileModel";

interface ImageSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  style?: CSSProperties;
  zIndex?: number;
  /** Set to true to display a preview of the image. Defaults to false. */
  preview?: boolean;
  /** Optional custom style for the preview container */
  previewContainerStyle?: CSSProperties;
  /** Optional custom style for the preview image */
  previewImageStyle?: CSSProperties;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
  value = "",
  onChange,
  style = {},
  zIndex = 1000,
  preview = false,
  previewContainerStyle = {},
  previewImageStyle = {},
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

  const defaultPreviewContainerStyle: CSSProperties = {
    marginBottom: 0,
    marginTop: 0,
    textAlign: "left",
    marginLeft: 0,
  };

  const defaultPreviewImageStyle: CSSProperties = {
    display: "block",
    margin: 0,
    padding: "4px",
    marginBottom: "2px",
    maxWidth: "100%",
    maxHeight: 200,
    border: "2px dashed #ccc",
    borderRadius: 4,
  };

  return (
    <div
      style={{
        ...defaultWrapperStyle,
        ...style,
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
      }}
    >
      {preview && value && (
        <div
          style={{
            ...defaultPreviewContainerStyle,
            ...previewContainerStyle,
          }}
        >
          <img
            src={value}
            alt="Preview"
            style={{
              ...defaultPreviewImageStyle,
              ...previewImageStyle,
            }}
          />
        </div>
      )}

      <div style={{ width: "100%" }}>
        <Space.Compact style={{ width: "100%" }}>
          <Input
            value={value}
            placeholder="Image URL"
            onChange={handleInputChange}
            style={{ ...defaultInputStyle }}
          />
          <Tooltip title="Sync Images">
            <Button
              icon={<SyncOutlined />}
              onClick={syncFiles}
              loading={loading}
              style={{ ...defaultSyncButtonStyle }}
            />
          </Tooltip>
          <Tooltip title="Choose Image">
            <Button
              icon={<PictureOutlined />}
              onClick={handleOpenModal}
              style={{ ...defaultChooseImageButtonStyle }}
            />
          </Tooltip>
        </Space.Compact>
      </div>
    </div>
  );
};

export default ImageSelector;
