/**
 * Utility Functions for ClassEvaluationDashboard
 * 
 * Các hàm tiện ích để xử lý dữ liệu, export, và tính toán thống kê
 */

import { IEvalSummary, IEvalHistoryItem } from "@/infra/apiRAG/type/IEval";

// ========================
// TYPES
// ========================

export interface StudentStatistics {
  userId: string;
  studentCode?: string;
  userName?: string;
  avgScore: number;
  totalScore: number;
  avgSubmissions: number;
  onTimeRate: number;
  competenceScore: number;
  disciplineScore: number;
  mostCommonRating: string;
  totalDays: number;
  improvementTrend: "up" | "down" | "stable";
}

export interface ClassStatistics {
  totalStudents: number;
  avgClassScore: number;
  highestScore: number;
  lowestScore: number;
  scoreStdDev: number;
  passRate: number;
  excellentRate: number;
  avgOnTimeRate: number;
  avgCompetence: number;
  avgDiscipline: number;
}

// ========================
// STATISTICAL CALCULATIONS
// ========================

/**
 * Tính độ lệch chuẩn (Standard Deviation)
 */
export function calculateStandardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  
  return Math.sqrt(avgSquaredDiff);
}

/**
 * Tính xu hướng cải thiện (dựa trên 5 ngày đầu vs 5 ngày cuối)
 */
export function calculateImprovementTrend(
  history: IEvalHistoryItem[]
): "up" | "down" | "stable" {
  if (history.length < 6) return "stable";

  const sortedHistory = [...history].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const firstFive = sortedHistory.slice(0, 5);
  const lastFive = sortedHistory.slice(-5);

  const firstAvg = firstFive.reduce((sum, h) => sum + h.avg_score, 0) / 5;
  const lastAvg = lastFive.reduce((sum, h) => sum + h.avg_score, 0) / 5;

  const diff = lastAvg - firstAvg;

  if (diff > 0.5) return "up";
  if (diff < -0.5) return "down";
  return "stable";
}

/**
 * Lấy xếp loại phổ biến nhất từ lịch sử
 */
export function getMostCommonRating(history: IEvalHistoryItem[]): string {
  if (history.length === 0) return "Chưa có";

  const ratingCount: Record<string, number> = {};
  history.forEach(h => {
    ratingCount[h.rating] = (ratingCount[h.rating] || 0) + 1;
  });

  return Object.entries(ratingCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "Chưa có";
}

/**
 * Tính thống kê cho một học sinh
 * ✅ ĐÃ FIX: Thêm validation đầy đủ cho trường hợp không có data
 */
export function calculateStudentStats(
  userId: string,
  studentCode: string | undefined,
    userName: string | undefined,
  summary: IEvalSummary | null,
  history: IEvalHistoryItem[]
): StudentStatistics | null {
  // ✅ CHECK ĐẦY ĐỦ: Kiểm tra xem có data thực sự không
  if (
    !summary ||
    summary.total_days === 0 ||
    typeof summary.avg_score === "undefined" ||
    history.length === 0
  ) {
    console.log(`❌ Invalid data for student ${studentCode}:`, {
      hasSummary: !!summary,
      totalDays: summary?.total_days,
      hasAvgScore: typeof summary?.avg_score !== "undefined",
      historyLength: history.length,
    });
    return null;
  }

  const avgOnTime = history.reduce((sum, h) => sum + h.on_time_rate, 0) / history.length;
  const avgCompetence = history.reduce((sum, h) => sum + h.competence_score, 0) / history.length;
  const avgDiscipline = history.reduce((sum, h) => sum + h.discipline_score, 0) / history.length;

  return {
    userId,
    studentCode,
    userName,
    avgScore: summary.avg_score,
    totalScore: summary.avg_total_score || 0,
    avgSubmissions: summary.avg_daily_submissions || 0,
    onTimeRate: avgOnTime,
    competenceScore: avgCompetence,
    disciplineScore: avgDiscipline,
    mostCommonRating: getMostCommonRating(history),
    totalDays: summary.total_days,
    improvementTrend: calculateImprovementTrend(history),
  };
}

/**
 * Tính thống kê tổng quan cho cả lớp
 */
export function calculateClassStats(
  studentStats: StudentStatistics[]
): ClassStatistics {
  if (studentStats.length === 0) {
    return {
      totalStudents: 0,
      avgClassScore: 0,
      highestScore: 0,
      lowestScore: 0,
      scoreStdDev: 0,
      passRate: 0,
      excellentRate: 0,
      avgOnTimeRate: 0,
      avgCompetence: 0,
      avgDiscipline: 0,
    };
  }

  const scores = studentStats.map(s => s.avgScore);
  const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  const passCount = scores.filter(s => s >= 5).length;
  const excellentCount = scores.filter(s => s >= 8).length;

  return {
    totalStudents: studentStats.length,
    avgClassScore: avgScore,
    highestScore: Math.max(...scores),
    lowestScore: Math.min(...scores),
    scoreStdDev: calculateStandardDeviation(scores),
    passRate: (passCount / studentStats.length) * 100,
    excellentRate: (excellentCount / studentStats.length) * 100,
    avgOnTimeRate: studentStats.reduce((sum, s) => sum + s.onTimeRate, 0) / studentStats.length,
    avgCompetence: studentStats.reduce((sum, s) => sum + s.competenceScore, 0) / studentStats.length,
    avgDiscipline: studentStats.reduce((sum, s) => sum + s.disciplineScore, 0) / studentStats.length,
  };
}

// ========================
// EXPORT FUNCTIONS
// ========================

/**
 * Export dữ liệu ra CSV format
 */
export function exportToCSV(
  studentStats: StudentStatistics[],
  classStats: ClassStatistics
): string {
  const headers = [
    "STT",
    "Mã HS",
    "Điểm TB",
    "Tổng Điểm",
    "Bài/Ngày",
    "Đúng Giờ (%)",
    "Năng Lực",
    "Kỷ Luật",
    "Xếp Loại",
    "Số Ngày",
    "Xu Hướng"
  ];

  const rows = studentStats.map((student, index) => [
    index + 1,
    student.studentCode || student.userId,
    student.avgScore.toFixed(2),
    student.totalScore.toFixed(1),
    student.avgSubmissions.toFixed(1),
    student.onTimeRate.toFixed(0),
    student.competenceScore.toFixed(1),
    student.disciplineScore.toFixed(1),
    student.mostCommonRating,
    student.totalDays,
    student.improvementTrend === "up" ? "Tăng" : student.improvementTrend === "down" ? "Giảm" : "Ổn định"
  ]);

  // Add summary row
  const summaryRow = [
    "",
    "TRUNG BÌNH LỚP",
    classStats.avgClassScore.toFixed(2),
    "",
    "",
    classStats.avgOnTimeRate.toFixed(0),
    classStats.avgCompetence.toFixed(1),
    classStats.avgDiscipline.toFixed(1),
    "",
    "",
    ""
  ];

  const csv = [
    headers.join(","),
    ...rows.map(row => row.join(",")),
    "",
    summaryRow.join(",")
  ].join("\n");

  return csv;
}

/**
 * Download CSV file
 */
export function downloadCSV(csv: string, filename: string = "bao_cao_danh_gia.csv"): void {
  // Add BOM for UTF-8
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * Export to Excel-compatible format (HTML table)
 * Có thể mở bằng Excel và giữ được formatting
 */
export function exportToExcelHTML(
  studentStats: StudentStatistics[],
  classStats: ClassStatistics
): string {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    table { border-collapse: collapse; width: 100%; font-family: Arial; }
    th, td { border: 1px solid #000; padding: 8px; text-align: center; }
    th { background-color: #00994c; color: white; font-weight: bold; }
    .summary { background-color: #fffacd; font-weight: bold; }
    .excellent { background-color: #90EE90; }
    .good { background-color: #87CEEB; }
    .average { background-color: #FFE4B5; }
    .poor { background-color: #FFB6C1; }
  </style>
</head>
<body>
  <h1>BÁO CÁO ĐÁNH GIÁ HỌC SINH</h1>
  <p>Ngày xuất: ${new Date().toLocaleDateString("vi-VN")}</p>
  
  <h2>THỐNG KÊ TỔNG QUAN</h2>
  <table>
    <tr>
      <th>Chỉ số</th>
      <th>Giá trị</th>
    </tr>
    <tr>
      <td>Tổng số học sinh</td>
      <td>${classStats.totalStudents}</td>
    </tr>
    <tr>
      <td>Điểm TB lớp</td>
      <td>${classStats.avgClassScore.toFixed(2)}</td>
    </tr>
    <tr>
      <td>Điểm cao nhất</td>
      <td>${classStats.highestScore.toFixed(2)}</td>
    </tr>
    <tr>
      <td>Điểm thấp nhất</td>
      <td>${classStats.lowestScore.toFixed(2)}</td>
    </tr>
    <tr>
      <td>Độ lệch chuẩn</td>
      <td>${classStats.scoreStdDev.toFixed(2)}</td>
    </tr>
    <tr>
      <td>Tỷ lệ đạt (≥5.0)</td>
      <td>${classStats.passRate.toFixed(1)}%</td>
    </tr>
    <tr>
      <td>Tỷ lệ xuất sắc (≥8.0)</td>
      <td>${classStats.excellentRate.toFixed(1)}%</td>
    </tr>
  </table>

  <h2>CHI TIẾT HỌC SINH</h2>
  <table>
    <thead>
      <tr>
        <th>STT</th>
        <th>Mã HS</th>
        <th>Điểm TB</th>
        <th>Tổng Điểm</th>
        <th>Bài/Ngày</th>
        <th>Đúng Giờ</th>
        <th>Năng Lực</th>
        <th>Kỷ Luật</th>
        <th>Xếp Loại</th>
        <th>Số Ngày</th>
        <th>Xu Hướng</th>
      </tr>
    </thead>
    <tbody>
      ${studentStats.map((student, index) => {
        const scoreClass = 
          student.avgScore >= 8 ? "excellent" :
          student.avgScore >= 6.5 ? "good" :
          student.avgScore >= 5 ? "average" : "poor";
        
        return `
        <tr class="${scoreClass}">
          <td>${index + 1}</td>
          <td>${student.studentCode || student.userId}</td>
          <td><strong>${student.avgScore.toFixed(2)}</strong></td>
          <td>${student.totalScore.toFixed(1)}</td>
          <td>${student.avgSubmissions.toFixed(1)}</td>
          <td>${student.onTimeRate.toFixed(0)}%</td>
          <td>${student.competenceScore.toFixed(1)}</td>
          <td>${student.disciplineScore.toFixed(1)}</td>
          <td>${student.mostCommonRating}</td>
          <td>${student.totalDays}</td>
          <td>${
            student.improvementTrend === "up" ? "📈 Tăng" :
            student.improvementTrend === "down" ? "📉 Giảm" :
            "➡️ Ổn định"
          }</td>
        </tr>
        `;
      }).join("")}
      <tr class="summary">
        <td colspan="2">TRUNG BÌNH LỚP</td>
        <td><strong>${classStats.avgClassScore.toFixed(2)}</strong></td>
        <td>-</td>
        <td>-</td>
        <td>${classStats.avgOnTimeRate.toFixed(0)}%</td>
        <td>${classStats.avgCompetence.toFixed(1)}</td>
        <td>${classStats.avgDiscipline.toFixed(1)}</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
      </tr>
    </tbody>
  </table>
</body>
</html>
  `;

  return html;
}

/**
 * Download Excel HTML file
 */
export function downloadExcelHTML(html: string, filename: string = "bao_cao_danh_gia.xls"): void {
  const blob = new Blob([html], { type: "application/vnd.ms-excel" });
  const link = document.createElement("a");
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// ========================
// DATA ANALYSIS
// ========================

/**
 * Phân tích các nhóm học sinh
 */
export interface StudentGroups {
  excellent: StudentStatistics[];  // >= 8.0
  good: StudentStatistics[];       // >= 6.5
  average: StudentStatistics[];    // >= 5.0
  needHelp: StudentStatistics[];   // < 5.0
}

export function groupStudentsByPerformance(
  studentStats: StudentStatistics[]
): StudentGroups {
  return {
    excellent: studentStats.filter(s => s.avgScore >= 8),
    good: studentStats.filter(s => s.avgScore >= 6.5 && s.avgScore < 8),
    average: studentStats.filter(s => s.avgScore >= 5 && s.avgScore < 6.5),
    needHelp: studentStats.filter(s => s.avgScore < 5),
  };
}

/**
 * Tìm học sinh có cải thiện nhiều nhất
 */
export function findMostImproved(
  studentStats: StudentStatistics[],
  count: number = 5
): StudentStatistics[] {
  return studentStats
    .filter(s => s.avgScore > 5)
    .slice(0, count);
}

/**
 * Tìm học sinh đang đi xuống
 */
export function findDeclining(
  studentStats: StudentStatistics[],
  count: number = 5
): StudentStatistics[] {
  return studentStats
    .filter(s => s.avgScore < 5)
    .slice(0, count);
}

// ========================
// FORMATTING HELPERS
// ========================

/**
 * Format số với dấu phẩy ngăn cách hàng nghìn
 */
export function formatNumber(num: number): string {
  return num.toLocaleString("vi-VN");
}

/**
 * Format phần trăm
 */
export function formatPercent(num: number): string {
  return `${num.toFixed(1)}%`;
}

/**
 * Get color class based on score
 */
export function getScoreColorClass(score: number): string {
  if (score >= 9) return "text-green-700";
  if (score >= 8) return "text-green-600";
  if (score >= 6.5) return "text-blue-600";
  if (score >= 5) return "text-yellow-600";
  return "text-red-600";
}

/**
 * Get badge variant based on rating
 */
export function getRatingBadgeVariant(rating: string): "default" | "secondary" | "destructive" | "outline" {
  if (rating.includes("Xuất sắc")) return "default";
  if (rating.includes("Tốt")) return "secondary";
  if (rating.includes("Khá")) return "outline";
  return "destructive";
}