import axiosInstance from "../conflig/axiosInstance";
import { API_ENDPOINTS } from "../conflig/apiEndpoints";
import { storage } from "@/utility/lib/storage";

const RAG_BASE_URL = import.meta.env.VITE_API_RAG_URL || "http://14.225.211.7:8110/api";

class ChatBotAPI {
  /**
   * 🔹 Tạo phiên chat mới (session)
   * @param userId - ID của người dùng
   */
  async createSession(userId: string) {
    const response = await axiosInstance.post(
      API_ENDPOINTS.RAG.CREATE_SESSIONS(userId)
    );
    return response.data;
  }

  /**
   * 🔹 Gửi câu hỏi đến RAG model và nhận phản hồi
   * @param session_id - ID của phiên chat hiện tại
   * @param user_input - Tin nhắn người dùng nhập vào
   */
async sendMessage(session_id: string, user_input: string, student_id: string, image?: File) {
  const formData = new FormData();
  formData.append('session_id', session_id);
  formData.append('user_input', user_input);
  formData.append('student_id', student_id);
  
  if (image) {
    formData.append('image', image);
  }

  const response = await axiosInstance.post(
    API_ENDPOINTS.RAG.RAG_QUERY,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
}


  /**
   * 🔹 Lấy danh sách lịch sử phiên chat của 1 học sinh
   * @param student_id - ID học sinh
   */
  async getSessionHistory(student_id: string) {
    const response = await axiosInstance.get(
      API_ENDPOINTS.RAG.GET_SESSION_HISTORY(student_id)
    );
    return response.data;
  }

  /**
   * 🔹 Lấy chi tiết 1 phiên chat cụ thể
   * @param session_id - ID phiên chat
   * @param student_id - ID học sinh
   */
  async getSessionDetail(session_id: string, student_id: string) {
    const response = await axiosInstance.get(
      API_ENDPOINTS.RAG.GET_SESSION_DETAIL(session_id, student_id)
    );
    return response.data;
  }

  async deleteSession(session_id: string, student_id: string) {
    const response = await axiosInstance.delete(
      API_ENDPOINTS.RAG.DELETE_SESSION(session_id, student_id)
    );
    return response.data;
  }

  async *sendMessageStream(
    session_id: string,
    question: string,
    student_id: string,
    use_bm25 = true,
    top_k = 7,
    image?: File
  ): AsyncGenerator<{ content: string; done: boolean; sources?: unknown[]; session?: unknown }> {
    const formData = new FormData();
    formData.append("session_id", session_id);
    formData.append("student_id", student_id);
    formData.append("question", question);
    formData.append("use_bm25", String(use_bm25));
    formData.append("top_k", String(top_k));
    if (image) formData.append("image", image);

    const token = storage.getToken();
    const response = await fetch(`${RAG_BASE_URL}${API_ENDPOINTS.RAG.CHAT_STREAM}`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));
            yield data;
            if (data.done) return;
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

}

export default new ChatBotAPI();
