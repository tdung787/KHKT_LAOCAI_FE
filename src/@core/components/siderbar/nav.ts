import { 
  // Home,
  // Users,
  // School,
  BookOpen,
  // FileText,
  // Bell,
  Database,
  // MessagesSquare,
  Brain,
  ClipboardList,
  // TrendingUp,
  Bot,
  UserLock,
  // Library,
  // BadgeCheck
} from "lucide-react";
import { NavLink } from "./INavProps";

export const adminNavLinks: NavLink[] = [
  // {
  //   title: "Trang chủ",
  //   href: "/",
  //   icon: Home,
  //   checkRoll: ["student", "teacher", "admin"],
  // },
  {
    title: "Phê duyệt tài khoản",
    href: "/admin/dashboard/usersapprove",
    icon: UserLock,
    checkRoll: ["admin"],
  },
  // {
  //   title: "Quản lý người dùng",
  //   href: "/admin/dashboard/users",
  //   icon: Users,
  //   checkRoll: ["admin"],
  // },
  // {
  //   title: "Quản lý lớp học",
  //   href: "/admin/dashboard/classes",
  //   icon: School,
  //   checkRoll: ["admin"],
  // },
  // {
  //   title: "Quản lý môn học",
  //   href: "/admin/dashboard/subjects",
  //   icon: Library,
  //   checkRoll: ["admin"],
  // },
  // {
  //   title: "Quản lý báo cáo",
  //   href: "/admin/dashboard/reports",
  //   icon: FileText,
  //   checkRoll: ["admin"],
  // },
  // {
  //   title: "Quản lý thông báo",
  //   href: "/admin/dashboard/notifications",
  //   icon: Bell,
  //   checkRoll: ["admin"],
  // },
  // {
  //   title: "Quản lý Mô hình tài liệu ",
  //   href: "/admin/dashboard/datasets-models",
  //   icon: Database,
  //   checkRoll: ["admin"],
  // },
];

export const teacherNavLinks: NavLink[] = [
 
  {
    title: "Quản lý Lớp học của tôi",
    href: "/teacher/dashboard/classes",
    icon: BookOpen,
    checkRoll: ["teacher"],
  },
  // {
  //   title: "Quản lý phản hồi học sinh",
  //   href: "/teacher/dashboard/feedbacks",
  //   icon: MessagesSquare,
  //   checkRoll: ["teacher"],
  // },
  //  {
  //   title: "Quản lý đánh giá học sinh",
  //   href: "/teacher/dashboard/evaluates",
  //   icon: BadgeCheck,
  //   checkRoll: ["teacher"],
  // },
  {
    title: "Mô hình tài liệu học tập",
    href: "/teacher/dashboard/datasets-models",
    icon: Database,
    checkRoll: ["teacher"],
  },
  {
    title: "Công cụ datasets AI",
    href: "/teacher/dashboard/datasets",
    icon: Brain,
    checkRoll: ["teacher"],
  },
];

export const studentNavLinks: NavLink[] = [

  {
    title: "Lớp học của tôi",
    href: "/student/dashboard/classes",
    icon: BookOpen,
    checkRoll: ["student"],
  },
  // {
  //   title: "Điểm số của tôi",
  //   href: "/student/dashboard/scores",
  //   icon: Award,
  //   checkRoll: ["student"],
  // },
  {
    title: "Bài tập của tôi",
    href: "/student/dashboard/assignments",
    icon: ClipboardList,
    checkRoll: ["student"],
  },
  // {
  //   title: "Tiến độ học tập",
  //   href: "/student/dashboard/learning-progress",
  //   icon: TrendingUp,
  //   checkRoll: ["student"],
  // },
  {
    title: "Trợ giúp học tập AI",
    href: "/student/dashboard/ai-tutors",
    icon: Bot,
    checkRoll: ["student"],
  },
];

export const navLinks: NavLink[] = [
  ...adminNavLinks,
  ...teacherNavLinks,
  ...studentNavLinks,
];

// Helper function to filter links by user role
export const getFilteredLinks = (role: "admin" | "teacher" | "student") => {
  return navLinks.filter((link) => link.checkRoll.includes(role));
};

// Helper function to get navigation links for specific role
export const getNavLinksByRole = (
  role: "admin" | "teacher" | "student"
): NavLink[] => {
  switch (role) {
    case "admin":
      return adminNavLinks;
    case "teacher":
      return teacherNavLinks;
    case "student":
      return studentNavLinks;
    default:
      return [];
  }
};