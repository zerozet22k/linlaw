"use client";
import React from "react";

type JsonNoneCardProps = {
  children: React.ReactNode;
};

const JsonNoneCard: React.FC<JsonNoneCardProps> = ({
  children,
}) => {

  return (
    <div style={{ padding: "12px", }}>
      {children}
    </div>
  );
};

export default JsonNoneCard;
