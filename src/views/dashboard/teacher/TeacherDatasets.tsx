import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import { 
  Upload, 
  FileText, 
  Eye, 
  Code, 
  Download, 
  Copy, 
  Check,
  Sparkles,
  BookOpen,
  Atom,
  Calculator,
  Microscope,
  FlaskConical,
  Brain,
  CheckCircle2
} from "lucide-react";

// Sample markdown data
const SAMPLE_MARKDOWN = `# Bài giảng: Định luật Bảo toàn Năng lượng

## I. Khái niệm

Trong một hệ cô lập, tổng năng lượng luôn được bảo toàn. Năng lượng có thể chuyển hóa từ dạng này sang dạng khác nhưng không tự sinh ra hoặc mất đi.

### Công thức tổng quát

W_cơ + W_nhiệt + W_điện = const

## II. Ứng dụng

1. **Cơ học**: Chuyển động của vật thể
2. **Nhiệt học**: Quá trình trao đổi nhiệt
3. **Điện học**: Mạch điện và năng lượng

### Ví dụ minh họa

Một quả cầu khối lượng m = 2kg được thả rơi từ độ cao h = 10m.

\`\`\`
E_thế = mgh = 2 × 10 × 10 = 200J
E_động (đáy) = 200J
\`\`\`

> "Năng lượng không tự sinh ra cũng không tự mất đi, nó chỉ chuyển hóa từ dạng này sang dạng khác" - Antoine Lavoisier

## III. Bài tập áp dụng

**Bài 1:** Tính vận tốc của vật khi chạm đất...`;

const SAMPLE_RAW = `BÀI GIẢNG: ĐỊNH LUẬT BẢO TOÀN NĂNG LƯỢNG

I. KHÁI NIỆM
Trong một hệ cô lập, tổng năng lượng luôn được bảo toàn...`;

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
    documentCount: 450,
    description: "Bài giảng, đề thi và bài tập toán học các cấp"
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
    documentCount: 380,
    description: "Lý thuyết vật lý và bài tập thực nghiệm"
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
    documentCount: 420,
    description: "Phản ứng hóa học và bài tập thí nghiệm"
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
    documentCount: 340,
    description: "Sinh học đại cương và ứng dụng thực tế"
  }
];

// Sample documents library
const SAMPLE_DOCUMENTS = [
  // Toán học
  {
    id: "toan-1",
    subject: "toan",
    title: "Bài giảng Đại số 12 - Hàm số và đạo hàm",
    description: "Lý thuyết chi tiết về hàm số, giới hạn, và đạo hàm với 50+ ví dụ minh họa",
    format: "PDF",
    size: "2.4 MB",
    pages: 45,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-400/30"
  },
 
  // Vật lý
  {
    id: "ly-1",
    subject: "ly",
    title: "Cơ học chất điểm - Định luật Newton",
    description: "Bài giảng đầy đủ về động lực học với mô phỏng và bài tập thực hành",
    format: "PDF",
    size: "2.8 MB",
    pages: 52,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-400/30"
  },
 
  // Hóa học
  {
    id: "hoa-1",
    subject: "hoa",
    title: "Hóa học hữu cơ - Hidrocacbon",
    description: "Phản ứng hữu cơ cơ bản với cơ chế chi tiết và bài tập vận dụng",
    format: "PDF",
    size: "2.2 MB",
    pages: 58,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-400/30"
  },

  // Sinh học
  {
    id: "sinh-1",
    subject: "sinh",
    title: "Di truyền học Mendel và nhiễm sắc thể",
    description: "Quy luật di truyền cơ bản với bài tập phả hệ và lai phân tích",
    format: "PDF",
    size: "2.6 MB",
    pages: 61,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-400/30"
  },

];

