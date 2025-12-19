'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Eye,
  ThumbsUp,
  Globe,
  Users,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  Calculator,
  Atom,
  FlaskConical,
  Microscope,
  BookOpen,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Types
type ModelStatus = 'draft' | 'active' | 'archived';
type PublishedType = 'only_class' | 'global';
type Subject = 'toan' | 'ly' | 'hoa' | 'sinh';

interface ModelDatasetRAG {
  id: string;
  user_id: string;
  name: string;
  code: string;
  description: string;
  document: string;
  avatar: string;
  query: number;
  vote: number;
  published: PublishedType;
  status: ModelStatus;
  subject: Subject;
  created_at: string;
  updated_at: string;
  user_name?: string;
  user_avatar?: string;
}

// Subject configuration
const SUBJECT_CONFIG = {
  toan: {
    label: 'Toán học',
    icon: Calculator,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-400/30',
    textColor: 'text-blue-400',
  },
  ly: {
    label: 'Vật lý',
    icon: Atom,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-400/30',
    textColor: 'text-purple-400',
  },
  hoa: {
    label: 'Hóa học',
    icon: FlaskConical,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-400/30',
    textColor: 'text-orange-400',
  },
  sinh: {
    label: 'Sinh học',
    icon: Microscope,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-400/30',
    textColor: 'text-green-400',
  },
};

