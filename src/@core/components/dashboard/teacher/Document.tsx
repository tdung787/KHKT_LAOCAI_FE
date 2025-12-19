"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  File,
  FileImage,
  FileVideo,
  // Plus,
} from "lucide-react";
import { storage } from "@/utility";
import { IUser } from "@/domain/interfaces/IUser";

// Types
interface Document {
  id: string;
  name: string;
  title: string;
  subject_id: string;
  teacher_id: string;
  class_id: string;
  file_url: string;
  file_type: string;
  created_at: string;
  updated_at: string;
}

// Mock data
const mockSubjects = [
  { id: "s1", name: "Toán" },
  { id: "s2", name: "Văn" },
  { id: "s3", name: "Anh" },
];

const mockClasses = [
  { id: "c1", name: "10A1" },
  { id: "c2", name: "10A2" },
  { id: "c3", name: "11A1" },
];

const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Bai_tap_ham_so.pdf",
    title: "Bài tập hàm số bậc 2",
    subject_id: "s1",
    teacher_id: "t1",
    class_id: "c1",
    file_url: "#",
    file_type: "pdf",
    created_at: "2024-11-01T10:00:00Z",
    updated_at: "2024-11-01T10:00:00Z",
  },
  {
    id: "2",
    name: "Ly_thuyet_dao_ham.docx",
    title: "Lý thuyết về đạo hàm",
    subject_id: "s1",
    teacher_id: "t1",
    class_id: "c1",
    file_url: "#",
    file_type: "docx",
    created_at: "2024-11-02T14:30:00Z",
    updated_at: "2024-11-02T14:30:00Z",
  },
];
interface DocumentProps {
  subjectId1: string;
}

const Document = ({ subjectId1 }: DocumentProps) => {
  const user: IUser | null = storage.getUser();
  console.log(subjectId1);

  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [classId, setClassId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile || !title || !subjectId || !classId) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const newDoc: Document = {
      id: Date.now().toString(),
      name: selectedFile.name,
      title,
      subject_id: subjectId,
      teacher_id: "t1", // Current teacher
      class_id: classId,
      file_url: URL.createObjectURL(selectedFile),
      file_type: selectedFile.name.split(".").pop() || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setDocuments([newDoc, ...documents]);

    // Reset form
    setTitle("");
    setSubjectId("");
    setClassId("");
    setSelectedFile(null);

    alert("Tải tài liệu thành công!");
  };

  // Handle delete
  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc muốn xóa tài liệu này?")) {
      setDocuments(documents.filter((doc) => doc.id !== id));
    }
  };

  // Get file icon
  const getFileIcon = (type: string) => {
    if (type === "pdf") return <FileText className="w-5 h-5 text-red-500" />;
    if (["jpg", "png", "jpeg"].includes(type))
      return <FileImage className="w-5 h-5 text-purple-500" />;
    if (["mp4", "avi"].includes(type))
      return <FileVideo className="w-5 h-5 text-orange-500" />;
    return <File className="w-5 h-5 text-blue-500" />;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto px-4 py-4 space-y-4">
      <div className=" mx-auto space-y-6">
        {/* Header */}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {user?.role === "teacher" ? "Tài liệu" : "Danh sách tài liệu"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {user?.role === "teacher" ? "Quản lý tài liệu" : ""}
            </p>
          </div>
        </div>

        {/* Upload Form */}
        {user?.role === "teacher" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Tải lên tài liệu mới
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Tiêu đề <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="Nhập tiêu đề tài liệu"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject">
                      Môn học <span className="text-red-500">*</span>
                    </Label>
                    <Select value={subjectId} onValueChange={setSubjectId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn môn học" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockSubjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Class */}
                  <div className="space-y-2">
                    <Label htmlFor="class">
                      Lớp <span className="text-red-500">*</span>
                    </Label>
                    <Select value={classId} onValueChange={setClassId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn lớp" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockClasses.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* File */}
                  <div className="space-y-2">
                    <Label htmlFor="file">
                      File <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png,.mp4"
                    />
                  </div>
                </div>

                {selectedFile && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    File đã chọn:{" "}
                    <span className="font-medium">{selectedFile.name}</span>
                  </div>
                )}

                <Button type="submit" className="w-full md:w-auto">
                  <Upload className="w-4 h-4 mr-2" />
                  Tải lên tài liệu
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách tài liệu ({documents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Chưa có tài liệu nào
                </div>
              ) : (
                documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      {getFileIcon(doc.file_type)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100 truncate">
                        {doc.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <span className="truncate max-w-[100px] sm:max-w-none">
                          {doc.name}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden md:inline">
                          {
                            mockSubjects.find((s) => s.id === doc.subject_id)
                              ?.name
                          }
                        </span>
                        <span className="hidden md:inline">•</span>
                        <span className="hidden lg:inline">
                          {mockClasses.find((c) => c.id === doc.class_id)?.name}
                        </span>
                        <span className="hidden lg:inline">•</span>
                        <span className="hidden sm:inline">
                          {formatDate(doc.created_at)}
                        </span>
                        <span className="sm:hidden text-[10px]">
                          {new Date(doc.created_at).toLocaleDateString(
                            "vi-VN",
                            {
                              day: "2-digit",
                              month: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(doc.file_url, "_blank")}
                        className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                        title="Xem"
                      >
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const a = document.createElement("a");
                          a.href = doc.file_url;
                          a.download = doc.name;
                          a.click();
                        }}
                        className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                        title="Tải xuống"
                      >
                        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                      {user?.role === "teacher" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(doc.id)}
                          className="text-red-500 hover:text-red-700 h-8 w-8 sm:h-9 sm:w-9 p-0"
                          title="Xóa"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Document;
