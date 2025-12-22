// services/user.service.ts
import axiosInstance from '@/infra/api/conflig/axiosInstance';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  full_name?: string;
  phone?: string;
  avatar: string;
  is_active: boolean;
  created_at: string;
}

export interface PendingUsersResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface ApproveUserRequest {
  action: 'approve' | 'reject';
  rejection_reason?: string;
}

export interface ApproveUserResponse {
  success: boolean;
  message: string;
  data: User;
}

export const userService = {
  // Lấy danh sách user chờ duyệt
  getPendingUsers: async (page: number = 1, limit: number = 10): Promise<PendingUsersResponse> => {
    const response = await axiosInstance.get('/public/users/pending', {
      params: { page, limit }
    });
    return response.data;
  },

  // Duyệt hoặc từ chối user
  approveUser: async (userId: string, data: ApproveUserRequest): Promise<ApproveUserResponse> => {
    const response = await axiosInstance.patch(`/public/users/${userId}/approve`, data);
    return response.data;
  },
};