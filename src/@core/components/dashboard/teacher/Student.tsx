"use client";

import { useState, useMemo, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowSelectionState,
  ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"; // Thêm Badge

import { Trash2, Search, UserCircle, Loader2, Users } from "lucide-react"; // Thêm Users icon
import { useEnrollmentStore } from "@/utility/stores/enrollmentsStore";
import { IEnrollmentItem } from "@/domain/interfaces/IErollment";
import { columns } from "./student_table/Column";
import { useOnlineUsers } from "@/services/useOnlineUsers";
import { UserRole } from "../../siderbar";

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

// Type definition
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
  isOnline?: boolean; // ✅ Thêm field để đánh dấu online
}

interface StudentsTableProps {
  classId: string;
}

// Main Component
const StudentsTable = ({ classId }: StudentsTableProps) => {
  // State
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [searchQuery, setSearchQuery] = useState("");

  // Store
  const { enrollments, isLoading, getEnrollmentsByClass } =
    useEnrollmentStore();

  const { onlineUsers } = useOnlineUsers();

  // ✅ Function check user có online không
  const checkUserOnline = (userId: string): boolean => {
    return onlineUsers.some((u) => u.userId === userId);
  };

  // Load data when component mounts or classId changes
  useEffect(() => {
    if (classId) {
      getEnrollmentsByClass(classId);
    }
  }, [classId]);

  // ✅ Map enrollment data với thông tin online
  const studentsData = useMemo<Student[]>(() => {
    return enrollments.map((enrollment: IEnrollmentItem) => ({
      id: enrollment.id,
      user_id: enrollment.student_id.user_id,
      avatar: enrollment.student_id.avatar,
      student_code: enrollment.student_id.student_code,
      grade_level: enrollment.student_id.grade_level,
      current_class: enrollment.student_id.current_class,
      school_name: enrollment.student_id.school_name,
      learning_style: enrollment.student_id.learning_style,
      difficulty_preference: enrollment.student_id.difficulty_preference,
      last_active: enrollment.student_id.last_active,
      created_at: enrollment.student_id.created_at,
      updated_at: enrollment.student_id.updated_at,
      status: enrollment.status,
      attendance_count: enrollment.attendance_count,
      enrollment_date: enrollment.enrollment_date,
      isOnline: checkUserOnline(enrollment.student_id.user_id._id),
    }));
  }, [enrollments, onlineUsers]); // ✅ Thêm onlineUsers vào dependency

  // ✅ Tính số lượng học sinh online
  const onlineCount = useMemo(() => {
    return studentsData.filter((student) => student.isOnline).length;
  }, [studentsData]);

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchQuery) return studentsData;

    const query = searchQuery.toLowerCase();
    return studentsData.filter(
      (student) =>
        student.student_code.toLowerCase().includes(query) ||
        student.school_name.toLowerCase().includes(query) ||
        student.user_id.full_name.toLowerCase().includes(query)
    );
  }, [studentsData, searchQuery]);

  // Handle bulk delete
  const handleBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection).filter(
      (key) => rowSelection[key]
    );
    // TODO: Call API to bulk delete enrollments
    console.log("Bulk delete:", selectedIds);
    setRowSelection({});
  };

  const table = useReactTable({
    data: filteredData,
    columns: columns as ColumnDef<Student>[],
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
    getRowId: (row) => row.id,
  });

  const selectedCount = Object.keys(rowSelection).filter(
    (key) => rowSelection[key]
  ).length;

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full space-y-4 p-4">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">
            Đang tải danh sách học sinh...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 p-0 sm:p-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Danh sách học sinh
          </h2>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            Quản lý học sinh trong lớp học
          </p>
        </div>

        {/* ✅ Hiển thị số học sinh online */}
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="px-2 md:px-3 py-1.5 md:py-2 bg-green-50 border-green-200 text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-400"
          >
            <Users className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
            <span className="font-semibold text-sm md:text-base">
              {onlineCount}
            </span>
            <span className="mx-1 text-sm md:text-base">/</span>
            <span className="text-sm md:text-base">{studentsData.length}</span>
            <span className="ml-1 text-xs md:text-sm">Online</span>
          </Badge>
        </div>
      </div>

      {/* Search and Actions Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm md:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={
              window.innerWidth < 768
                ? "Tìm kiếm..."
                : "Tìm kiếm theo mã học sinh, tên, trường..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>

        {selectedCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Đã chọn <strong>{selectedCount}</strong> học sinh
            </span>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa đã chọn
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Xác nhận xóa nhiều học sinh
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn xóa <strong>{selectedCount}</strong>{" "}
                    học sinh đã chọn?
                    <br />
                    Hành động này không thể hoàn tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleBulkDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Xóa tất cả
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="border-y border-gray-200 dark:border-gray-800 overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-gray-50 dark:bg-gray-900"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="px-0 bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-blue-100 hover:transition-shadow dark:hover:bg-gray-900/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-0  ">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <UserCircle className="h-12 w-12 mb-2 opacity-50" />
                    <p className="text-sm font-medium">
                      Không tìm thấy học sinh nào
                    </p>
                    <p className="text-xs">
                      {searchQuery
                        ? "Thử thay đổi từ khóa tìm kiếm"
                        : "Chưa có học sinh trong lớp này"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary Footer */}
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <div>
          Hiển thị <strong>{filteredData.length}</strong> trong tổng số{" "}
          <strong>{studentsData.length}</strong> học sinh
          {/* ✅ Thêm thông tin online ở footer */}
          <span className="ml-2 text-green-600 dark:text-green-400">
            ({onlineCount} đang online)
          </span>
        </div>
        {selectedCount > 0 && (
          <div>
            Đã chọn <strong>{selectedCount}</strong> học sinh
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsTable;
