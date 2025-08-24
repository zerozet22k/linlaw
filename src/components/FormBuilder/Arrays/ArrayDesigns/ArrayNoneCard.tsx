"use client";
import React, { CSSProperties } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

type ArrayNoneCardProps = {
  children: React.ReactNode;
  onAdd: () => void;
  showAddButton?: boolean;
  style?: CSSProperties;
  addButtonText?: string;
};

const ArrayNoneCard: React.FC<ArrayNoneCardProps> = ({
  children,
  onAdd,
  showAddButton = true,
  style = {},
  addButtonText = "Add New Block",
}) => {
  return (
    <div style={{ padding: 12, ...style }}>
      {showAddButton && (
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={onAdd}
          style={{ width: "100%", marginBottom: 12 }}
        >
          {addButtonText}
        </Button>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {children}
      </div>
    </div>
  );
};

export default ArrayNoneCard;
