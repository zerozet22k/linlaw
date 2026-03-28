"use client";

import { useCallback, useEffect, useState } from "react";

import type {
  AdminAnalyticsSnapshot,
  AnalyticsRange,
} from "@/types/adminAnalytics";
import apiClient from "@/utils/api/apiClient";

export function useAdminAnalytics(range: AnalyticsRange = "30d") {
  const [data, setData] = useState<AdminAnalyticsSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<AdminAnalyticsSnapshot>(
        `/analytics?range=${range}`
      );
      setData(response.data);
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to load analytics.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    data,
    loading,
    error,
    reload: fetchAnalytics,
  };
}
