import { Plus, MessageSquare, Trash2, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatSession } from "@/views/dashboard/student/StudentAITutors";
import { useEffect } from "react";
import { truncateText } from "@/utility/lib/truncateText";

interface ChatHistoryProps {
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  isLoading?: boolean;
}

const ChatHistory = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  isLoading = false,
}: ChatHistoryProps) => {
  useEffect(() => {}, [currentSessionId]);
  return (
    <aside className="h-full bg-white border-r border-gray-200 flex flex-col shadow-lg">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b bg-gradient-to-r from-[var(--color-primary-light)] to-green-900">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white rounded-lg">
            <Bot className="w-6 h-6 text-[var(--color-primary-dark)]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">AI Tutor</h1>
            <p className="text-xs text-white/80">Trợ lý học tập thông minh</p>
          </div>
        </div>

        <Button
          onClick={onNewChat}
          disabled={isLoading}
          className="w-full bg-white text-[var(--color-primary-dark)] hover:bg-gray-100 gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Cuộc trò chuyện mới
        </Button>
      </div>

      {/* Chat Sessions List - Scrollable Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="py-1 space-y-2">
            {isLoading && sessions.length === 0 ? (
              <div className="text-center py-16">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--color-primary-light)]" />
                <p className="text-sm text-gray-500 mt-2">Đang tải...</p>
              </div>
            ) : sessions.length > 0 ? (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:bg-green-50 group relative rounded-lg p-2 sm:p-3 ${
                    currentSessionId === session.id
                      ? "bg-gradient-to-r from-[var(--color-primary-light)]/10 to-[var(--color-secondary)]/10 border-2 border-[var(--color-primary-light)] shadow-sm"
                      : "border border-gray-200 hover:border-[var(--color-primary-light)]/30"
                  }`}
                  onClick={() => onSelectSession(session.id)}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <h3 className="font-medium text-sm sm:text-base truncate text-green-950 mb-1">
                        {truncateText(session.title, 30)}
                      </h3>

                      {/* Last Message */}
                      {session.lastMessage && (
                        <p className="text-[11px] sm:text-xs text-gray-500 truncate mb-1">
                          <span className="hidden md:inline">
                            {truncateText(session.lastMessage, 50)}
                          </span>
                          <span className="md:hidden">
                            {truncateText(session.lastMessage, 25)}
                          </span>
                        </p>
                      )}

                      {/* Message Count */}
                      <p className="text-[10px] sm:text-xs text-gray-400">
                        {session.messageCount} tin nhắn
                      </p>
                    </div>

                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 p-1 sm:p-1.5 h-auto hover:bg-red-50 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 hover:text-red-600" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 text-gray-400">
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-gray-100 rounded-full mb-4">
                    <MessageSquare className="w-10 h-10 opacity-30" />
                  </div>
                  <p className="text-sm font-medium">
                    Chưa có cuộc trò chuyện nào
                  </p>
                  <p className="text-xs mt-1 text-gray-400">
                    Nhấn nút "Cuộc trò chuyện mới" để bắt đầu
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Footer Info */}
      <div className="flex-shrink-0 p-4 border-t bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          Powered by AI • {sessions.length} cuộc trò chuyện
        </p>
      </div>
    </aside>
  );
};

export default ChatHistory;
