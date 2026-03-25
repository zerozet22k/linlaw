"use client";

import React from "react";

import LoaderShell, { type LoaderVariant } from "./LoaderShell";

interface SubLoaderProps {
  tip?: string;
  minHeight?: string | number;
  backgroundColor?: string;
  size?: "small" | "default" | "large";
  variant?: LoaderVariant;
}

const SubLoader: React.FC<SubLoaderProps> = ({
  tip = "Loading...",
  minHeight = "80vh",
  backgroundColor = "transparent",
  size = "large",
  variant = "section",
}) => {
  return (
    <LoaderShell
      message={tip}
      minHeight={minHeight}
      backgroundColor={backgroundColor}
      size={size}
      variant={variant}
    />
  );
};

export default SubLoader;
