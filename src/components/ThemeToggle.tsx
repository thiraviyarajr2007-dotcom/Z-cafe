'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className={`relative inline-flex items-center justify-center p-2 rounded-full transition-all duration-300 focus:outline-none ${
        theme === 'dark'
          ? 'bg-[#2A121B] text-[#F7B52C] hover:bg-[#3E1A27] border border-[#F7B52C]/30 shadow-[0_0_12px_rgba(247,181,44,0.25)]'
          : 'bg-[#FFF8EE] text-[#5A1A2B] hover:bg-white border border-[#5A1A2B]/15 shadow-sm'
      } ${className}`}
      title={theme === 'dark' ? 'Switch to Bright Light Mode' : 'Switch to Neon Dark Mode'}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {theme === 'dark' ? (
          <Sun className="w-4 h-4 text-[#F7B52C] stroke-[2.5] transition-transform duration-300 rotate-0 hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-[#5A1A2B] stroke-[2.5] transition-transform duration-300 rotate-0 hover:-rotate-12" />
        )}
      </div>
    </button>
  );
};
