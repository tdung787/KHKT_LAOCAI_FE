import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Award,
  CheckCircle,
  Clock,
  Loader2,
  Trophy,
  AlertTriangle,
  Users,
  ArrowUpDown,
  Download,
  FileSpreadsheet,
  FileText,
  TrendingDown,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { IEvalHistoryItem, IEvalSummary } from "@/infra/apiRAG/type/IEval";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  calculateStudentStats,
  calculateClassStats,
  exportToCSV,
  exportToExcelHTML,
  downloadCSV,
  downloadExcelHTML,
  groupStudentsByPerformance,
  findMostImproved,
  findDeclining,
  type StudentStatistics,
} from "./Classevaluationutils";
import quizAPI from "@/infra/apiRAG/quiz/quizAPI";

// ========================
// TYPES
// ========================

interface StudentEvalData {
  userId: string;
  studentCode?: string;
  userName?: string;
  summary: IEvalSummary | null;
  history: IEvalHistoryItem[];
  isLoading: boolean;
  error: string | null;
}

interface ClassEvaluationDashboardEnhancedProps {
  userIds: Array<{ userId: string; studentCode?: string; userName?: string }>;
}

type SortField =
  | "avg_score"
  | "total_score"
  | "submissions"
  | "on_time_rate"
  | "competence"
  | "discipline";
type SortOrder = "asc" | "desc";

// ========================
// Helper Functions
// ========================

const getRatingColor = (rating: string) => {
  if (rating.includes("Xuất sắc")) return "bg-[#00994c] text-white";
  if (rating.includes("Tốt")) return "bg-[#008c8c] text-white";
  if (rating.includes("Giỏi")) return "bg-[#32CD32] text-white";
  if (rating.includes("Khá")) return "bg-[#0077cc] text-white";
  if (rating.includes("Trung bình")) return "bg-yellow-500 text-white";
  return "bg-gray-500 text-white";
};

const getScoreColor = (score: number) => {
  if (score >= 9) return "text-[#00994c]";
  if (score >= 8) return "text-[#008c8c]";
  if (score >= 6.5) return "text-[#0077cc]";
  if (score >= 5) return "text-yellow-600";
  return "text-red-600";
};

const getTrendIcon = (trend: "up" | "down" | "stable") => {
  if (trend === "up") return <TrendingUp className="w-4 h-4 text-green-600" />;
  if (trend === "down")
    return <TrendingDown className="w-4 h-4 text-red-600" />;
  return <Minus className="w-4 h-4 text-gray-400" />;
};

// ========================
// Main Component
// ========================

