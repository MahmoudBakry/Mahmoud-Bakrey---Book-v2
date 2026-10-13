import React from 'react';

interface FashionSVGAnimationProps {
  className?: string;
}

export const FashionSVGAnimation: React.FC<FashionSVGAnimationProps> = ({
  className = '',
}) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="threadGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B99A61" stopOpacity="0.0" />
            <stop offset="30%" stopColor="#D8BF8A" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#B99A61" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8C7243" stopOpacity="0.0" />
          </linearGradient>

          <linearGradient id="roseCurveGrad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C28F89" stopOpacity="0.0" />
            <stop offset="40%" stopColor="#C28F89" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#4B3732" stopOpacity="0.0" />
          </linearGradient>

          <pattern id="tailorGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#B99A61"
              strokeWidth="0.5"
              strokeOpacity="0.06"
            />
          </pattern>
        </defs>

        {/* Subtle Tailor Atelier Blueprint Grid (low opacity in corners) */}
        <rect width="100%" height="100%" fill="url(#tailorGrid)" />

        {/* Flowing Silk / Drape Contour Line 1 */}
        <path
          d="M -100 250 C 300 120, 600 480, 1100 280 C 1300 200, 1500 350, 1600 400"
          stroke="url(#threadGoldGrad)"
          strokeWidth="1.2"
          strokeDasharray="6 4"
          className="transition-all duration-1000"
        />

        {/* Couture Atelier Silhouette Contour Line 2 */}
        <path
          d="M 100 750 C 400 850, 800 600, 1200 780 C 1400 840, 1550 720, 1650 680"
          stroke="url(#roseCurveGrad)"
          strokeWidth="1.5"
        />

        {/* Haute Couture Draping Line 3 (Smooth organic curve passing through center stage) */}
        <path
          d="M 50 100 C 450 350, 480 650, 950 820"
          stroke="url(#threadGoldGrad)"
          strokeWidth="0.8"
          strokeOpacity="0.5"
        />

        {/* Atelier Pattern Dart / Measurement Notches */}
        <g opacity="0.35">
          {/* Top-Right Measurement Ruler */}
          <line x1="1150" y1="80" x2="1380" y2="80" stroke="#B99A61" strokeWidth="0.8" />
          <line x1="1150" y1="74" x2="1150" y2="86" stroke="#B99A61" strokeWidth="0.8" />
          <line x1="1200" y1="76" x2="1200" y2="84" stroke="#B99A61" strokeWidth="0.8" />
          <line x1="1250" y1="76" x2="1250" y2="84" stroke="#B99A61" strokeWidth="0.8" />
          <line x1="1300" y1="76" x2="1300" y2="84" stroke="#B99A61" strokeWidth="0.8" />
          <line x1="1380" y1="74" x2="1380" y2="86" stroke="#B99A61" strokeWidth="0.8" />

          {/* Bottom-Left Pattern Cutting Dart Marks */}
          <line x1="80" y1="700" x2="220" y2="700" stroke="#B99A61" strokeWidth="0.8" strokeDasharray="4 4" />
          <line x1="150" y1="670" x2="150" y2="730" stroke="#B99A61" strokeWidth="0.8" />
        </g>
      </svg>
    </div>
  );
};
