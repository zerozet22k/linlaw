"use client";

import React, { FC } from "react";

import LoaderShell from "./LoaderShell";

interface LoadingSpinProps {
  message?: string;
}

const LoadingSpin: FC<LoadingSpinProps> = ({ message }) => {
  return <LoaderShell message={message} variant="page" size="large" minHeight="100dvh" />;
};

export default LoadingSpin;
