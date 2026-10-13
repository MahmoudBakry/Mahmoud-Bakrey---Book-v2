import React from 'react';

interface KineticTypographyProps {
  className?: string;
  isRtl?: boolean;
  mouseX?: number;
  mouseY?: number;
}

export const KineticTypography: React.FC<KineticTypographyProps> = ({
  className = '',
  isRtl = true,
  mouseX = 0,
  mouseY = 0,
}) => {
  // Gentle parallax displacement based on mouse
  const offsetX = mouseX * 25;
  const offsetY = mouseY * 15;

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    >
      {/* Upper Layer: Oversized Fashion Editorial Typography ("MUNIRA ALHARBI") */}
      <div
        className="absolute top-[8%] left-1/2 -translate-x-1/2 w-full text-center whitespace-nowrap transition-transform duration-700 ease-out"
        style={{
          transform: `translate(calc(-50% + ${offsetX * 0.4}px), ${offsetY * 0.4}px)`,
        }}
      >
        <span
          className="font-editorial-serif tracking-[0.28em] font-extrabold uppercase text-[70px] sm:text-[110px] md:text-[160px] lg:text-[210px] leading-none"
          style={{
            color: 'transparent',
            WebkitTextStroke: '1px rgba(185, 154, 97, 0.16)',
            textShadow: '0 0 60px rgba(185, 154, 97, 0.05)',
          }}
        >
          MUNIRA
        </span>
      </div>

      {/* Mid Layer: Massive Arabic Architectural Title ("الأزياء") behind the book */}
      <div
        className="absolute top-[38%] left-1/2 -translate-x-1/2 w-full text-center whitespace-nowrap transition-transform duration-700 ease-out"
        style={{
          transform: `translate(calc(-50% + ${-offsetX * 0.6}px), ${-offsetY * 0.6}px)`,
        }}
      >
        <span
          className="font-arabic-display font-black text-[90px] sm:text-[150px] md:text-[220px] lg:text-[280px] leading-none opacity-[0.06] text-[#F7F2EA]"
        >
          {isRtl ? 'الأزياء' : 'COUTURE'}
        </span>
      </div>

      {/* Lower Layer: Running Editorial Ribbon ("FASHION BUSINESS GUIDE · KUWAIT · 20+ YEARS") */}
      <div
        className="absolute bottom-[14%] left-0 right-0 flex justify-between px-8 md:px-16 text-[10px] md:text-[12px] font-editorial-serif tracking-[0.35em] text-[#B99A61]/30 uppercase"
        style={{
          transform: `translateY(${offsetY * 0.2}px)`,
        }}
      >
        <span className="hidden sm:inline">ATELIER MUNIRA ALHARBI</span>
        <span>دليل نجاح مشروع الأزياء</span>
        <span className="hidden md:inline">FOUNDED IN KUWAIT</span>
      </div>
    </div>
  );
};
