import axiosInstance from "./conflig/axiosInstanceold";
import { API_ENDPOINTS } from "./conflig/apiEndpoints";
import { IStudentResponse } from "@/domain/interfaces/IStudent";

class StudentAPI {
 
  async getProfileStudent(): Promise<IStudentResponse> {
    const response = await axiosInstance.get<IStudentResponse>(
      API_ENDPOINTS.STUDENT.GETPROFILE
    );
    return response.data;
  }
}

export default new StudentAPI();
