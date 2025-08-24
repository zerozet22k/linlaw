"use client";
import React, { CSSProperties } from "react";
import { Button, Card, theme } from "antd";
import { PlusOutlined } from "@ant-design/icons";

type ArrayParentCardProps = {
  label: string;
  children: React.ReactNode;
  onAdd: () => void;
  showAddButton?: boolean;
  style?: CSSProperties;
};

const ArrayParentCard: React.FC<ArrayParentCardProps> = ({
  label,
  children,
  onAdd,
  showAddButton = true,
  style = {},
}) => {
  const { token } = theme.useToken();

  return (
    <Card
      title={label}
      extra={
        showAddButton && (
          <Button type="dashed" icon={<PlusOutlined />} onClick={onAdd}>
            Add New Block
          </Button>
        )
      }
      style={{
        borderLeft: `4px solid ${token.colorPrimary}`,
        padding: "16px",
        borderRadius: "10px",
        marginBottom: "20px",
        ...style,
      }}
    >
      {children}
    </Card>
  );
};

export default ArrayParentCard;
