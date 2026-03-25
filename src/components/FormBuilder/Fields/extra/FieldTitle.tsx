"use client";
import React from "react";
import { Typography, Tooltip } from "antd";

type FieldTitleProps = {
  label?: string | null;
  guide?: string | null;
  style?: React.CSSProperties;
  level?: 3 | 5 | 1 | 2 | 4 | undefined;
};

const FieldTitle: React.FC<FieldTitleProps> = ({
  label,
  guide,
  style = {},
  level = 4,
}) => {
  return (
    <div
      className="formbuilder-field-title"
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        columnGap: 10,
        rowGap: 4,
        minWidth: 0,
        ...style,
      }}
    >
      {label && (
        <Typography.Title
          level={level}
          style={{
            fontWeight: 500,
            marginTop: 0,
            marginBottom: 0,
            minWidth: 0,
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
        >
          {label}
        </Typography.Title>
      )}
      {guide && (
        <Tooltip title={guide}>
          <Typography.Text
            style={{
              marginLeft: 0,
              cursor: "pointer",
              fontWeight: 600,
              flex: "0 0 auto",
            }}
          >
            ℹ️
          </Typography.Text>
        </Tooltip>
      )}
    </div>
  );
};

export default FieldTitle;
