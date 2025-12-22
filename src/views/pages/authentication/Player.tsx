import ReactPlayer from "react-player";
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaVolumeRange,
  MediaPlaybackRateButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
  MediaFullscreenButton,
} from "media-chrome/react";
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

// import {
//   HoverCard,
//   HoverCardContent,
//   HoverCardTrigger,
// } from "@/components/ui/hover-card";

// import image_canh_phai_duoi from "../../../../public/image/IA_tri_nao/canh_phai_duoi.png";
// import image_canh_phai_tren from "../../../../public/image/IA_tri_nao/canh_phai_Tren.png";
// import image_canh_trai_duoi from "../../../../public/image/IA_tri_nao/canh_trai_duoi.png";
// import image_canh_trai_tren from "../../../../public/image/IA_tri_nao/canh_trai_tren.png";
// import image_trungtam from "../../../../public/image/IA_tri_nao/trung_tam_ai.png";

import icon_centure from "../../../../public/image/ai_sb/icon_centrre.png";
import icon_sub from "../../../../public/image/ai_sb/icon_sub.png";
import bg_sb from "../../../../public/image/ai_sb/bg-sb.jpg";

import userGuide from "../../../../public/file/test.pdf";

export default function Player() {
  return (
    <div className="player-wrapper">
      {/* Title Section */}
      <div className="player-header">
        <h2 className="player-title">Hệ thống AI hỗ trợ học tập </h2>
        <p className="player-subtitle">
          Trợ thủ đắc lực cho học sinh và giáo viên các môn khoa học tự nhiên
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
                {/* Layer 1: Background - Dưới cùng */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={bg_sb}
                    alt="Background"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Layer 2: Icon xung quanh (xoay) - Giữa */}
                <div className="absolute inset-0 z-10 flex items-center justify-center ">
                  <div className=" ">
                    <img
                      src={icon_sub}
                      alt="Sub Center Icon"
                      className="w-full h-full object-contain rotate-layer"
                    />
                  </div>
                </div>

                {/* Layer 3: Icon trung tâm (tĩnh) - Trên cùng */}
                <div className="absolute inset-0 z-10 mt-2.5 flex items-center justify-center">
                  <div className="w-30 h-30">
                    <img
                      src={icon_centure}
                      alt="Center Icon"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <div className="particles">
                  {[...Array(25)].map((_, i) => (
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
            </CarouselItem>

            <CarouselItem>
              <div className="tv-frame">
                <div className="tv-bezel">
                  <div className="tv-screen">
                    <MediaController className="media-controller">
                      <ReactPlayer
                        slot="media"
                        src="https://stream.mux.com/jB8H3p02Ln9cWAkdy4EOgV3wQqAmGclHkLA5UhEozFY4.m3u8"
                        controls={false}
                        playing={true}
                        loop={true}
                        muted={true}
                        width="100%"
                        height="100%"
                      />
                      <MediaControlBar className="media-control-bar">
                        <MediaPlayButton className="media-button" />
                        <MediaSeekBackwardButton
                          seekOffset={10}
                          className="media-button"
                        />
                        <MediaSeekForwardButton
                          seekOffset={10}
                          className="media-button"
                        />
                        <MediaTimeRange className="media-time-range" />
                        <MediaTimeDisplay
                          showDuration
                          className="media-time-display md:flex hidden"
                        />
                        <MediaMuteButton className="media-button" />
                        <MediaVolumeRange className="media-volume-range md:flex hidden" />
                        <MediaPlaybackRateButton className="media-button" />
                        <MediaFullscreenButton className="media-button" />
                      </MediaControlBar>
                    </MediaController>
                  </div>
                </div>

                <div className="tv-stand">
                  <div className="tv-stand-neck"></div>
                  <div className="tv-stand-base"></div>
                </div>
              </div>
            </CarouselItem>

            <CarouselItem>
              <div className="tv-frame">
                <div className="tv-bezel">
                  <div className="tv-screen">
                    <iframe
                      src={userGuide}
                      className="w-full h-full border-0"
                      title="PDF Viewer"
                    />
                  </div>
                </div>

                <div className="tv-stand">
                  <div className="flex flex-col items-center gap-1 mt-2">
                    <p className="text-gray-700 font-medium text-lg">
                      Tài liệu hướng dẫn cách dùng
                    </p>
                    <a
                      href={userGuide}
                      download="huong-dan-su-dung.pdf"
                      className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-5 py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      {/* PDF Icon */}
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18.5,9H13V3.5L18.5,9M6,20V4H12V10H18V20H6Z" />
                      </svg>
                      <span className="font-semibold">Tải về PDF</span>
                      {/* Download arrow */}
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="carousel-previous" />
          <CarouselNext className="carousel-next" />
        </Carousel>
      </div>

      {/* Features Section */}
      <div className="player-features max-w-6xl mx-auto">
        <div className="feature-item">
          <div className="feature-icon">🤖</div>
          <div className="feature-text">
            <h4>Hệ thống nâng cao khả năng tự học</h4>
            <p>Hỗ trợ học tập 24/7</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon">📚</div>
          <div className="feature-text">
            <h4>Cá nhân hóa lộ trình học tập</h4>
            <p>Đầy đủ các môn Toán Lý Hóa Sinh</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon">⚡</div>
          <div className="feature-text">
            <h4>Quản lý và đánh giá kết quả học tập</h4>
            <p>Giúp giáo viên theo dõi tiến trình học tập của học sinh</p>
          </div>
        </div>
      </div>
    </div>
  );
}
