"use client";

import { FC, useState } from "react";
import {
  User,
  BookOpen,
  School,
  Briefcase,
  Sparkles,
  LogOut,
} from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axiosInstance from "@/infra/api/conflig/axiosInstance";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/utility";
import { useNavigate } from "react-router";
import { Controller } from "react-hook-form";
// Interface đúng với dữ liệu gửi lên backend
interface CreateProfileTeacherFormData {
  teacher_code: string;
  bio: string;
  avatar?: string;
  specialization: string[]; // mảng các môn chuyên dạy
  grade_levels_taught: number[]; // mảng các khối lớp giáo viên dạy
  school_name: string;
}

interface CreateProfileTeacherProps {
  onSuccess?: () => void;
}

// Zod schema validate theo đúng cấu trúc JSON mẫu
const createProfileSchema = z.object({
  teacher_code: z.string().min(1, "Mã giáo viên là bắt buộc"),
  bio: z.string().min(10, "Tiểu sử phải ít nhất 10 ký tự"),
  avatar: z
    .string()
    .url("URL avatar không hợp lệ")
    .optional()
    .or(z.literal("")),
  specialization: z
    .array(z.string().min(1))
    .min(1, "Vui lòng chọn ít nhất một môn chuyên dạy"),
  grade_levels_taught: z
    .array(z.number().int().min(6).max(12))
    .min(1, "Vui lòng chọn ít nhất một khối lớp"),
  school_name: z.string().min(1, "Tên trường là bắt buộc"),
});

