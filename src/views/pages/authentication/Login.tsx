import { FC, useState, useEffect } from "react";
import FormLogin from "@/@core/components/auth/form";
import logoTNUT from "../../../../public/image/logo/logo_tnut.png";
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
    const updateTime = () => {
      const vietnamTime = dayjs().tz("Asia/Ho_Chi_Minh");
      const dayOfWeek = vietnamTime.format("dddd");
      const formattedDate = vietnamTime.format("DD/MM/YYYY");
      const formattedTime = vietnamTime.format("HH:mm:ss");
      const capitalizedDay = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
      setCurrentTime(`${capitalizedDay}, ${formattedDate} - ${formattedTime}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* HEADER */}
      <header className="w-full shadow-md">
        {/* TOP BAR */}
        <div className="bg-[#A61D37] text-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="rounded-lg p-1.5 md:p-2">
                <img
                  src={logoTNUT}
                  alt="Logo TNUT"
                  className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 object-contain"
                />
              </div>
              <div className="flex flex-col justify-between items-center text-white">
                <p className="text-[9px] md:text-[10px] lg:text-sm font-light uppercase tracking-wide">
                  Đại học Thái Nguyên
                </p>
                <h2 className="text-[10px] md:text-xs lg:text-base font-semibold uppercase">
                  Trường Đại học Kỹ thuật Công nghiệp Thái Nguyên
                </h2>
                <p className="text-[9px] md:text-[10px] lg:text-sm font-light uppercase">
                  Thai Nguyen University of Technology
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION BAR */}
        <div className="bg-[#2e5288]">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3">
              <nav className="hidden md:flex items-center gap-4 lg:gap-8">
                <a href="#" className="text-white text-sm font-medium hover:text-yellow-300 transition-colors duration-200 px-2 py-1">Giới thiệu</a>
                <a href="#" className="text-white text-sm font-medium hover:text-yellow-300 transition-colors duration-200 px-2 py-1">Tra cứu</a>
                <a href="#" className="text-white text-sm font-medium hover:text-yellow-300 transition-colors duration-200 px-2 py-1">Liên hệ</a>
              </nav>
              <div className="hidden md:flex items-center gap-2 text-white">
                <svg className="w-4 h-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">{currentTime}</span>
              </div>
              <button className="md:hidden text-white p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <div className="md:hidden text-center py-2 border-t border-white/20">
              <span className="text-white text-xs font-medium">{currentTime}</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col lg:flex-row items-stretch w-full">
        <div className="w-full lg:w-2/3">
          <div className="rounded-xl p-4 md:p-6 h-full">
            <Player />
          </div>
        </div>
        <div className="w-full lg:w-1/3 flex items-center justify-center px-4 py-6 lg:py-8">
          <div className="w-full max-w-md">
            <FormLogin />
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Login;
