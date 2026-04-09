"use client";
import React, { useState, useCallback, useEffect, useMemo, ReactNode } from "react";
import useSWR from "swr";
import { message } from "antd";
import apiClient, { saveTokens, clearTokens } from "@/utils/api/apiClient";
import UserContext from "@/contexts/UserContext";
import { UserAPI } from "@/models/UserModel";
import {
  SESSION_HINT_COOKIE,
  SESSION_HINT_COOKIE_VALUE,
} from "@/utils/auth/sessionHint";

const getAccessTokenExpiry = () => {
  const raw = localStorage.getItem("accessTokenExpiry");
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;
  return Number.isFinite(parsed) ? parsed : null;
};

const hasValidAccessToken = () => {
  const accessToken = localStorage.getItem("accessToken");
  const expiry = getAccessTokenExpiry();
  return !!accessToken && !!expiry && expiry > Date.now();
};

const hasSessionHintCookie = () =>
  document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .some((cookie) => cookie === `${SESSION_HINT_COOKIE}=${SESSION_HINT_COOKIE_VALUE}`);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAPI | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasShownLogoutMessage, setHasShownLogoutMessage] = useState(false);

  
  const [tokenVersion, setTokenVersion] = useState(0);

  
  const [authBooted, setAuthBooted] = useState(false);

  const getBrowserName = useCallback(() => {
    const userAgent = navigator.userAgent || "Unknown Device";
    let browserName = "Unknown Device";

    if (
      userAgent.includes("Chrome") &&
      userAgent.includes("Safari") &&
      !userAgent.includes("Edge") &&
      !userAgent.includes("OPR")
    ) browserName = "Chrome";
    else if (userAgent.includes("Edg")) browserName = "Edge";
    else if (userAgent.includes("OPR")) browserName = "Opera";
    else if (userAgent.includes("Firefox")) browserName = "Firefox";
    else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) browserName = "Safari";

    localStorage.setItem("deviceName", browserName);
    return browserName;
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("deviceName")) getBrowserName();
  }, [getBrowserName]);

  const fetcher = useCallback(async (url: string) => {
    try {
      const res = await apiClient.get(url);
      return res.data;
    } catch (error: any) {
      if (!error.response || error.response.status !== 401) {
        console.error("Error fetching user data:", error);
      }
      return null;
    }
  }, []);

  
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (hasValidAccessToken()) return;

        if (!hasSessionHintCookie()) {
          clearTokens();
          return;
        }

        let deviceName = localStorage.getItem("deviceName");
        if (!deviceName) deviceName = getBrowserName();

        const { data } = await apiClient.post("/auth/refresh", { deviceName });
        
        saveTokens(data.accessToken, data.accessTokenExpiry);

        if (!cancelled) setTokenVersion((v) => v + 1);
      } catch {
        clearTokens();
        if (!cancelled) setTokenVersion((v) => v + 1);
      } finally {
        if (!cancelled) setAuthBooted(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [getBrowserName]);

  
  const swrKey = useMemo(() => {
    if (!authBooted) return null;
    return hasValidAccessToken() ? ["/me", tokenVersion] : null;
  }, [authBooted, tokenVersion]);

  const { data, mutate, isValidating } = useSWR<UserAPI>(swrKey, ([url]) => fetcher(url), {
    refreshInterval: 0,
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    dedupingInterval: 30000,
  });

  
  useEffect(() => {
    setUser(data || null);

    
    if (authBooted && initialLoading && !isValidating) {
      setInitialLoading(false);
    }
  }, [data, isValidating, authBooted, initialLoading]);

  const handleError = useCallback((error: any, defaultMessage: string) => {
    console.error(error);
    const errorMessage = error?.response?.data?.message || defaultMessage;
    message.error(errorMessage);
  }, []);

  const refreshUser = useCallback(() => {
    mutate();
  }, [mutate]);

  const awaitRefreshUser = useCallback(async () => {
    try {
      await mutate();
    } catch (error) {
      handleError(error, "Failed to refresh user data.");
    }
  }, [mutate, handleError]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        let deviceName = localStorage.getItem("deviceName");
        if (!deviceName) deviceName = getBrowserName();

        const { data } = await apiClient.post("/auth/login", { email, password, deviceName });
        saveTokens(data.accessToken, data.accessTokenExpiry);

        setHasShownLogoutMessage(false);
        setAuthBooted(true);
        setTokenVersion((v) => v + 1);

        await mutate();
        message.success("Login successful!");
      } catch (error) {
        handleError(error, "Invalid email or password.");
        throw error;
      }
    },
    [mutate, handleError, getBrowserName]
  );

  const signUp = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        let deviceName = localStorage.getItem("deviceName");
        if (!deviceName) deviceName = getBrowserName();

        const { data } = await apiClient.post("/auth/signup", { username, email, password, deviceName });
        saveTokens(data.accessToken, data.accessTokenExpiry);

        setHasShownLogoutMessage(false);
        setAuthBooted(true);
        setTokenVersion((v) => v + 1);

        await mutate();
        message.success("Signup successful!");
      } catch (error) {
        handleError(error, "Signup failed. Please try again.");
        throw error;
      }
    },
    [mutate, handleError, getBrowserName]
  );

  const logout = useCallback(
    async (infoMessage?: string | React.SyntheticEvent) => {
      const finalMessage = typeof infoMessage === "string" ? infoMessage : "Logging out";
      try {
        const deviceName = localStorage.getItem("deviceName");

        if (!hasShownLogoutMessage) {
          message.info(finalMessage);
          setHasShownLogoutMessage(true);
        }

        const logoutPromise = deviceName ? apiClient.post("/auth/logout", { deviceName }) : Promise.resolve();

        clearTokens();
        setUser(null);
        setTokenVersion((v) => v + 1);

        mutate(undefined, false);
        await logoutPromise;

        localStorage.removeItem("deviceName");
      } catch (error) {
        console.error("Unexpected error during logout:", error);
        message.error("Logout failed!");
      }
    },
    [mutate, hasShownLogoutMessage]
  );

  
  useEffect(() => {
    const handleStorageChange = () => {
      setTokenVersion((v) => v + 1);
      mutate();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [mutate]);

  
  const loading = initialLoading;
  const refreshing = !initialLoading && isValidating;

  const value = useMemo(
    () => ({
      user,
      initialLoading,
      loading,
      refreshing, 
      refreshUser,
      awaitRefreshUser,
      signIn,
      signUp,
      logout,
    }),
    [user, initialLoading, loading, refreshing, refreshUser, awaitRefreshUser, signIn, signUp, logout]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
