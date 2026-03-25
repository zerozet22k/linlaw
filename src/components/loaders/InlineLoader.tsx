import React from "react";
import { Empty, Alert } from "antd";

import LoaderShell from "./LoaderShell";

interface InlineLoaderProps {
  loading: boolean;
  error?: string | null;
  data: any[];
  emptyMessage?: string;
  loadingMessage?: string;
}

const InlineLoader: React.FC<InlineLoaderProps> = ({
  loading,
  error = null,
  data,
  emptyMessage = "No data available",
  loadingMessage = "Loading...",
}) => {
  if (loading) {
    return (
      <div style={{ width: "100%", maxWidth: 560, margin: "0 auto" }}>
        <LoaderShell message={loadingMessage} size="small" variant="inline" minHeight={96} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ width: "100%", maxWidth: 560, margin: "0 auto", padding: "20px 0" }}>
        <Alert title="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div style={{ width: "100%", maxWidth: 560, margin: "0 auto", padding: "20px 0", textAlign: "center" }}>
        <Empty description={emptyMessage} />
      </div>
    );
  }

  return null;
};

export default InlineLoader;