export default function ClassEvaluationDashboardEnhanced({
  userIds,
}: ClassEvaluationDashboardEnhancedProps) {
  const [studentsData, setStudentsData] = useState<StudentEvalData[]>([]);
  const [sortField, setSortField] = useState<SortField>("avg_score");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Load data khi component mount hoặc userIds thay đổi
  useEffect(() => {
    if (userIds.length > 0) {
      loadAllStudentsData();
    }
  }, [userIds]);

  const loadAllStudentsData = async () => {
    console.log("🔍 Loading data for userIds:", userIds);

    const initialData: StudentEvalData[] = userIds.map((user) => ({
      userId: user.userId,
      studentCode: user.studentCode,
      userName: user.userName,
      summary: null,
      history: [],
      isLoading: true,
      error: null,
    }));
    setStudentsData(initialData);

    const promises = userIds.map(async (user, index) => {
      try {
        console.log(
          `📡 Calling API for user ${user.userId} (${user.studentCode})`
        );

        // ✅ GỌI TRỰC TIẾP API
        const result = await quizAPI.getAllEval(user.userId, 7);

        console.log(`✅ API response for ${user.studentCode}:`, result);

        if (!result) {
          console.log(`❌ No data in response for ${user.studentCode}`);
          return {
            index,
            data: {
              userId: user.userId,
              studentCode: user.studentCode,
              userName: user.userName,
              summary: null,
              history: [],
              isLoading: false,
              error: "Không có dữ liệu",
            },
          };
        }

        // ✅ CHECK XEM CÓ DATA THỰC SỰ KHÔNG
        const hasValidData =
          result.summary &&
          result.summary.total_days > 0 &&
          typeof result.summary.avg_score !== "undefined" &&
          result.history &&
          result.history.length > 0;

        if (!hasValidData) {
          console.log(`⚠️ No valid data for ${user.studentCode}`);
        }

        return {
          index,
          data: {
            userId: user.userId,
            studentCode: user.studentCode,
            userName: user.userName,
            summary: hasValidData ? result.summary : null,
            history: hasValidData ? result.history : [],
            isLoading: false,
            error: null,
          },
        };
      } catch (error) {
        console.error(`❌ Error loading data for ${user.studentCode}:`, error);
        return {
          index,
          data: {
            userId: user.userId,
            studentCode: user.studentCode,
            userName: user.userName,
            summary: null,
            history: [],
            isLoading: false,
            error: "Không tải được dữ liệu",
          },
        };
      }
    });

    const results = await Promise.all(promises);
    setStudentsData((prev) => {
      const newData = [...prev];
      results.forEach((result) => {
        newData[result.index] = result.data;
      });
      // console.log("📊 Final studentsData:", newData);
      // console.log(
      //   "📊 Valid students:",
      //   newData.filter((s) => s.summary !== null).length
      // );
      return newData;
    });
  };

  // ========================
  // Computed Statistics with Utils
  // ========================

  const studentStatistics = useMemo(() => {
    const stats = studentsData
      .map((student) => {
        const stat = calculateStudentStats(
          student.userId,
          student.studentCode,
          student.userName,
          student.summary,
          student.history
        );
        return stat;
      })
      .filter((s): s is StudentStatistics => s !== null);

    return stats;
  }, [studentsData]);

  const classStatistics = useMemo(() => {
    return calculateClassStats(studentStatistics);
  }, [studentStatistics]);

  const studentGroups = useMemo(() => {
    return groupStudentsByPerformance(studentStatistics);
  }, [studentStatistics]);

  const mostImproved = useMemo(() => {
    return findMostImproved(studentStatistics, 5);
  }, [studentStatistics]);

  const declining = useMemo(() => {
    return findDeclining(studentStatistics, 5);
  }, [studentStatistics]);

  // Sorted students list
  const sortedStudents = useMemo(() => {
    return [...studentStatistics].sort((a, b) => {
      let aValue = 0;
      let bValue = 0;

      switch (sortField) {
        case "avg_score":
          aValue = a.avgScore;
          bValue = b.avgScore;
          break;
        case "total_score":
          aValue = a.totalScore;
          bValue = b.totalScore;
          break;
        case "submissions":
          aValue = a.avgSubmissions;
          bValue = b.avgSubmissions;
          break;
        case "on_time_rate":
          aValue = a.onTimeRate;
          bValue = b.onTimeRate;
          break;
        case "competence":
          aValue = a.competenceScore;
          bValue = b.competenceScore;
          break;
        case "discipline":
          aValue = a.disciplineScore;
          bValue = b.disciplineScore;
          break;
      }

      return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
    });
  }, [studentStatistics, sortField, sortOrder]);

  // Loading & State checks
  const isLoadingAny = studentsData.some((s) => s.isLoading);
  const hasErrors = studentsData.some((s) => s.error);
  const hasValidData = studentStatistics.length > 0;

  // ========================
  // Export Functions
  // ========================

  const handleExportCSV = () => {
    const csv = exportToCSV(studentStatistics, classStatistics);
    const date = new Date().toISOString().split("T")[0];
    downloadCSV(csv, `bao-cao-danh-gia-${date}.csv`);
  };

  const handleExportExcel = () => {
    const html = exportToExcelHTML(studentStatistics, classStatistics);
    const date = new Date().toISOString().split("T")[0];
    downloadExcelHTML(html, `bao-cao-danh-gia-${date}.xls`);
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="mx-auto space-y-3 sm:space-y-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Bảng Tổng Hợp Đánh Giá Lớp
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          Thống kê và phân tích tổng quan {userIds.length} học sinh
        </p>
      </div>

      {/* Loading State */}
      {isLoadingAny && (
        <div className="flex flex-col sm:flex-row items-center justify-center py-8 sm:py-12 gap-2">
          <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-blue-500" />
          <span className="text-sm sm:text-base text-gray-600 text-center">
            Đang tải dữ liệu {userIds.length} học sinh...
          </span>
        </div>
      )}

      {/* Error State */}
      {!isLoadingAny && hasErrors && !hasValidData && (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4">
          <AlertTriangle className="h-10 w-10 sm:h-12 sm:w-12 text-orange-500 mb-3 sm:mb-4" />
          <p className="text-base sm:text-lg font-medium text-gray-900">
            Không thể tải dữ liệu
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 text-center">
            Vui lòng kiểm tra kết nối và thử lại
          </p>
          <Button
            onClick={() => loadAllStudentsData()}
            className="mt-3 sm:mt-4"
            variant="outline"
            size="sm"
          >
            Thử lại
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoadingAny && !hasValidData && !hasErrors && (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4">
          <Users className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
          <p className="text-base sm:text-lg font-medium text-gray-900">
            Chưa có dữ liệu đánh giá
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 text-center">
            Các học sinh chưa có lịch sử đánh giá
          </p>
        </div>
      )}

      {/* Main Content - CHỈ HIỂN THỊ KHI CÓ DATA HỢP LỆ */}
      {!isLoadingAny && hasValidData && (
        <div className="space-y-4 sm:space-y-6">
          {/* Overview Stats - Mobile: 2 cols, Tablet: 3 cols, Desktop: 5 cols */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
            <div className="bg-gradient-to-br from-[#00994c] to-[#007a3d] rounded-lg p-3 sm:p-4 text-white shadow-lg">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                <p className="text-xs sm:text-sm opacity-90">Tổng HS</p>
              </div>
              <p className="text-2xl sm:text-3xl font-bold">
                {classStatistics.totalStudents}
              </p>
              <p className="text-[10px] sm:text-xs opacity-75 mt-0.5 sm:mt-1">
                {userIds.length} được chọn
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#008c8c] to-[#007070] rounded-lg p-3 sm:p-4 text-white shadow-lg">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                <p className="text-xs sm:text-sm opacity-90">ĐTB Lớp</p>
              </div>
              <p className="text-2xl sm:text-3xl font-bold">
                {classStatistics.avgClassScore.toFixed(2)}
              </p>
              <p className="text-[10px] sm:text-xs opacity-75 mt-0.5 sm:mt-1">
                SD: {classStatistics.scoreStdDev.toFixed(2)}
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#0077cc] to-[#0066bb] rounded-lg p-3 sm:p-4 text-white shadow-lg">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                <p className="text-xs sm:text-sm opacity-90">Tỷ lệ Đạt</p>
              </div>
              <p className="text-2xl sm:text-3xl font-bold">
                {classStatistics.passRate.toFixed(0)}%
              </p>
              <p className="text-[10px] sm:text-xs opacity-75 mt-0.5 sm:mt-1">
                ≥ 5.0 điểm
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#ff9800] to-[#f57c00] rounded-lg p-3 sm:p-4 text-white shadow-lg">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                <p className="text-xs sm:text-sm opacity-90">Xuất sắc</p>
              </div>
              <p className="text-2xl sm:text-3xl font-bold">
                {classStatistics.excellentRate.toFixed(0)}%
              </p>
              <p className="text-[10px] sm:text-xs opacity-75 mt-0.5 sm:mt-1">
                ≥ 8.0 điểm
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#9c27b0] to-[#7b1fa2] rounded-lg p-3 sm:p-4 text-white shadow-lg col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                <p className="text-xs sm:text-sm opacity-90">Đúng giờ</p>
              </div>
              <p className="text-2xl sm:text-3xl font-bold">
                {classStatistics.avgOnTimeRate.toFixed(0)}%
              </p>
              <p className="text-[10px] sm:text-xs opacity-75 mt-0.5 sm:mt-1">
                TB toàn lớp
              </p>
            </div>
          </div>

          {/* Performance Distribution - Mobile: 2 cols, Desktop: 4 cols */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-2.5 sm:p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs sm:text-sm font-medium text-green-700">
                  Xuất sắc
                </span>
                <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-green-700">
                {studentGroups.excellent.length}
              </p>
              <p className="text-[10px] sm:text-xs text-green-600">
                ≥ 8.0 điểm
              </p>
            </div>

            <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-2.5 sm:p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs sm:text-sm font-medium text-blue-700">
                  Tốt
                </span>
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-blue-700">
                {studentGroups.good.length}
              </p>
              <p className="text-[10px] sm:text-xs text-blue-600">6.5 - 7.9</p>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-2.5 sm:p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs sm:text-sm font-medium text-yellow-700">
                  Trung bình
                </span>
                <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-600" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-yellow-700">
                {studentGroups.average.length}
              </p>
              <p className="text-[10px] sm:text-xs text-yellow-600">
                5.0 - 6.4
              </p>
            </div>

            <div className="bg-red-50 border-2 border-red-500 rounded-lg p-2.5 sm:p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs sm:text-sm font-medium text-red-700">
                  Cần hỗ trợ
                </span>
                <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-red-700">
                {studentGroups.needHelp.length}
              </p>
              <p className="text-[10px] sm:text-xs text-red-600">&lt; 5.0</p>
            </div>
          </div>

          {/* Trends - Mobile: 1 col, Desktop: 2 cols */}
          {(mostImproved.length > 0 || declining.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {/* Most Improved */}
              {mostImproved.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-500 p-3 sm:p-4">
                  <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-green-700">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                    Top Cải Thiện Nhiều Nhất
                  </h3>
                  <div className="space-y-1.5 sm:space-y-2">
                    {mostImproved.slice(0, 5).map((student, index) => (
                      <div
                        key={student.userId}
                        className="flex items-center justify-between bg-white rounded-lg p-2 shadow-sm"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500 flex items-center justify-center font-bold text-white text-[10px] sm:text-xs flex-shrink-0">
                            {index + 1}
                          </div>
                          <span className="text-xs sm:text-sm font-medium truncate">
                            {student.studentCode || `HS ${index + 1}`}
                            {student.userName && (
                              <span className="hidden sm:inline">
                                {" "}
                                - {student.userName}
                              </span>
                            )}
                          </span>
                          <span className="flex-shrink-0">
                            {getTrendIcon(student.improvementTrend)}
                          </span>
                        </div>
                        <div
                          className={`text-xs sm:text-sm font-bold ml-2 flex-shrink-0 ${getScoreColor(
                            student.avgScore
                          )}`}
                        >
                          {student.avgScore.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Declining */}
              {declining.length > 0 && (
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border-2 border-orange-500 p-3 sm:p-4">
                  <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-orange-700">
                    <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />
                    Cần Chú Ý Đặc Biệt
                  </h3>
                  <div className="space-y-1.5 sm:space-y-2">
                    {declining.slice(0, 5).map((student, index) => (
                      <div
                        key={student.userId}
                        className="flex items-center justify-between bg-white rounded-lg p-2 shadow-sm"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white text-[10px] sm:text-xs flex-shrink-0">
                            {index + 1}
                          </div>
                          <span className="text-xs sm:text-sm font-medium truncate">
                            {student.studentCode || `HS ${index + 1}`}
                            {student.userName && (
                              <span className="hidden sm:inline">
                                {" "}
                                - {student.userName}
                              </span>
                            )}
                          </span>
                          <span className="flex-shrink-0">
                            {getTrendIcon(student.improvementTrend)}
                          </span>
                        </div>
                        <div
                          className={`text-xs sm:text-sm font-bold ml-2 flex-shrink-0 ${getScoreColor(
                            student.avgScore
                          )}`}
                        >
                          {student.avgScore.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Full Student List */}
          <div className="bg-white rounded-lg border">
            <div className="p-3 sm:p-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h3 className="text-sm sm:text-base font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#00994c]" />
                Danh sách chi tiết ({sortedStudents.length} học sinh)
              </h3>
              <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                <Select
                  value={sortField}
                  onValueChange={(value) => setSortField(value as SortField)}
                >
                  <SelectTrigger className="w-[130px] sm:w-[150px] h-8 sm:h-9 text-xs sm:text-sm">
                    <SelectValue placeholder="Sắp xếp theo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="avg_score">Điểm TB</SelectItem>
                    <SelectItem value="total_score">Tổng điểm</SelectItem>
                    <SelectItem value="submissions">Số bài nộp</SelectItem>
                    <SelectItem value="on_time_rate">Đúng giờ</SelectItem>
                    <SelectItem value="competence">Năng lực</SelectItem>
                    <SelectItem value="discipline">Kỷ luật</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 sm:h-9 px-2 sm:px-3"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                >
                  <ArrowUpDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                  {sortOrder === "desc" ? "↓" : "↑"}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
                    >
                      <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">Xuất báo cáo</span>
                      <span className="xs:hidden">Xuất</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleExportCSV}>
                      <FileText className="w-4 h-4 mr-2" />
                      Xuất CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportExcel}>
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      Xuất Excel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="w-full overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              {" "}
              {/* Wrapper chính, co theo màn hình và cho phép scroll ngang */}
              <div className="inline-block min-w-full align-middle">
                {" "}
                {/* Đảm bảo table không co quá nhỏ */}
                <table className="w-full min-w-[340px]">
                  {" "}
                  {/* Giữ min-w-[640px] để buộc scroll khi cần */}
                  <thead className="bg-gray-50">
                    <tr>
                      {/* STT - Luôn hiển thị */}
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                        STT
                      </th>

                      {/* Học sinh - Luôn hiển thị (cột chính) */}
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                        Học sinh
                      </th>

                      {/* Số ngày - Ẩn trên mobile */}
                      <th className="hidden md:table-cell px-2 sm:px-4 py-2 sm:py-3 text-center text-[10px] sm:text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                        Số ngày
                      </th>

                      {/* Điểm TB - Luôn hiển thị (rất quan trọng) */}
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-[10px] sm:text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                        Điểm TB
                      </th>

                      {/* Bài/Ngày - Luôn hiển thị */}
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-[10px] sm:text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                        Bài/Ngày
                      </th>

                      {/* Đúng giờ - Ẩn trên mobile */}
                      <th className="hidden md:table-cell px-2 sm:px-4 py-2 sm:py-3 text-center text-[10px] sm:text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                        Đúng giờ
                      </th>

                      {/* Năng lực - Ẩn trên mobile */}
                      <th className="hidden md:table-cell px-2 sm:px-4 py-2 sm:py-3 text-center text-[10px] sm:text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                        Năng lực
                      </th>

                      {/* Kỷ luật - Ẩn trên mobile */}
                      <th className="hidden md:table-cell px-2 sm:px-4 py-2 sm:py-3 text-center text-[10px] sm:text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                        Kỷ luật
                      </th>

                      {/* Xếp loại - Luôn hiển thị (kết luận quan trọng) */}
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-[10px] sm:text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                        Xếp loại
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sortedStudents.map((student, index) => (
                      <tr
                        key={student.userId}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* STT - Luôn hiển thị */}
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900">
                          {index + 1}
                        </td>

                        {/* Học sinh - Luôn hiển thị (cột chính) */}
                        <td className="px-2 sm:px-4 py-2 sm:py-3">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <div>
                              <div className="text-xs sm:text-sm font-medium text-gray-900">
                                {student.userName || "Học sinh"}
                              </div>
                              <div className="text-[10px] sm:text-xs text-gray-500">
                                {student.studentCode || "Mã HS không rõ"}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Số ngày - Ẩn trên mobile */}
                        <td className="hidden md:table-cell px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm">
                          {student.totalDays}
                        </td>

                        {/* Điểm TB - Luôn hiển thị (rất quan trọng) */}
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                          <span
                            className={`text-base sm:text-lg font-bold ${getScoreColor(
                              student.avgScore
                            )}`}
                          >
                            {student.avgScore.toFixed(2)}
                          </span>
                        </td>

                        {/* Bài/Ngày - Luôn hiển thị */}
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm">
                          {student.avgSubmissions.toFixed(1)}
                        </td>

                        {/* Đúng giờ - Ẩn trên mobile */}
                        <td className="hidden md:table-cell px-2 sm:px-4 py-2 sm:py-3 text-center">
                          <span className="text-xs sm:text-sm font-semibold text-[#00994c]">
                            {student.onTimeRate.toFixed(0)}%
                          </span>
                        </td>

                        {/* Năng lực - Ẩn trên mobile */}
                        <td className="hidden md:table-cell px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold text-[#00994c]">
                          {student.competenceScore.toFixed(1)}
                        </td>

                        {/* Kỷ luật - Ẩn trên mobile */}
                        <td className="hidden md:table-cell px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold text-[#008c8c]">
                          {student.disciplineScore.toFixed(1)}
                        </td>

                        {/* Xếp loại - Luôn hiển thị */}
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                          <Badge
                            className={`${getRatingColor(
                              student.mostCommonRating
                            )} text-[10px] sm:text-xs`}
                          >
                            {student.mostCommonRating}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
