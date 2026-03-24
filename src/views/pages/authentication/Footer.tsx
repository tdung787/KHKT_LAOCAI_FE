import { Calendar, Eye, TrendingUp, Users } from "lucide-react";
import bg_sb from "../../../../public/image/ai_sb/bg-sb.jpg";

const Footer = () => {
  return (
    <footer className="footer-container relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={bg_sb} alt="Background" className="w-full h-full object-cover" />
      </div>
      <div className="footer-pattern-bg"></div>

      <div className="flex px-4 py-1 bg-primary-light justify-end items-center gap-2 text-xs text-white/75 relative z-10">
        <div className="flex md:justify-end justify-center items-center">
          <div className="flex flex-wrap justify-center gap-4 px-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-xs text-white"><span className="font-medium text-white">20</span> online</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="text-xs text-white"><span className="font-medium text-white">22</span> hôm nay</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-xs text-white"><span className="font-medium text-white">1,429</span> tháng này</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs text-white"><span className="font-medium text-white">82,455</span> tổng</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
