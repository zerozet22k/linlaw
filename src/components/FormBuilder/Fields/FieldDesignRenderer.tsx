"use client";

import React from "react";
import { Typography, Tooltip, theme } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

import FieldParentCard from "./FieldDesigns/FieldParentCard";
import FieldDefaultCard from "./FieldDesigns/FieldDefaultCard";
import FieldRow from "./FieldDesigns/FieldRow";
import { FieldDesign, RenderSurface } from "@/config/CMS/settings";

type FieldDesignRendererProps = {
  design: FieldDesign;
  label?: string;
  guide?: string;
  renderItem: () => React.ReactNode;
  extra?: React.ReactNode;
  style?: React.CSSProperties;
  surface?: RenderSurface;
};

const FieldDesignRenderer: React.FC<FieldDesignRendererProps> = ({
  design,
  label,
  guide,
  renderItem,
  extra,
  style = {},
  surface = "body",
}) => {
  const { token } = theme.useToken();

  if (surface === "header") {
    return (
      <div
        style={{

          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          lineHeight: 1,
          ...style,
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center" }}>
          {renderItem?.()}
        </div>

        {extra ? (
          <div style={{ display: "inline-flex", alignItems: "center" }}>
            {extra}
          </div>
        ) : null}
      </div>
    );
  }

  switch (design) {
    case FieldDesign.PARENT:
      return (
        <FieldParentCard label={label} guide={guide} extra={extra} style={style}>
          {renderItem?.()}
        </FieldParentCard>
      );

    case FieldDesign.CARD:
      return (
        <FieldDefaultCard label={label} guide={guide} extra={extra} style={style}>
          {renderItem?.()}
        </FieldDefaultCard>
      );

    case FieldDesign.NONE:
      return <>{renderItem?.()}</>;

    case FieldDesign.ROW:
    default:
      return (
        <FieldRow label={label} guide={guide} style={style}>
          {renderItem?.()}
        </FieldRow>
      );
  }
};

export default FieldDesignRenderer;
