"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  ClipboardList,
  Clock,
  // Trophy,
  Play,
  Edit,
  Trash2,
  Plus,
  // Calendar,
  Target,
  Shuffle,
  BarChart,
  Eye,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  BookCheck,
} from "lucide-react";
import { storage } from "@/utility";
import { IUser } from "@/domain/interfaces/IUser";
import { truncateText } from "@/utility/lib/truncateText";

// Types based on entity schema
interface Quiz {
  id: string;
  class_id: string;
  subject_id: string;
  title: string;
  description: string;
  type: "multiple_choice" | "true_false" | "mixed";
  duration: number;
  total_points: number;
  passing_score: number;
  start_time: string;
  end_time: string;
  randomize_questions: boolean;
  created_at: string;
}

interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: "multiple_choice" | "true_false";
  options: string[];
  correct_answer: string | string[];
  points: number;
  explanation: string;
  order: number;
}

// Mock data
const getMockData = () => {
  return {
    quizzes: [
      {
        id: "1",
        class_id: "class_1",
        subject_id: "TOAN",
        title: "Kiểm tra Hàm số bậc 2",
        description: "Kiểm tra 15 phút về hàm số bậc 2, đồ thị và tính chất",
        type: "multiple_choice" as const,
        duration: 15,
        total_points: 10,
        passing_score: 5,
        start_time: "2024-11-05T08:00:00Z",
        end_time: "2024-11-05T23:59:00Z",
        randomize_questions: true,
        created_at: "2024-11-01T10:00:00Z",
      },
      {
        id: "2",
        class_id: "class_1",
        subject_id: "LY",
        title: "Bài kiểm tra Định luật Newton",
        description: "Trắc nghiệm về các định luật Newton và ứng dụng",
        type: "mixed" as const,
        duration: 20,
        total_points: 10,
        passing_score: 6,
        start_time: "2024-11-10T08:00:00Z",
        end_time: "2024-11-10T23:59:00Z",
        randomize_questions: false,
        created_at: "2024-11-02T14:30:00Z",
      },
    ],
    questions: [
      {
        id: "q1",
        quiz_id: "1",
        question_text: "Đồ thị hàm số y = ax² + bx + c có dạng như thế nào?",
        question_type: "multiple_choice" as const,
        options: ["Đường thẳng", "Parabol", "Hyperbol", "Đường tròn"],
        correct_answer: "Parabol",
        points: 2,
        explanation: "Hàm số bậc 2 có đồ thị là đường Parabol",
        order: 1,
      },
      {
        id: "q2",
        quiz_id: "1",
        question_text:
          "Điều kiện để hàm số y = ax² + bx + c đạt giá trị nhỏ nhất?",
        question_type: "multiple_choice" as const,
        options: ["a > 0", "a < 0", "a = 0", "b > 0"],
        correct_answer: "a > 0",
        points: 2,
        explanation:
          "Khi a > 0, parabol có bề lõm hướng lên, đạt giá trị nhỏ nhất tại đỉnh",
        order: 2,
      },
      {
        id: "q3",
        quiz_id: "1",
        question_text: "Tọa độ đỉnh của parabol y = ax² + bx + c là?",
        question_type: "multiple_choice" as const,
        options: ["(-b/2a, -Δ/4a)", "(b/2a, Δ/4a)", "(-b/a, Δ/4a)", "(0, c)"],
        correct_answer: "(-b/2a, -Δ/4a)",
        points: 3,
        explanation: "Công thức tọa độ đỉnh: x₀ = -b/2a, y₀ = -Δ/4a",
        order: 3,
      },
    ],
  };
};

// Helper functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// const getQuizTypeLabel = (type: string) => {
//   const types = {
//     multiple_choice: "Trắc nghiệm",
//     true_false: "Đúng/Sai",
//     mixed: "Hỗn hợp",
//   };
//   return types[type] || type;
// };