const TeacherDatasets = () => {
  const [raw, setRaw] = useState(SAMPLE_RAW);
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [viewMode, setViewMode] = useState<"raw" | "markdown">("markdown");
  const [fileName, setFileName] = useState("");
  const [copied, setCopied] = useState(false);
  const [hoveredDataset, setHoveredDataset] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const text = await file.text();
    setRaw(text);
    const md = `# Tài liệu: ${file.name}\n\n${text}`;
    setMarkdown(md);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName ? fileName.replace(/\.[^/.]+$/, "") + '.md' : 'tailieu.md';
    a.click();
    URL.revokeObjectURL(url);
  };

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
                    RAG (Retrieval-Augmented Generation) là kỹ thuật kết hợp truy xuất thông tin từ cơ sở dữ liệu với khả năng sinh ngôn ngữ của AI, giúp tạo ra câu trả lời chính xác và có nguồn gốc rõ ràng.
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
                      <span>Tải lên tài liệu PDF, Word về Toán, Lý, Hóa, Sinh</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-400 flex-shrink-0" />
                      <span>Hệ thống tự động chuyển đổi sang định dạng Markdown</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-400 flex-shrink-0" />
                      <span>Dữ liệu được index và sẵn sàng cho truy vấn AI</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Upload & Trained Datasets */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section - Compact */}
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
                      PDF, DOC, DOCX
                    </p>
                    <p className="text-xs text-slate-400">
                      Tối đa 10MB
                    </p>
                  </div>
                  
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium transition-all shadow-lg inline-block">
                      Chọn tệp
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  
                  {fileName && (
                    <Badge className="mt-3 bg-blue-500/20 text-blue-300 border-blue-400/30">
                      <FileText className="w-3 h-3 mr-1" />
                      {fileName}
                    </Badge>
                  )}
                </div>

                <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-4 border border-indigo-400/20">
                  <p className="text-xs text-indigo-200 leading-relaxed">
                    💡 <strong>Gợi ý:</strong> Tải lên bài giảng, đề thi, hoặc tài liệu tham khảo. Hệ thống sẽ tự động trích xuất và chuẩn hóa nội dung.
                  </p>
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
                Hover vào mỗi thẻ để xem chi tiết các chủ đề đã được train
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {TRAINED_DATASETS.map((dataset, index) => {
                const Icon = dataset.icon;
                const isHovered = hoveredDataset === dataset.id;
                
                return (
                  <Card
                    key={dataset.id}
                    className={`dataset-card border-2 ${dataset.borderColor} ${dataset.hoverColor} ${dataset.bgColor} bg-opacity-10 backdrop-blur-xl cursor-pointer overflow-hidden relative group h-[320px]`}
                    onMouseEnter={() => setHoveredDataset(dataset.id)}
                    onMouseLeave={() => setHoveredDataset(null)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Background gradient effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${dataset.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    
                    <CardContent className="p-6 flex flex-col h-full relative z-10">
                      {/* Icon and Title */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`icon-wrapper p-4 bg-gradient-to-br ${dataset.color} rounded-2xl shadow-xl`}>
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

                      {/* Description */}
                      <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                        {dataset.description}
                      </p>

                      {/* Models - Show on hover */}
                      <div className="mt-auto space-y-2">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                          Các chủ đề đã train:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {isHovered && dataset.models.map((model, idx) => (
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

                      {/* Hover indicator */}
                      <div className={`absolute bottom-3 right-3 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                        <div className={`p-2 bg-gradient-to-br ${dataset.color} rounded-full`}>
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3 mono">
                <BookOpen className="w-8 h-8 text-yellow-400" />
                Kho tài liệu mẫu
              </h2>
              <p className="text-blue-200">
                Tải xuống tài liệu mẫu để tham khảo hoặc sử dụng cho mục đích giảng dạy
              </p>
            </div>
          </div>

          {/* Subject Filter */}
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={() => setSelectedSubject("all")}
              variant={selectedSubject === "all" ? "default" : "outline"}
              className={`${
                selectedSubject === "all"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0"
                  : "bg-slate-800/50 text-slate-300 border-slate-600 hover:bg-slate-700"
              }`}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Tất cả môn
            </Button>
            {TRAINED_DATASETS.map((dataset) => {
              const Icon = dataset.icon;
              return (
                <Button
                  key={dataset.id}
                  onClick={() => setSelectedSubject(dataset.id)}
                  variant={selectedSubject === dataset.id ? "default" : "outline"}
                  className={`${
                    selectedSubject === dataset.id
                      ? `bg-gradient-to-r ${dataset.color} text-white border-0`
                      : "bg-slate-800/50 text-slate-300 border-slate-600 hover:bg-slate-700"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {dataset.subject}
                </Button>
              );
            })}
          </div>

          {/* Documents Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SAMPLE_DOCUMENTS
              .filter(doc => selectedSubject === "all" || doc.subject === selectedSubject)
              .map((doc, index) => (
                <Card
                  key={doc.id}
                  className={`${doc.bgColor} ${doc.borderColor} border-2 backdrop-blur-xl hover:scale-105 transition-all duration-300 group overflow-hidden`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-6 space-y-4 relative">
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${doc.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    
                    {/* Header with format badge */}
                    <div className="flex items-start justify-between relative z-10">
                      <div className={`p-3 bg-gradient-to-br ${doc.color} rounded-xl shadow-lg`}>
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <Badge className="bg-slate-800/80 text-slate-200 border-slate-700">
                        {doc.format}
                      </Badge>
                    </div>

                    {/* Document info */}
                    <div className="space-y-2 relative z-10">
                      <h3 className="font-bold text-white text-lg leading-tight line-clamp-2 group-hover:text-blue-300 transition-colors">
                        {doc.title}
                      </h3>
                      <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                        {doc.description}
                      </p>
                    </div>

                    {/* File stats */}
                    <div className="flex items-center gap-4 text-xs text-slate-500 relative z-10">
                      <div className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        <span>{doc.pages} trang</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" />
                        <span>{doc.size}</span>
                      </div>
                    </div>

                    {/* Download button */}
                    <Button
                      onClick={() => {
                        // Simulate download
                        console.log(`Downloading ${doc.title}`);
                      }}
                      className={`w-full bg-gradient-to-r ${doc.color} hover:opacity-90 text-white border-0 shadow-lg group-hover:shadow-xl transition-all relative z-10`}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Tải xuống
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* No results message */}
          {SAMPLE_DOCUMENTS.filter(doc => selectedSubject === "all" || doc.subject === selectedSubject).length === 0 && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-12 text-center">
                <p className="text-slate-400 text-lg">
                  Không tìm thấy tài liệu mẫu cho môn học này
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Preview Section */}
        {fileName && (
          <Card className="shadow-2xl border-2 border-slate-700 bg-slate-800 backdrop-blur-xl">
            <CardHeader className="border-b border-slate-700 bg-slate-800/80">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Eye className="w-5 h-5 text-blue-400" />
                  Xem trước tài liệu
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-2 bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Đã sao chép
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Sao chép
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="gap-2 bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600"
                  >
                    <Download className="w-4 h-4" />
                    Tải xuống
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "raw" | "markdown")} className="w-full">
                <div className="border-b border-slate-700 bg-slate-800 p-4">
                  <TabsList className="grid w-full max-w-md grid-cols-2 bg-slate-700/50">
                    <TabsTrigger value="markdown" className="gap-2 data-[state=active]:bg-slate-600 text-slate-200">
                      <Eye className="w-4 h-4" />
                      Markdown
                    </TabsTrigger>
                    <TabsTrigger value="raw" className="gap-2 data-[state=active]:bg-slate-600 text-slate-200">
                      <Code className="w-4 h-4" />
                      Raw Text
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="markdown" className="m-0 p-6 text-slate-200">
                  <div className="prose prose-invert max-w-none prose-headings:text-blue-300 prose-p:text-slate-300 prose-a:text-blue-400 prose-strong:text-white prose-code:text-indigo-300 prose-code:bg-indigo-950/50 prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-900 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-950/20 prose-blockquote:italic">
                    <ReactMarkdown>{markdown}</ReactMarkdown>
                  </div>
                </TabsContent>

                <TabsContent value="raw" className="m-0 p-6">
                  <div className="bg-slate-950 text-green-400 rounded-xl p-6 border border-slate-800">
                    <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed overflow-auto max-h-[600px]">
                      {raw}
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TeacherDatasets;