const CreateProfileTeacher: FC<CreateProfileTeacherProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<CreateProfileTeacherFormData>({
    resolver: zodResolver(createProfileSchema),
    defaultValues: {
      teacher_code: "",
      bio: "",
      avatar: "",
      specialization: ["Toán"],
      grade_levels_taught: [10, 11, 12],
      school_name: "",
    },
  });

  const onSubmit = async (data: CreateProfileTeacherFormData) => {
    setIsLoading(true);
    console.log(data);
    try {
      await axiosInstance.post("/private/teachers/profile", data);

      toast.success("Tạo profile giáo viên thành công!", {
        icon: "🎉",
        duration: 4000,
      });

      reset();
      onSuccess?.();
    } catch (err: unknown) {
      let message = "Có lỗi xảy ra khi tạo profile. Vui lòng thử lại.";

      if (err instanceof AxiosError && err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      toast.error(message, { duration: 5000 });
      console.error("Create teacher profile error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Header */}
      <div className="text-center my-8">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900">
            🎉 Chào mừng thầy/cô đến với hệ thống học tập AI!
          </h3>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Để sử dụng đầy đủ các tính năng hỗ trợ giảng dạy và theo dõi học
            sinh, vui lòng hoàn thiện hồ sơ giáo viên ngay bây giờ.
          </p>
        </div>

        <div className="relative max-w-md mx-auto">
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
            <div className="text-5xl animate-bounce">👇</div>
          </div>
        </div>

        <div className="mt-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Tạo Profile Giáo Viên
          </h1>
          <p className="text-xl text-gray-600 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            Hỗ trợ giảng dạy hiệu quả hơn với trợ lý AI
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Mã giáo viên + Avatar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã giáo viên <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register("teacher_code")}
                  placeholder="GV0010"
                  disabled={isLoading}
                  className={[
                    "w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 border-2 transition-all",
                    errors.teacher_code
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300",
                    "focus:outline-none focus:bg-white focus:border-[#00994C]",
                  ].join(" ")}
                />
              </div>
              {errors.teacher_code && (
                <p className="text-red-600 text-xs mt-2">
                  {errors.teacher_code.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avatar (URL)
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register("avatar")}
                  placeholder="https://i.pravatar.cc/150?img=3"
                  disabled={isLoading}
                  className={[
                    "w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 border-2 transition-all",
                    errors.avatar
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300",
                    "focus:outline-none focus:bg-white focus:border-[#00994C]",
                  ].join(" ")}
                />
              </div>
              {errors.avatar && (
                <p className="text-red-600 text-xs mt-2">
                  {errors.avatar.message}
                </p>
              )}
            </div>
          </div>

          {/* Tên trường */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên trường <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <School className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                {...register("school_name")}
                placeholder="Trường Đại học Kỹ thuật Công nghiệp Thái Nguyên"
                disabled={isLoading}
                className={[
                  "w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 border-2 transition-all",
                  errors.school_name
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:border-gray-300",
                  "focus:outline-none focus:bg-white focus:border-[#00994C]",
                ].join(" ")}
              />
            </div>
            {errors.school_name && (
              <p className="text-red-600 text-xs mt-2">
                {errors.school_name.message}
              </p>
            )}
          </div>

          {/* Tiểu sử (bio) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiểu sử / Giới thiệu bản thân{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <BookOpen className="absolute left-4 top-8 w-5 h-5 text-gray-400" />
              <textarea
                {...register("bio")}
                rows={4}
                placeholder="Giáo viên Tin học, chuyên dạy lập trình Scratch và Python cơ bản cho học sinh THCS..."
                disabled={isLoading}
                className={[
                  "w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 border-2 transition-all resize-none",
                  errors.bio
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:border-gray-300",
                  "focus:outline-none focus:bg-white focus:border-[#00994C]",
                ].join(" ")}
              />
            </div>
            {errors.bio && (
              <p className="text-red-600 text-xs mt-2">{errors.bio.message}</p>
            )}
          </div>

          <div className="flex justify-between flex-wrap gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Môn chuyên dạy <span className="text-red-500">*</span>
              </label>
              <Controller
                name="specialization"
                control={control}
                render={({ field }) => (
                  <div className="flex justify-center items-center flex-wrap gap-4">
                    {["Toán", "Vật lý", "Hóa học", "Sinh học"].map(
                      (subject) => (
                        <label
                          key={subject}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            value={subject}
                            checked={field.value?.includes(subject)}
                            onChange={(e) => {
                              const value = e.target.value;
                              const checked = e.target.checked;
                              field.onChange(
                                checked
                                  ? [...(field.value || []), value]
                                  : (field.value || []).filter(
                                      (v: string) => v !== value
                                    )
                              );
                            }}
                            disabled={isLoading}
                            className="w-5 h-5 text-[#00994C] rounded focus:ring-[#00994C]"
                          />
                          <span className="text-gray-700">{subject}</span>
                        </label>
                      )
                    )}
                  </div>
                )}
              />
              {errors.specialization && (
                <p className="text-red-600 text-xs mt-2">
                  {errors.specialization.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Khối lớp dạy <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  name="grade_levels_taught"
                  control={control}
                  render={({ field }) => (
                    <div className="flex justify-center items-center flex-wrap gap-4">
                      {[10, 11, 12].map((grade) => (
                        <label
                          key={grade}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            value={grade}
                            checked={field.value?.includes(grade)}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              const checked = e.target.checked;
                              field.onChange(
                                checked
                                  ? [...(field.value || []), value]
                                  : (field.value || []).filter(
                                      (v: number) => v !== value
                                    )
                              );
                            }}
                            disabled={isLoading}
                            className="w-5 h-5 text-[#00994C] rounded focus:ring-[#00994C]"
                          />
                          <span className="text-gray-700">Lớp {grade}</span>
                        </label>
                      ))}
                    </div>
                  )}
                />
              </div>
              {errors.grade_levels_taught && (
                <p className="text-red-600 text-xs mt-2">
                  {errors.grade_levels_taught.message}
                </p>
              )}
            </div>
          </div>

          {/* Nút submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-8 py-4 rounded-2xl bg-gradient-to-r from-[#00994C] to-[#0077CC] text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-[#00994C]/30 disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
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
                Đang tạo profile...
              </span>
            ) : (
              "Hoàn tất tạo Profile Giáo Viên"
            )}
          </button>
        </form>
      </div>

      <div className="flex justify-end mt-6">
        <Button
          variant="default"
          className="bg-primary-light hover:bg-primary-dark"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
        </Button>
      </div>
    </div>
  );
};

export default CreateProfileTeacher;
