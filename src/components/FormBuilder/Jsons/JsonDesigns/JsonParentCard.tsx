"use client";
import React from "react";
import { Card, theme } from "antd";
import { darken } from "polished";
import FieldTitle from "../../Fields/extra/FieldTitle";
import { hasRenderableChildren } from "@/utils/hasRenderableChildren";

type JsonParentCardProps = {
  label?: string | null;
  guide?: string | null;
  children: React.ReactNode;
  extra?: React.ReactNode;
  style?: React.CSSProperties;

  // explicit override
  hasBody?: boolean;
};

const JsonParentCard: React.FC<JsonParentCardProps> = ({
  label,
  guide,
  children,
  extra,
  style = {},
  hasBody,
}) => {
  const { token } = theme.useToken();

  const bodyExists = hasBody ?? hasRenderableChildren(children);

  return (
    <Card
      title={<FieldTitle label={label} guide={guide} />}
      extra={extra}
      styles={{
        header: bodyExists
          ? undefined
          : {
              borderBottom: 0,
            },
        body: bodyExists
          ? undefined
          : {
              display: "none",
              padding: 0,
            },
      }}
      style={{
        borderRadius: "12px",
        padding: "16px",
        borderLeft: `4px solid ${token.colorPrimary}`,
        boxShadow: `0 4px 12px ${darken(0.1, token.colorBgContainer)}`,
        backgroundColor: token.colorBgContainer,
        marginBottom: "20px",
        ...style,
      }}
    >
      {bodyExists ? children : null}
    </Card>
  );
};

export default JsonParentCard;
