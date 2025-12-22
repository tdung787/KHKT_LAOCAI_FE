import { useEffect, useState } from "react";
import { useStudentStore } from "@/utility/stores/studentStore";
import { useAuthStore } from "@/utility/stores/authStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  User,
  Mail,
  School,
  Calendar,
  BookOpen,
  Loader2,
  MapPin,
  Briefcase,
  Users,
  Phone,
  GraduationCap,
  Bot,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import CreateProfileStudent from "./components/CreateProfileStudent";

const StudentProfile = () => {
  const { user,clearError } = useAuthStore();
  const { student, isLoading, error, getProfileStudent,clearErrorStuProfile  } = useStudentStore();
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [isForceCreateOpen, setIsForceCreateOpen] = useState(false);
  const navigate = useNavigate();

  // Key để lưu trong localStorage
  const PROFILE_CREATED_KEY = "student_profile_created";
  useEffect(() => {
    if (user?.id) {
      getProfileStudent();
    }
  }, [user?.id, getProfileStudent]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Không thể tải thông tin học sinh");
      clearError(); // Clear ngay để không toast lặp
      clearErrorStuProfile();
    }
  }, [error, clearError,clearErrorStuProfile]);

  // Kiểm tra profile sau khi load xong
  useEffect(() => {
    if (isLoading) return;

    if (student === null) {
      const hasProfileCreatedFlag =
        localStorage.getItem(PROFILE_CREATED_KEY) === "true";
      if (!hasProfileCreatedFlag) {
        setIsForceCreateOpen(true);
      }
    } else if (student && typeof student === "object") {
      // localStorage.setItem(PROFILE_CREATED_KEY, "true");
      setIsForceCreateOpen(false);
    }
  }, [isLoading, student]);


  const handleProfileCreated = () => {
    localStorage.setItem(PROFILE_CREATED_KEY, "true");
    setIsForceCreateOpen(false);
    getProfileStudent(); // Reload lại dữ liệu mới nhất
  };

  // Calculate profile completion
  useEffect(() => {
    if (student) {
      let completed = 0;
      const fields = [
        student.user_id?.full_name,
        student.user_id?.email,
        student.student_code,
        student.school_name,
        student.grade_level,
        student.current_class,
        student.learning_style,
        student.difficulty_preference,
      ];

      completed = fields.filter((field) => field).length;
      const percentage = Math.round((completed / fields.length) * 100);
      setProfileCompletion(percentage);
    }
  }, [student]);


  const handleGo = () => {
    navigate("/student/dashboard/ai-tutors");
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
      {!student && (
        <div
          className="h-screen bg-amber-200 relative overflow-hidden"
          style={{
            backgroundImage:
              "url('https://thumbs.dreamstime.com/b/dreamy-sunset-sky-gradient-background-soft-pastel-tones-smooth-featuring-clouds-inspired-warm-light-great-411611119.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
         

          {/* Optional: Thêm text chào mừng ở giữa nếu muốn */}
          <div className="relative z-20 flex items-center justify-center h-full">
            <div className="text-center text-white">
              <h1 className="text-6xl font-bold drop-shadow-2xl">
                Chào mừng bạn!
              </h1>
              <p className="text-3xl mt-4 drop-shadow-lg">
                Bắt đầu hành trình học tập cùng AI
              </p>
            </div>
          </div>
        </div>
      )}
      <Dialog open={isForceCreateOpen} onOpenChange={() => {}}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto p-0">
          <div className="px-6 ">
            <CreateProfileStudent onSuccess={handleProfileCreated} />
          </div>
          <div className="text-center text-sm text-gray-500 pb-6 px-6">
            Bạn bắt buộc phải hoàn thành bước này để tiếp tục sử dụng hệ thống.
          </div>
        </DialogContent>
      </Dialog>
      {student && (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl  mx-auto px-4">
            {/* Header Card */}
            <Card className="mb-2">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-secondary)] flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                      {student?.user_id?.avatar || student?.avatar ? (
                        <img
                          src={student?.user_id?.avatar || student?.avatar}
                          alt={student.user_id.full_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        student?.user_id?.full_name?.charAt(0).toUpperCase() ||
                        "S"
                      )}
                    </div>
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {student?.user_id?.full_name || "Học sinh"}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-gray-600 text-sm">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        <span>Mã HS: {student?.student_code || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{student?.school_name || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Tham gia{" "}
                          {new Date(
                            student?.created_at || ""
                          ).toLocaleDateString("vi-VN", {
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div>
                    {/* <CreateProfileStudent /> */}
                    <Button
                      onClick={handleGo}
                      className="bg-[var(--color-primary-light)] hover:bg-[var(--color-primary-dark)] text-white gap-2"
                    >
                      <Bot className="w-4 h-4" />
                      Trợ lý AI
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {/* Left Column */}
              <div className="space-y-2">
                {/* Profile Completion */}
                <Card>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-gray-900 mb-4 text-sm">
                      Hoàn thiện hồ sơ
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tiến độ</span>
                        <span className="font-semibold text-[var(--color-primary-light)]">
                          {profileCompletion}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[var(--color-primary-light)] to-[var(--color-secondary)] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${profileCompletion}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Basic Info */}
                <Card>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                      <User className="w-4 h-4" />
                      Thông tin cơ bản
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3 text-gray-600">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{student?.user_id?.full_name || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <School className="w-4 h-4 text-gray-400" />
                        <span>{student?.current_class || "Chưa có lớp"}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        <span>Mã HS: {student?.student_code || "N/A"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <Card>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4" />
                      Liên hệ
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1">Email</p>
                          <p className="text-gray-700 break-all">
                            {student?.user_id?.email || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1">
                            Điện thoại
                          </p>
                          <p className="text-gray-700">
                            {student?.user_id?.phone || "Chưa cập nhật"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="md:col-span-2 space-y-2 bg-white rounded-2xl border-2 border-gray-200 shadow-sm">
                {/* School Info */}
                <Card className="border-none shadow-none">
                  <CardContent className="px-5">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                      <School className="w-4 h-4" />
                      Thông tin trường học
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Trường</p>
                          <p className="text-gray-700 font-medium">
                            {student?.school_name || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Users className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Khối</p>
                          <p className="text-gray-700 font-medium">
                            {student?.grade_level || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <School className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Lớp</p>
                          <p className="text-gray-700 font-medium">
                            {student?.current_class || "Chưa có lớp"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Learning Preferences */}
                <Card className="border-none shadow-none">
                  <CardContent className="px-5">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                      <BookOpen className="w-4 h-4" />
                      Sở thích học tập
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-start gap-3">
                        <BookOpen className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Phong cách học
                          </p>
                          <p className="text-gray-700 font-medium capitalize">
                            {student?.learning_style || "Chưa xác định"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <GraduationCap className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Độ khó ưa thích
                          </p>
                          <p className="text-gray-700 font-medium capitalize">
                            {student?.difficulty_preference || "Chưa xác định"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Activity Info */}
                <Card className="border-none shadow-none">
                  <CardContent className="px-5">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      Hoạt động
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-start gap-3">
                        <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Tham gia</p>
                          <p className="text-gray-700 font-medium">
                            {student?.created_at
                              ? new Date(student.created_at).toLocaleDateString(
                                  "vi-VN"
                                )
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Cập nhật gần nhất
                          </p>
                          <p className="text-gray-700 font-medium">
                            {student?.updated_at
                              ? new Date(student.updated_at).toLocaleDateString(
                                  "vi-VN"
                                )
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      {student?.last_active && (
                        <div className="flex items-start gap-3">
                          <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Hoạt động gần nhất
                            </p>
                            <p className="text-gray-700 font-medium">
                              {new Date(student.last_active).toLocaleDateString(
                                "vi-VN"
                              )}
                            </p>
                          </div>
                        </div>
                      )}
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

export default StudentProfile;
