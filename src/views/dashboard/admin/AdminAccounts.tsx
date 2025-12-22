
import { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  Clock, 
  Mail, 
  Phone, 
  UserCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { userService } from './user.service';


// Shadcn components
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AxiosError } from 'axios';

// types/user.types.ts
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  full_name?: string;
  phone?: string;
  avatar: string;
  is_active: boolean;
  created_at: string;
}

export interface PendingUsersResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface ApproveUserRequest {
  action: 'approve' | 'reject';
  rejection_reason?: string;
}

export interface ApproveUserResponse {
  success: boolean;
  message: string;
  data: User;
}
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

export interface AxiosErrorResponse {
  response?: {
    data?: ApiErrorResponse;
    status?: number;
  };
  message?: string;
}

const AdminAccounts = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);


    // Helper function to get error message
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
      const apiError = error.response?.data as ApiErrorResponse | undefined;
      return apiError?.message || 'Đã xảy ra lỗi không xác định';
    }
    if (error instanceof Error) {
      return error.message;
    }
    return 'Đã xảy ra lỗi không xác định';
  };

  // Fetch pending users
  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getPendingUsers(page, limit);
      setUsers(response.data.users);
      setTotal(response.data.pagination.total);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, [page, limit]);

  // Approve user
  const handleApprove = async (user: User) => {
    try {
      setProcessingUserId(user.id);
      await userService.approveUser(user.id, { action: 'approve' });
      toast.success(`Đã phê duyệt tài khoản ${user.username}`);
      fetchPendingUsers(); // Refresh list
    } catch (error) {
       toast.error(getErrorMessage(error));
    } finally {
      setProcessingUserId(null);
    }
  };

  // Reject user
  const handleReject = async () => {
    if (!selectedUser) return;
    
    if (!rejectionReason.trim()) {
      toast.warning('Vui lòng nhập lý do từ chối');
      return;
    }

    try {
      setProcessingUserId(selectedUser.id);
      await userService.approveUser(selectedUser.id, { 
        action: 'reject',
        rejection_reason: rejectionReason 
      });
      toast.success(`Đã từ chối tài khoản ${selectedUser.username}`);
      setShowRejectDialog(false);
      setRejectionReason('');
      setSelectedUser(null);
      fetchPendingUsers(); // Refresh list
    } catch (error) {
       toast.error(getErrorMessage(error));
    } finally {
      setProcessingUserId(null);
    }
  };



  // Get role badge color
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'teacher':
        return 'default';
      case 'student':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-2 py-2 space-y-3">
      {/* Header */}
      <Card className='border-none rounded-none'>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Clock className="h-6 w-6" />
                Quản lý tài khoản chờ duyệt
              </CardTitle>
              <CardDescription className="mt-2">
                Danh sách tài khoản đang chờ phê duyệt từ admin
              </CardDescription>
            </div>
            <Button 
              onClick={fetchPendingUsers} 
              disabled={loading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Table */}
      <Card className='border-none rounded-none'>
        <CardContent className="pt-2">
          {loading && users.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Không có tài khoản nào chờ duyệt</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Ngày đăng ký</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <UserCircle className="h-4 w-4 text-muted-foreground" />
                          {user.username}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell>{user.full_name || '—'}</TableCell>
                      <TableCell>
                        {user.phone ? (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {user.phone}
                          </div>
                        ) : (
                          '—'
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(user.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApprove(user)}
                            disabled={processingUserId === user.id}
                            className='hover:bg-primary-dark bg-primary-light'
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Duyệt
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Hiển thị <span className="font-medium">{(page - 1) * limit + 1}</span> -{' '}
                  <span className="font-medium">
                    {Math.min(page * limit, total)}
                  </span>{' '}
                  trong tổng số <span className="font-medium">{total}</span> tài khoản
                </div>

                <div className="flex items-center gap-2">
                  <Select
                    value={limit.toString()}
                    onValueChange={(value) => {
                      setLimit(Number(value));
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page >= totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối tài khoản</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn từ chối tài khoản{' '}
              <span className="font-semibold">{selectedUser?.username}</span>?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejection_reason">
                Lý do từ chối <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="rejection_reason"
                placeholder="Nhập lý do từ chối tài khoản..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectionReason('');
                setSelectedUser(null);
              }}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={processingUserId === selectedUser?.id || !rejectionReason.trim()}
            >
              {processingUserId === selectedUser?.id ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Từ chối
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAccounts;