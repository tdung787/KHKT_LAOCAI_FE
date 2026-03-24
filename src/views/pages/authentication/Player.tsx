import {
  BookOpen,
  FlaskConical,
  Calculator,
  Atom,
  Beaker,
  PenTool,
} from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import bg1 from "../../../../public/image/ai_sb/bg1.jpeg";
import bg2 from "../../../../public/image/ai_sb/bg2.jpeg";

export default function Player() {
  return (
    <div className="player-wrapper">
      {/* Title Section */}
      <div className="player-header">
        <h2 className="player-title">Hệ Thống Gia Sư AI TNUT - ĐHKTCN</h2>
        <p className="player-subtitle">
          Trợ thủ đắc lực cho học sinh và giáo viên
        </p>
      </div>

      {/* TV Container with Floating Icons */}
      <div className="tv-scene">
        {/* Floating Icons */}
        <div className="floating-icon icon-1">
          <BookOpen size={40} />
        </div>
        <div className="floating-icon icon-2">
          <Calculator size={36} />
        </div>
        <div className="floating-icon icon-3">
          <FlaskConical size={38} />
        </div>
        <div className="floating-icon icon-4">
          <Atom size={42} />
        </div>
        <div className="floating-icon icon-5">
          <Beaker size={36} />
        </div>
        <div className="floating-icon icon-6">
          <PenTool size={34} />
        </div>

        {/* Carousel Container */}
        <Carousel className="w-full max-w-4xl">
          <CarouselContent>
            {/* <CarouselItem>
              <div className="tv-frame">
                <div className="ai-brain-container">
                  <div className="ai-brain-center">
                    <img src={image_trungtam} alt="AI Brain Center" />
                    <div className="center-glow"></div>
                  </div>

                  <HoverCard openDelay={200} closeDelay={100}>
                    <HoverCardTrigger asChild>
                      <div className="ai-brain-corner corner-top-left">
                        <img src={image_canh_trai_tren} alt="Top Left" />
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="hover-card-content z-[9999]"
                      side="top"
                      align="center"
                      sideOffset={10}
                    >
                      <div className="hover-card-inner">
                        <h4 className="text-sm font-bold text-gray-800 mb-1">
                          Toán
                        </h4>
                        <p className="text-xs text-gray-600">
                          Mô-đun AI xử lý ngôn ngữ tự nhiên
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>

                  <HoverCard openDelay={200}>
                    <HoverCardTrigger asChild>
                      <div className="ai-brain-corner corner-top-right cursor-pointer">
                        <img src={image_canh_phai_tren} alt="Top Right" />
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="hover-card-content z-[9999] "
                      side="top"
                      align="center"
                      sideOffset={15}
                    >
                      <div className="hover-card-inner">
                        <h4 className="text-sm font-bold text-gray-800 mb-1">
                          Lý
                        </h4>
                        <p className="text-xs text-gray-600">
                          Mô-đun AI xử lý ngôn ngữ tự nhiên
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>

                  <HoverCard openDelay={200}>
                    <HoverCardTrigger asChild>
                      <div className="ai-brain-corner corner-bottom-left cursor-pointer">
                        <img src={image_canh_trai_duoi} alt="Bottom Left" />
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="hover-card-content z-[9999] w-80"
                      side="bottom"
                      align="center"
                      sideOffset={15}
                    >
                      <div className="hover-card-inner">
                        <h4 className="text-sm font-bold text-gray-800 mb-1">
                          Sinh
                        </h4>
                        <p className="text-xs text-gray-600">
                          Mô-đun AI xử lý ngôn ngữ tự nhiên
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>

                  <HoverCard openDelay={200}>
                    <HoverCardTrigger asChild>
                      <div className="ai-brain-corner corner-bottom-right cursor-pointer">
                        <img src={image_canh_phai_duoi} alt="Bottom Right" />
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="hover-card-content z-[9999] w-80"
                      side="bottom"
                      align="center"
                      sideOffset={15}
                    >
                      <div className="hover-card-inner">
                        <h4 className="text-sm font-bold text-gray-800 mb-1">
                          Hóa
                        </h4>
                        <p className="text-xs text-gray-600">
                          Mô-đun AI xử lý ngôn ngữ tự nhiên
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                

                  <div className="particles">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="particle"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 3}s`,
                          animationDuration: `${3 + Math.random() * 4}s`,
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </CarouselItem> */}

            <CarouselItem>
              <div className="relative w-full h-[500px] overflow-hidden rounded-lg">
                <img src={bg1} alt="Slide 1" className="w-full h-full object-cover" />
              </div>
            </CarouselItem>

            <CarouselItem>
              <div className="relative w-full h-[500px] overflow-hidden rounded-lg">
                <img src={bg2} alt="Slide 2" className="w-full h-full object-cover" />
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="carousel-previous bg-[#A61D37] text-white hover:bg-[#8a1a30] border-none" />
          <CarouselNext className="carousel-next bg-[#A61D37] text-white hover:bg-[#8a1a30] border-none" />
        </Carousel>
      </div>

      {/* Features Section */}
      <div className="player-features max-w-6xl mx-auto">
        <div className="feature-item">
          <div className="feature-icon">🎓</div>
          <div className="feature-text">
            <h4>Nền tảng hỗ trợ tự học và nghiên cứu chủ động</h4>
            <p>Đồng hành cùng sinh viên trong học tập mọi lúc, mọi nơi</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon">🗺️</div>
          <div className="feature-text">
            <h4>Xây dựng lộ trình học tập theo năng lực và chuyên ngành</h4>
            <p>Đáp ứng yêu cầu chương trình đào tạo bậc đại học</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon">📊</div>
          <div className="feature-text">
            <h4>Theo dõi và phân tích hiệu quả học tập</h4>
            <p>Giúp giảng viên đánh giá quá trình học tập của sinh viên một cách toàn diện</p>
          </div>
        </div>
      </div>
    </div>
  );
}
