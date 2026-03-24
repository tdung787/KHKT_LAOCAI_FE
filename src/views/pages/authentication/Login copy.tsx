import { FC, useState, useEffect } from "react";
import FormLogin from "@/@core/components/auth/form";
import logoLC from "../../../assets/images/logo/logo NTT.png";
import bgKHKT from "../../../assets/images/background/bg-KHKT.png";
import bgheader from "../../../assets/images/banner/bg-header.jpg";
import timebg from "../../../assets/images/icons/time bg.png";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/vi";

import {
  Users,
  Eye,
  Calendar,
  TrendingUp,
} from "lucide-react";

// Extend dayjs với plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("vi");

const Login: FC = () => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    // Cập nhật thời gian ngay khi component mount
    const updateTime = () => {
      const vietnamTime = dayjs().tz("Asia/Ho_Chi_Minh");
      // Format: Thứ 5, 30/10/2025 - HH:mm:ss
      const dayOfWeek = vietnamTime.format("dddd"); // Lấy thứ trong tuần bằng tiếng Việt
      const formattedDate = vietnamTime.format("DD/MM/YYYY");
      // const formattedTime = vietnamTime.format("HH:mm:ss");

      // Viết hoa chữ cái đầu của thứ
      const capitalizedDay =
        dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

      setCurrentTime(`${capitalizedDay}, ${formattedDate} `);
    };

    updateTime();

    // Cập nhật mỗi giây
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <header
        className="relative w-full h-[80px] md:h-[120px] lg:h-[200px] text-white flex items-center justify-center bg-cover bg-center shadow-md"
        style={{
          backgroundImage: `url(${bgheader})`,
        }}
      >
        {/* Nội dung chính */}
        <div className="relative w-full flex items-center justify-between px-3 md:px-6 lg:px-4 py-2 md:py-3 lg:py-4">
          {/* LOGO BÊN TRÁI */}
          <div className="w-[60px] md:w-[100px] lg:w-[250px] flex-shrink-0">
            <img
              src={logoLC}
              alt="Logo"
              className="w-full h-auto object-contain drop-shadow-lg"
            />
          </div>

          {/* TIÊU ĐỀ CHÍNH - Tablet & Mobile: bên phải logo */}
          <div className="flex-1 text-left md:text-left lg:text-center lg:absolute lg:left-1/2 lg:-translate-x-1/2 ml-3 md:ml-4 lg:ml-0">
            <h1 className="text-[10px] md:text-[14px] lg:text-[28px] xl:text-[32px] font-extrabold leading-tight md:leading-snug lg:leading-snug drop-shadow-xl">
              HỆ THỐNG HỖ TRỢ HỌC TẬP CÁC MÔN
              <br className="hidden lg:block" />
              <span className="lg:hidden"> </span>
              KHOA HỌC TỰ NHIÊN CHO HỌC SINH
              <br className="hidden lg:block" />
              <span className="lg:hidden"> </span>
              TRUNG HỌC PHỔ THÔNG
            </h1>
            <p className="italic text-[7px] md:text-[10px] lg:text-[16px] xl:text-[18px] mt-0.5 md:mt-1 lg:mt-2 drop-shadow">
              (Sản phẩm dự thi khoa học kỹ thuật tỉnh 2025)
            </p>
          </div>

          {/* THỜI GIAN THỰC - Chỉ hiện trên Desktop */}
          <div className="hidden lg:flex w-[300px] absolute right-0 bottom-9 flex-col items-end">
            <div
              className=" w-full h-[60px] flex items-center justify-center "
              style={{
                backgroundImage: `url(${timebg})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            >
              <div className="text-black font-bold  xl:text-base drop-shadow-lg text-center px-4">
                <i className="text-xl ml-15 ">{currentTime}</i>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main
        className="flex-1 flex flex-col lg:flex-row items-center justify-between w-full bg-no-repeat bg-center bg-cover"
        style={{
          backgroundImage: `url(${bgKHKT})`,
        }}
      >
        {/* LEFT SIDE - GIỚI THIỆU */}
        <div className="w-full lg:w-2/3 p-4 sm:p-6 md:p-8 lg:p-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            <i className="text-text-h1 underline ml-2 sm:ml-3 md:ml-5">
              Giới thiệu:
            </i>
          </h2>
          <div className="text-gray-900 max-w-5xl ml-3 sm:ml-5 md:ml-7 font-medium text-justify leading-relaxed space-y-2 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
            <p>
              <i>
                Trong bối cảnh năm 2025 đánh dấu kỳ thi tốt nghiệp THPT đầu tiên
                áp dụng toàn diện CTGDPT 2018, việc tìm ra giải pháp công nghệ
                để khắc phục những hạn chế nêu trên trở nên đặc biệt cấp bách.
                Ứng dụng AI trong xây dựng phần mềm hỗ trợ học tập các môn Khoa
                học Tự nhiên không chỉ đáp ứng yêu cầu cá nhân hóa lộ trình học
                tập, mà còn cung cấp công cụ giúp giáo viên theo dõi tiến bộ,
                thiết kế kiểm tra đánh giá sát với chuẩn đầu ra. Đồng thời, hệ
                thống còn tăng cường tính tương tác và thực hành qua mô phỏng
                thí nghiệm, học liệu số và tình huống thực tế.
              </i>
            </p>
            <p>
              <i>
                Với những lợi ích thiết thực và tính cập nhật cao, đề tài "Ứng
                dụng công nghệ trí tuệ nhân tạo (AI) xây dựng hệ thống hỗ trợ
                học tập các môn khoa học tự nhiên cho học sinh Trung học phổ
                thông" mang giá trị khoa học cao, có ý nghĩa thực tiễn lớn, góp
                phần nâng cao chất lượng dạy và học, hỗ trợ quá trình đổi mới
                giáo dục phổ thông ở Việt Nam.
              </i>
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - LOGIN FORM */}
        <div className="w-full lg:w-1/3 flex justify-center px-4 py-6 lg:py-0 lg:mt-0">
          <FormLogin />
        </div>
      </main>

      {/* FOOTER */}
      <footer
        className="text-white"
        style={{
          background:
            "linear-gradient(135deg, #00994C 0%, #008C8C 50%, #0077CC 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            {/* Research Team */}
            <div>
              <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide text-white/90">
                Nhóm nghiên cứu
              </h3>
              <div className="space-y-1.5 text-sm text-white/75">
                <p>Trần Minh</p>
                <p>Phan Mạnh Cường</p>
              </div>
            </div>

            {/* Advisors */}
            <div>
              <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide text-white/90">
                Giáo viên hướng dẫn
              </h3>
              <div className="space-y-1.5 text-sm text-white/75">
                <p>Nguyễn</p>
                <p>Phan</p>
              </div>
            </div>

            {/* Stats */}
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 pt-5">
            <p className="text-center text-xs text-white/60">
              © 2025 Trường Đại học Kỹ thuật Công nghiệp Thái Nguyên
            </p>
          </div>
        </div>

        <div className="flex p-2 justify-end items-center gap-2 text-xs text-white/75">
          <div className=" flex justify-end items-center md:items-end">
            <div className="flex flex-wrap justify-center gap-4 px-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#00994c]" />
                <span className="text-xs text-white">
                  <span className="font-medium text-white">20</span> online
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#00994c]" />
                <span className="text-xs text-white">
                  <span className="font-medium text-white">22</span> hôm nay
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#00994c]" />
                <span className="text-xs text-white">
                  <span className="font-medium text-white">1,429</span> tháng
                  này
                </span>
              </div>

              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#00994c]" />
                <span className="text-xs text-white">
                  <span className="font-medium text-white">82,455</span> tổng
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
