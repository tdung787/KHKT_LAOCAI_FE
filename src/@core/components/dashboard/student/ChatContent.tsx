import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Bot,
  User,
  ArrowDown,
  Loader2,
  Copy,
  Check,
  Download,
} from "lucide-react"; // Thêm Check icon
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import { Message } from "@/views/dashboard/student/StudentAITutors";

// utils/api.ts hoặc nơi bạn định nghĩa axiosInstance
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://14.225.211.7:8110",
  // các config khác nếu có
});

interface ChatContentProps {
  messages: Message[];
  isLoading?: boolean;
}

const ChatContent = ({ messages, isLoading = false }: ChatContentProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // State để quản lý trạng thái copy của từng message
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Hàm xử lý copy
  const handleCopy = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000); // Ẩn sau 2s
    } catch (err) {
      console.error("Copy thất bại:", err);
    }
  };

  // Auto scroll khi có messages mới HOẶC khi loading
  useEffect(() => {
    if (bottomRef.current && scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;

      const scrollTimeout = setTimeout(() => {
        const isNearBottom =
          scrollContainer.scrollHeight -
            scrollContainer.scrollTop -
            scrollContainer.clientHeight <
          100;

        if (isNearBottom || messages.length === 1 || isLoading) {
          bottomRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }
      }, 100);

      return () => clearTimeout(scrollTimeout);
    }
  }, [messages, isLoading]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      setShowScrollButton(distanceFromBottom > 200);
    }
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatLatexContent = (content: string) => {
    return content
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<!--\s*ANSWER_KEY:.*?-->/gi, "")
      .replace(/(Nộp bài:\s*)(\d+-[A-D])/gi, "$1\n\n$2")
      .replace(/(\d+-[A-D]),(\d+-[A-D])/g, "$1,\n$2")
      .replace(/(❌|✅)\s*Câu/g, "\n$1 Câu")
      .replace(/\\\[/g, "$$")
      .replace(/\\\]/g, "$$")
      .replace(/\\\(/g, "$")
      .replace(/\\\)/g, "$");
  };

  // Trong ChatContent component
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const handleDownloadPDF = async (content: string, messageId: string) => {
    if (downloadingId === messageId) return;

    try {
      setDownloadingId(messageId);

      const response = await axiosInstance.post<{
        success: boolean;
        download_url: string;
        message?: string;
      }>(
        "/api/markdown/to-pdf",
        { markdown_content: content }, // gửi đúng key backend mong đợi
        {
          headers: {
            "Content-Type": "application/json", // ép buộc
          },
          responseType: "json",
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Tạo PDF thất bại");
      }

      // Trigger download
      const link = document.createElement("a");
      link.href = response.data.download_url;
      link.download = "bai-giang.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: unknown) {
    console.error("Download PDF thất bại:", err);

    // Type guard để kiểm tra err có phải là AxiosError không
    if (axios.isAxiosError(err) && err.response) {
      console.error("Response data:", err.response.data);
      console.error("Status:", err.response.status);

      // const serverMessage = (err.response.data as any)?.message;
      // alert(
      //   "Không thể tạo PDF. Lỗi server: " +
      //     (serverMessage || err.message || "Không rõ lỗi")
      // );
    } else if (err instanceof Error) {
      alert("Không thể tạo PDF. Lỗi: " + err.message);
    } else {
      alert("Không thể tạo PDF. Đã xảy ra lỗi không xác định.");
    }
  } finally {
    setDownloadingId(null);
  }
  };

  return (
    <div className="w-full relative h-full flex flex-col">
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden"
        onScroll={handleScroll}
        style={{
          scrollBehavior: "smooth",
          overscrollBehavior: "contain",
        }}
      >
        <div className="min-h-full flex flex-col">
          {messages.length === 0 && !isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <div className="p-6 bg-gradient-to-br from-[var(--color-primary-light)]/20 to-[var(--color-secondary)]/20 rounded-full mb-6">
                <Bot className="w-16 h-16 text-[var(--color-primary-dark)]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">
                Xin chào! Tôi là AI Tutor
              </h2>
              <p className="text-gray-500 text-center max-w-md">
                Hãy đặt câu hỏi về bất kỳ môn học nào. Tôi sẵn sàng giúp bạn học
                tập hiệu quả hơn!
              </p>
            </div>
          ) : (
            <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0 md:flex hidden">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-secondary)] flex items-center justify-center">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}

                    <div
                      className={`flex flex-col ${
                        message.role === "user" ? "items-end" : "items-start"
                      } max-w-[85%] md:max-w-[75%]`}
                    >
                      <Card
                        className={`p-4 w-full relative group ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-[var(--color-primary-light)] to-[#2e5288] text-white"
                            : "bg-white shadow-md"
                        }`}
                      >
                        {/* Image Display */}
                        {message.image && (
                          <div className="mb-3">
                            <img
                              src={message.image}
                              alt="Uploaded image"
                              className="max-w-full h-auto rounded-lg border-2 border-white/20"
                              style={{ maxHeight: "300px" }}
                              onError={(e) => {
                                console.warn("Image preview không khả dụng");
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                        )}

                        {/* Message Content */}
                        {message.content && (
                          <>
                            {message.role === "assistant" ? (
                              <div className="prose prose-sm max-w-none break-words">
                                <ReactMarkdown
                                  children={formatLatexContent(message.content)}
                                  remarkPlugins={[remarkMath]}
                                  rehypePlugins={[rehypeKatex]}
                                />
                              </div>
                            ) : (
                              <p className="text-sm whitespace-pre-wrap break-words">
                                {formatLatexContent(message.content)}
                              </p>
                            )}
                          </>
                        )}
                      </Card>

                      <div className="w-full flex justify-between items-center gap-2 mt-2">
                        <div className="flex ">
                          {/* Nút Copy - hiện khi hover hoặc đã copy */}
                          {message.content && (
                            <button
                              onClick={() =>
                                handleCopy(message.content, message.id)
                              }
                              className="  transition-opacity 
                               hover:bg-black/20 rounded-md p-1.5 
                              text-gray-600 hover:text-gray-900"
                              aria-label="Copy tin nhắn"
                            >
                              {copiedId === message.id ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          )}

                          {/* Nút download pdf */}
                          {/* Nút Download PDF - chỉ hiện cho message của assistant */}
                          {message.content && message.role === "assistant" && (
                            <button
                              onClick={() =>
                                handleDownloadPDF(message.content, message.id)
                              }
                              disabled={downloadingId === message.id}
                              className="transition-opacity hover:bg-black/20 rounded-md p-1.5 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                              aria-label="Tải xuống PDF"
                            >
                              {downloadingId === message.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Download className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 mt-1 px-2">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>

                    {message.role === "user" && (
                      <div className="flex-shrink-0 md:flex hidden">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary-light)] flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="flex gap-3 justify-start animate-fadeIn">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-secondary)] flex items-center justify-center animate-pulse">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="flex flex-col items-start max-w-[85%] md:max-w-[75%]">
                      <Card className="p-4 w-full bg-white shadow-md">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-[var(--color-primary-light)]" />
                          <span className="text-sm text-gray-500">
                            Đang suy nghĩ...
                          </span>
                          <div className="flex gap-1">
                            <span
                              className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            ></span>
                            <span
                              className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            ></span>
                            <span
                              className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            ></span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                )}

                <div ref={bottomRef} className="h-4" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <div className="absolute bottom-20 md:bottom-6 left-0 right-0 pointer-events-none flex justify-center z-50">
          <button
            onClick={scrollToBottom}
            className="pointer-events-auto h-8 w-8 rounded-full bg-white border border-[var(--color-primary-dark)] shadow-lg hover:bg-[var(--color-primary-dark)] hover:text-white hover:scale-110 transition-all flex items-center justify-center"
            aria-label="Cuộn xuống"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatContent;
