"use client";
import React, { CSSProperties } from "react";
import { Button, Typography, theme } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { lighten } from "polished";

type ArrayFlatOutsideCardProps = {
  label: string;
  children: React.ReactNode;
  onAdd: () => void;
  showAddButton?: boolean;
  style?: CSSProperties;
};

const ArrayFlatOutsideCard: React.FC<ArrayFlatOutsideCardProps> = ({
  label,
  children,
  onAdd,
  showAddButton = true,
  style = {},
}) => {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        marginBottom: "16px",
      }}
    >
      <div
        className="formbuilder-flat-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: "8px",
        }}
      >
        <Typography.Title
          level={5}
          style={{
            margin: 0,
            minWidth: 0,
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
        >
          {label}
        </Typography.Title>

        {showAddButton && (
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
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={onAdd}
              size="small"
            >
              Add New Block
            </Button>
          </div>
        )}
      </div>

      <div
        style={{
          padding: "12px",
          border: `2px dashed ${token.colorBorder}`,
          borderRadius: "10px",
          backgroundColor: lighten(0.05, token.colorBgContainer),
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ArrayFlatOutsideCard;
