import { useEffect, useState } from "react";
import ChatHistory from "@/@core/components/dashboard/student/ChatHistory";
import ChatContent from "@/@core/components/dashboard/student/ChatContent";
import ChatInput from "@/@core/components/dashboard/student/ChatInput";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useChatBotStore } from "@/utility/stores/chatStore";
import { useAuthStore } from "@/utility/stores/authStore";
import { toast } from "sonner";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { FileClock } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  image?: string; // ✅ Thêm field image
  attachments?: {
    type: "image" | "document";
    url: string;
    name: string;
  }[];
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

const StudentAITutors = () => {
  const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768); // md breakpoint
      };

      checkMobile();
      window.addEventListener("resize", checkMobile);

      return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return isMobile;
  };

  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { user } = useAuthStore();
  const {
    createSession,
    sendMessage,
    getSessionHistory,
    getSessionDetail,
    sessionHistory,
    currentSession,
    conversation,
    isLoading,
    isSending,
    setCurrentSession,
    clearCurrentSession,
    deleteSession,
  } = useChatBotStore();

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  // Load session history khi component mount
  useEffect(() => {
    if (user?.id) {
      loadSessionHistory();
    }
  }, [user?.id]);

  // ✅ Sync sessionHistory từ store → local state
  useEffect(() => {
    if (sessionHistory.length > 0) {
      const mappedSessions: ChatSession[] = sessionHistory.map((session) => ({
        id: session.id,
        title: session.name,
        lastMessage: session.first_message || "",
        timestamp: new Date(session.updated_at),
        messageCount: session.message_count,
      }));
      setSessions(mappedSessions);
    } else {
      setSessions([]);
    }
  }, [sessionHistory]);

  // ✅ Sync conversation từ store → messages
  useEffect(() => {
    if (conversation.length > 0) {
      const mappedMessages: Message[] = [];

      conversation.forEach((pair, index) => {
        // User message
        mappedMessages.push({
          id: `user-${index}`,
          role: "user",
          content: pair.user.content,
          timestamp: new Date(pair.user.timestamp),
          image: pair.user.image,
        });

        // ✅ Chỉ thêm assistant message nếu có content
        if (pair.chatbot.content) {
          mappedMessages.push({
            id: `assistant-${index}`,
            role: "assistant",
            content: pair.chatbot.content,
            timestamp: new Date(pair.chatbot.timestamp),
          });
        }
      });

      setMessages(mappedMessages);
    } else {
      setMessages([]);
    }
  }, [conversation]);

  // ✅ Auto-select session khi currentSession thay đổi
  useEffect(() => {
    if (currentSession?.session?.id) {
      setCurrentSessionId(currentSession.session.id);
    }
  }, [currentSession]);

  // Load session history
  const loadSessionHistory = async () => {
    try {
      if (user?.id) {
        await getSessionHistory(user.id);
      }
    } catch (error) {
      toast.error("Không thể tải lịch sử chat");
      console.error("Error loading session history:", error);
    }
  };

  // ✅ Tạo chat mới - FIXED
  const handleNewChat = async () => {
    try {
      if (!user?.id) {
        toast.error("Vui lòng đăng nhập");
        return;
      }

      // 1. Tạo session mới
      await createSession(user.id);

      // 2. Reload session history để có session mới trong list
      await loadSessionHistory();

      // 3. currentSession đã được set trong store, useEffect sẽ tự động update currentSessionId
      // await getSessionDetail(sessionHistory[0].id, user.id);

      toast.success("Đã tạo cuộc trò chuyện mới");
    } catch (error) {
      toast.error("Không thể tạo cuộc trò chuyện mới");
      console.error("Error creating session:", error);
    }
  };

  // ✅ Chọn session - IMPROVED
  const handleSelectSession = async (sessionId: string) => {
    try {
      if (!user?.id) return;

      // Nếu đang chọn session hiện tại thì không làm gì
      if (sessionId === currentSessionId) return;

      setCurrentSessionId(sessionId);

      // Load chi tiết session
      await getSessionDetail(sessionId, user.id);

      // Set current session vào store
      const selectedSession = sessionHistory.find((s) => s.id === sessionId);
      if (selectedSession) {
        setCurrentSession({
          success: true,
          session: {
            id: selectedSession.id,
            student_id: selectedSession.student_id,
            name: selectedSession.name,
            created_at: selectedSession.created_at,
            updated_at: selectedSession.updated_at,
            message_count: selectedSession.message_count,
          },
          student_info: {
            id: user.id,
            name: user?.full_name || "",
            grade: 0,
            class: "",
          },
          response: null,
          has_first_message: selectedSession.message_count > 0,
        });
      }
    } catch (error) {
      toast.error("Không thể tải cuộc trò chuyện");
      console.error("Error loading session:", error);
    }
  };

  // ✅ Gửi tin nhắn - IMPROVED
  // ✅ Gửi tin nhắn - SIMPLIFIED
  const handleSendMessage = async (
    content: string,
    attachments?: {
      type: "image" | "document";
      url: string;
      name: string;
      file?: File;
    }[]
  ) => {
    try {
      if (!currentSessionId) {
        toast.error("Vui lòng tạo cuộc trò chuyện mới");
        return;
      }

      // ✅ Lấy image file (chỉ có 1 ảnh)
      let imageFile: File | undefined;

      if (
        attachments &&
        attachments.length > 0 &&
        attachments[0].type === "image"
      ) {
        imageFile = attachments[0].file;
      }

      // Gửi tin nhắn
      await sendMessage(currentSessionId, content, user?.id || "", imageFile);

      // Reload session history để cập nhật message count và last message
      await loadSessionHistory();
    } catch (error) {
      toast.error("Không thể gửi tin nhắn");
      console.error("Error sending message:", error);
    }
  };

  // Xóa session
  const handleDeleteSession = async (sessionId: string) => {
    try {
      toast.info("Tính năng xóa đang được phát triển");

      // Xóa session
      await deleteSession(sessionId, user?.id || "");

      // Nếu đang xóa session hiện tại
      if (currentSessionId === sessionId) {
        clearCurrentSession();
        setCurrentSessionId("");
      }

      // Xóa khỏi danh sách
      setSessions(sessions.filter((s) => s.id !== sessionId));
    } catch (error) {
      toast.error("Không thể xóa cuộc trò chuyện");
      console.error("Error deleting session:", error);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[var(--bg-light-start)] to-[var(--bg-light-end)] overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Chat History Panel */}
        {!isMobile ? (
          <ResizablePanel
            defaultSize={15}
            minSize={15}
            maxSize={30}
            className="bg-white"
          >
         
              <div className="h-full overflow-hidden">
                <ChatHistory
                  sessions={sessions}
                  currentSessionId={currentSessionId}
                  onSelectSession={handleSelectSession}
                  onNewChat={handleNewChat}
                  onDeleteSession={handleDeleteSession}
                  isLoading={isLoading}
                />
              </div>
         
          </ResizablePanel>
        ) : (
          <div >
       
              <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button
                    variant="outline"
                    size="default"
                    className="fixed rounded-t-none top-21 left-3 z-30 md:hidden"
                  >
                    <FileClock  className="h-5 w-5" /> lịch sử chát
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Lịch sử chat</DrawerTitle>
                    <DrawerDescription>
                      Chọn một phiên chat để tiếp tục
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="h-[60vh] overflow-y-auto px-4">
                    <ChatHistory
                      sessions={sessions}
                      currentSessionId={currentSessionId}
                      onSelectSession={(id) => {
                        handleSelectSession(id);
                        setDrawerOpen(false); // Đóng drawer sau khi chọn
                      }}
                      onNewChat={() => {
                        handleNewChat();
                        setDrawerOpen(false);
                      }}
                      onDeleteSession={handleDeleteSession}
                      isLoading={isLoading}
                    />
                  </div>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button variant="outline">Đóng</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
          
          </div>
        )}

        {/* Resizable Handle */}
        <ResizableHandle
          withHandle
          className="bg-gray-200 hover:bg-[var(--color-primary-light)] transition-colors"
        />

        {/* Main Chat Panel */}
        <ResizablePanel defaultSize={75} minSize={50}>
          <div className="h-full flex flex-col overflow-hidden">
            {currentSessionId ? (
              <>
                {/* Chat Content */}
                <div className="flex-1 overflow-hidden min-h-0">
                  <ChatContent messages={messages} isLoading={isSending} />
                </div>

                {/* Fixed Input at Bottom */}
                <div className="flex-shrink-0 bg-white border-t shadow-lg">
                  <ChatInput
                    onSendMessage={handleSendMessage}
                    isLoading={isSending}
                  />
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center overflow-hidden">
                <div className="text-center">
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-primary-light)]/20 to-[var(--color-secondary)]/20">
                      <svg
                        className="w-10 h-10 text-[var(--color-primary-dark)]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-700 mb-2">
                    Chọn hoặc tạo cuộc trò chuyện mới
                  </h2>
                  <p className="text-gray-500">
                    Bắt đầu chat với AI Tutor của bạn
                  </p>
                </div>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default StudentAITutors;
