// services/auth.service.ts
import axiosInstance from '@/infra/api/conflig/axiosInstanceold';
// types/auth.types.ts
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: 'teacher' | 'student';
  full_name: string;
  phone: string;
  avatar?: string;
  is_active?: boolean;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    username: string;
    email: string;
    role: string;
    full_name: string;
    is_active: boolean;
    created_at: string;
  };
}
export const authService = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await axiosInstance.post('/public/users/register', {
      ...data,
      avatar: 'default-avatar.png',
      is_active: false,
    });
    return response.data;
  },
};