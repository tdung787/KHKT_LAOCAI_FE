import { FC } from "react";
import { useOnlineUsers } from "@/services/useOnlineUsers";
import { Circle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface OnlineStatusBadgeProps {
  userId: string;
  showLabel?: boolean;
  showLastSeen?: boolean; // ✅ Hiển thị "Hoạt động X phút trước"
  size?: "sm" | "md" | "lg";
}

const OnlineStatusBadge: FC<OnlineStatusBadgeProps> = ({
  userId,
  showLabel = false,
  showLastSeen = true, // ✅ Mặc định hiển thị
  size = "md",
}) => {
  const { isUserOnline, getLastSeen } = useOnlineUsers();
  const online = isUserOnline(userId);
  const lastSeenAt = getLastSeen(userId);

  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  // ✅ Format last seen
  const getLastSeenText = () => {
    if (online) {
      return "Online";
    }

    if (!lastSeenAt) {
      return "Offline";
    }

    try {
      return `Hoạt động ${formatDistanceToNow(new Date(lastSeenAt), {
        addSuffix: true,
        locale: vi,
      })}`;
    } catch (error) {
      return "Offline";
    }
  };

  if (showLabel) {
    return (
      <div className="flex items-center gap-1.5">
        <Circle
          className={`${sizeClasses[size]} ${
            online
              ? "text-green-500 fill-green-500"
              : "text-gray-400 fill-gray-400"
          }`}
          strokeWidth={3}
        />
        <span
          className={`hidden md:inline text-xs font-medium ${
            online
              ? "text-green-600 dark:text-green-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {showLastSeen ? getLastSeenText() : online ? "Online" : "Offline"}
        </span>
      </div>
    );
  }

  return (
    <Circle
      className={`${sizeClasses[size]} ${
        online ? "text-green-500 fill-green-500" : "text-gray-400 fill-gray-400"
      }`}
      strokeWidth={3}
    />
  );
};

export default OnlineStatusBadge;
