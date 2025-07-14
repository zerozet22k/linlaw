/*  components/sections/SectionWrapper.tsx  */
"use client";

import React from "react";

type SectionWrapperProps = {
  children: React.ReactNode;
  index: number;
  id?: string;
};

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  index,
  id,
}) => {
  if (!children) return null;

  const background = index % 2 === 0 ? "#ffffff" : "#f5f5f5";

  return (
    <section
      id={id}
      style={{
        backgroundColor: background,
        width: "100%",
        padding: "60px 20px",
      }}
    >
      {children}
    </section>
  );
};

export default SectionWrapper;
