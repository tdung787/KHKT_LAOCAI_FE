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

import Player from "./Player";
import Footer from "./Footer";

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
        <div className="w-full lg:w-2/3 p-2 sm:p-4 md:p-6 lg:p-8">
          <Player />
        </div>

        {/* RIGHT SIDE - LOGIN FORM */}
        <div className="w-full lg:w-1/3 flex justify-center px-4 py-6 lg:py-0 lg:mt-0">
          <FormLogin />
        </div>
        
      </main>
  
      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Login;
