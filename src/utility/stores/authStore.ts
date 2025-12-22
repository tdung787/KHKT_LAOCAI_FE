// Cập nhật authStore - thêm setUser action
import { create } from "zustand";
import AuthRepository from "@/infra/AuthRepository";
import { ILoginRequest } from "@domain/interfaces/IAuth";
import { storage } from "@/utility/lib/storage";
import toast from "react-hot-toast";
import { IUser } from "@/domain/interfaces/IUser";
import {  handleApiErrorAuth } from "../lib/errorHandler";
import { IApiError } from "../lib/IError";

interface AuthState {
  // State
  user: IUser | null;
  isLoading: boolean;
  error: IApiError | null;
  isAuthenticated: boolean;

  // Actions
  login: (credentials: ILoginRequest) => Promise<void>;
  logout: () => void;
  setUser: (user: IUser) => void;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  // Initial state
  user: null,
  isLoading: true, // Bắt đầu với loading = true
  error: null,
  isAuthenticated: false,

  // Initialize auth from storage
  initializeAuth: () => {
    const storedUser = storage.getUser<IUser>();
    const token = storage.getToken();

    if (storedUser && token) {
      set({
        user: storedUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      set({ isLoading: false });
    }
  },

  // Login
  login: async (credentials: ILoginRequest) => {
    try {
      set({ isLoading: true, error: null });

      const response = await AuthRepository.login(credentials);

      // Save to localStorage
      storage.setToken(response.data.accessToken);
      storage.setUser(response.data.user);

      // Update state
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      toast.success("Đăng nhập thành công!");
    } catch (error) {
      const apiError = handleApiErrorAuth(error);

      set({
        isLoading: false,
        error: apiError,
        isAuthenticated: false,
      });
    }
  },

  // Logout
  logout: () => {
    storage.clearAuth();
    storage.remove("profile_teacher");
    storage.remove("profile_student");
    storage.remove("profile_admin");
    storage.remove("auth-storage");
    storage.remove("student_profile_created");
    storage.remove("teacher_profile_created");
   
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
    toast.success("Đã đăng xuất!");
  },

  // Set user manually
  setUser: (user: IUser) => {
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  // Set loading
  setLoading: (loading: boolean) => set({ isLoading: loading }),

  // Clear error
  clearError: () => set({ error: null }),
}));
