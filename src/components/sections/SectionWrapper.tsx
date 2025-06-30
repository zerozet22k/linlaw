// components/layout/SectionWrapper.tsx

"use client";

import React from "react";

type SectionWrapperProps = {
  children: React.ReactNode;
  index: number;
};

const SectionWrapper: React.FC<SectionWrapperProps> = ({ children, index }) => {
  const backgroundColor = index % 2 === 0 ? "#ffffff" : "#f5f5f5";

  return (
    <div
      style={{
        backgroundColor,
        width: "100%",
        padding: "60px 20px",
      }}
    >
      {children}
    </div>
  );
};

export default SectionWrapper;
