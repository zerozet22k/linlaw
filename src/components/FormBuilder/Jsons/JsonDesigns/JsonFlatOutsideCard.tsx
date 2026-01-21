"use client";
import React from "react";
import { theme } from "antd";
import FieldTitle from "../../Fields/extra/FieldTitle";

type JsonFlatOutsideCardProps = {
  label?: string | null;
  guide?: string | null;
  children: React.ReactNode;
  extra?: React.ReactNode;
  style?: React.CSSProperties;

  // ✅ new
  hasBody?: boolean;
};

const JsonFlatOutsideCard: React.FC<JsonFlatOutsideCardProps> = ({
  label,
  guide,
  children,
  extra,
  style = {},
  hasBody,
}) => {
  const { token } = theme.useToken();

  const showHeader = Boolean(label || guide || extra);
  const showBody = hasBody !== false;

  return (
    <div style={{ marginBottom: "16px", padding: "12px" }}>
      {showHeader && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: showBody ? "8px" : 0,
          }}
        >
          {label && <FieldTitle label={label} guide={guide} />}
          {extra && <div>{extra}</div>}
        </div>
      )}

      {showBody ? (
        <div
          style={{
            padding: "12px",
            border: `2px dashed ${token.colorBorder}`,
            borderRadius: "10px",
            backgroundColor: token.colorBgContainer,
            ...style,
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default JsonFlatOutsideCard;
