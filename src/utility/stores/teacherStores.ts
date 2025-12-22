import { create } from "zustand";
import teacherAPI from "@/infra/api/teacher/teacherAPI";
import { ITeacherResponseData } from "@/domain/interfaces/ITeacher";
import { handleApiErrorAuth } from "../lib/errorHandler";
import { IApiError } from "../lib/IError";
import { storage } from "../lib/storage";

interface TeacherState {
  // State - Lưu data từ response
  teacher: ITeacherResponseData | null;
  isLoading: boolean;
  error: IApiError | null;

  // Actions
  getProfileTeacher: () => Promise<void>;
  setTeacher: (teacher: ITeacherResponseData) => void;
  clearTeacher: () => void;
  clearError: () => void;
}

export const useTeacherStore = create<TeacherState>()((set) => ({
  // Initial State
  teacher: null,
  isLoading: false,
  error: null,

  /**
   * 🔹 Lấy thông tin profile của teacher
   */
  getProfileTeacher: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await teacherAPI.getProfileTeacher();

      // ✅ Destructure để TypeScript hiểu rõ hơn

      set({
        teacher: response.data || null,
        isLoading: false,
      });

      storage.set("profile_teacher", response.data);
    } catch (error) {
      const apiError = handleApiErrorAuth(error);

      set({
        error: apiError,
        isLoading: false,
        teacher: null,
      });
    }
  },

  /**
   * 🔹 Set teacher trực tiếp
   */
  setTeacher: (teacher: ITeacherResponseData) => {
    set({ teacher });
    storage.set("profile_teacher", teacher);
  },

  /**
   * 🔹 Clear thông tin teacher
   */
  clearTeacher: () => {
    set({ teacher: null, error: null });
    storage.remove("profile_teacher");
  },

  /**
   * 🔹 Clear error
   */
  clearError: () => {
    set({ error: null });
  },
}));
