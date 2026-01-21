"use client";
import React from "react";
import { theme } from "antd";
import FieldTitle from "../../Fields/extra/FieldTitle";

type JsonFlatCardProps = {
  label?: string | null;
  guide?: string | null;
  children: React.ReactNode;
  extra?: React.ReactNode;
  style?: React.CSSProperties;

  // ✅ new: lets parent hide the body entirely (header-only layout)
  hasBody?: boolean;
};

const JsonFlatCard: React.FC<JsonFlatCardProps> = ({
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
    <div
      style={{
        padding: "12px",
        marginBottom: "16px",
        border: `2px dashed ${token.colorBorder}`,
        borderRadius: "10px",
        backgroundColor: token.colorBgContainer,
        display: "flex",
        flexDirection: "column",
        gap: showHeader && showBody ? "8px" : 0,
        ...style,
      }}
    >
      {showHeader && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <FieldTitle label={label} guide={guide} />
          {extra && <div>{extra}</div>}
        </div>
      )}

      {showBody ? children : null}
    </div>
  );
};

export default JsonFlatCard;
