// utility/stores/studentStore.ts
import { create } from "zustand";
import StudentAPI from "@/infra/api/StudentAPI";
import {  IStudentResponseData } from "@/domain/interfaces/IStudent";
import {  handleApiErrorAuth } from "../lib/errorHandler";
import { IApiError } from "../lib/IError";
import { storage } from "../lib/storage";

interface StudentState {
  // State
  student: IStudentResponseData | null;
  isLoading: boolean;
  error: IApiError | null;

  // Actions
  getProfileStudent: () => Promise<void>;
  setStudent: (student: IStudentResponseData) => void;
  clearStudent: () => void;
  clearErrorStuProfile: () => void;
}

export const useStudentStore = create<StudentState>()((set) => ({
  // Initial State
  student: null,
  isLoading: false,
  error: null,

  /**
   * 🔹 Lấy thông tin profile của student
   */
  getProfileStudent: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await StudentAPI.getProfileStudent();

      set({
        student: response.data || null,
        isLoading: false,
      });
      
      // Lưu vào localStorage
      storage.set("profile_student", response.data);

      // toast.success("Tải thông tin học sinh thành công!");
    } catch (error) {
      const apiError = handleApiErrorAuth(error);

      set({
        error: apiError,
        isLoading: false,
        student: null,
      });
    }
  },

  /**
   * 🔹 Set student trực tiếp
   */
  setStudent: (student: IStudentResponseData) => {
    set({ student });
    storage.set("profile_student", student);
  },

  /**
   * 🔹 Clear thông tin student
   */
  clearStudent: () => {
    set({ student: null, error: null });
    storage.remove("profile_student");
  },

  /**
   * 🔹 Clear error
   */
  clearErrorStuProfile: () => {
    set({ error: null });
  },
}));