"use client";
import React from "react";
import { Card, theme } from "antd";
import { darken } from "polished";
import FieldTitle from "../../Fields/extra/FieldTitle";

type JsonDefaultCardProps = {
  label?: string | null;
  guide?: string | null;
  children: React.ReactNode;
  extra?: React.ReactNode;
  style?: React.CSSProperties;

  // ✅ new
  hasBody?: boolean;
};

const JsonDefaultCard: React.FC<JsonDefaultCardProps> = ({
  label,
  guide,
  children,
  extra,
  style = {},
  hasBody,
}) => {
  const { token } = theme.useToken();
  const showBody = hasBody !== false;

  return (
    <Card
      title={<FieldTitle label={label} guide={guide} />}
      extra={extra}
      styles={{
        body: showBody
          ? undefined
          : {
              display: "none",
              padding: 0,
            },
        header: showBody
          ? undefined
          : {
              borderBottom: 0,
            },
      }}
      style={{
        borderRadius: "12px",
        padding: "16px",
        boxShadow: `0 4px 12px ${darken(0.1, token.colorBgContainer)}`,
        backgroundColor: token.colorBgContainer,
        marginBottom: "20px",
        ...style,
      }}
    >
      {showBody ? children : null}
    </Card>
  );
};

export default JsonDefaultCard;
