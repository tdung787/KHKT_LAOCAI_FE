import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  Sparkles,
  BookOpen,
  Atom,
  Calculator,
  Microscope,
  FlaskConical,
  Brain,
  CheckCircle2,
  ArrowDownToLine,
} from "lucide-react";

import axiosInstance from "@/infra/apiRAG/conflig/axiosInstance";

// Types cho API response


// Trained datasets for science subjects
const TRAINED_DATASETS = [
  {
    id: "toan",
    subject: "Toán học",
    icon: Calculator,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    hoverColor: "hover:border-blue-400",
    models: ["Đại số", "Hình học", "Giải tích", "Xác suất"],
    documentCount: 5,
    description: "Bài giảng, đề thi và bài tập toán học các cấp",
  },
  {
    id: "ly",
    subject: "Vật lý",
    icon: Atom,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    hoverColor: "hover:border-purple-400",
    models: ["Cơ học", "Nhiệt học", "Điện học", "Quang học"],
    documentCount: 6,
    description: "Lý thuyết vật lý và bài tập thực nghiệm",
  },
  {
    id: "hoa",
    subject: "Hóa học",
    icon: FlaskConical,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    hoverColor: "hover:border-orange-400",
    models: ["Vô cơ", "Hữu cơ", "Hóa phân tích", "Hóa lý"],
    documentCount: 8,
    description: "Phản ứng hóa học và bài tập thí nghiệm",
  },
  {
    id: "sinh",
    subject: "Sinh học",
    icon: Microscope,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    hoverColor: "hover:border-green-400",
    models: ["Tế bào", "Di truyền", "Sinh thái", "Tiến hóa"],
    documentCount: 8,
    description: "Sinh học đại cương và ứng dụng thực tế",
  },
];

