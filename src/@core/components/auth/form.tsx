import { FC, useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Bot, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/utility/stores/authStore';
import { getFieldError } from '@/utility/lib/errorHandler';

// React Hook Form + Zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/utility/schema/authSchema';
import type { z } from 'zod';

type LoginFormData = z.infer<typeof loginSchema>;

const FormLogin: FC = () => {
  const { login, isLoading, error, clearError } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: { email: '', password: '' },
  });

  const handleInputChange = (fieldName: keyof LoginFormData) => {
    clearErrors(fieldName);
    if (error) {
      clearError();
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Header with Bot Icon */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#A61D37] to-[#2e5288] mb-4 shadow-lg">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Đăng nhập hệ thống
        </h1>
        <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
          <Sparkles className="w-4 h-4" />
          Truy cập Chatbot AI của bạn
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        {/* Display API Error */}
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
            <p className="font-medium text-red-800 text-sm">{error.message}</p>
            {error.errors && error.errors.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs text-red-700">
                {error.errors.map((err, idx) => (
                  <li key={idx}>• {err.field}: {err.message}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                {...register('email', { onChange: () => handleInputChange('email') })}
                placeholder="you@example.com"
                disabled={isLoading}
                className={[
                  'w-full pl-11 pr-4 py-2.5 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400',
                  'border-2 transition-all duration-200',
                  'focus:outline-none focus:bg-white focus:border-[#A61D37]',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  errors.email || getFieldError(error, 'email') 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300',
                ].join(' ')}
              />
            </div>
            {/* Validation errors */}
            {errors.email && (
              <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-red-600"></span>
                {errors.email.message}
              </p>
            )}
            {!errors.email && getFieldError(error, 'email') && (
              <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-red-600"></span>
                {getFieldError(error, 'email')}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', { onChange: () => handleInputChange('password') })}
                placeholder="••••••••"
                disabled={isLoading}
                className={[
                  'w-full pl-11 pr-12 py-2.5 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400',
                  'border-2 transition-all duration-200',
                  'focus:outline-none focus:bg-white focus:border-[#A61D37]',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  errors.password || getFieldError(error, 'password')
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300',
                ].join(' ')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {/* Validation errors */}
            {errors.password && (
              <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-red-600"></span>
                {errors.password.message}
              </p>
            )}
            {!errors.password && getFieldError(error, 'password') && (
              <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-red-600"></span>
                {getFieldError(error, 'password')}
              </p>
            )}
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
                className="h-4 w-4 rounded border-gray-300 text-[#A61D37] focus:ring-2 focus:ring-[#A61D37]/20 disabled:cursor-not-allowed"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                Ghi nhớ đăng nhập
              </span>
            </label>

            <a
              href="/forgot-password"
              className="text-sm text-[#A61D37] hover:text-[#8a1a30] font-medium transition-colors"
            >
              Quên mật khẩu?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 py-3 rounded-lg bg-gradient-to-r from-[#A61D37] to-[#2e5288] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#A61D37]/50 focus:ring-offset-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Đang đăng nhập...
              </span>
            ) : (
              'Đăng nhập'
            )}
          </button>
        </form>

        {/* Divider */}
        {/* <div className="relative mt-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-gray-500">
              Hoặc tiếp tục với
            </span>
          </div>
        </div> */}

        {/* Social Login (Optional) */}
        {/* <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50"
            disabled={isLoading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-sm font-medium text-gray-700">Google</span>
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50"
            disabled={isLoading}
          >
            <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span className="text-sm font-medium text-gray-700">Facebook</span>
          </button>
        </div> */}
      </div>


      {/* Footer */}
      <p className="text-center mt-6 text-sm text-gray-600">
        Chưa có tài khoản?{' '}
        <a href="/register" className="text-[#A61D37] hover:text-[#8a1a30] font-semibold transition-colors">
          Đăng ký ngay
        </a>
      </p>
    </div>
  );
};

export default FormLogin;