import { FC} from "react";
import { Menu, Bell, User, LogOut } from "lucide-react";
import { Breadcrumbs } from "../ui/Breadcrumbs";
import { useNavigate } from "react-router";

import { useNotification } from "@/services/useNotification";
import { useBreadcrumbs } from "../ui/hooks/useBreadcrumbs";
import { useAuthStore } from "@/utility/stores/authStore";
import { getRoleDefaultPath } from "./getRoleDefaultPath";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { ThemeToggle } from "@/utility";

export interface NavbarProps {
  setMenuVisibility?: (visible: boolean) => void;
  isMobile?: boolean;
  menuVisibility?: boolean;
  showSearch?: boolean;
  showNotifications?: boolean;
  showSettings?: boolean;
  showUserAvatar?: boolean;
  notificationCount?: number;
  onSearchChange?: (value: string) => void;
  onNotificationClick?: () => void;
  onSettingsClick?: () => void;
  onUserClick?: () => void;
  searchPlaceholder?: string;
}

const Navbar: FC<NavbarProps> = ({
  setMenuVisibility,
  isMobile = false,
  showNotifications = true,
  showUserAvatar = true,
  onNotificationClick,
}) => {
  const navigate = useNavigate();
  const breadcrumbItems = useBreadcrumbs();
  const { unreadCount } = useNotification();

  // ✅ Get user from auth store
  const { user, logout } = useAuthStore();

  // ✅ Get user initials


  // ✅ Get role display name
  // const getRoleDisplayName = (): string => {
  //   if (!user?.role) return "User";

  //   const roleMap: Record<string, string> = {
  //     admin: "Quản trị viên",
  //     teacher: "Giáo viên",
  //     student: "Học sinh",
  //   };

  //   return roleMap[user.role] || user.role;
  // };

  // ✅ Navigate to profile
  const handleProfileClick = () => {
    if (!user?.role) return;

    const basePath = getRoleDefaultPath(user.role);
    navigate(`${basePath}`);
  };

  // ✅ Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-white dark:bg-transparent border-b border-gray-200 dark:border-transparent flex items-center justify-between px-4 md:px-6 py-3">
      {/* Mobile Menu Toggle */}
      {isMobile && setMenuVisibility && (
        <button
          onClick={() => setMenuVisibility(true)}
          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-all"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Breadcrumbs */}
      <div className="flex-1 max-w-2xl">
        <Breadcrumbs
          items={breadcrumbItems}
          onNavigate={(href) => navigate(href)}
          showHome={false}
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <div>{/* <ThemeToggle /> */}</div>
        {/* Notifications */}
        {showNotifications && (
          <button
            onClick={onNotificationClick}
            className="relative text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold bg-gradient-to-r from-[#00994C] to-[#0077CC] text-white rounded-full">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        )}

        {/* User Avatar */}
        {showUserAvatar && user && (
          <Popover>
            <PopoverTrigger>
              <button
                className="flex items-center"
                aria-label="User menu"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00994C] via-[#008C8C] to-[#0077CC] flex items-center justify-center 110 transition-transform shadow-md overflow-hidden">
                  <Avatar className="h-12 w-12 border-4 border-white shadow-2xl">
                    <AvatarImage src={user?.avatar} alt={user?.full_name} />
                    <AvatarFallback className="bg-gray-200 text-gray-700 font-bold">
                      {user?.full_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* User Info */}
                {/* <div className="hidden md:flex flex-col items-start leading-tight text-left">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user.full_name || "User"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {getRoleDisplayName()}
                  </span>
                </div> */}
              </button>
            </PopoverTrigger>
            <PopoverContent
              className=" mr-5 w-48 p-2 flex flex-col  bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-lg"
              side="bottom"
              align="center"
            >
              {/* Profile */}
              <div
                className="p-2 flex items-center rounded-sm  text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
                onClick={handleProfileClick}
              >
                <User className="mr-2 h-5 w-5" />
                <span className="text-l">Thông tin cá nhân</span>
              </div>
              <div
                className="p-2 flex items-center rounded-sm  text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-5 w-5" />
                <span className="text-l">Đăng xuất</span>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};

export default Navbar;
