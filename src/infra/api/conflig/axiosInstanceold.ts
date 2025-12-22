// infra/api/conflig/axiosInstance.ts
import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { storage } from "@/utility/lib/storage";
import { useSessionStore } from "../sessionStore";

// Base URL from environment or default
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// ✅ Create axios instance with credentials
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  withCredentials: true, // ✅ IMPORTANT: Send cookies with requests
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get access token from storage (NOT refresh token)
    const token = storage.get<string>("auth_token", "");

    // Add Authorization header if token exists
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log("📤 API Request:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ✅ Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (import.meta.env.DEV) {
      console.log("📥 API Response:", {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      // ✅ Prevent retry for refresh endpoint itself
      if (originalRequest.url?.includes("/public/auth/refresh")) {
        // Refresh token cũng hết hạn → Show dialog
        storage.clearAuth();
        storage.remove("profile_teacher");
        storage.remove("profile_student");
        storage.remove("profile_admin");
        storage.remove("auth-storage");

        // const { showSessionExpiredDialog } = useSessionStore.getState();
        // showSessionExpiredDialog();

        return Promise.reject(error);
      }

      // ✅ If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // ✅ Call refresh endpoint - NO BODY needed (cookie sent automatically)
        const response = await axios.post(
          `${BASE_URL}/public/auth/refresh`,
          {}, // Empty body
          {
            withCredentials: true, // ✅ Send cookies
          }
        );

        const { accessToken } = response.data.data;

        // ✅ Save new access token
        storage.set("auth_token", accessToken);

        // ✅ Update original request header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        // ✅ Process queued requests
        processQueue(null, accessToken);

        // ✅ Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("🔒 Refresh token failed:", refreshError);

        // ✅ Process queued requests with error
        processQueue(refreshError as AxiosError, null);

        // ✅ Clear all auth data
        storage.clearAuth();
        storage.remove("profile_teacher");
        storage.remove("profile_student");
        storage.remove("profile_admin");
        storage.remove("auth-storage");

        // ✅ Show session expired dialog
        const { showSessionExpiredDialog } = useSessionStore.getState();
        showSessionExpiredDialog();

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      window.location.href = "/not-authorized";
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error("Server Error:", error.response.data);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;