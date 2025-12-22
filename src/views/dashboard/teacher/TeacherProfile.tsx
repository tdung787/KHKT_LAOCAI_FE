"use client";

import { useEffect, useState } from "react";
import { useTeacherStore } from "@/utility/stores/teacherStores";
import { useAuthStore } from "@/utility/stores/authStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  School,
  Calendar,
  BookOpen,
  Loader2,
  Award,
  GraduationCap,
  SquareChartGantt,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CreateProfileTeacher from "./components/CreateProfileTeacher";

const TeacherProfile = () => {
  const { user } = useAuthStore();
  const { teacher, isLoading, error, getProfileTeacher, clearError } =
    useTeacherStore();
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [isForceCreateOpen, setIsForceCreateOpen] = useState(false);

  // Key lưu localStorage để tránh hỏi tạo profile lại nhiều lần
  const PROFILE_CREATED_KEY = "teacher_profile_created";

  // Load profile khi có user
  useEffect(() => {
    if (user?.id) {
      getProfileTeacher();
    }
  }, [user?.id, getProfileTeacher]);

  // Toast lỗi
  useEffect(() => {
    if (error) {
      toast.error(error.message || "Không thể tải thông tin giáo viên");
      clearError();
    }
  }, [error, clearError]);

  // Kiểm tra xem có cần force tạo profile không
  useEffect(() => {
    if (isLoading) return;

    if (teacher === null) {
      const hasCreatedFlag =
        localStorage.getItem(PROFILE_CREATED_KEY) === "true";
      if (!hasCreatedFlag) {
        setIsForceCreateOpen(true);
      }
    } else if (teacher && typeof teacher === "object") {
      // localStorage.setItem(PROFILE_CREATED_KEY, "true");
      setIsForceCreateOpen(false);
    }
  }, [isLoading, teacher]);

  // Tính % hoàn thiện profile
  useEffect(() => {
    if (teacher) {
      const fields = [
        teacher.user_id?.full_name,
        teacher.user_id?.email,
        teacher.teacher_code,
        teacher.school_name,
        teacher.bio,
        teacher.specialization?.length > 0,
        teacher.grade_levels_taught?.length > 0,
      ];
      const completed = fields.filter(Boolean).length;
      const percentage = Math.round((completed / fields.length) * 100);
      setProfileCompletion(percentage);
    }
  }, [teacher]);

  // Callback khi tạo profile thành công
  const handleProfileCreated = () => {
    localStorage.setItem(PROFILE_CREATED_KEY, "true");
    setIsForceCreateOpen(false);
    getProfileTeacher(); // Reload profile mới
    toast.success("Tạo hồ sơ giáo viên thành công! 🎉");
  };

  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate("/teacher/dashboard/classes");
  };

  const getJoinedDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary-light)]" />
      </div>
    );
  }

  return (
    <>
      {/* Màn hình chào mừng khi chưa có profile */}
      {!teacher && (
        <div
          className="h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 relative overflow-hidden"
          style={{
             backgroundImage:
              "url('https://thumbs.dreamstime.com/b/dreamy-sunset-sky-gradient-background-soft-pastel-tones-smooth-featuring-clouds-inspired-warm-light-great-411611119.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/30" />

      

          <div className="relative z-20 flex items-center justify-center h-full">
            <div className="text-center text-white">
              <h1 className="text-6xl font-bold drop-shadow-2xl">
                Chào mừng Thầy/Cô!
              </h1>
              <p className="text-3xl mt-6 drop-shadow-lg">
                Đồng hành cùng học sinh với công nghệ AI hiện đại
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dialog bắt buộc tạo profile */}
      <Dialog open={isForceCreateOpen} onOpenChange={() => {}}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <div className="p-6">
            <CreateProfileTeacher onSuccess={handleProfileCreated} />
          </div>
          <div className="text-center text-sm text-gray-500 pb-6 px-6 border-t pt-4">
            Bạn bắt buộc phải hoàn thành hồ sơ để sử dụng đầy đủ các tính năng
            dành cho giáo viên.
          </div>
        </DialogContent>
      </Dialog>

      {/* Trang profile chính */}
      {teacher && (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-5xl mx-auto px-4">
            {/* Header Card */}
            <Card className="mb-6 shadow-lg">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                      {teacher?.avatar ? (
                        <img
                          src={teacher.avatar}
                          alt={teacher.user_id?.full_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        teacher?.user_id?.full_name?.charAt(0).toUpperCase() ||
                        "T"
                      )}
                    </div>
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                      {teacher.user_id?.full_name || "Giáo viên"}
                    </h1>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-600 text-sm mb-4">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        <span>Mã GV: {teacher.teacher_code || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <School className="w-5 h-5" />
                        <span>{teacher.school_name || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        <span>
                          Tham gia {getJoinedDate(teacher.created_at || "")}
                        </span>
                      </div>
                    </div>

                    {/* Quick stats */}
                    <div className="flex gap-8 justify-center md:justify-start mt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-indigo-600">
                          {teacher.specialization?.length || 0}
                        </p>
                        <p className="text-sm text-gray-500">Môn chuyên</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">
                          {teacher.grade_levels_taught?.length || 0}
                        </p>
                        <p className="text-sm text-gray-500">Khối dạy</p>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <Button
                    size="lg"
                    onClick={handleGoToDashboard}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg"
                  >
                    <SquareChartGantt className="w-5 h-5 mr-2" />
                    Quản lý lớp học
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Sidebar */}
              <div className="space-y-6">
                {/* Hoàn thiện hồ sơ */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Hoàn thiện hồ sơ
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tiến độ</span>
                        <span className="font-bold text-indigo-600">
                          {profileCompletion}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all"
                          style={{ width: `${profileCompletion}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Giới thiệu */}
                {teacher.bio && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Giới thiệu
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed break-words whitespace-pre-wrap">
                        {teacher.bio || "Chưa có thông tin giới thiệu."}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Liên hệ */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      Liên hệ
                    </h3>
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="text-gray-700 font-medium break-all">
                          {teacher.user_id?.email || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Điện thoại</p>
                        <p className="text-gray-700 font-medium">
                          {teacher.user_id?.phone || "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Main Area */}
              <div className="lg:col-span-2 space-y-6">
                {/* Thông tin giảng dạy */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Thông tin giảng dạy
                    </h3>

                    <div className="space-y-6">
                      <div>
                        <p className="text-sm text-gray-500 mb-3">
                          Môn chuyên dạy
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {teacher.specialization?.length > 0 ? (
                            teacher.specialization.map((sub) => (
                              <Badge
                                key={sub}
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                              >
                                {sub}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-500">Chưa cập nhật</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 mb-3">
                          Khối lớp giảng dạy
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {teacher.grade_levels_taught?.length > 0 ? (
                            teacher.grade_levels_taught.map((grade) => (
                              <Badge
                                key={grade}
                                variant="outline"
                                className="border-indigo-500 text-indigo-700"
                              >
                                <GraduationCap className="w-3 h-3 mr-1" />
                                Khối {grade}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-500">Chưa cập nhật</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Hoạt động */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Hoạt động tài khoản
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs mb-1">
                          Ngày tham gia
                        </p>
                        <p className="font-medium">
                          {teacher.created_at
                            ? new Date(teacher.created_at).toLocaleDateString(
                                "vi-VN"
                              )
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">
                          Cập nhật gần nhất
                        </p>
                        <p className="font-medium">
                          {teacher.updated_at
                            ? new Date(teacher.updated_at).toLocaleDateString(
                                "vi-VN"
                              )
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TeacherProfile;
