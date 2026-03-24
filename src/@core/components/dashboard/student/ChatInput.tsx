import { useState, useRef, useEffect } from "react";
import { Send, Image as ImageIcon, Loader2, X, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Attachment {
  type: "image" | "document";
  url: string;
  name: string;
  file?: File;
}

interface ChatInputProps {
  onSendMessage: (content: string, attachments?: Attachment[]) => void;
  isLoading?: boolean;
}

const ChatInput = ({ onSendMessage, isLoading = false }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<Attachment | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "56px";
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = Math.min(scrollHeight, 200) + "px";
    }
  }, [message]);

  const handleSend = () => {
    if ((message.trim() || image) && !isLoading) {
      onSendMessage(message.trim(), image ? [image] : undefined);
      setMessage("");
      setImage(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ✅ Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  // ✅ Validate and set image
  const validateAndSetImage = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chỉ chọn file ảnh");
      return false;
    }

    // Validate file size - Tối đa 1MB
    const maxSize = 1 * 1024 * 1024; // 1MB in bytes
    if (file.size > maxSize) {
      toast.error(
        `Kích thước ảnh quá lớn (${formatFileSize(
          file.size
        )}). Vui lòng chọn ảnh dưới 1MB`
      );
      return false;
    }

    // All validations passed
    setImage({
      type: "image",
      url: URL.createObjectURL(file),
      name: file.name,
      file,
    });

    toast.success(`Đã chọn ảnh (${formatFileSize(file.size)})`);
    return true;
  };

  // ✅ Handle paste event (Ctrl+V / Cmd+V)
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;

    if (!items) return;

    // Check if there's an image in clipboard
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.type.startsWith("image/")) {
        e.preventDefault(); // Prevent default paste behavior

        const file = item.getAsFile();
        if (file) {
          validateAndSetImage(file);
        }
        break; // Only handle first image
      }
    }
  };

  // ✅ Handle image upload from file picker
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      validateAndSetImage(files[0]);
    }
    e.target.value = ""; // Reset input
  };

  const removeImage = () => {
    if (image && image.url.startsWith("blob:")) {
      URL.revokeObjectURL(image.url);
    }
    setImage(null);
    toast.success("Đã xóa ảnh");
  };

  return (
    <div className="border-t bg-white p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Image Preview */}
        {image && (
          <div className="mb-2 sm:mb-3">
            <div className="relative inline-block group rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all">
              <img
                src={image.url}
                alt={image.name}
                className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 bg-red-500 text-white rounded-full p-1 sm:p-1.5 hover:bg-red-600 transition-colors"
                title="Xóa ảnh"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1.5 sm:px-2 py-0.5 sm:py-1">
                <p className="text-[9px] sm:text-xs text-white truncate">
                  {image.name}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Input Container - Flex column on mobile, row on desktop */}
        <div className="flex flex-col md:flex-row justify-center items-stretch md:items-end gap-2">
          <div className="relative md:flex hidden">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 flex-shrink-0 border-[var(--color-primary-light)]/30 hover:bg-[var(--color-primary-light)]/10"
                >
                  <Brain className="w-5 h-5 text-[var(--color-primary-light)]" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="w-80 mb-2" // mb-2 để tạo khoảng cách với nút (drop-up)
                side="top" // Quan trọng: hiện từ dưới lên (drop-up)
                align="center"
                sideOffset={8}
              >
                <div className="space-y-4 py-2">
                  <div className="flex items-center gap-3 px-2">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Trợ lý AI Khoa học</h4>
                      <p className="text-sm text-muted-foreground">
                        Hỏi đáp dựa trên tài liệu đã tải lên
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 px-2">
                    <Button
                      variant="default"
                      className="w-full justify-start bg-primary-light hover:bg-primary-dark text-white"
                    >
                      Hàm số và Đạo hàm
                    </Button>
                    <Button
                      variant="default"
                      className="w-full justify-start bg-primary-light hover:bg-primary-dark text-white"
                    >
                      Hình học không gian
                    </Button>
                    <Button
                      variant="default"
                      className="w-full justify-start bg-primary-light hover:bg-primary-dark text-white"
                    >
                      Hóa học hữu cơ cơ bản
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          {/* Text Input */}
          <div className="flex-1 relative w-full md:max-w-[650px]">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder="Nhập câu hỏi..."
              className="min-h-[40px] sm:min-h-[56px] max-h-[120px] sm:max-h-[200px] resize-none border-[var(--color-primary-light)]/30 focus:ring-[var(--color-primary-light)] overflow-y-auto text-sm sm:text-base px-3 py-2 w-full"
              rows={1}
              disabled={isLoading}
            />
          </div>

          {/* Buttons Container - Horizontal on mobile, auto on desktop */}
          <div className="flex justify-end md:justify-start items-center gap-1.5 sm:gap-2">
            {/* Image Upload Button */}

            <div className="relative flex md:hidden">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 flex-shrink-0 border-[var(--color-primary-light)]/30 hover:bg-[var(--color-primary-light)]/10"
                  >
                    <Brain className="w-5 h-5 text-[var(--color-primary-light)]" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  className="w-80 mb-2" // mb-2 để tạo khoảng cách với nút (drop-up)
                  side="top" // Quan trọng: hiện từ dưới lên (drop-up)
                  align="center"
                  sideOffset={8}
                >
                  <div className="space-y-4 py-2">
                    <div className="flex items-center gap-3 px-2">
                      <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                        <Brain className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Trợ lý AI Khoa học</h4>
                        <p className="text-sm text-muted-foreground">
                          Hỏi đáp dựa trên tài liệu đã tải lên
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 px-2">
                      <Button
                        variant="default"
                        className="w-full justify-start bg-primary-light hover:bg-primary-dark text-white"
                      >
                        Hàm số và Đạo hàm
                      </Button>
                      <Button
                        variant="default"
                        className="w-full justify-start bg-primary-light hover:bg-primary-dark text-white"
                      >
                        Hình học không gian
                      </Button>
                      <Button
                        variant="default"
                        className="w-full justify-start bg-primary-light hover:bg-primary-dark text-white"
                      >
                        Hóa học hữu cơ cơ bản
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            {!image && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 flex-shrink-0 border-[var(--color-primary-light)]/30 hover:bg-[var(--color-primary-light)]/10"
                disabled={isLoading}
                onClick={() => imageInputRef.current?.click()}
                title="Tải lên ảnh (tối đa 1MB)"
              >
                <ImageIcon className="w-5 h-5 text-[var(--color-primary-light)]" />
              </Button>
            )}

            {/* Hidden Image Input */}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />

            {/* Send Button */}
            <Button
              type="button"
              onClick={handleSend}
              disabled={(!message.trim() && !image) || isLoading}
              className="h-10 w-10 bg-gradient-to-r from-[var(--color-primary-light)] to-[#2e5288] hover:from-[var(--color-primary-dark)] hover:to-[var(--color-primary-light)]"
              size="icon"
              title="Gửi tin nhắn"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Keyboard Shortcuts Hint - Desktop only */}
        <p className="hidden md:block text-xs text-center text-gray-500 mt-2">
          <kbd className="px-2 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd>{" "}
          để gửi,{" "}
          <kbd className="px-2 py-0.5 bg-gray-100 rounded text-xs">
            Shift + Enter
          </kbd>{" "}
          để xuống dòng,{" "}
          <kbd className="px-2 py-0.5 bg-gray-100 rounded text-xs">
            Ctrl + V
          </kbd>{" "}
          để dán ảnh •{" "}
          <span className="text-orange-600 font-medium">Ảnh tối đa 1MB</span>
        </p>

        {/* Mobile hint - only size limit */}
        <p className="md:hidden text-[10px] text-center text-gray-500 mt-1.5">
          <span className="text-orange-600 font-medium">Ảnh tối đa 1MB</span>
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
