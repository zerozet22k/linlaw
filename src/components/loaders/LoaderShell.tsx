"use client";

import React from "react";
import { Spin, theme } from "antd";

import styles from "./LoaderShell.module.css";

export type LoaderVariant = "page" | "section" | "inline" | "compact";

interface LoaderShellProps {
  message?: string;
  minHeight?: string | number;
  backgroundColor?: string;
  size?: "small" | "default" | "large";
  variant?: LoaderVariant;
}

function toCssLength(value?: string | number) {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

const LoaderShell: React.FC<LoaderShellProps> = ({
  message,
  minHeight,
  backgroundColor,
  size = "large",
  variant = "section",
}) => {
  const { token } = theme.useToken();
  const shellClassName = [styles.shell, styles[variant]].join(" ");
  const resolvedBackgroundColor = backgroundColor ?? (variant === "page" ? token.colorBgLayout : undefined);
  const shellStyle = {
    ...(resolvedBackgroundColor ? { backgroundColor: resolvedBackgroundColor } : null),
    ...(minHeight !== undefined ? { minHeight: toCssLength(minHeight) } : null),
    "--loader-text": token.colorTextSecondary,
  } as React.CSSProperties;

  return (
    <div className={shellClassName} style={shellStyle}>
      <div className={styles.panel}>
        <Spin size={size} />
        {message ? <div className={styles.message}>{message}</div> : null}
      </div>
    </div>
  );
};

export default LoaderShell;