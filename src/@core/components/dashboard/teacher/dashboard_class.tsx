import { useEnrollmentStore } from "@/utility/stores/enrollmentsStore";
import { UserRole } from "../../siderbar";
import { useEffect } from "react";
import ClassEvaluationDashboardEnhanced from "./components/dash2/EvalutedStudentDashboard";

// ========================
// INTERFACES
// ========================

interface StudentsTableProps {
  classId: string;
}

export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  full_name: string;
  avatar?: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Student interface - Fixed
export interface Student {
  id: string;
  user_id: IUser;
  avatar: string;
  student_code: string;
  grade_level: number;
  current_class: string;
  school_name: string;
  learning_style: string;
  created_at: string;
  difficulty_preference: string;
  last_active: string;
  updated_at: string;
  status: string;
  attendance_count: number;
  enrollment_date: string;
  isOnline?: boolean;
}

// Format cho Dashboard Component
interface DashboardUserData {
  userId: string;
  studentCode?: string;
}

// ========================
// COMPONENT
// ========================

export const DashboardClass = ({ classId }: StudentsTableProps) => {
  const { enrollments, isLoading, getEnrollmentsByClass } = useEnrollmentStore();

  useEffect(() => {
    if (classId) {
      getEnrollmentsByClass(classId);
    }
  }, [classId, getEnrollmentsByClass]);

  // Map enrollments sang format phù hợp cho Dashboard
  const dashboardUsers: DashboardUserData[] = enrollments.map((enrollment) => ({
    userId: enrollment.student_id.user_id._id,
    studentCode: enrollment.student_id.student_code,
    userName: enrollment.student_id.user_id.full_name,
  }));

  // console.log("Dashboard Users:", dashboardUsers);

  // Hiển thị loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Đang tải dữ liệu...</div>
      </div>
    );
  }

  // Hiển thị empty state
  if (enrollments.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Chưa có học sinh trong lớp</div>
      </div>
    );
  }

  return (
    <div>
      <ClassEvaluationDashboardEnhanced userIds={dashboardUsers} />
    </div>
  );
};