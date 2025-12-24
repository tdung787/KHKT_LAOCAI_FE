import {
  FC,
  ReactNode,
  useEffect,
  useState,
  cloneElement,
  isValidElement,
} from "react";
import { motion } from "framer-motion";
import BackgroundLayout from "./background_animate/BackgroundLayout";
import { useLocation } from "react-router";

interface VerticalLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
  navbar?: ReactNode;
  footer?: ReactNode;
  className?: string;
  onMenuVisibilityChange?: (visible: boolean) => void;
  sidebarCollapsed?: boolean;
}

const VerticalLayout: FC<VerticalLayoutProps> = ({
  children,
  sidebar,
  navbar,
  footer,
  className = "",
  onMenuVisibilityChange,
  sidebarCollapsed = false,
}) => {
  // ** States
  const [isMounted, setIsMounted] = useState(false);
  const [menuVisibility, setMenuVisibility] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation(); 
  const isAITutorPage = location.pathname.includes(
    "/student/dashboard/ai-tutors"
  );

  const isAITutorPage1 = location.pathname.includes(
    "/teacher/dashboard/ai-tutors"
  );
  // console.log("isAITutorPageisAITutorPageisAITutorPage",isAITutorPage);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ** Update Window Width
  const handleWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };

  // ** Handle menu visibility change
  const handleMenuVisibility = (visible: boolean) => {
    setMenuVisibility(visible);
    onMenuVisibilityChange?.(visible);
  };

  // ** Handle window resize
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleWindowWidth);
      return () => window.removeEventListener("resize", handleWindowWidth);
    }
  }, []);

  // ** Close menu on route change (mobile)
  useEffect(() => {
    if (menuVisibility && windowWidth < 1024) {
      handleMenuVisibility(false);
    }
  }, [typeof window !== "undefined" ? window.location.pathname : ""]);

  // ** ComponentDidMount
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // ** Don't render until mounted (prevent hydration issues)
  if (!isMounted) {
    return null;
  }

  const isMobile = windowWidth < 1024;
  const showOverlay = menuVisibility && isMobile;

  // Dynamic sidebar width based on collapsed state
  const sidebarWidth = sidebarCollapsed ? "w-20" : "w-64";
  const contentMargin = sidebarCollapsed ? "ml-20" : "ml-64";

  // ** Props to inject into navbar
  const navbarProps = {
    setMenuVisibility: handleMenuVisibility,
    isMobile,
    menuVisibility,
  };

  return (
    <BackgroundLayout className={className}>
      {/* Sidebar - Desktop: Fixed, Mobile: Overlay */}
      {sidebar && (
        <>
          {/* Desktop Sidebar */}
          <aside
            className={`
              ${isMobile ? "fixed" : "fixed"} 
              left-0 top-0 h-screen ${sidebarWidth}
              transition-all duration-300 ease-in-out
              ${
                isMobile && !menuVisibility
                  ? "-translate-x-full"
                  : "translate-x-0"
              }
              z-50
            `}
          >
            <div className="h-full overflow-y-auto hide-scrollbar">
              {sidebar}
            </div>
          </aside>

          {/* Mobile Overlay */}
          {showOverlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => handleMenuVisibility(false)}
            />
          )}
        </>
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col  ${
          sidebar && !isMobile ? contentMargin : ""
        } transition-all duration-300`}
      >
        {/* Navbar - Pure Tailwind */}
        {navbar && (
          <>
            {/* Navbar cho trang AI Tutor - Màu đỏ */}
            {(isAITutorPage || isAITutorPage1) && (
              <header
                className={`
                   sm:hidden
          sticky top-[15px] mx-3.5 rounded-xl z-30
          transition-all duration-300 ease-in-out
          bg-red-500/90 dark:bg-red-600/80 
          backdrop-blur-xl 

          shadow-[0_8px_32px_0_rgba(220,38,38,0.4)] 
          dark:shadow-[0_8px_32px_0_rgba(220,38,38,0.3)]
        `}
              >
                {isValidElement(navbar)
                  ? cloneElement(navbar, navbarProps as unknown as object)
                  : navbar}
              </header>
            )}

            {/* Navbar cho các trang khác - Logic cũ */}
            {!isAITutorPage && !isAITutorPage1 && (
              <header
                className={`
          sticky rounded-xl z-30
          transition-all duration-300 ease-in-out
          ${
            isScrolled
              ? "top-[15px] mx-3.5 bg-white/10 dark:bg-white/5 backdrop-blur-xl dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]"
              : "top-0 mx-0 bg-transparent"
          }
        `}
              >
                {isValidElement(navbar)
                  ? cloneElement(navbar, navbarProps as unknown as object)
                  : navbar}
              </header>
            )}
          </>
        )}

        {/* Content */}
        <main
          className="
    p-1
    dark:my-3.5
    flex-1 
    dark:p-3
    dark:md:mx-3.5
    relative
    
    /* ← THÊM DÒNG NÀY - QUAN TRỌNG NHẤT */
    overflow-hidden
    flex flex-col
    dark:bg-gradient-to-br from-white/10 via-white/5 to-transparent
    dark:backdrop-saturate-150
    dark:border border-white/20
    
    dark:shadow-[0_8px_32px_0_rgba(31,38,135,0.37),0_2px_8px_0_rgba(255,255,255,0.15)_inset]
    dark:hover:shadow-[0_8px_40px_0_rgba(31,38,135,0.45),0_2px_12px_0_rgba(255,255,255,0.2)_inset]
    transition-all duration-300
    before:absolute before:inset-0 
    
    dark:before:bg-gradient-to-br before:from-white/20 before:to-transparent
    before:opacity-50
    before:-z-10
  "
        >
          {children}
        </main>

        {/* Footer - Glass Effect */}
        {footer && (
          <motion.footer
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="backdrop-blur-xl bg-white/10 border-t border-white/20 shadow-lg"
          >
            {footer}
          </motion.footer>
        )}
      </div>
    </BackgroundLayout>
  );
};

export default VerticalLayout;
