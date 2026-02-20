import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retryAttempt?: number;
}

const MAX_RETRIES = 3;

const saveTokens = (accessToken: string, accessTokenExpiry: number) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("accessTokenExpiry", String(accessTokenExpiry));
};

const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("accessTokenExpiry");
  localStorage.removeItem("deviceName");
};

const isAccessTokenExpired = (): boolean => {
  const exp = localStorage.getItem("accessTokenExpiry");
  const expMs = exp ? parseInt(exp, 10) : null;
  return expMs !== null && expMs < Date.now();
};

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && !isAccessTokenExpired()) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    const deviceName = localStorage.getItem("deviceName");
    if (deviceName) {
      config.headers["Device-Name"] = deviceName;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    const url = originalRequest?.url ?? "";
    if (url.includes("/auth/refresh")) {
      clearTokens();
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      (originalRequest._retryAttempt || 0) < MAX_RETRIES
    ) {
      originalRequest._retryAttempt = (originalRequest._retryAttempt || 0) + 1;

      const deviceName = localStorage.getItem("deviceName");
      if (!deviceName) {
        clearTokens();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${NEXT_PUBLIC_API_URL}/auth/refresh`,
          { deviceName },
          { withCredentials: true }
        );

        saveTokens(data.accessToken, data.accessTokenExpiry);

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${data.accessToken}`,
        };

        return apiClient(originalRequest);
      } catch (refreshErr) {
        clearTokens();
        return Promise.reject(refreshErr);
      }
    }

    if ((originalRequest._retryAttempt || 0) >= MAX_RETRIES) {
      clearTokens();
    }

    return Promise.reject(error);
  }
);

export { saveTokens, clearTokens };
export default apiClient;