// Mock data - Science subjects only
const mockModels: ModelDatasetRAG[] = [
  {
    id: '1',
    user_id: 'u1',
    name: 'Hàm số và Đạo hàm',
    code: 'MATH_HS_DH',
    description: 'Dataset về hàm số bậc 2, giới hạn và đạo hàm cơ bản',
    document: 'ham_so_dao_ham.pdf',
    avatar: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400',
    query: 1284,
    vote: 89,
    published: 'global',
    status: 'active',
    subject: 'toan',
    created_at: '2024-11-01T10:00:00Z',
    updated_at: '2024-11-05T15:30:00Z',
    user_name: 'Nguyễn Thị Mai',
    user_avatar: 'NTM',
  },
  {
    id: '2',
    user_id: 'u2',
    name: 'Hình học không gian',
    code: 'MATH_HGKG',
    description: 'Bài tập và lý thuyết về khối đa diện, mặt cầu, hình trụ',
    document: 'hinh_hoc_khong_gian.pdf',
    avatar: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
    query: 892,
    vote: 67,
    published: 'global',
    status: 'active',
    subject: 'toan',
    created_at: '2024-10-28T14:00:00Z',
    updated_at: '2024-11-04T09:15:00Z',
    user_name: 'Trần Văn Hùng',
    user_avatar: 'TVH',
  },
  {
    id: '3',
    user_id: 'u1',
    name: 'Tích phân và Ứng dụng',
    code: 'MATH_TPUD',
    description: 'Các bài toán tích phân, tính diện tích, thể tích',
    document: 'tich_phan.pdf',
    avatar: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400',
    query: 567,
    vote: 45,
    published: 'only_class',
    status: 'draft',
    subject: 'toan',
    created_at: '2024-11-03T16:00:00Z',
    updated_at: '2024-11-05T10:30:00Z',
    user_name: 'Nguyễn Thị Mai',
    user_avatar: 'NTM',
  },
  {
    id: '4',
    user_id: 'u3',
    name: 'Cơ học Newton',
    code: 'PHY_CMNT',
    description: 'Định luật Newton, động lực học chất điểm và hệ chất điểm',
    document: 'co_hoc_newton.pdf',
    avatar: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400',
    query: 1456,
    vote: 103,
    published: 'global',
    status: 'active',
    subject: 'ly',
    created_at: '2024-10-15T08:30:00Z',
    updated_at: '2024-11-05T11:00:00Z',
    user_name: 'Lê Minh Tuấn',
    user_avatar: 'LMT',
  },
  {
    id: '5',
    user_id: 'u3',
    name: 'Dao động điều hòa',
    code: 'PHY_DDDH',
    description: 'Con lắc đơn, con lắc lò xo và dao động tắt dần',
    document: 'dao_dong_dieu_hoa.pdf',
    avatar: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
    query: 723,
    vote: 58,
    published: 'global',
    status: 'active',
    subject: 'ly',
    created_at: '2024-10-20T12:00:00Z',
    updated_at: '2024-11-03T14:00:00Z',
    user_name: 'Lê Minh Tuấn',
    user_avatar: 'LMT',
  },
  {
    id: '6',
    user_id: 'u4',
    name: 'Điện trường và Từ trường',
    code: 'PHY_DTTT',
    description: 'Định luật Coulomb, định luật Faraday và ứng dụng',
    document: 'dien_tu_truong.pdf',
    avatar: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400',
    query: 934,
    vote: 71,
    published: 'only_class',
    status: 'active',
    subject: 'ly',
    created_at: '2024-10-25T09:00:00Z',
    updated_at: '2024-11-02T16:45:00Z',
    user_name: 'Phạm Thị Lan',
    user_avatar: 'PTL',
  },
  {
    id: '7',
    user_id: 'u5',
    name: 'Hóa học hữu cơ cơ bản',
    code: 'CHEM_HHCB',
    description: 'Hidrocacbon, dẫn xuất halogen và cơ chế phản ứng',
    document: 'huu_co_co_ban.pdf',
    avatar: 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=400',
    query: 1123,
    vote: 94,
    published: 'global',
    status: 'active',
    subject: 'hoa',
    created_at: '2024-09-20T12:00:00Z',
    updated_at: '2024-11-04T14:00:00Z',
    user_name: 'Đỗ Văn Quang',
    user_avatar: 'DVQ',
  },
  {
    id: '8',
    user_id: 'u5',
    name: 'Bảng tuần hoàn các nguyên tố',
    code: 'CHEM_BTTH',
    description: 'Cấu tạo nguyên tử, tính chất tuần hoàn và liên kết',
    document: 'bang_tuan_hoan.pdf',
    avatar: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400',
    query: 2134,
    vote: 156,
    published: 'global',
    status: 'active',
    subject: 'hoa',
    created_at: '2024-10-01T10:00:00Z',
    updated_at: '2024-11-05T09:30:00Z',
    user_name: 'Đỗ Văn Quang',
    user_avatar: 'DVQ',
  },
  {
    id: '9',
    user_id: 'u6',
    name: 'Phản ứng Oxi hóa - Khử',
    code: 'CHEM_OXKH',
    description: 'Cân bằng phản ứng redox và ứng dụng điện hóa',
    document: 'oxi_hoa_khu.pdf',
    avatar: 'https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=400',
    query: 678,
    vote: 52,
    published: 'only_class',
    status: 'draft',
    subject: 'hoa',
    created_at: '2024-11-02T14:00:00Z',
    updated_at: '2024-11-05T11:15:00Z',
    user_name: 'Bùi Thị Hương',
    user_avatar: 'BTH',
  },
  {
    id: '10',
    user_id: 'u7',
    name: 'Di truyền học Mendel',
    code: 'BIO_DTMD',
    description: 'Quy luật phân ly, quy luật phân ly độc lập và bài tập',
    document: 'di_truyen_mendel.pdf',
    avatar: 'https://images.unsplash.com/photo-1578496480157-697fc14d2e55?w=400',
    query: 1567,
    vote: 128,
    published: 'global',
    status: 'active',
    subject: 'sinh',
    created_at: '2024-10-10T08:00:00Z',
    updated_at: '2024-11-04T15:20:00Z',
    user_name: 'Hoàng Văn Nam',
    user_avatar: 'HVN',
  },
  {
    id: '11',
    user_id: 'u7',
    name: 'Cấu trúc tế bào',
    code: 'BIO_CTTB',
    description: 'Tế bào nhân thực, nhân sơ và các bào quan',
    document: 'cau_truc_te_bao.pdf',
    avatar: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400',
    query: 1892,
    vote: 147,
    published: 'global',
    status: 'active',
    subject: 'sinh',
    created_at: '2024-10-05T09:30:00Z',
    updated_at: '2024-11-05T10:45:00Z',
    user_name: 'Hoàng Văn Nam',
    user_avatar: 'HVN',
  },
  {
    id: '12',
    user_id: 'u8',
    name: 'Sinh thái và Quần xã',
    code: 'BIO_STQX',
    description: 'Hệ sinh thái, chuỗi thức ăn và bảo tồn đa dạng sinh học',
    document: 'sinh_thai_quan_xa.pdf',
    avatar: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400',
    query: 834,
    vote: 65,
    published: 'global',
    status: 'archived',
    subject: 'sinh',
    created_at: '2024-09-15T11:00:00Z',
    updated_at: '2024-10-20T13:30:00Z',
    user_name: 'Vũ Thị Thảo',
    user_avatar: 'VTT',
  },
];

