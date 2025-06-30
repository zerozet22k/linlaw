"use client";

import React from "react";
import AppProvider from "@/providers/AppProvider";
import CustomConfigProvider from "@/providers/CustomConfigProvider";

interface LayoutContentProps {
  children: React.ReactNode;
}

const LayoutContent: React.FC<LayoutContentProps> = ({ children }) => {
  return (
    <CustomConfigProvider>
      <AppProvider>{children}</AppProvider>
    </CustomConfigProvider>
  );
};

export default LayoutContent;
