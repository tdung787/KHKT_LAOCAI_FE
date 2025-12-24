import * as z from "zod";
import { VALID_CLASSES } from ".";

export const createProfileSchema = z.object({
  student_code: z
    .string()
    .min(1, "Mã học sinh là bắt buộc")
    .trim()
    .regex(
      /^HS[0-9]{4,6}$/i,
      "Mã học sinh phải có định dạng HS + 4-6 chữ số (VD: HS0001)"
    )
    .transform((val) => val.toUpperCase()),

  avatar: z
    .string()
    .trim()
    .refine((val) => val === "" || z.string().url().safeParse(val).success, {
      message: "URL avatar không hợp lệ",
    })
    .default(""),

  grade_level: z.number().int().min(10).max(12),

  current_class: z.enum(VALID_CLASSES, {
    message: "Vui lòng chọn lớp hợp lệ",
  }),

  school_name: z.string().min(1, "Tên trường là bắt buộc"),
  learning_style: z.enum(
    ["visual", "auditory", "kinesthetic", "reading_writing"],
    {
      message: "Vui lòng chọn phong cách học hợp lệ",
    }
  ),
  difficulty_preference: z.enum(["easy", "medium", "hard"], {
    message: "Vui lòng chọn độ khó ưu tiên",
  }),
});
