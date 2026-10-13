import React from 'react';

interface BrandMonogramProps {
  className?: string;
  size?: number;
  color?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
}

export const BrandMonogram: React.FC<BrandMonogramProps> = ({
  className = '',
  size = 40,
  color = '#B99A61',
  showWordmark = false,
  wordmarkClassName = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="monogramGoldGrad" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#F5DFB5" />
            <stop offset="50%" stopColor="#B99A61" />
            <stop offset="100%" stopColor="#876735" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Geometric "M" Outer Shell and Inner Chevron matching Munira Alharbi's brand insignia */}
        {/* Left outer peak and leg */}
        <path
          d="M 18 84 L 18 20 L 50 48 L 82 20 L 82 84 L 68 84 L 68 45 L 50 61 L 32 45 L 32 84 Z"
          fill="url(#monogramGoldGrad)"
          stroke="#B99A61"
          strokeWidth="1.2"
          strokeLinejoin="miter"
        />

        {/* Central Geometric Inset Chevron */}
        <path
          d="M 38 72 L 50 82 L 62 72 L 62 78 L 50 88 L 38 78 Z"
          fill="url(#monogramGoldGrad)"
          opacity="0.9"
        />

        {/* Architectural Bottom Grounding Bars */}
        <rect x="25" y="80" width="8" height="5" fill="url(#monogramGoldGrad)" />
        <rect x="67" y="80" width="8" height="5" fill="url(#monogramGoldGrad)" />
      </svg>

      {showWordmark && (
        <div className={`flex flex-col leading-none ${wordmarkClassName}`}>
          <span className="font-editorial-serif tracking-[0.22em] text-[13px] md:text-[15px] font-semibold text-[#F7F2EA]">
            MUNIRA
          </span>
          <span className="font-editorial-serif tracking-[0.26em] text-[10px] md:text-[11px] text-[#B99A61] mt-0.5">
            ALHARBI
          </span>
        </div>
      )}
    </div>
  );
};
