import React from 'react';

interface VegBadgeProps {
  isVeg: boolean;
  size?: 'sm' | 'md';
  className?: string;
  showText?: boolean;
}

export const VegBadge: React.FC<VegBadgeProps> = ({ 
  isVeg, 
  size = 'md', 
  className = '',
  showText = false
}) => {
  const outerSize = size === 'sm' ? 'w-3.5 h-3.5 p-[1px]' : 'w-4 h-4 p-[2px]';
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div 
        className={`${outerSize} border-2 rounded flex items-center justify-center shrink-0 ${
          isVeg ? 'border-emerald-600' : 'border-rose-600'
        }`}
        title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
        aria-label={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
      >
        <span 
          className={`${dotSize} rounded-full ${
            isVeg ? 'bg-emerald-600' : 'bg-rose-600'
          }`} 
        />
      </div>
      {showText && (
        <span className={`text-xs font-semibold ${isVeg ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isVeg ? 'VEG' : 'NON-VEG'}
        </span>
      )}
    </div>
  );
};
