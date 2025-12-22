// utils/roleRedirects.ts
import { UserRole } from '@/domain/interfaces/IEnum';

export const getRoleDefaultPath = (role: UserRole): string => {
  const rolePathMap: Record<UserRole, string> = {
    [UserRole.ADMIN]: '/admin/dashboard/usersapprove',
    [UserRole.TEACHER]: '/teacher/profile',
    [UserRole.STUDENT]: '/student/profile',
  };
  return rolePathMap[role] || '/';
};

// ✅ Common routes mà tất cả roles đều được truy cập
const COMMON_ROUTES = [
  '/',
  '/profile',
  '/settings',
  '/notifications',
  '/help',
  '/about',
];

// ✅ Check nếu path là common route
const isCommonRoute = (path: string): boolean => {
  return COMMON_ROUTES.some(route => path === route || path.startsWith(`${route}/`));
};

export const isPathAllowedForRole = (path: string, role: UserRole): boolean => {
  // ✅ Common routes - tất cả roles đều có thể truy cập
  if (isCommonRoute(path)) {
    return true;
  }

  // ✅ Admin có thể truy cập mọi nơi
  if (role === UserRole.ADMIN) {
    return true;
  }
  
  // ✅ Teacher chỉ được vào /teacher/* + common routes
  if (role === UserRole.TEACHER) {
    return path.startsWith('/teacher');
  }
  
  // ✅ Student chỉ được vào /student/* + common routes
  if (role === UserRole.STUDENT) {
    return path.startsWith('/student');
  }
  
  return false;
};

// ✅ Helper: Check nếu cần redirect
export const shouldRedirectToRoleDefault = (path: string, role: UserRole): boolean => {
  // Nếu đang ở trang login/register/forgot-password thì không redirect
  const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
  if (publicPaths.some(p => path.startsWith(p))) {
    return false;
  }

  // Nếu path không được phép cho role thì redirect
  return !isPathAllowedForRole(path, role);
};