const ModelDatasetRAG = () => {
  const [models, setModels] = useState<ModelDatasetRAG[]>(mockModels);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');

  // Filter models
  const filteredModels = models.filter((model) => {
    const statusMatch = filterStatus === 'all' || model.status === filterStatus;
    const subjectMatch = filterSubject === 'all' || model.subject === filterSubject;
    return statusMatch && subjectMatch;
  });

  // Calculate stats
  const stats = {
    total: models.length,
    active: models.filter((m) => m.status === 'active').length,
    draft: models.filter((m) => m.status === 'draft').length,
    archived: models.filter((m) => m.status === 'archived').length,
  };

  // Get status badge
  const getStatusBadge = (status: ModelStatus) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
            Hoạt động
          </Badge>
        );
      case 'draft':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
            Bản Nháp
          </Badge>
        );
      case 'archived':
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 text-xs">
            Đã lưu chữ
          </Badge>
        );
    }
  };

  // Handle delete
  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa model này?')) {
      setModels(models.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Archivo:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Archivo', sans-serif;
        }
        
        .mono {
          font-family: 'Space Mono', monospace;
        }
        
        .model-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .model-card:hover {
          transform: translateY(-4px);
        }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary-dark ">
              Model Dataset RAG
            </h1>
            <p className="text-gray-700 mt-1">
              Quản lý các bộ dữ liệu khoa học tự nhiên
            </p>
          </div>

          <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Tạo Model mới
          </Button>
        </div>

        {/* Stats & Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Subject Filter Pills */}
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              onClick={() => setFilterSubject('all')}
              variant={filterSubject === 'all' ? 'default' : 'outline'}
              className={`${
                filterSubject === 'all'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0'
                  : ''
              }`}
            >
              <BookOpen className="w-4 h-4 mr-1" />
              Tất cả
            </Button>
            {Object.entries(SUBJECT_CONFIG).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <Button
                  key={key}
                  size="sm"
                  onClick={() => setFilterSubject(key)}
                  variant={filterSubject === key ? 'default' : 'outline'}
                  className={`${
                    filterSubject === key
                      ? `bg-gradient-to-r ${config.color} text-white border-0`
                      : '  border-slate-600 hover:bg-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {config.label}
                </Button>
              );
            })}
          </div>

          {/* Status Filter */}
          <div className="">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className=" border-slate-600 ">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả ({stats.total})</SelectItem>
                <SelectItem value="active">Hoạt động ({stats.active})</SelectItem>
                <SelectItem value="draft">Nháp ({stats.draft})</SelectItem>
                <SelectItem value="archived">Đã lưu trữ ({stats.archived})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Models Grid - Smaller cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredModels.map((model) => {
            const subjectConfig = SUBJECT_CONFIG[model.subject];
            const Icon = subjectConfig.icon;
            
            return (
              <div
                key={model.id}
                className="model-card group relative  backdrop-blur-xl rounded-xl overflow-hidden shadow-lg hover:shadow-2xl border border-slate-700/50"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800">
                  <img
                    src={model.avatar}
                    alt={model.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                      size="sm"
                      className="bg-white text-black hover:bg-gray-100 text-xs"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Chi tiết
                    </Button>
                  </div>

                  {/* Top badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {getStatusBadge(model.status)}
                    <Badge className={`${subjectConfig.bgColor} ${subjectConfig.textColor} border ${subjectConfig.borderColor} text-xs`}>
                      <Icon className="w-3 h-3 mr-1" />
                      {subjectConfig.label}
                    </Badge>
                  </div>

                  {/* Published badge */}
                  <div className="absolute top-2 right-2">
                    {model.published === 'global' ? (
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                        <Globe className="w-3 h-3" />
                      </Badge>
                    ) : (
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                        <Users className="w-3 h-3" />
                      </Badge>
                    )}
                  </div>

                  {/* Stats overlay */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black/70 backdrop-blur-sm px-2 py-1 rounded">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-white">
                        <Eye className="w-3 h-3" />
                        <span className="text-xs font-medium">{model.query}</span>
                      </div>
                      <div className="flex items-center gap-1 text-white">
                        <ThumbsUp className="w-3 h-3" />
                        <span className="text-xs font-medium">{model.vote}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          className="w-6 h-6 p-0 bg-white/90 hover:bg-white"
                        >
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-xs">
                          <Edit className="w-3 h-3 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs">
                          <Download className="w-3 h-3 mr-2" />
                          Tải xuống
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-xs text-red-600"
                          onClick={() => handleDelete(model.id)}
                        >
                          <Trash2 className="w-3 h-3 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3">
                  <h3 className="font-semibold  text-sm line-clamp-2 mb-1.5 hover:text-blue-400 transition-colors cursor-pointer leading-tight">
                    {model.name}
                  </h3>

                  <p className="text-xs text-slate-700 line-clamp-2 mb-2 leading-relaxed">
                    {model.description}
                  </p>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-700/50">
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${subjectConfig.color} flex items-center justify-center text-white text-xs font-semibold`}>
                      {model.user_avatar?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-slate-700 truncate">
                        {model.user_name}
                      </div>
                      <div className="text-xs text-slate-500 mono">
                        {model.code}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredModels.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              Không tìm thấy model nào
            </h3>
            <p className="text-slate-400">
              Thử thay đổi bộ lọc hoặc tạo model mới
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelDatasetRAG;