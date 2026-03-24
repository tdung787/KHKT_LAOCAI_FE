// components/dashboard/student/assignments/QuizStatistics.tsx
import { useMemo } from "react";
import { IQuiz } from "@/infra/apiRAG/type/IQuiz";
import { ISubmission } from "@/infra/apiRAG/type/ISubmission";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
//   PieChart,
//   Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  Clock,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuizStatisticsProps {
  quizzes: IQuiz[];
  submissions: ISubmission[];
}

interface ScoreRange {
  range: string;
  min: number;
  max: number;
  count: number;
  color: string;
}

interface ScoreTrendItem {
  index: number;
  score: number;
  date: string;
}

interface SubjectStat {
  subject: string;
  total: number;
  avgScore: number;
}

interface DifficultyStat {
  difficulty: string;
  total: number;
  avgScore: number;
  color: string;
}

// At the top of the file
type RechartsData = Record<string, unknown>;

interface ScoreRange extends RechartsData {
  range: string;
  min: number;
  max: number;
  count: number;
  color: string;
}

interface ScoreTrendItem extends RechartsData {
  index: number;
  score: number;
  date: string;
}

interface SubjectStat extends RechartsData {
  subject: string;
  total: number;
  avgScore: number;
}

interface DifficultyStat extends RechartsData {
  difficulty: string;
  total: number;
  avgScore: number;
  color: string;
}

