import React from 'react';

interface NeonBadgeProps {
  className?: string;
}

export const NeonBadge: React.FC<NeonBadgeProps> = ({ className = '' }) => {
  return (
    <div 
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FF3B5C]/60 bg-[#120A0C]/85 backdrop-blur-md shadow-glow-neon select-none ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF3B5C] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF3B5C]"></span>
      </span>

      <span 
        className="font-bold tracking-widest text-[11px] sm:text-xs uppercase text-[#FF3B5C] animate-flicker"
        style={{
          textShadow: '0 0 5px #FF3B5C, 0 0 10px #FF3B5C, 0 0 20px rgba(255,59,92,0.8)'
        }}
      >
        TEA • COFFEE • AVAILABLE
      </span>
    </div>
  );
};
