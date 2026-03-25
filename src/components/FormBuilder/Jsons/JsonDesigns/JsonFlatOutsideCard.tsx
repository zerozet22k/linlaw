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
          className="formbuilder-flat-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: showBody ? "8px" : 0,
          }}
        >
          {(label || guide) && (
            <FieldTitle
              label={label}
              guide={guide}
              style={{ flex: "1 1 240px", minWidth: 0 }}
            />
          )}
          {extra && (
            <div
              className="formbuilder-flat-header-extra"
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 8,
                minWidth: 0,
              }}
            >
              {extra}
            </div>
          )}
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
