import { useState, useEffect, useCallback } from "react";
import apiClient from "@/utils/api/apiClient";
import { useUser } from "@/hooks/useUser";

export const useFirebaseConfig = () => {
  const { user, initialLoading: userInitialLoading } = useUser();
  const [firebaseLoading, setFirebaseLoading] = useState(true);
  const [firebaseReady, setFirebaseReady] = useState(false);

  const fetchFirebaseConfig = useCallback(async () => {
    if (!user) {
      setFirebaseLoading(false);
      setFirebaseReady(false);
      return;
    }

    try {
      setFirebaseLoading(true);
      const response = await apiClient.get("/firebase/status");
      setFirebaseReady(!!response.data?.ready);
    } catch (error) {
      console.error("Error fetching Firebase settings:", error);
      setFirebaseReady(false);
    } finally {
      setFirebaseLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!userInitialLoading) {
      void fetchFirebaseConfig();
    }
  }, [fetchFirebaseConfig, userInitialLoading]);

  const checkFirebaseConfig = useCallback(async () => {
    await fetchFirebaseConfig();
  }, [fetchFirebaseConfig]);

  return {
    firebaseLoading,
    firebaseReady,
    fetchFirebaseConfig,
    checkFirebaseConfig,
  };
};
