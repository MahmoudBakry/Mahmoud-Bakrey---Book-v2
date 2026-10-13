import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, Maximize2, RotateCcw } from 'lucide-react';
import { BrandMonogram } from './BrandMonogram';

interface AnimatedBookProps {
  className?: string;
  isInteractive?: boolean;
  mouseX?: number;
  mouseY?: number;
}

export const AnimatedBook: React.FC<AnimatedBookProps> = ({
  className = '',
  isInteractive = true,
  mouseX,
  mouseY,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(8);
  const [rotateY, setRotateY] = useState(-18);
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isInspectMode, setIsInspectMode] = useState(false);
  const [localMouse, setLocalMouse] = useState({ x: 0, y: 0 });

  // Use either external parallax mouse or local container mouse
  const activeMouseX = mouseX !== undefined ? mouseX : localMouse.x;
  const activeMouseY = mouseY !== undefined ? mouseY : localMouse.y;

  // Smooth mouse tilt handler
  useEffect(() => {
    if (!isInteractive) return;

    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isInspectMode) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const normX = (x - centerX) / centerX;
      const normY = (y - centerY) / centerY;

      setLocalMouse({ x: normX, y: normY });

      // Subtle, controlled angles for elegance
      const rY = normX * 16 - 12;
      const rX = -normY * 12 + 6;

      setRotateY(rY);
      setRotateX(rX);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setLocalMouse({ x: 0, y: 0 });
      // Ease back to signature editorial pose
      setRotateX(8);
      setRotateY(-18);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isInteractive, isInspectMode]);

  // Compute dynamic radial mesh-gradient parameters based on mouse coordinates
  const lightCenterPrimaryX = 50 + activeMouseX * 22; // 28% to 72%
  const lightCenterPrimaryY = 42 + activeMouseY * 18; // 24% to 60%
  const lightCenterSecondaryX = 50 - activeMouseX * 18;
  const lightCenterSecondaryY = 58 - activeMouseY * 14;

  const dynamicGoldIntensity = 0.32 + Math.abs(activeMouseX) * 0.15;
  const dynamicRoseIntensity = 0.22 + Math.max(0, -activeMouseX) * 0.15;
  const dynamicCocoaIntensity = 0.32 + Math.max(0, activeMouseY) * 0.15;
  const meshOpacity = isHovered ? 0.98 : 0.82 + Math.min(0.18, Math.abs(activeMouseX) * 0.15 + Math.abs(activeMouseY) * 0.15);

  return (
    <div
      ref={containerRef}
      className={`relative select-none flex items-center justify-center p-4 md:p-8 perspective-2000 ${className}`}
      style={{ touchAction: 'pan-y' }}
    >
      {/* Dynamic Multi-Point Radial Mesh-Gradient Glow behind the 3D Book */}
      <div
        className="absolute -inset-14 sm:-inset-20 md:-inset-28 rounded-full pointer-events-none transition-all duration-700 ease-out"
        style={{
          background: `
            radial-gradient(circle at ${lightCenterPrimaryX}% ${lightCenterPrimaryY}%, rgba(216, 191, 138, ${dynamicGoldIntensity}) 0%, rgba(185, 154, 97, ${dynamicGoldIntensity * 0.75}) 28%, transparent 68%),
            radial-gradient(circle at ${lightCenterSecondaryX}% ${lightCenterSecondaryY}%, rgba(194, 143, 137, ${dynamicRoseIntensity}) 0%, rgba(106, 82, 76, ${dynamicCocoaIntensity}) 35%, transparent 72%),
            radial-gradient(circle at 50% 50%, rgba(75, 55, 50, 0.35) 0%, rgba(36, 29, 26, 0.45) 50%, transparent 80%)
          `,
          filter: 'blur(52px)',
          opacity: meshOpacity,
          transform: `translate3d(${activeMouseX * 16}px, ${activeMouseY * 12}px, -40px) scale(${isHovered ? 1.08 : 1.0})`,
        }}
      />

      {/* Floating 3D Book Container */}
      <div
        className="relative transition-transform duration-300 ease-out preserve-3d"
        style={{
          transform: `rotateX(${isInspectMode ? 0 : rotateX}deg) rotateY(${
            isInspectMode ? 0 : isFlipped ? 160 : rotateY
          }deg) scale(${isInspectMode ? 1.08 : isHovered ? 1.03 : 1})`,
          transition: isHovered ? 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Book Realistic Shadow underneath */}
        <div
          className="absolute -bottom-8 md:-bottom-10 left-1/2 -translate-x-1/2 w-[85%] h-10 md:h-12 rounded-[100%] pointer-events-none transition-all duration-500"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(10, 8, 7, 0.85) 0%, rgba(18, 14, 12, 0.45) 50%, transparent 80%)',
            transform: `translateZ(-50px) rotateX(90deg) scale(${isHovered ? 1.1 : 1})`,
            filter: 'blur(8px)',
          }}
        />

        {/* 3D Physical Book Structure: Front Cover, Spine, Gilded Pages Block */}
        <div className="relative w-[215px] min-[380px]:w-[240px] sm:w-[275px] md:w-[315px] lg:w-[350px] aspect-[1/1.42] rounded-[4px] preserve-3d cursor-pointer shadow-2xl group transition-all duration-300">
          
          {/* FRONT COVER */}
          <div
            className="absolute inset-0 rounded-[4px] overflow-hidden preserve-3d border border-[#B99A61]/30 backface-hidden"
            style={{
              background: 'linear-gradient(145deg, #2A211D 0%, #1F1815 40%, #171210 100%)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(185, 154, 97, 0.25)',
              transform: 'translateZ(18px)',
            }}
          >
            {/* Soft Ambient Top Vignette Light */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 28%, rgba(185, 154, 97, 0.16) 0%, rgba(75, 55, 50, 0.12) 40%, transparent 75%)',
              }}
            />

            {/* Specular Sheen sweep on hover */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
              style={{
                background: 'linear-gradient(115deg, transparent 20%, rgba(245, 223, 181, 0.12) 45%, rgba(255, 255, 255, 0.18) 50%, rgba(245, 223, 181, 0.08) 55%, transparent 75%)',
                transform: `translateX(${rotateY * 4}px)`,
              }}
            />

            {/* Fine Luxury Double Gold Border (Exact reproduction of uploaded cover) */}
            <div className="absolute inset-2.5 md:inset-3 border border-[#B99A61]/50 pointer-events-none">
              <div className="absolute inset-1 border border-[#B99A61]/25">
                {/* Diamond Corner Accents */}
                <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border border-[#B99A61] rotate-45 bg-[#231B18]" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border border-[#B99A61] rotate-45 bg-[#231B18]" />
                <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border border-[#B99A61] rotate-45 bg-[#231B18]" />
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border border-[#B99A61] rotate-45 bg-[#231B18]" />
              </div>
            </div>

            {/* Book Spine Crease Shadow (Left side in LTR, Right side in RTL - book has spine on left in 3D) */}
            <div
              className="absolute left-0 top-0 bottom-0 w-7 pointer-events-none z-10"
              style={{
                background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
              }}
            />
            {/* Book Spine Embossed Ridge Line */}
            <div className="absolute left-5 top-0 bottom-0 w-[1px] bg-[#B99A61]/20 pointer-events-none z-10" />

            {/* Book Cover Typography & Layout Content */}
            <div className="relative z-10 h-full flex flex-col justify-between items-center text-center px-4 py-6 md:px-6 md:py-7">
              
              {/* TOP HEADER: Special Edition & Brand */}
              <div className="pt-1">
                <div className="flex items-center justify-center gap-1.5 text-[9px] md:text-[11px] tracking-[0.24em] font-editorial-serif text-[#D4B77D]">
                  <span className="font-arabic-calligraphy text-[11px] md:text-xs tracking-normal">إصدار خاص</span>
                  <span className="text-[#B99A61]">·</span>
                  <span className="font-editorial-serif uppercase">MUNIRA ALHARBI</span>
                </div>
              </div>

              {/* CENTER: Brand Monogram & Book Main Title */}
              <div className="flex flex-col items-center my-auto w-full">
                {/* Brand Monogram */}
                <div className="mb-2 sm:mb-3 transform transition-transform duration-500 group-hover:scale-105">
                  <BrandMonogram size={44} />
                </div>

                {/* Brand Name Lockup */}
                <div className="mb-3 sm:mb-4 flex flex-col items-center">
                  <span className="font-editorial-serif text-[15px] md:text-[18px] tracking-[0.22em] font-medium text-[#F7F2EA] leading-none">
                    MUNIRA
                  </span>
                  <span className="font-editorial-serif text-[10px] md:text-[12px] tracking-[0.25em] text-[#B99A61] mt-0.5">
                    ALHARBI
                  </span>
                </div>

                {/* Main Book Title (Large Arabic Display Calligraphy) */}
                <div className="flex flex-col items-center">
                  <h2 className="font-arabic-display text-[22px] sm:text-[25px] md:text-[29px] font-bold text-white tracking-wide leading-tight drop-shadow-md">
                    دليل نجاح
                  </h2>
                  <h2 className="font-arabic-display text-[22px] sm:text-[25px] md:text-[29px] font-bold text-white tracking-wide leading-tight mt-0.5 drop-shadow-md">
                    مشروع الأزياء
                  </h2>
                </div>

                {/* Golden Diamond Divider */}
                <div className="flex items-center justify-center gap-2.5 w-32 my-2.5 md:my-3">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#B99A61]/70 to-[#B99A61]" />
                  <div className="w-1.5 h-1.5 rotate-45 bg-[#B99A61]" />
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#B99A61]/70 to-[#B99A61]" />
                </div>

                {/* Subtitle */}
                <p className="font-arabic-calligraphy text-[13px] sm:text-[14px] md:text-[16px] text-[#D8BF8A] leading-relaxed">
                  خلاصة أكثر من 20 عامًا من الخبرة
                </p>
              </div>

              {/* BOTTOM: Author Attribution */}
              <div className="pb-0.5 flex flex-col items-center text-center">
                <span className="text-[9px] md:text-[10px] font-arabic-display text-[#B99A61]/80 tracking-wider">
                  إعداد
                </span>
                <span className="font-arabic-display text-[11px] md:text-[13px] font-medium text-[#F7F2EA] mt-0.5 tracking-wide">
                  المصممة منيرة الحربي
                </span>
              </div>
            </div>
          </div>

          {/* BOOK SPINE (Left Side, 3D Depth) */}
          <div
            className="absolute top-0 bottom-0 left-0 w-[36px] rounded-l-[3px] overflow-hidden backface-hidden"
            style={{
              background: 'linear-gradient(to right, #1A1412 0%, #302420 50%, #1F1714 100%)',
              transform: 'rotateY(-90deg) translateZ(0px)',
              transformOrigin: 'left center',
              borderLeft: '1px solid rgba(185, 154, 97, 0.3)',
              boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.7)',
            }}
          >
            <div className="h-full flex flex-col justify-between items-center py-6 text-center">
              <span className="w-4 h-[1px] bg-[#B99A61]/40" />
              <div
                className="font-arabic-display text-[10px] font-medium text-[#D8BF8A] tracking-wider whitespace-nowrap"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                دليل نجاح مشروع الأزياء — منيرة الحربي
              </div>
              <span className="w-4 h-[1px] bg-[#B99A61]/40" />
            </div>
          </div>

          {/* GILDED BOOK PAGES BLOCK (Right & Bottom Edges) */}
          <div
            className="absolute top-1 bottom-1 right-0 w-[34px] rounded-r-[2px] overflow-hidden"
            style={{
              transform: 'rotateY(90deg) translateZ(-34px)',
              transformOrigin: 'right center',
              background: 'repeating-linear-gradient(to bottom, #F7F2EA 0px, #F7F2EA 1.5px, #D6CBB8 1.5px, #D6CBB8 2.5px)',
              boxShadow: 'inset 4px 0 8px rgba(0,0,0,0.3)',
              borderRight: '1px solid rgba(185, 154, 97, 0.5)',
            }}
          >
            {/* Gilded Gold Paper Leaf Shimmer */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, rgba(185, 154, 97, 0.35) 0%, rgba(245, 223, 181, 0.25) 50%, rgba(135, 103, 53, 0.4) 100%)',
              }}
            />
          </div>

          {/* Interactive Floating Annotation Pin */}
          <div
            className="absolute -top-3 -right-3 md:-top-4 md:-right-4 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#241D1A]/90 border border-[#B99A61]/60 text-[#D8BF8A] text-xs shadow-lg backdrop-blur-md transition-transform duration-300 group-hover:scale-105"
            style={{ transform: 'translateZ(30px)' }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B99A61] animate-pulse" />
            <span className="font-editorial-serif tracking-widest text-[10px] uppercase font-semibold">
              Digital Masterwork
            </span>
          </div>

        </div>
      </div>

      {/* Interactive Helper Controls */}
      <div className="absolute bottom-0 right-4 md:right-8 z-30 flex items-center gap-2">
        <button
          onClick={() => setIsInspectMode(!isInspectMode)}
          className="p-2 rounded-full bg-[#241D1A]/80 border border-[#B99A61]/30 text-[#D8BF8A] hover:text-white hover:border-[#B99A61] transition-all duration-200 backdrop-blur-sm"
          title={isInspectMode ? 'Free 3D Tilt' : 'Center Flat View'}
          aria-label="Toggle book inspection angle"
        >
          {isInspectMode ? <RotateCcw className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
