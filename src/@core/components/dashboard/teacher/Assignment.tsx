"use client";

import { useState, useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  FileText,
  Users,
  Eye,
  Edit,
  MoreVertical,
  Plus,
  Calendar,
  ArrowBigUpDash,
  Download,
  FileImage,
  FileArchive,
  File,
} from "lucide-react";
import { storage } from "@/utility";
import { IUser } from "@/domain/interfaces/IUser";
import { useAssignmentStore } from "@/utility/stores/assignmentStore";
import { useStudentAssignmentStore } from "@/utility/stores/studentAssignmentStore";
import { IAssignment } from "@/domain/interfaces/IAssignment";
import { formatDate, getTimeAgo, isOverdue } from "./helper";
import { IAttachment } from "@/domain/interfaces/IAssignment";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Helper functions for file handling
const getFileIcon = (type: string) => {
  if (type.includes('image')) return <FileImage className="h-5 w-5 text-green-500" />;
  if (type.includes('zip') || type.includes('rar')) return <FileArchive className="h-5 w-5 text-yellow-500" />;
  if (type.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
  return <File className="h-5 w-5 text-gray-500" />;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const handleDownload = (attachment: IAttachment) => {
  // Remove /api from base URL since upload is served from root
  const baseUrl = API_BASE_URL.replace('/api', '');
  const downloadUrl = `${baseUrl}${attachment.url}`;
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = attachment.filename;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
import AssignmentDetailDialog from "./components/AssignmentDetailDialog";
import AssignmentCreateDialog from "./components/AssignmentCreateDialog";
import AssignmentUpdateDialog from "./components/AssignmentUpdateDialog";
import AssignmentDeleteDialog from "./components/AssignmentDeleteDialog";
import { Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SentAllNotificationsDialog from "./components/SentAllNotificationsDialog";

interface AssignmentProps {
  subjectId: string;
  classId: string;
}

// Main Assignment Component
const Assignment = ({ subjectId, classId }: AssignmentProps) => {
  const user: IUser | null = storage.getUser();
  // Assignment store
  const {
    assignments,
    statistics,
    isLoading,
    fetchAssignmentsByClass,
    fetchAssignmentStatistics,
  } = useAssignmentStore();

  // Student Assignment store
  const { studentAssignments, fetchSubmissionsByAssignment } =
    useStudentAssignmentStore();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedAssignment, setSelectedAssignment] =
    useState<IAssignment | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Fetch assignments when class changes
  useEffect(() => {
    if (classId) {
      fetchAssignmentsByClass({ classId });
    }
  }, [classId, fetchAssignmentsByClass]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const openDetail = async (assignment: IAssignment) => {
    setSelectedAssignment(assignment);
    setIsDetailOpen(true);
    // Load statistics
    if (assignment.id) {
      await fetchAssignmentStatistics(assignment.id);
    }
  };

  const handleLoadSubmissions = async () => {
    if (selectedAssignment?.id) {
      await fetchSubmissionsByAssignment({
        assignmentId: selectedAssignment.id,
      });
    }
  };

  const openUpdate = (assignment: IAssignment) => {
    setSelectedAssignment(assignment);
    setIsUpdateOpen(true);
  };

  const openDelete = (assignment: IAssignment) => {
    setSelectedAssignment(assignment);
    setIsDeleteOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!classId) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Vui lòng chọn một lớp học</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {user?.role === "teacher" ? "Bài tập" : "Danh sách bài tập"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {user?.role === "teacher" ? "Quản lý bài tập" : ""}
          </p>
        </div>

        {/* Create Button */}
        {user?.role === "teacher" && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-[#0077CC] hover:scale-105 text-white font-medium rounded-full shadow-md transition-all hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Tạo bài tập
          </button>
        )}
      </div>

      {/* Assignments List */}
      {assignments.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Chưa có bài tập nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((assignment) => {
            const isExpanded = expandedId === assignment.id;
            const isLate = isOverdue(assignment.due_date);

            return (
              <div
                key={assignment.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all ${
                  isExpanded ? "shadow-md" : ""
                }`}
              >
                {/* Assignment Header */}
                <div className="flex items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white mr-4 shadow-md">
                    <FileText className="w-6 h-6" />
                  </div>

                  {/* Title and Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 truncate">
                        {assignment.title}
                      </h3>
                      {isLate && (
                        <Badge variant="destructive" className="text-xs">
                          Quá hạn
                        </Badge>
                      )}
                      {assignment.auto_grade_enabled && (
                        <Badge variant="secondary" className="text-xs">
                          Auto
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className=" items-center gap-1 flex ">
                        <Calendar className="h-3.5 w-3.5" />
                        Hạn: {formatDate(assignment.due_date)}
                      </span>
                      <span className=" items-center gap-1 md:flex hidden">
                        <Users className="h-3.5 w-3.5" />
                        {assignment.total_submitted +
                          assignment.total_unsubmitted}{" "}
                        học sinh
                      </span>
                      {assignment.updated_at && (
                        <span className="text-xs md:flex hidden items-center gap-1">
                          Cập nhật {getTimeAgo(assignment.updated_at)}
                        </span>
                      )}
                    </div>
                  
                  </div>

                  {user?.role === "student" && (
                    <Button variant="outline" size="sm" className="md:mr-5 mr-0">
                      <ArrowBigUpDash className="h-4 w-4 " />
                      <span className="md:flex hidden" >nộp bài</span>
                    </Button>
                  )}

                  {/* Quick Stats */}
                  <div className="hidden md:flex items-center gap-6 mr-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">
                        {assignment.total_submitted}
                      </div>
                      <div className="text-xs text-gray-500">Đã nộp</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-600">
                        {assignment.total_unsubmitted}
                      </div>
                      <div className="text-xs text-gray-500">Chưa nộp</div>
                    </div>
                  </div>

                  {user?.role === "teacher" && (
                    
                    <SentAllNotificationsDialog classId={classId} />
                  )}

                  {/* Menu Button */}
                  {user?.role === "teacher" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                          aria-label="Tùy chọn"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => openDetail(assignment)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openUpdate(assignment)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDelete(assignment)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {/* Expandable Details */}
                {isExpanded && (
                  <div className="px-6 pb-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
                    {/* Description Preview */}
                    <div className="py-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {assignment.description || "Không có mô tả"}
                      </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 py-4">
                      <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-semibold text-green-600">
                          {assignment.total_submitted}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Đã nộp
                        </div>
                      </div>
                      <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-semibold text-blue-600">
                          {assignment.completion_rate || 0}%
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Hoàn thành
                        </div>
                      </div>
                      <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-semibold text-gray-600">
                          {assignment.total_unsubmitted}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Chưa nộp
                        </div>
                      </div>
                    </div>

                    {/* Attachments */}
                    {assignment.attachments &&
                      assignment.attachments.length > 0 && (
                        <div className="space-y-2 py-3">
                          <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                            Tài liệu đính kèm ({assignment.attachments.length} file)
                          </h3>
                          <div className="space-y-2">
                            {assignment.attachments.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  {getFileIcon(file.type)}
                                  <div>
                                    <span className="text-sm font-medium">{file.filename}</span>
                                    <div className="text-xs text-gray-500">
                                      {formatFileSize(file.size)} • {file.type.toUpperCase()}
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDownload(file)}
                                  title="Tải xuống"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-4">
                      {user?.role === "teacher" && (
                        <>
                          <Button
                            onClick={() => openDetail(assignment)}
                            variant="default"
                            size="sm"
                            className="flex-1 sm:flex-none"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openUpdate(assignment)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Toggle Button */}
                <button
                  onClick={() => toggleExpand(assignment.id || "")}
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
      )}

      {/* Detail Dialog */}
      {selectedAssignment && (
        <AssignmentDetailDialog
          assignment={selectedAssignment}
          submissions={studentAssignments}
          statistics={statistics}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onLoadSubmissions={handleLoadSubmissions}
        />
      )}

      {/* Create Dialog */}
      <AssignmentCreateDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        subjectId={subjectId}
        classId={classId}
      />

      {/* Update Dialog */}
      {selectedAssignment && (
        <AssignmentUpdateDialog
          isOpen={isUpdateOpen}
          onClose={() => setIsUpdateOpen(false)}
          assignment={selectedAssignment}
        />
      )}

      {/* Delete Dialog */}
      {selectedAssignment && (
        <AssignmentDeleteDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          assignment={selectedAssignment}
        />
      )}
    </div>
  );
};

export default Assignment;
