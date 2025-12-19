import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import OnlineStatusBadge from "@/@core/components/dashboard/admin/OnlineStatusBadge";
import EvaluatedStudentDialog from "@/@core/components/dashboard/teacher/components/EvalutedStudentDoalog";
import SentNotificationsDialog from "@/@core/components/dashboard/teacher/components/SentNotificationsDialog";

export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  full_name: string;
  avatar: string;
  phone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Sửa interface Student
export interface Student {
  id: string;
  user_id: IUser; // Đổi từ string thành IUser
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
}

// Đổi từ IEnrollmentItem sang Student
export const columns: ColumnDef<Student>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "avatar",
    header: "",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={row.original.user_id.avatar} 
              alt={row.original.user_id.full_name} 
            />
            <AvatarFallback>
              {row.original.student_code.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <OnlineStatusBadge 
            userId={row.original.user_id._id} 
            showLabel 
            size="sm" 
          />
        </div>
      </div>
    ),
  },
 {
  accessorKey: "student_code",
  header: () => <div className="hidden md:block">Mã học sinh</div>,
  cell: ({ row }) => (
    <div className="hidden md:block">
      <div className="font-semibold text-gray-900 dark:text-gray-100">
        {row.original.student_code}
      </div>
    </div>
  ),
},
  {
    accessorKey: "user_id.full_name",
    header: "Họ và tên",
    cell: ({ row }) => (
      <div>
        <div className="font-semibold text-gray-900 dark:text-gray-100">
          {row.original.user_id.full_name}
        </div>
      </div>
    ),
  },
{
  accessorKey: "school_name",
  header: () => <div className="hidden md:block">Trường</div>,
  cell: () => (
    <span className="hidden md:inline text-sm text-gray-600 dark:text-gray-400">
    Nguyễn Tất Thành
    </span>
  ),
},
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => (
      <div className="flex items-center ">
       <EvaluatedStudentDialog userId={row.original.user_id._id} studentCode={row.original.student_code} />
       <SentNotificationsDialog userId={row.original.user_id._id} />
      </div>
    ),
  },
];