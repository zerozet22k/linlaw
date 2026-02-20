import React from "react";
import { Spin } from "antd";

interface SubLoaderProps {
  tip?: string;
  minHeight?: string | number;
  backgroundColor?: string;
}

const SubLoader: React.FC<SubLoaderProps> = ({
  tip = "Loading...",
  minHeight = "80vh",
  backgroundColor = "transparent",
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: minHeight,
        backgroundColor: backgroundColor,
        width: "100%", 
      }}
    >
      <Spin size="large" tip={tip}>
        <div style={{ padding: '50px' }} />
      </Spin>
    </div>
  );
};

export default SubLoader;
