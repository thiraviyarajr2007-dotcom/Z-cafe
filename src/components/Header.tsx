'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, ShieldCheck, Menu, X, GraduationCap, Sparkles } from 'lucide-react';
import { ZLogo } from './ZLogo';
import { useCartStore } from '@/store/useCartStore';
import { AuthModal } from './AuthModal';
import { FoodDetailSheet } from './FoodDetailSheet';
import { ThemeToggle } from './ThemeToggle';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { getTotalCount, getTotal, setIsOpen, studentUser } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const itemCount = getTotalCount();
  const totalAmount = getTotal();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/orders', label: 'My Orders' },
    { href: '/admin', label: 'Staff & Scanner', icon: ShieldCheck },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#5A1A2B] text-[#FFF8EE] border-b border-[#F7B52C]/20 shadow-md counter-led-glow transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left: Brand Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="hover:opacity-95 transition-opacity">
                <ZLogo size="md" />
              </Link>
            </div>

            {/* Center: Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-full text-xs lg:text-sm font-extrabold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'text-[#120A0C] bg-[#F7B52C] shadow-[0_2px_12px_rgba(247,181,44,0.4)]'
                        : 'text-[#FFF8EE]/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#120A0C]' : 'text-[#F7B52C]'}`} />}
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Theme Toggle + Student Pass + Cart Button */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Light/Dark Theme Switcher */}
              <ThemeToggle />

              {/* Student Pass Button */}
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-xs text-[#FFF8EE] transition-all min-h-[42px]"
                aria-label="Student profile pass"
              >
                <div className="w-6 h-6 rounded-full bg-[#F7B52C] text-[#120A0C] flex items-center justify-center font-bold">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="font-extrabold text-[11px] leading-tight text-white">
                    {studentUser ? studentUser.fullName : 'Student Pass'}
                  </div>
                  <div className="text-[10px] text-[#F7B52C] font-mono leading-none font-bold">
                    {studentUser ? studentUser.studentId : 'Login'}
                  </div>
                </div>
              </button>

              {/* Cart Drawer Trigger Button */}
              <button
                onClick={() => setIsOpen(true)}
                aria-label="View Cart"
                className="relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#F7B52C] to-[#FF9F1C] text-[#120A0C] font-black text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all min-h-[44px]"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2.5 -right-2.5 w-4 h-4 rounded-full bg-[#5A1A2B] text-[#F7B52C] text-[10px] font-black flex items-center justify-center border border-[#F7B52C]">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">Cart</span>
                {totalAmount > 0 && (
                  <span className="font-black border-l border-[#120A0C]/25 pl-2">
                    ₹{totalAmount}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-2xl text-[#FFF8EE] hover:bg-white/10 md:hidden focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#4D1726] px-4 pt-3 pb-5 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setAuthModalOpen(true);
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/10 border border-white/10 text-xs text-white"
            >
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-4 h-4 text-[#F7B52C]" />
                <div className="text-left">
                  <div className="font-bold">{studentUser?.fullName || 'Student Pass'}</div>
                  <div className="text-[10px] text-white/70">{studentUser?.studentId || 'Click to login / switch student'}</div>
                </div>
              </div>
              <span className="text-[#F7B52C] font-bold">Manage</span>
            </button>

            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-2xl text-sm font-bold ${
                    isActive
                      ? 'text-[#120A0C] bg-[#F7B52C] font-black'
                      : 'text-[#FFF8EE] hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Global Auth Modal & Lightweight Food Detail Bottom Sheet */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <FoodDetailSheet />
    </>
  );
};
