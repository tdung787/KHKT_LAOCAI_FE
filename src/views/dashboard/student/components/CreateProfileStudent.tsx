"use client";

import { FC, useState } from "react";
import {
  User,
  BookOpen,
  School,
  GraduationCap,
  Brain,
  Target,
  Sparkles,
  LogOut,
} from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axiosInstance from "@/infra/api/conflig/axiosInstance";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/utility";
import { useNavigate } from "react-router";
import { VALID_CLASSES } from ".";
import { handleApiError } from "@/utility/lib/errorHandler";
// Interface TypeScript rõ ràng, đơn giản, dễ hiểu - đúng kiểu gửi lên backend
interface CreateProfileFormData {
  student_code: string;
  avatar?: string;
  grade_level: number;
  current_class: string;
  school_name: string;
  learning_style: "visual" | "auditory" | "kinesthetic" | "reading_writing";
  difficulty_preference: "easy" | "medium" | "hard";
}

interface CreateProfileStudentProps {
  onSuccess?: () => void;
}

// Schema Zod chỉ dùng để validate, không coerce/preprocess phức tạp → tránh lỗi type
const createProfileSchema = z.object({
  student_code: z.string().min(1, "Mã học sinh là bắt buộc"),
  avatar: z
    .string()
    .url("URL avatar không hợp lệ")
    .optional()
    .or(z.literal("")),
  grade_level: z
    .number()
    .int()
    .min(10, "Khối lớp tối thiểu là 10")
    .max(12, "Khối lớp tối đa là 12"),
  current_class: z.string().min(1, "Lớp hiện tại là bắt buộc"),
  school_name: z.string().min(1, "Tên trường là bắt buộc"),
  learning_style: z.enum(
    ["visual", "auditory", "kinesthetic", "reading_writing"],
    {
      message: "Vui lòng chọn phong cách học hợp lệ",
    }
  ),
  difficulty_preference: z.enum(["easy", "medium", "hard"], {
    message: "Vui lòng chọn độ khó ưu tiên",
  }),
});

const CreateProfileStudent: FC<CreateProfileStudentProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateProfileFormData>({
    resolver: zodResolver(createProfileSchema),
    defaultValues: {
      student_code: "",
      avatar: "",
      grade_level: 12,
      current_class: "",
      school_name: "",
      learning_style: "visual",
      difficulty_preference: "medium",
    },
  });

  const selectedGrade = watch("grade_level");

  const filteredClasses = VALID_CLASSES.filter((cls) =>
    cls.startsWith(`${selectedGrade} `)
  );

  const onSubmit = async (data: CreateProfileFormData) => {
    setIsLoading(true);
    try {
      await axiosInstance.post("/private/students/profile", data);

      toast.success("Tạo profile học sinh thành công!", {
        icon: "🎉",
        duration: 4000,
      });

      reset();
      onSuccess?.();
    } catch (err) {
      const error = handleApiError(err);

      toast.error(error.message, { duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };
  const navigate = useNavigate();
   const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-full max-w-2xl mx-auto  px-4">
      {/* Header */}
      <div className="text-center my-8">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900">
            🎉 Chào mừng bạn đến với hệ thống học tập AI!
          </h3>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Để sử dụng đầy đủ trợ lý AI và các tính năng cá nhân hóa, bạn cần
            hoàn thiện hồ sơ học sinh ngay bây giờ.
          </p>
        </div>

        {/* Ảnh robot chỉ tay xuống form - chọn những cái rõ ràng nhất */}
        <div className="relative max-w-md mx-auto ">
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
            <div className="text-5xl animate-bounce">👇</div>
          </div>
        </div>

        {/* Tiêu đề form */}
        <div className="mt-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Tạo Profile Học Sinh
          </h1>
          <p className="text-xl text-gray-600 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            Bắt đầu hành trình học tập cá nhân hóa với AI
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          {/* Mã học sinh + Avatar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã học sinh <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register("student_code")}
                  placeholder="HS00030"
                  disabled={isLoading}
                  className={[
                    "w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 border-2 transition-all",
                    errors.student_code
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300",
                    "focus:outline-none focus:bg-white focus:border-[#00994C]",
                  ].join(" ")}
                />
              </div>
              {errors.student_code && (
                <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-600"></span>
                  {errors.student_code.message}
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
                  placeholder="https://i.pravatar.cc/150?img=1"
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
                <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-600"></span>
                  {errors.avatar.message}
                </p>
              )}
            </div>
          </div>

          {/* Khối lớp + Lớp hiện tại */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Khối lớp <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  {...register("grade_level", { valueAsNumber: true })}
                  disabled={isLoading}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 bg-gray-50 focus:bg-white focus:border-[#00994C] outline-none ${
                    errors.grade_level ? "border-red-300" : "border-gray-200"
                  }`}
                >
                  <option value={10}>Khối 10</option>
                  <option value={11}>Khối 11</option>
                  <option value={12}>Khối 12</option>
                </select>
              </div>
              {errors.grade_level && (
                <p className="text-red-600 text-xs mt-1">{errors.grade_level.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lớp hiện tại <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  {...register("current_class")}
                  disabled={isLoading || filteredClasses.length === 0}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 bg-gray-50 focus:bg-white focus:border-[#00994C] outline-none ${
                    errors.current_class ? "border-red-300" : "border-gray-200"
                  }`}
                >
                  {filteredClasses.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>
              {errors.current_class && (
                <p className="text-red-600 text-xs mt-1">{errors.current_class.message}</p>
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
                placeholder="THPT Nguyễn Du"
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
              <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-red-600"></span>
                {errors.school_name.message}
              </p>
            )}
          </div>

          {/* Phong cách học + Độ khó */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phong cách học
              </label>
              <div className="relative">
                <Brain className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  {...register("learning_style")}
                  disabled={isLoading}
                  className={[
                    "w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 text-gray-900 border-2 transition-all appearance-none",
                    errors.learning_style
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300",
                    "focus:outline-none focus:bg-white focus:border-[#00994C]",
                  ].join(" ")}
                >
                  <option value="visual">Visual (Hình ảnh)</option>
                  <option value="auditory">Auditory (Thính giác)</option>
                  <option value="kinesthetic">Kinesthetic (Vận động)</option>
                  <option value="reading_writing">Reading/Writing</option>
                </select>
              </div>
              {errors.learning_style && (
                <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-600"></span>
                  {errors.learning_style.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Độ khó ưu tiên
              </label>
              <div className="relative">
                <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  {...register("difficulty_preference")}
                  disabled={isLoading}
                  className={[
                    "w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 text-gray-900 border-2 transition-all appearance-none",
                    errors.difficulty_preference
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300",
                    "focus:outline-none focus:bg-white focus:border-[#00994C]",
                  ].join(" ")}
                >
                  <option value="easy">Dễ</option>
                  <option value="medium">Trung bình</option>
                  <option value="hard">Khó</option>
                </select>
              </div>
              {errors.difficulty_preference && (
                <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-600"></span>
                  {errors.difficulty_preference.message}
                </p>
              )}
            </div>
          </div>

          {/* Nút submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-4 rounded-2xl bg-gradient-to-r from-[#00994C] to-[#0077CC] text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-[#00994C]/30 disabled:opacity-60 disabled:hover:translate-y-0"
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
              "Hoàn tất tạo Profile"
            )}
          </button>
        </form>
      </div>
        <div className="flex justify-end items-end mt-2">
              <Button className="bg-primary-light hover:bg-primary-dark" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" /> Đăng xuất</Button>
        </div>
    </div>
  );
};

export default CreateProfileStudent;