const QuizStatistics = ({ quizzes, submissions }: QuizStatisticsProps) => {
  const statistics = useMemo(() => {
    // Overall stats
    const totalQuizzes = quizzes.length;
    const completedQuizzes = submissions.length;
    const completionRate =
      totalQuizzes > 0 ? (completedQuizzes / totalQuizzes) * 100 : 0;

    const averageScore =
      submissions.length > 0
        ? submissions.reduce((sum, sub) => sum + sub.score, 0) /
          submissions.length
        : 0;

    const highestScore =
      submissions.length > 0 ? Math.max(...submissions.map((s) => s.score)) : 0;

    const lowestScore =
      submissions.length > 0 ? Math.min(...submissions.map((s) => s.score)) : 0;

    const totalTime = submissions.reduce((sum, sub) => sum + sub.duration, 0);
    const averageTime =
      submissions.length > 0 ? totalTime / submissions.length : 0;

    // Score distribution
    const scoreRanges: ScoreRange[] = [
      { range: "9-10", min: 9, max: 11, count: 0, color: "#10b981" },
      { range: "8-9", min: 8, max: 9, count: 0, color: "#3b82f6" },
      { range: "6.5-8", min: 6.5, max: 8, count: 0, color: "#f59e0b" },
      { range: "5-6.5", min: 5, max: 6.5, count: 0, color: "#f97316" },
      { range: "<5", min: 0, max: 5, count: 0, color: "#ef4444" },
    ];

    submissions.forEach((sub) => {
      if (sub.score >= 9) {
        scoreRanges[0].count++; // 9-10
      } else if (sub.score >= 8) {
        scoreRanges[1].count++; // 8-9
      } else if (sub.score >= 6.5) {
        scoreRanges[2].count++; // 6.5-8
      } else if (sub.score >= 5) {
        scoreRanges[3].count++; // 5-6.5
      } else {
        scoreRanges[4].count++; // <5
      }
    });

    // Score trend over time
    const scoreTrend: ScoreTrendItem[] = submissions
      .sort(
        (a, b) =>
          new Date(a.submitted_at).getTime() -
          new Date(b.submitted_at).getTime()
      )
      .map((sub, index) => ({
        index: index + 1,
        score: sub.score,
        date: new Date(sub.submitted_at).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
        }),
      }));

    // By subject
    const bySubjectMap = new Map<string, { total: number; avgScore: number }>();

    submissions.forEach((sub) => {
      const quiz = quizzes.find((q) => q.id === sub.quiz_id);
      if (quiz) {
        const existing = bySubjectMap.get(quiz.subject);
        if (existing) {
          existing.total++;
          existing.avgScore += sub.score;
        } else {
          bySubjectMap.set(quiz.subject, { total: 1, avgScore: sub.score });
        }
      }
    });

    const subjectStats: SubjectStat[] = Array.from(bySubjectMap.entries()).map(
      ([subject, data]) => ({
        subject,
        total: data.total,
        avgScore: Number((data.avgScore / data.total).toFixed(2)),
      })
    );

    // By difficulty
    const difficultyMap = new Map<
      string,
      { total: number; avgScore: number; color: string }
    >();
    difficultyMap.set("easy", { total: 0, avgScore: 0, color: "#10b981" });
    difficultyMap.set("medium", { total: 0, avgScore: 0, color: "#f59e0b" });
    difficultyMap.set("hard", { total: 0, avgScore: 0, color: "#ef4444" });

    submissions.forEach((sub) => {
      const quiz = quizzes.find((q) => q.id === sub.quiz_id);
      if (quiz) {
        const existing = difficultyMap.get(quiz.difficulty);
        if (existing) {
          existing.total++;
          existing.avgScore += sub.score;
        }
      }
    });

    const difficultyStats: DifficultyStat[] = Array.from(
      difficultyMap.entries()
    )
      .map(([difficulty, data]) => ({
        difficulty,
        total: data.total,
        avgScore: data.total > 0 ? data.avgScore / data.total : 0,
        color: data.color,
      }))
      .filter((d) => d.total > 0);

    // Recent performance (last 5)
    const recentScores = submissions
      .sort(
        (a, b) =>
          new Date(b.submitted_at).getTime() -
          new Date(a.submitted_at).getTime()
      )
      .slice(0, 5)
      .map((s) => s.score);

    const recentAverage =
      recentScores.length > 0
        ? recentScores.reduce((sum, score) => sum + score, 0) /
          recentScores.length
        : 0;

    const trend = recentAverage > averageScore ? "up" : "down";

    return {
      totalQuizzes,
      completedQuizzes,
      completionRate,
      averageScore,
      highestScore,
      lowestScore,
      totalTime,
      averageTime,
      scoreRanges,
      scoreTrend,
      subjectStats,
      difficultyStats,
      recentAverage,
      trend,
    };
  }, [quizzes, submissions]);

  console.log(statistics.scoreRanges.find((r) => r.max));

  if (submissions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Chưa có dữ liệu thống kê
        </h3>
        <p className="text-gray-500">
          Hoàn thành ít nhất một bài kiểm tra để xem thống kê
        </p>
      </div>
    );
  }

  //   console.log("🎨 QuizStatistics - statistics:", statistics.difficultyStats);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Average Score */}
        <Card className="py-2 rounded-none">
          <CardContent className="px-6 py-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Điểm trung bình</p>
                <p className="text-3xl font-bold text-green-600">
                  {statistics.averageScore.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-sm">
              {statistics.trend === "up" ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span
                className={
                  statistics.trend === "up" ? "text-green-600" : "text-red-600"
                }
              >
                {statistics.trend === "up" ? "Tăng" : "Giảm"} gần đây
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Completion Rate */}
        <Card className="py-2 rounded-none">
          <CardContent className="px-6 py-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Tỷ lệ hoàn thành</p>
                <p className="text-3xl font-bold text-blue-600">
                  {statistics.completionRate.toFixed(0)}%
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {statistics.completedQuizzes}/{statistics.totalQuizzes} bài
            </p>
          </CardContent>
        </Card>

        {/* Highest Score */}
        <Card className="py-2 rounded-none">
          <CardContent className="px-6 py-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Điểm cao nhất</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {statistics.highestScore.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Thấp nhất: {statistics.lowestScore.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        {/* Average Time */}
        <Card className="py-2 rounded-none">
          <CardContent className="px-6 py-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Thời gian TB</p>
                <p className="text-3xl font-bold text-purple-600">
                  {Math.round(statistics.averageTime)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">phút/bài</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Xu hướng điểm số</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={statistics.scoreTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="var(--color-primary-light)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-primary-light)", r: 4 }}
                  name="Điểm số"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Phân bố điểm số</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statistics.scoreRanges}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Số bài">
                  {statistics.scoreRanges.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Subject */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Theo môn học</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statistics.subjectStats } barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="subject"
                  tick={{ fill: "#374151", fontSize: 13, fontWeight: 500 }}
                />
                <YAxis
                  yAxisId="left"
                  domain={[0, 10]}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  label={{
                    value: "Điểm TB",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#00994C",
                    style: { fontWeight: 600 },
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  label={{
                    value: "Số bài",
                    angle: 90,
                    position: "insideRight",
                    fill: "#0077CC",
                    style: { fontWeight: 600 },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "2px solid #f3f4f6",
                    borderRadius: "12px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    padding: "12px 16px",
                  }}
                  labelStyle={{
                    fontWeight: 700,
                    color: "#111827",
                    marginBottom: "8px",
                    fontSize: "14px",
                  }}
                  cursor={{ fill: "rgba(0, 153, 76, 0.05)" }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: "24px" }}
                  iconType="circle"
                  iconSize={12}
                  formatter={(value) => (
                    <span
                      style={{
                        color: "#374151",
                        fontSize: "13px",
                        fontWeight: 500,
                      }}
                    >
                      {value}
                    </span>
                  )}
                />
                <Bar
                  yAxisId="left"
                  dataKey="avgScore"
                  name="Điểm trung bình"
                  radius={[10, 10, 0, 0]}
                  maxBarSize={55}
                >
                  {statistics.subjectStats.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.subject}`}
                      fill={
                        index === 0
                          ? "#00994C"
                          : index === 1
                          ? "#008C8C"
                          : "#10b981"
                      }
                    />
                  ))}
                </Bar>
                <Bar
                  yAxisId="right"
                  dataKey="total"
                  name="Số bài làm"
                  radius={[10, 10, 0, 0]}
                  maxBarSize={55}
                >
                  {statistics.subjectStats.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.subject}`}
                      fill={
                        index === 0
                          ? "#0077CC"
                          : index === 1
                          ? "#3b82f6"
                          : "#60a5fa"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* By Difficulty */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="text-lg">Theo độ khó</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart >
                <Pie
                  data={statistics.difficultyStats as any}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) =>
                    `${entry.difficulty}: ${
                      entry.total
                    } bài (${entry.avgScore.toFixed(1)}đ)`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="total"
                >
                  {statistics.difficultyStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}

        {/* Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tổng quan hiệu suất</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Điểm xuất sắc (≥9)</p>
                <p className="text-2xl font-bold text-green-600">
                  {statistics.scoreRanges.find((r) => r.range === "9-10")
                    ?.count || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">bài làm</p>
              </div>

              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  Điểm khá giỏi (≥6.5)
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {(statistics.scoreRanges.find((r) => r.range === "8-9")
                    ?.count || 0) +
                    (statistics.scoreRanges.find((r) => r.range === "6.5-8")
                      ?.count || 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">bài làm</p>
              </div>

              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  Cần cải thiện (&lt;6.5)
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {(statistics.scoreRanges.find((r) => r.range === "5-6.5")
                    ?.count || 0) +
                    (statistics.scoreRanges.find((r) => r.range === "<5")
                      ?.count || 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">bài làm</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizStatistics;
