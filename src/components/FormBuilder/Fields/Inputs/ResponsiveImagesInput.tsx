"use client";
import React, { CSSProperties } from "react";
import { Typography, theme } from "antd";
import { lighten, darken } from "polished";

import ImageSelector from "./ImageSelector";

interface ResponsiveImagesValue {
  desktop?: string;
  tablet?: string;
  mobile?: string;
}

interface ResponsiveImagesInputProps {
  value?: ResponsiveImagesValue;
  onChange?: (value: ResponsiveImagesValue) => void;
  style?: CSSProperties;
}

const ResponsiveImagesInput: React.FC<ResponsiveImagesInputProps> = ({
  value = {},
  onChange,
  style,
}) => {
  const { token } = theme.useToken();

  const baseColor = token.colorBgContainer;
  const lightShade = lighten(0.05, baseColor);
  const darkShade = darken(0.1, baseColor);

  const handleChange = (key: keyof ResponsiveImagesValue, url: string) => {
    onChange?.({
      ...value,
      [key]: url,
    });
  };

  const desktopPreviewContainerStyle: CSSProperties = {
    textAlign: "left",
  };

  const desktopPreviewImageStyle: CSSProperties = {
    width: "160px",
    height: "90px",
    objectFit: "cover",
  };

  const tabletPreviewContainerStyle: CSSProperties = {
    textAlign: "center",
  };
  const tabletPreviewImageStyle: CSSProperties = {
    width: "120px",
    height: "80px",
    objectFit: "cover",
  };

  const mobilePreviewContainerStyle: CSSProperties = {
    textAlign: "center",
  };
  const mobilePreviewImageStyle: CSSProperties = {
    width: "80px",
    height: "100px",
    objectFit: "cover",
  };

  return (
    <div
      style={{
        padding: "12px",
        marginBottom: "16px",
        border: `2px dashed ${darkShade}`,
        borderRadius: "10px",
        backgroundColor: lightShade,
        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        ...style,
      }}
    >
      <Typography.Text strong>Desktop Image</Typography.Text>
      <ImageSelector
        value={value.desktop || ""}
        onChange={(url) => handleChange("desktop", url)}
        preview={true}
        previewContainerStyle={desktopPreviewContainerStyle}
        previewImageStyle={desktopPreviewImageStyle}
      />

      <Typography.Text strong>Tablet Image</Typography.Text>
      <ImageSelector
        value={value.tablet || ""}
        onChange={(url) => handleChange("tablet", url)}
        preview={true}
        previewContainerStyle={tabletPreviewContainerStyle}
        previewImageStyle={tabletPreviewImageStyle}
      />

      <Typography.Text strong>Mobile Image</Typography.Text>
      <ImageSelector
        value={value.mobile || ""}
        onChange={(url) => handleChange("mobile", url)}
        preview={true}
        previewContainerStyle={mobilePreviewContainerStyle}
        previewImageStyle={mobilePreviewImageStyle}
      />
    </div>
  );
};

export default ResponsiveImagesInput;
