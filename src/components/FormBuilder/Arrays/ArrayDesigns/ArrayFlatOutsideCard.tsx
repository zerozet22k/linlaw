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
        padding: "12px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <Typography.Title level={5} style={{ margin: 0 }}>
          {label}
        </Typography.Title>

        {showAddButton && (
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={onAdd}
            size="small"
          >
            Add New Block
          </Button>
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
