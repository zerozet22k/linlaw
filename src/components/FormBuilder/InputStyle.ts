import { CSSProperties } from "react";

// Common dimensions
const commonHeight = "40px";
const commonBorderRadius = "8px";
const commonFontSize = "14px";
const commonPadding = "8px 12px";

// Base styles
export const baseInputStyle: CSSProperties = {
  width: "100%",
  minHeight: commonHeight,
  height: commonHeight,
  padding: commonPadding,
  borderRadius: commonBorderRadius,
  fontSize: commonFontSize,
};

// Wrapper styles
export const defaultWrapperStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  width: "100%",
  minHeight: commonHeight,
};

export const flexColumnStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

// Input styles
export const defaultInputStyle: CSSProperties = {
  ...baseInputStyle,
};

// Select styles
export const defaultSelectStyle: CSSProperties = {
  ...baseInputStyle,
  minHeight: commonHeight,
  height: "auto",
  display: "flex",
  alignItems: "center",
  flex: "1 1 0%",
  padding: 0,
  lineHeight: commonHeight,
};

// Card styles
export const defaultCardStyle: CSSProperties = {
  borderRadius: commonBorderRadius,
  marginBottom: "16px",
  border: "1px solid #ccc",
};

export const defaultCardStyles = {
  body: {
    padding: 0,
    border: "none",
  },
};

// Button styles
export const defaultSyncButtonStyle: CSSProperties = {
  backgroundColor: "#1890ff",
  color: "#fff",
  border: "none",
  borderRadius: "0",
  minHeight: commonHeight,
  height: commonHeight,
};

export const defaultChooseImageButtonStyle: CSSProperties = {
  backgroundColor: "#52c41a",
  color: "#fff",
  border: "none",
  borderRadius: "0",
  minHeight: commonHeight,
  height: commonHeight,
};

// Tooltip styles
export const defaultTooltipStyle: CSSProperties = {
  fontSize: "12px",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  width: "20px",
  height: "20px",
  justifyContent: "center",
  marginLeft: "8px",
};

// Language input styles
export const languageInputWrapperStyle: CSSProperties = {
  padding: "20px",
  marginBottom: "16px",
  border: "2px dashed #ccc",
  borderRadius: commonBorderRadius,
  backgroundColor: "#fafafa",
  boxShadow: "0 1px 5px rgba(0,0,0,0.04)",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

export const languageInputStyle: CSSProperties = {
  ...baseInputStyle,
  resize: "vertical",
};

// Preview styles
export const previewImageStyle: CSSProperties = {
  display: "block",
  maxWidth: "100%",
  maxHeight: "200px",
  padding: "4px",
  borderRadius: commonBorderRadius,
  border: "1px solid #ccc",
  objectFit: "contain",
};

// Tag styles
export const defaultTagStyle: CSSProperties = {
  cursor: "grab",
  padding: "6px",
  fontSize: commonFontSize,
};
