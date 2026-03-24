import { FC, useState } from "react";
import {
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  User,
} from "lucide-react";
import { SidebarProps, NavLink as NavItem } from "./INavProps";
import { getFilteredLinks } from "./nav";
import { useNavigate, NavLink, useLocation } from "react-router";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/utility";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getRoleDefaultPath } from "../navbar/getRoleDefaultPath";

import logo from "../../../../public/image/logo/logoTNUT.png";
import logo2 from "../../../../public/image/logo/logoMobile.png";

const Sidebar: FC<SidebarProps> = ({ isCollapsed, onCollapse, userRole }) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const navigate = useNavigate();
  const links = getFilteredLinks(userRole || "student");
  const location = useLocation();
  const currentPath = location.pathname;
  // ✅ Get user from auth store
  const { logout } = useAuthStore();
  const toggleMenu = (title: string) => {
    setExpandedMenus((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (link: NavItem) => {
    if (link.href && currentPath === link.href) return true;
    if (link.hrefCon && link.hrefCon.some((href) => currentPath === href))
      return true;
    return false;
  };
  const { user } = useAuthStore();

  const isMenuExpanded = (title: string) => expandedMenus.includes(title);
  // const isAITutorPage = location.pathname.includes(
  //   "/student/dashboard/ai-tutors"
  // );

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

  const getRoleDisplayName = (): string => {
    if (!user?.role) return "User";

    const roleMap: Record<string, string> = {
      admin: "Quản trị viên",
      teacher: "Giáo viên",
      student: "Học sinh",
    };

    return roleMap[user.role] || user.role;
  };

  return (
    <>
      <aside
        className={`fixed left-0 top-0 h-screen bg-white dark:bg-transparent border-r border-gray-200 dark:border-transparent transition-all duration-300 z-40 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-2 py-2 border-b border-gray-200 dark:border-slate-800">
            {!isCollapsed ? (
              <img src={logo} alt="Logo" className="h-20 w-auto mx-auto" />
            ) : (
              <img src={logo2} alt="Logo" className="h-15 w-auto mx-auto" />
            )}
            {/* <button
              onClick={() => onCollapse(!isCollapsed)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all text-gray-700 dark:text-gray-300 ml-auto"
            >
              {isCollapsed ? (
                <ChevronsRight className="w-5 h-5" />
              ) : (
                <ChevronsLeft className="w-5 h-5" />
              )}
            </button> */}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-700">
            {links.map((link, index) => (
              <div key={index}>
                {/* Main Link */}
                <button
                  onClick={() => {
                    if (link.hrefCon) {
                      toggleMenu(link.title);
                    } else if (link.href) {
                      navigate(link.href);
                    }
                  }}
                  className={`
                  w-full flex items-center gap-3 rounded-lg transition-all duration-200 ${
                    isCollapsed ? "py-3 px-3" : "py-2.5 px-4"
                  }
                  ${
                    isActive(link)
                      ? "bg-gradient-to-r from-[#A61D37] to-[#2e5288] text-white shadow-md"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                  }
                  ${isCollapsed ? "justify-center" : "justify-between"}
                `}
                >
                  <div className="flex items-center gap-3">
                    <link.icon
                      className={`${
                        !isCollapsed ? "w-6.5 h-6.5" : "w-6.5 h-6.5"
                      } flex-shrink-0`}
                    />
                    {!isCollapsed && (
                      <span className="font-medium text-l">{link.title}</span>
                    )}
                  </div>

                  {!isCollapsed && link.hrefCon && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isMenuExpanded(link.title) ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Sub-menu */}
                {link.hrefCon && !isCollapsed && (
                  <div
                    className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${
                      isMenuExpanded(link.title)
                        ? "max-h-96 opacity-100 mt-1"
                        : "max-h-0 opacity-0"
                    }
                  `}
                  >
                    <div className="ml-4 pl-4 border-l-2 border-gray-200 dark:border-slate-700 space-y-1">
                      {link.hrefCon.map((subHref, subIndex) => {
                        const subTitle = subHref.split("/").pop() || "";
                        return (
                          <NavLink
                            key={subIndex}
                            to={subHref}
                            className={({ isActive }) =>
                              `block px-4 py-2 rounded-lg transition-all duration-200 capitalize text-sm ${
                                isActive
                                  ? "bg-red-50 dark:bg-slate-800 text-[#A61D37] dark:text-[#A61D37] font-medium"
                                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                              }`
                            }
                          >
                            {subTitle}
                          </NavLink>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
        <div
          className={`pointer-events-auto mx-auto max-w-md flex items-center justify-center rounded-t-3xl shadow-2xl transition-all duration-300 ease-in-out ${
            isCollapsed ? "h-16" : "h-20"
          }`}
        >
          {/* Avatar - nhô lên khi collapsed */}
          <div
            className={`absolute transition-all duration-300 ${
              isCollapsed
                ? "-top-8 left-1/2 -translate-x-1/2"
                : "left-8 top-1/2 -translate-y-1/2"
            }`}
          >
            <Popover>
              <PopoverTrigger>
                <button
                  className="flex items-center justify-between gap-3"
                  aria-label="User menu"
                >
                  <Avatar className="h-12 w-12 border-4 border-white shadow-2xl">
                    <AvatarImage src={user?.avatar} alt={user?.full_name} />
                    <AvatarFallback className="bg-gray-200 text-gray-700 font-bold">
                      {user?.full_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {/* User Info */}
                 {!isCollapsed && (
                   <div className="hidden md:flex flex-col items-start leading-tight text-left">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {user?.full_name || "User"}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {getRoleDisplayName()}
                    </span>
                  </div>
                 )}
                </button>
              </PopoverTrigger>
              <PopoverContent
                className=" ml-5 w-48 p-2 flex flex-col  bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-lg"
                side="top"
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
          </div>

          {/* Nút toggle collapse */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-6  hover:bg-gray-100 dark:hover:bg-slate-800 rounded-sm"
            onClick={() => onCollapse(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronsRight className="h-5 w-5" />
            ) : (
              <ChevronsLeft className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
