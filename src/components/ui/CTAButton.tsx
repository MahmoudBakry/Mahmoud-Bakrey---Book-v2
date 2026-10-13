import React from 'react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

interface CTAButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'navbar' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  isRtl?: boolean;
  icon?: boolean;
}

export const CTAButton: React.FC<CTAButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  isRtl = true,
  icon = true,
}) => {
  const sizeClasses = {
    sm: 'py-2 px-4 text-xs',
    md: 'py-3 px-6 text-sm',
    lg: 'py-3.5 px-8 text-base font-semibold',
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  // Modern, minimal, and sleek Navbar CTA variant
  if (variant === 'navbar') {
    return (
      <button
        onClick={onClick}
        className={`group relative inline-flex items-center justify-center font-medium tracking-wide rounded-full px-4 sm:px-5 py-1.5 text-xs sm:text-[13px] bg-[#B99A61] hover:bg-[#C8AC75] text-[#140F0D] font-bold transition-all duration-300 transform active:scale-95 hover:shadow-lg hover:shadow-[#B99A61]/25 hover:-translate-y-0.5 overflow-hidden whitespace-nowrap shrink-0 select-none ${className}`}
      >
        <span className="relative z-10 flex items-center gap-1.5">
          {children}
        </span>
      </button>
    );
  }

  if (variant === 'primary') {
    return (
      <button
        onClick={onClick}
        className={`relative group inline-flex items-center justify-center gap-2 font-medium tracking-wide rounded-xl overflow-hidden transition-all duration-300 transform active:scale-95 bg-gradient-to-r from-[#D8BF8A] via-[#B99A61] to-[#A8884E] hover:from-[#E5D0A1] hover:to-[#B99A61] text-[#140F0D] font-bold shadow-lg shadow-[#B99A61]/20 hover:shadow-xl hover:shadow-[#B99A61]/30 hover:-translate-y-0.5 whitespace-nowrap shrink-0 ${sizeClasses[size]} ${className}`}
      >
        <span className="relative z-10">{children}</span>
        {icon && (
          <ArrowIcon
            className={`w-4 h-4 relative z-10 transition-transform duration-300 ${
              isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
            }`}
          />
        )}
      </button>
    );
  }

  if (variant === 'secondary') {
    return (
      <button
        onClick={onClick}
        className={`relative inline-flex items-center justify-center gap-2 font-medium tracking-wide rounded-xl border border-[#B99A61]/40 hover:border-[#B99A61] bg-[#241D1A]/50 hover:bg-[#241D1A]/80 text-[#F7F2EA] hover:text-[#D8BF8A] transition-all duration-300 transform active:scale-95 backdrop-blur-sm whitespace-nowrap shrink-0 ${sizeClasses[size]} ${className}`}
      >
        <span>{children}</span>
        {icon && (
          <Sparkles className="w-3.5 h-3.5 text-[#B99A61] transition-transform duration-300 group-hover:rotate-12" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 text-[#D8BF8A] hover:text-[#F7F2EA] transition-colors duration-200 whitespace-nowrap shrink-0 ${sizeClasses[size]} ${className}`}
    >
      <span>{children}</span>
    </button>
  );
};
