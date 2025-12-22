import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

import { useEnrollmentStore } from "@/utility/stores/enrollmentsStore";
import { useStudentStore } from "@/utility/stores/studentStore";

import Assignment from "@/@core/components/dashboard/teacher/Assignment";
import StudentGrade from "@/@core/components/dashboard/teacher/StudentGrade";
import Quiz from "@/@core/components/dashboard/teacher/Quiz";
import Document from "@/@core/components/dashboard/teacher/Document";

const StudentClasses = () => {
  const { student, getProfileStudent } = useStudentStore();
  const {
    studentClasses,
    selectedStudentClass,
    isLoading,
    getEnrollmentsByStudent,
    setSelectedStudentClass,
  } = useEnrollmentStore();

  const [selectedSubject, setSelectedSubject] = useState("");

  // Load student profile nếu chưa có
  useEffect(() => {
    if (!student) {
      getProfileStudent();
    }
  }, [student, getProfileStudent]);

  // Fetch danh sách lớp khi có student
  useEffect(() => {
    if (student?._id) {
      getEnrollmentsByStudent(student._id);
    }
  }, [student?._id, getEnrollmentsByStudent]);

  // Auto select first class when data loaded
  useEffect(() => {
    if (studentClasses.length > 0 && !selectedStudentClass) {
      setSelectedStudentClass(studentClasses[0]);
    }
  }, [studentClasses, selectedStudentClass, setSelectedStudentClass]);
  console.log("Selected Student Class:", studentClasses, student);

  const handleClassSelect = (classId: string) => {
    const selected = studentClasses.find(
      (item) => item.class_id.id === classId
    );
    setSelectedStudentClass(selected || null);
    setSelectedSubject("");
  };

  const handleSubjectChange = (subjectId: string) => {
    console.log("ID môn học được chọn:", subjectId);
    setSelectedSubject(subjectId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Đang tải danh sách lớp học...</span>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {/* Body */}
      <div className="flex flex-col lg:flex-row gap-1 w-full">
        {/* Sidebar: Danh sách lớp học */}
        <aside className="lg:w-1/5 w-full space-y-2 p-2 bg-white dark:backdrop-blur-xl dark:bg-white/10 border border-white/20 ">
          <h3 className="font-semibold text-lg mb-2">Lớp học của tôi</h3>
          {studentClasses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Bạn chưa đăng ký lớp học nào
            </p>
          ) : (
            studentClasses.map((enrollment) => (
              <Card
                key={enrollment.id}
                className={`border-none cursor-pointer transition-all hover:shadow-md p-0 rounded-none   ${
                  selectedStudentClass?.id === enrollment.id
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
                onClick={() => handleClassSelect(enrollment.class_id.id)}
              >
                <CardContent className="p-3">
                  <h4 className="font-medium">{enrollment.class_id.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {enrollment.class_id.school_year} | Khối{" "}
                    {enrollment.class_id.grade_level}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </aside>

        {/* Nội dung chính: Tabs */}
        <main className="lg:w-4/5 w-full bg-white dark:backdrop-blur-xl dark:bg-white/10 border border-white/20 p-2.5">
          <Tabs defaultValue="students" className="w-full">
            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
              {/* TabsList - Scrollable trên mobile */}
              <div className="overflow-x-auto pb-2 md:pb-0">
                <TabsList className="bg-[var(--color-secondary)] dark:bg-[var(--color-secondary-dark)] dark:border-1 dark:border-[var(--color-secondary-dark)] text-white text-sm md:text-xl w-full md:w-auto inline-flex">
                  <TabsTrigger
                    value="assignments"
                    disabled={!selectedSubject}
                    className="disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap px-2 md:px-4 "
                  >
                    Bài tập
                  </TabsTrigger>
                  <TabsTrigger
                    value="quiz"
                    disabled={!selectedSubject}
                    className="disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap px-2 md:px-4"
                  >
                    Bài kiểm tra
                  </TabsTrigger>
                  <TabsTrigger
                    value="grades"
                    disabled={!selectedSubject}
                    className="disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap px-2 md:px-4"
                  >
                    Điểm số
                  </TabsTrigger>
                  <TabsTrigger
                    value="documents"
                    disabled={!selectedSubject}
                    className="disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap px-2 md:px-4"
                  >
                    Tài liệu
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Select Subject */}
              <div className="flex flex-col items-start md:items-end gap-1 w-full md:w-auto">
                <Select
                  onValueChange={handleSubjectChange}
                  value={selectedSubject}
                  disabled={!selectedStudentClass}
                >
                  <SelectTrigger className="w-full md:w-[180px] dark:border-1 dark:border-[var(--color-secondary-dark)]">
                    <SelectValue placeholder="Chọn môn học " />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--color-secondary)] dark:bg-[var(--color-secondary-dark)] dark:border-1 dark:border-[var(--color-secondary-dark)] ">
                    <SelectGroup >
                      <SelectLabel>Môn học</SelectLabel>
                      {selectedStudentClass?.class_id.subject_ids.map(
                        (subjectId) => (
                          <SelectItem key={subjectId} value={subjectId} className="dark:bg-[var(--color-secondary-dark)] hover:bg-gray-100 dark:hover:bg-white/10">
                            {subjectId === "690d75bcd9f6d86227089d81" && "Toán"}
                            {subjectId === "690d75cfd9f6d86227089d85" && "Vật Lý"}
                            {subjectId === "690d75d6d9f6d86227089d89" && "Hóa"}
                            {subjectId === "690d75dad9f6d86227089d8d" && "Sinh"}
                          </SelectItem>
                        )
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {!selectedSubject && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 text-left md:text-right">
                    * Chọn môn học để xem các tab khác
                  </p>
                )}
              </div>
            </div>

            <TabsContent value="assignments">
              {selectedSubject && selectedStudentClass && (
                <Assignment
                  subjectId={selectedSubject}
                  classId={selectedStudentClass.class_id.id}
                />
              )}
            </TabsContent>
            <TabsContent value="quiz">
              {selectedSubject && <Quiz subjectId={selectedSubject} />}
            </TabsContent>
            <TabsContent value="grades">
              {selectedSubject && <StudentGrade subjectId={selectedSubject} />}
            </TabsContent>
            <TabsContent value="documents">
              {selectedSubject && <Document subjectId1={selectedSubject} />}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default StudentClasses;
