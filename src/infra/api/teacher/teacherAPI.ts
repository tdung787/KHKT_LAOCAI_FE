import axiosInstance from "../conflig/axiosInstanceold";
import { API_ENDPOINTS } from "../conflig/apiEndpoints";
import { IClassResponse } from "@/domain/interfaces/IClass";
import { ITeacherResponse,  } from "@/domain/interfaces/ITeacher";

class ClassAPI {
  /**
   * Lấy danh sách comments theo blogId
   */
  async getClassesByTeacher(teacherId: string): Promise<IClassResponse> {
    const response = await axiosInstance.get<IClassResponse>(
      API_ENDPOINTS.CLASSES.GETCLASSBYTEACCHER(teacherId)
    );
    return response.data;
  }

  async getProfileTeacher(): Promise<ITeacherResponse> {
    const response = await axiosInstance.get<ITeacherResponse>(
      API_ENDPOINTS.TEACHER.GETPROFILE
    );
    return response.data;
  }
}

export default new ClassAPI();
