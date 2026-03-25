"use client";

import React, { FC } from "react";

import LoaderShell from "./LoaderShell";

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({ message = "" }) => {
  return <LoaderShell message={message} variant="page" size="large" minHeight="100dvh" />;
};

export default LoadingSpinner;