const TeacherDatasets = () => {
  const [datasets, setDatasets] = useState(TRAINED_DATASETS);
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [hoveredDataset, setHoveredDataset] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  // Thêm các state mới cho upload thực tế
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "processing" | "success" | "error"
  >("idle");
  const [uploadMessage, setUploadMessage] = useState<string>("");

  // Để lưu task_id và interval polling
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Xử lý chọn môn học (giữ nguyên)
  const handleDatasetClick = (id: string) => {
    setSelectedDataset(id === selectedDataset ? null : id);
  };

  // Hàm dọn dẹp polling khi component unmount hoặc upload mới
  const clearPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  // Hàm poll status
  const pollStatus = async (taskId: string, subject: string) => {
    const statusUrl = `http://14.225.211.7:8110/api/pipeline/status/${taskId}`;

    try {
      const response = await axiosInstance.get(statusUrl);
      const data = response.data;

      // Giả sử API trả về status: "pending", "processing", "completed", "failed"
      if (data.status === "completed" || data.status === "success") {
        clearPolling();
        setIsUploading(false);
        setUploadStatus("success");
        setUploadMessage(
          `Tài liệu đã được xử lý thành công cho môn ${subject}!`
        );

        // Tăng documentCount
        setDatasets((prev) =>
          prev.map((ds) =>
            ds.id === selectedDataset
              ? { ...ds, documentCount: ds.documentCount + 1 }
              : ds
          )
        );

        setTimeout(() => {
          setUploadStatus("idle");
          setUploadMessage("");
        }, 5000);
      } else if (data.status === "failed" || data.error) {
        clearPolling();
        setIsUploading(false);
        setUploadStatus("error");
        setUploadMessage(
          `Xử lý thất bại: ${
            data.error || data.message || "Lỗi không xác định"
          }`
        );
      } else {
        // Vẫn đang processing/pending → tiếp tục poll
        setUploadStatus("processing");
        setUploadMessage(
          "Đang xử lý tài liệu (trích xuất, chuyển Markdown, embedding...)"
        );
      }
    } catch (error) {
      // Type guard cho AxiosError
      const err = error as import('axios').AxiosError<{ message?: string }>;

      clearPolling();
      setIsUploading(false);
      setUploadStatus("error");

      if (err.response?.data?.message) {
        setUploadMessage(`Lỗi khi kiểm tra trạng thái: ${err.response.data.message}`);
      } else if (err.message) {
        setUploadMessage(`Lỗi khi kiểm tra trạng thái: ${err.message}`);
      } else {
        setUploadMessage("Lỗi không xác định khi kiểm tra trạng thái");
      }
    }
  };

  // Xử lý upload file thực tế
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!selectedDataset) {
      alert("Vui lòng chọn một môn học trước khi tải tài liệu lên!");
      return;
    }

    // Kiểm tra định dạng
    const allowedTypes = [".pdf", ".doc", ".docx"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!allowedTypes.includes(ext)) {
      alert("Chỉ chấp nhận file PDF, DOC, DOCX");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File không được vượt quá 10MB");
      return;
    }

    // Reset trạng thái cũ
    clearPolling();
    setUploadStatus("uploading");
    setIsUploading(true);
    setFileName(file.name);
    setUploadMessage("Đang tải file lên server...");

    const selectedDatasetObj = datasets.find((d) => d.id === selectedDataset);
    const subject = selectedDatasetObj?.subject || "";

    const formData = new FormData();
    formData.append("docx_file", file);
    // Nếu backend yêu cầu thêm metadata (ví dụ: subject), có thể thêm:
    // formData.append("subject", selectedDataset);

    try {
      const response = await axiosInstance.post(
        "http://14.225.211.7:8110/api/pipeline/process-docx",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 60000, // 60s timeout cho upload
        }
      );

      if (response.data.success && response.data.task_id) {
        const taskId = response.data.task_id;

        // Bắt đầu polling mỗi 3 giây
        pollingIntervalRef.current = setInterval(() => {
          pollStatus(taskId, subject);
        }, 3000);

        setUploadMessage("File đã được nhận, đang chờ xử lý...");
      } else {
        throw new Error("Không nhận được task_id từ server");
      }
    } catch (error) {
      clearPolling();
      setIsUploading(false);
      setUploadStatus("error");

      const err = error as import('axios').AxiosError<{ message?: string }>;

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Không thể kết nối đến server";

      setUploadMessage(`Tải lên thất bại: ${errorMessage}`);
    }

    // Reset input file
    e.target.value = "";
  };

  // Dọn dẹp interval khi component unmount
  useEffect(() => {
    return () => {
      clearPolling();
    };
  }, []);

  const selectedDatasetObj = datasets.find((d) => d.id === selectedDataset);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-green-900 to-primary-dark p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Archivo:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Archivo', sans-serif;
        }
        
        .mono {
          font-family: 'Space Mono', monospace;
        }
        
        .dataset-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .dataset-card:hover {
          transform: translateY(-8px) scale(1.02);
        }
        
        .dataset-card .icon-wrapper {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .dataset-card:hover .icon-wrapper {
          transform: rotate(360deg) scale(1.1);
        }
        
        .model-badge {
          animation: slideIn 0.3s ease-out forwards;
          opacity: 0;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .dataset-card:hover .model-badge:nth-child(1) { animation-delay: 0.1s; }
        .dataset-card:hover .model-badge:nth-child(2) { animation-delay: 0.15s; }
        .dataset-card:hover .model-badge:nth-child(3) { animation-delay: 0.2s; }
        .dataset-card:hover .model-badge:nth-child(4) { animation-delay: 0.25s; }
        
        .glow-effect {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
        }
        
        .noise-bg {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
        }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Hero Section - Introduction */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-xl border border-blue-400/30 p-10 noise-bg">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10" />

          <div className="flex items-start gap-6">
            <div className="p-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-2xl glow-effect">
              <Brain className="w-12 h-12 text-white" />
            </div>

            <div className="flex-1 space-y-5">
              <div>
                <h1 className="text-5xl font-bold text-white mb-3 mono tracking-tight">
                  Hệ thống RAG Khoa học Tự nhiên
                </h1>
                <p className="text-xl text-blue-100">
                  Retrieval-Augmented Generation cho giáo dục STEM
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 text-blue-50">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2 text-white">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    RAG là gì?
                  </h3>
                  <p className="text-sm leading-relaxed">
                    RAG (Retrieval-Augmented Generation) là kỹ thuật kết hợp
                    truy xuất thông tin từ cơ sở dữ liệu với khả năng sinh ngôn
                    ngữ của AI, giúp tạo ra câu trả lời chính xác và có nguồn
                    gốc rõ ràng.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2 text-white">
                    <BookOpen className="w-5 h-5 text-green-400" />
                    Cách sử dụng
                  </h3>
                  <ul className="text-sm space-y-1.5">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-400 flex-shrink-0" />
                      <span>
                        Tải lên tài liệu Word về Toán, Lý, Hóa, Sinh
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-400 flex-shrink-0" />
                      <span>
                        Hệ thống tự động chuyển đổi sang định dạng Markdown
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-400 flex-shrink-0" />
                      <span>
                        Dữ liệu được index và sẵn sàng cho truy vấn AI
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Upload & Trained Datasets */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-blue-400/30 bg-slate-800/50 backdrop-blur-xl h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-400" />
                  Tải tài liệu mới
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-blue-400/40 rounded-xl p-6 text-center space-y-4 hover:border-blue-400/60 transition-colors bg-blue-500/5">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-white" />
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-blue-200 font-medium">
                      DOC, DOCX ,Tối đa 10MB
                    </p>
                  </div>

                  {/* Hiển thị môn đang chọn */}
                  {selectedDatasetObj && (
                    <div className="my-4 p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-lg">
                      <p className="text-xs text-green-300 font-medium">
                        Đang tải lên cho:
                      </p>
                      <p className="text-sm text-white font-bold">
                        {selectedDatasetObj.subject}
                      </p>
                    </div>
                  )}

                  {/* Nút chọn file - chỉ active khi đã chọn môn */}
                  <label
                    htmlFor="file-upload"
                    className={`cursor-pointer block ${
                      !selectedDataset
                        ? "opacity-50 pointer-events-none"
                        : "opacity-100"
                    }`}
                  >
                    <div
                      className={`px-6 py-2 rounded-lg font-medium transition-all shadow-lg inline-block ${
                        selectedDataset
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                          : "bg-gray-600 text-gray-400"
                      }`}
                    >
                      {isUploading ? "Đang tải lên..." : "Chọn tệp"}
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      disabled={!selectedDataset || isUploading}
                      className="hidden"
                    />
                  </label>

                  {/* Hiển thị tên file và trạng thái */}
                  {fileName && (
                    <div className="space-y-2">
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
                        <FileText className="w-3 h-3 mr-1" />
                        {fileName}
                      </Badge>
                    </div>
                  )}

                  {/* Thông báo trạng thái */}
                  {uploadMessage && (
                    <div
                      className={`text-sm font-medium ${
                        uploadStatus === "error"
                          ? "text-red-400"
                          : uploadStatus === "success"
                          ? "text-green-400"
                          : "text-yellow-300"
                      }`}
                    >
                      {uploadMessage}
                    </div>
                  )}

                  {!selectedDataset && (
                    <p className="text-xs text-amber-300 mt-4">
                      👆 Vui lòng chọn một môn học bên phải trước khi tải tài
                      liệu
                    </p>
                  )}
                </div>

                <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-4 border border-indigo-400/20">
                  <p className="text-xs text-indigo-200 leading-relaxed">
                    💡 <strong>Gợi ý:</strong> Tải lên bài giảng, đề thi, hoặc
                    tài liệu tham khảo. Hệ thống sẽ tự động trích xuất và chuẩn
                    hóa nội dung.
                  </p>
                </div>
              </CardContent>
              <CardContent>
                <div className="text-white space-y-3 ">
                  <h2 className="text-xl font-semibold ">Tài liệu mẫu</h2>

                  <div className="space-y-3 ">
                    {/* Toán */}
                    <div className="flex items-center justify-between p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/30 rounded-lg">
                          <Calculator className="w-5 h-5 text-blue-300" />
                        </div>
                        <span className="font-medium">Toán học</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm opacity-90 hover:opacity-100 cursor-pointer">
                        <span>Tải về</span>
                        <ArrowDownToLine className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Vật Lý */}
                    <div className="flex items-center justify-between p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/30 rounded-lg">
                          <Atom className="w-5 h-5 text-purple-300" />
                        </div>
                        <span className="font-medium">Vật lý</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm opacity-90 hover:opacity-100 cursor-pointer">
                        <span>Tải về</span>
                        <ArrowDownToLine className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Hóa học */}
                    <div className="flex items-center justify-between p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/30 rounded-lg">
                          <FlaskConical className="w-5 h-5 text-green-300" />
                        </div>
                        <span className="font-medium">Hóa học</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm opacity-90 hover:opacity-100 cursor-pointer">
                        <span>Tải về</span>
                        <ArrowDownToLine className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Sinh học */}
                    <div className="flex items-center justify-between p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-pink-500/30 rounded-lg">
                          <Microscope className="w-5 h-5 text-pink-300" />
                        </div>
                        <span className="font-medium">Sinh học</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm opacity-90 hover:opacity-100 cursor-pointer">
                        <span>Tải về</span>
                        <ArrowDownToLine className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trained Datasets Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                Bộ dữ liệu đã huấn luyện
              </h2>
              <p className="text-blue-200 text-sm">
                Click vào thẻ môn học để chọn và tải tài liệu lên
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {datasets.map((dataset, index) => {
                const Icon = dataset.icon;
                const isSelected = selectedDataset === dataset.id;
                const isHovered = hoveredDataset === dataset.id;

                return (
                  <Card
                    key={dataset.id}
                    className={`
                  dataset-card relative overflow-hidden cursor-pointer transition-all duration-300
                  border-2 ${dataset.borderColor} ${dataset.hoverColor}
                  ${
                    isSelected
                      ? "ring-4 ring-white/50 scale-105 shadow-2xl"
                      : ""
                  }
                  ${dataset.bgColor} bg-opacity-10 backdrop-blur-xl h-[320px]
                `}
                    onClick={() => handleDatasetClick(dataset.id)}
                    onMouseEnter={() => setHoveredDataset(dataset.id)}
                    onMouseLeave={() => setHoveredDataset(null)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Selected indicator */}
                    {isSelected && (
                      <div className="absolute top-4 right-4 z-20">
                        <div className="p-2 bg-green-500 rounded-full shadow-lg">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Background gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${dataset.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                    />

                    <CardContent className="p-6 flex flex-col h-full relative z-10">
                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className={`icon-wrapper p-4 bg-gradient-to-br ${dataset.color} rounded-2xl shadow-xl`}
                        >
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mono">
                            {dataset.subject}
                          </h3>
                          <p className="text-sm text-slate-400 mt-1">
                            {dataset.documentCount} tài liệu
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                        {dataset.description}
                      </p>

                      <div className="mt-auto space-y-2">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                          Các chủ đề đã train:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(isHovered || isSelected) &&
                            dataset.models.map((model, idx) => (
                              <Badge
                                key={idx}
                                className={`model-badge ${dataset.bgColor} ${dataset.borderColor} border text-slate-700 font-medium`}
                                style={{ animationDelay: `${idx * 0.05}s` }}
                              >
                                {model}
                              </Badge>
                            ))}
                        </div>
                      </div>

                      <div
                        className={`absolute bottom-3 right-3 transition-opacity ${
                          isHovered || isSelected ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <div
                          className={`p-2 bg-gradient-to-br ${dataset.color} rounded-full`}
                        >
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sample Documents Library */}
        <div className="space-y-6">
          {/* <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3 mono">
                <BookOpen className="w-8 h-8 text-yellow-400" />
                Kho tài liệu mẫu
              </h2>
              <p className="text-blue-200">
                Tải xuống tài liệu mẫu để tham khảo hoặc sử dụng cho mục đích giảng dạy
              </p>
            </div>
          </div> */}

          {/* Subject Filter */}
        </div>

        {/* Preview Section */}
      </div>
    </div>
  );
};

export default TeacherDatasets;
