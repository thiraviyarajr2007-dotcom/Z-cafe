import React from 'react';
import Link from 'next/link';

interface ZLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
}

export const ZLogo: React.FC<ZLogoProps> = ({ 
  size = 'md', 
  showWordmark = true, 
  className = '' 
}) => {
  const sizeMap = {
    sm: { icon: 34, text: 'text-lg', cup: 16 },
    md: { icon: 44, text: 'text-2xl', cup: 20 },
    lg: { icon: 60, text: 'text-4xl', cup: 28 },
    xl: { icon: 84, text: 'text-6xl', cup: 38 },
  };

  const current = sizeMap[size];

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group cursor-pointer select-none ${className}`}>
      {/* Golden Glowing Badge with Z and Coffee Cup */}
      <div 
        className="relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#F7B52C] via-[#FF9F1C] to-[#E08500] p-1 shadow-glow-gold transition-transform duration-300 group-hover:scale-105"
        style={{ width: current.icon, height: current.icon }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stylized Bold Z */}
          <path
            d="M 22 24 L 78 24 L 78 35 L 43 65 L 78 65 L 78 78 L 22 78 L 22 67 L 57 37 L 22 37 Z"
            fill="#120A0C"
          />

          {/* Steaming Coffee Cup in Center of Z */}
          <g transform="translate(34, 38) scale(0.32)">
            {/* Steam trails */}
            <path
              d="M 30 10 Q 25 0 30 -10 Q 35 -20 30 -30"
              stroke="#FFF8EE"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              className="animate-pulse"
            />
            <path
              d="M 50 8 Q 45 -2 50 -12 Q 55 -22 50 -32"
              stroke="#FFF8EE"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              className="animate-pulse"
              style={{ animationDelay: '0.4s' }}
            />
            <path
              d="M 70 10 Q 65 0 70 -10 Q 75 -20 70 -30"
              stroke="#FFF8EE"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              className="animate-pulse"
              style={{ animationDelay: '0.8s' }}
            />
            {/* Cup Body */}
            <path
              d="M 15 25 L 25 75 Q 50 95 75 75 L 85 25 Z"
              fill="#F7B52C"
              stroke="#120A0C"
              strokeWidth="4"
            />
            {/* Cup Handle */}
            <path
              d="M 80 35 Q 102 38 100 55 Q 96 70 76 65"
              fill="none"
              stroke="#120A0C"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Saucer */}
            <path
              d="M 10 82 Q 50 95 90 82"
              stroke="#120A0C"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </g>
        </svg>

        {/* Ambient bottom glow */}
        <div className="absolute -bottom-1 inset-x-2 h-1 bg-[#FF9F1C] blur-sm opacity-80" />
      </div>

      {/* Brand Wordmark: "CAFÉ" in thick geometric sans */}
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline tracking-wider">
            <span className={`font-black uppercase tracking-tighter text-[#FFF8EE] font-display ${current.text} drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]`}>
              Z CAFÉ
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#F7B52C]/90 -mt-0.5">
            AUTHENTIC INDIAN TASTE
          </span>
        </div>
      )}
    </Link>
  );
};