// Quiz Preview Component (Flashcard Style like Quizlet)
const QuizPreview = ({
  quiz,
  questions,
  isOpen,
  onClose,
}: {
  quiz: Quiz;
  questions: QuizQuestion[];
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  // const [showAnswer, setShowAnswer] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      // setShowAnswer(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      // setShowAnswer(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      // setShowAnswer(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    // setShowAnswer(false);
  };

  if (!currentQuestion) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            {quiz.title} - Preview
          </DialogTitle>
          <DialogDescription>
            {questions.length} câu hỏi • {quiz.duration} phút
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              Câu {currentIndex + 1} / {questions.length}
            </span>
            <span className="text-gray-500">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Flashcard */}
        <div className="relative my-8">
          <div
            className={`relative w-full min-h-[400px] cursor-pointer transition-transform duration-500 preserve-3d ${
              isFlipped ? "rotate-y-180" : ""
            }`}
            onClick={handleFlip}
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front of Card - Question */}
            <div
              className={`absolute inset-0 backface-hidden ${
                isFlipped ? "invisible" : "visible"
              }`}
            >
              <div className="w-full h-full min-h-[400px] p-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 rounded-2xl border-2 border-blue-200 dark:border-blue-800 shadow-xl flex flex-col items-center justify-center">
                <div className="text-center space-y-6 max-w-2xl">
                  <Badge variant="secondary" className="mb-4">
                    Câu hỏi {currentQuestion.order}
                  </Badge>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {currentQuestion.question_text}
                  </h3>

                  {currentQuestion.question_type === "multiple_choice" && (
                    <div className="grid grid-cols-1 gap-3 mt-8">
                      {currentQuestion.options.map((option, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 transition-colors"
                        >
                          <span className="font-medium">
                            {String.fromCharCode(65 + idx)}. {option}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
                    👆 Click để xem đáp án
                  </p>
                </div>
              </div>
            </div>

            {/* Back of Card - Answer */}
            <div
              className={`absolute inset-0 backface-hidden ${
                isFlipped ? "visible" : "invisible"
              }`}
              style={{
                transform: "rotateY(180deg)",
              }}
            >
              <div className="w-full h-full min-h-[400px] p-8 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-950 rounded-2xl border-2 border-green-200 dark:border-green-800 shadow-xl flex flex-col items-center justify-center">
                <div className="text-center space-y-6 max-w-2xl">
                  <Badge className="mb-4 bg-green-600">Đáp án</Badge>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      Đáp án đúng:
                    </h3>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-green-500">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {currentQuestion.correct_answer}
                      </p>
                    </div>

                    {currentQuestion.explanation && (
                      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-left">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                          💡 Giải thích:
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {currentQuestion.explanation}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-4">
                      <Target className="h-4 w-4" />
                      <span>{currentQuestion.points} điểm</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
                    👆 Click để quay lại câu hỏi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Câu trước
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={handleReset} size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Làm lại
            </Button>
            <Button
              variant="ghost"
              onClick={handleFlip}
              size="sm"
              className="font-medium"
            >
              {isFlipped ? "Xem câu hỏi" : "Xem đáp án"}
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
          >
            Câu sau
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Quiz Detail Dialog
const QuizDetailDialog = ({
  quiz,
  questions,
  isOpen,
  onClose,
  onPreview,
}: {
  quiz: Quiz;
  questions: QuizQuestion[];
  isOpen: boolean;
  onClose: () => void;
  onPreview: () => void;
}) => {
  const quizQuestions = questions.filter((q) => q.quiz_id === quiz.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold">
                {quiz.title}
              </DialogTitle>
              <DialogDescription className="mt-2 flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {quiz.duration} phút
                </span>
                <span className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  {quiz.total_points} điểm
                </span>
                {/* <Badge variant="secondary">{getQuizTypeLabel(quiz.type)}</Badge> */}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onPreview}>
                <Play className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="info" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Thông tin</TabsTrigger>
            <TabsTrigger value="questions">
              Câu hỏi ({quizQuestions.length})
            </TabsTrigger>
            <TabsTrigger value="settings">Cài đặt</TabsTrigger>
          </TabsList>

          {/* Info Tab */}
          <TabsContent value="info" className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold">Mô tả</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                {quiz.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                  Tổng điểm
                </div>
                <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  {quiz.total_points}
                </div>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                  Điểm đạt
                </div>
                <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                  {quiz.passing_score}
                </div>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <div className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">
                  Thời gian
                </div>
                <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                  {quiz.duration}
                  <span className="text-lg ml-1">phút</span>
                </div>
              </div>

              <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <div className="text-sm font-medium text-orange-700 dark:text-orange-300 mb-1">
                  Số câu hỏi
                </div>
                <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                  {quizQuestions.length}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Thời gian mở</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Bắt đầu
                  </div>
                  <div className="text-sm font-medium mt-1">
                    {formatDate(quiz.start_time)}
                  </div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Kết thúc
                  </div>
                  <div className="text-sm font-medium mt-1">
                    {formatDate(quiz.end_time)}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions">
            <div className="space-y-4">
              {quizQuestions.length > 0 ? (
                quizQuestions.map((question, index) => (
                  <div
                    key={question.id}
                    className="p-4 bg-white dark:bg-gray-800 rounded-lg border"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <Badge variant="outline">Câu {index + 1}</Badge>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {question.question_text}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>{question.points} điểm</span>
                            <span>•</span>
                            <span>
                              {question.question_type === "multiple_choice"
                                ? "Trắc nghiệm"
                                : "Đúng/Sai"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>

                    {question.question_type === "multiple_choice" && (
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        {question.options.map((option, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded text-sm ${
                              option === question.correct_answer
                                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-900 dark:text-green-100"
                                : "bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}. {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <ClipboardList className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Chưa có câu hỏi nào</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <div className="font-medium">Xáo trộn câu hỏi</div>
                  <div className="text-sm text-gray-500">
                    Câu hỏi sẽ được hiển thị ngẫu nhiên cho mỗi học sinh
                  </div>
                </div>
                <Badge
                  variant={quiz.randomize_questions ? "default" : "secondary"}
                >
                  {quiz.randomize_questions ? "Bật" : "Tắt"}
                </Badge>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="font-medium mb-2">Loại bài kiểm tra</div>
                {/* <Badge variant="outline">{getQuizTypeLabel(quiz.type)}</Badge> */}
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="font-medium mb-2">Thông tin hệ thống</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <div>Ngày tạo: {formatDate(quiz.created_at)}</div>
                  <div>ID: {quiz.id}</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

interface QuizProps {
  subjectId: string;
}

// Main Quiz Component
const Quiz = ({ subjectId }: QuizProps) => {
  const user: IUser | null = storage.getUser();
  console.log(subjectId);

  const [data, setData] = useState<{
    quizzes: Quiz[];
    questions: QuizQuestion[];
  }>({ quizzes: [], questions: [] });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mockData = getMockData();
    setData(mockData);
    setIsLoading(false);
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const openDetail = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setIsDetailOpen(true);
  };

  const openPreview = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setIsPreviewOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {user?.role === "teacher" ? "Quản lý bài kiểm tra" : "Bài kiểm tra"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {user?.role === "teacher" ? "Quản lý bài kiểm tra" : ""}
          </p>
        </div>

        {user?.role === "teacher" && (
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-105 text-white font-medium rounded-full shadow-md transition-all hover:shadow-lg">
            <Plus className="w-5 h-5" />
            Tạo bài kiểm tra
          </button>
        )}
      </div>

      {/* Quiz List */}
      <div className="space-y-3">
        {data.quizzes.map((quiz) => {
          const isExpanded = expandedId === quiz.id;
          const quizQuestions = data.questions.filter(
            (q) => q.quiz_id === quiz.id
          );

          return (
            <div
              key={quiz.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all ${
                isExpanded ? "shadow-md" : ""
              }`}
            >
              {/* Quiz Header */}
              <div className="flex items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white mr-4 shadow-md">
                  <ClipboardList className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 truncate">
                      {truncateText(quiz.title, 20)}
                    </h3>
                    {quiz.randomize_questions && (
                      <Badge variant="outline" className="text-xs md:flex hidden">
                        <Shuffle className="h-3 w-3 mr-1" />
                        Random
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 md:h-3.5 md:w-3.5" />
                      <span>{quiz.duration} phút</span>
                    </span>
                    <span className="hidden md:inline text-gray-300">•</span>
                    <span className="flex items-center gap-1">
                      <Target className="h-3 w-3 md:h-3.5 md:w-3.5" />
                      <span>{quiz.total_points} điểm</span>
                    </span>
                    <span className="hidden md:inline text-gray-300">•</span>
                    <span className="flex items-center gap-1">
                      <ClipboardList className="h-3 w-3 md:h-3.5 md:w-3.5" />
                      <span>{quizQuestions.length} câu</span>
                    </span>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-6 mr-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-600">
                      {quiz.passing_score}
                    </div>
                    <div className="text-xs text-gray-500">Điểm đạt</div>
                  </div>
                </div>

                {user?.role === "teacher" && (
                  <Button variant="ghost" size="sm" className="p-2">
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-6 pb-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
                  <div className="py-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {quiz.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-4 gap-4 py-4">
                    <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-semibold text-purple-600">
                        {quizQuestions.length}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">Câu hỏi</div>
                    </div>
                    <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-semibold text-blue-600">
                        {quiz.duration}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">Phút</div>
                    </div>
                    <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-semibold text-green-600">
                        {quiz.total_points}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">Điểm</div>
                    </div>
                    <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-semibold text-orange-600">
                        {quiz.passing_score}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">Đạt</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    {user?.role === "teacher" && (
                      <>
                        <Button
                          onClick={() => openPreview(quiz)}
                          variant="default"
                          size="sm"
                          className="bg-gradient-to-r from-purple-500 to-indigo-600"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Xem trước
                        </Button>
                        <Button
                          onClick={() => openDetail(quiz)}
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Chi tiết
                        </Button>
                        <Button variant="outline" size="sm">
                          <BarChart className="h-4 w-4 mr-2" />
                          Thống kê
                        </Button>
                      </>
                    )}

                    <Button variant="outline" size="sm">
                      <BookCheck className="h-4 w-4 mr-2" />
                      Làm bài
                    </Button>
                  </div>
                </div>
              )}

              {/* Toggle Button */}
              <button
                onClick={() => toggleExpand(quiz.id)}
                className="w-full px-6 py-3 bg-gray-50 dark:bg-gray-750 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <span>{isExpanded ? "Thu gọn" : "Xem thêm"}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      {/* Detail Dialog */}
      {selectedQuiz && (
        <QuizDetailDialog
          quiz={selectedQuiz}
          questions={data.questions}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onPreview={() => {
            setIsDetailOpen(false);
            setIsPreviewOpen(true);
          }}
        />
      )}

      {/* Preview Dialog */}
      {selectedQuiz && (
        <QuizPreview
          quiz={selectedQuiz}
          questions={data.questions.filter(
            (q) => q.quiz_id === selectedQuiz.id
          )}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </div>
  );
};

export default Quiz;
