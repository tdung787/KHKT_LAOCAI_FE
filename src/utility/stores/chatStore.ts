import { create } from "zustand";
import chatbotAPI from "@/infra/apiRAG/chatbot/chatbotAPI";
import {
  ICreateSessionResponse,
  ISessionHistoryResponse,
  ISessionDetailResponse,
  ISessionItem,
  IConversationPair,
} from "@/infra/apiRAG/type/IRag";
import { handleApiError } from "../lib/errorHandler";
import { IApiError } from "../lib/IError";

interface ChatBotState {
  // State
  currentSession: ICreateSessionResponse | null;
  sessionHistory: ISessionItem[];
  sessionDetail: ISessionDetailResponse | null;
  conversation: IConversationPair[];
  isLoading: boolean;
  isSending: boolean;
  error: IApiError | null;

  // Actions
  createSession: (userId: string) => Promise<void>;
  sendMessage: (sessionId: string, userInput: string, studentId: string, image?: File) => Promise<void>;
  getSessionHistory: (studentId: string) => Promise<void>;
  getSessionDetail: (sessionId: string, studentId: string) => Promise<void>;
  deleteSession: (sessionId: string, studentId: string) => Promise<void>;
  
  // Setters
  setCurrentSession: (session: ICreateSessionResponse | null) => void;
  setConversation: (conversation: IConversationPair[]) => void;
  addMessageToConversation: (message: IConversationPair) => void;
  
  // Clear functions
  clearCurrentSession: () => void;
  clearSessionHistory: () => void;
  clearSessionDetail: () => void;
  clearError: () => void;
  clearAll: () => void;
}

// ✅ Helper function to parse user_input from backend
const parseUserInput = (userInput: string): { image?: string; content: string } => {
  // Regex to extract markdown image: ![alt](url)
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const match = userInput.match(imageRegex);
  
  if (match) {
    const imageUrl = match[1]; // Extract URL from markdown
    const content = userInput.replace(imageRegex, '').trim(); // Remove image markdown, keep text
    return { image: imageUrl, content };
  }
  
  return { content: userInput };
};

export const useChatBotStore = create<ChatBotState>()((set, get) => ({
  // Initial State
  currentSession: null,
  sessionHistory: [],
  sessionDetail: null,
  conversation: [],
  isLoading: false,
  isSending: false,
  error: null,

  /**
   * 🔹 Tạo phiên chat mới
   */
  createSession: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await chatbotAPI.createSession(userId);

      set({
        currentSession: response,
        conversation: [],
        isLoading: false,
      });
    } catch (error) {
      const apiError = handleApiError(error);

      set({
        isLoading: false,
        error: apiError,
        currentSession: null,
      });

      throw apiError;
    }
  },

  deleteSession: async (sessionId: string, studentId: string) => {
    try {
      set({ isLoading: true, error: null });

      await chatbotAPI.deleteSession(sessionId, studentId);

      set({
        isLoading: false,
      });
    } catch (error) {
      const apiError = handleApiError(error);

      set({
        isLoading: false,
        error: apiError,
      });

      throw apiError;
    }
  },

  /**
   * 🔹 Gửi tin nhắn và nhận phản hồi
   */
  /**
 * 🔹 Gửi tin nhắn và nhận phản hồi - WITH OPTIMISTIC UPDATE
 */
sendMessage: async (sessionId: string, userInput: string, studentId: string, image?: File) => {
  set({ isSending: true, error: null });

  const localImagePreview = image ? URL.createObjectURL(image) : undefined;

  const optimisticMessage: IConversationPair = {
    user: {
      content: userInput,
      timestamp: new Date().toISOString(),
      image: localImagePreview,
    },
    chatbot: {
      content: "",
      timestamp: new Date().toISOString(),
    },
  };

  set({ conversation: [...get().conversation, optimisticMessage] });

  try {
    const stream = chatbotAPI.sendMessageStream(sessionId, userInput, studentId, true, 7, image);

    for await (const chunk of stream) {
      if (!chunk.done) {
        set((state) => {
          const conv = [...state.conversation];
          const last = { ...conv[conv.length - 1] };
          last.chatbot = { ...last.chatbot, content: last.chatbot.content + chunk.content };
          conv[conv.length - 1] = last;
          return { conversation: conv };
        });
      } else {
        if (get().currentSession) {
          set({
            currentSession: {
              ...get().currentSession!,
              session: {
                ...get().currentSession!.session,
                message_count: get().currentSession!.session.message_count + 1,
              },
            },
          });
        }
      }
    }

    set({ isSending: false });
  } catch (error) {
    const apiError = handleApiError(error);

    set((state) => ({
      conversation: state.conversation.slice(0, -1),
      isSending: false,
      error: apiError,
    }));

    throw apiError;
  }
},

  /**
   * 🔹 Lấy danh sách lịch sử phiên chat
   */
  getSessionHistory: async (studentId: string) => {
    try {
      set({ isLoading: true, error: null });

      const response: ISessionHistoryResponse =
        await chatbotAPI.getSessionHistory(studentId);

      set({
        sessionHistory: response.sessions || [],
        isLoading: false,
      });
    } catch (error) {
      const apiError = handleApiError(error);

      set({
        isLoading: false,
        error: apiError,
        sessionHistory: [],
      });

      throw apiError;
    }
  },

  /**
   * 🔹 Lấy chi tiết 1 phiên chat
   */
  getSessionDetail: async (sessionId: string, studentId: string) => {
    try {
      set({ isLoading: true, error: null });

      const response: ISessionDetailResponse =
        await chatbotAPI.getSessionDetail(sessionId, studentId);

      // ✅ Parse tất cả user_input trong conversation history
      const parsedConversation = response.conversation?.map((pair) => {
        const parsed = parseUserInput(pair.user.content);
        return {
          user: {
            ...pair.user,
            content: parsed.content,
            image: parsed.image,
          },
          chatbot: pair.chatbot,
        };
      }) || [];

      set({
        sessionDetail: response,
        conversation: parsedConversation,
        isLoading: false,
      });
    } catch (error) {
      const apiError = handleApiError(error);

      set({
        isLoading: false,
        error: apiError,
        sessionDetail: null,
        conversation: [],
      });

      throw apiError;
    }
  },

  // Setters
  setCurrentSession: (session: ICreateSessionResponse | null) => {
    set({ currentSession: session });
  },

  setConversation: (conversation: IConversationPair[]) => {
    set({ conversation });
  },

  addMessageToConversation: (message: IConversationPair) => {
    set({
      conversation: [...get().conversation, message],
    });
  },

  // Clear functions
  clearCurrentSession: () => {
    set({ 
      currentSession: null, 
      conversation: [],
      error: null 
    });
  },

  clearSessionHistory: () => {
    set({ sessionHistory: [], error: null });
  },

  clearSessionDetail: () => {
    set({ 
      sessionDetail: null, 
      conversation: [],
      error: null 
    });
  },

  clearError: () => {
    set({ error: null });
  },

  clearAll: () => {
    set({
      currentSession: null,
      sessionHistory: [],
      sessionDetail: null,
      conversation: [],
      isLoading: false,
      isSending: false,
      error: null,
    });
  },
}));