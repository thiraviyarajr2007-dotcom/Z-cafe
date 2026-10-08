'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Utensils, Clock, ShieldCheck, Menu, X, User, GraduationCap } from 'lucide-react';
import { ZLogo } from './ZLogo';
import { NeonBadge } from './NeonBadge';
import { useCartStore } from '@/store/useCartStore';
import { AuthModal } from './AuthModal';
import { FoodDetail3DModal } from './FoodDetail3DModal';

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
      <header className="sticky top-0 z-40 w-full bg-[#120A0C]/92 backdrop-blur-md border-b border-white/10 counter-led-glow transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left: Brand Logo */}
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:opacity-95 transition-opacity">
                <ZLogo size="md" />
              </Link>
              <div className="hidden xl:block ml-1">
                <NeonBadge />
              </div>
            </div>

            {/* Center: Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-2 rounded-full text-xs lg:text-sm font-bold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'text-[#F7B52C] bg-[#3E1220]/80 border border-[#F7B52C]/40 shadow-glow-gold'
                        : 'text-[#FFF8EE]/80 hover:text-[#FFF8EE] hover:bg-white/5'
                    }`}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5 text-[#F7B52C]" />}
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Student Profile + Cart Drawer Trigger */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Student Pass Button */}
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-[#FFF8EE] transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-[#F7B52C]/20 border border-[#F7B52C]/40 flex items-center justify-center text-[#F7B52C]">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="font-extrabold text-[11px] leading-tight text-white">
                    {studentUser ? studentUser.fullName : 'Student Pass'}
                  </div>
                  <div className="text-[10px] text-[#F7B52C] font-mono leading-none">
                    {studentUser ? studentUser.studentId : 'Login'}
                  </div>
                </div>
              </button>

              {/* Cart Drawer Trigger Button */}
              <button
                onClick={() => setIsOpen(true)}
                aria-label="View Cart"
                className="relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#F7B52C] to-[#FF9F1C] text-[#120A0C] font-black text-xs sm:text-sm shadow-glow-gold hover:scale-105 active:scale-95 transition-all"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2.5 -right-2.5 w-4 h-4 rounded-full bg-[#120A0C] text-[#F7B52C] text-[10px] font-black flex items-center justify-center border border-[#F7B52C]">
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
                className="p-2 rounded-xl text-[#FFF8EE] hover:bg-white/10 md:hidden focus:outline-none"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#120A0C] px-4 pt-3 pb-5 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setAuthModalOpen(true);
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-white"
            >
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-4 h-4 text-[#F7B52C]" />
                <div className="text-left">
                  <div className="font-bold">{studentUser?.fullName || 'Student Pass'}</div>
                  <div className="text-[10px] text-white/60">{studentUser?.studentId || 'Click to login / switch student'}</div>
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
                  className={`block px-4 py-2.5 rounded-xl text-sm font-bold ${
                    isActive
                      ? 'text-[#F7B52C] bg-[#3E1220] font-extrabold'
                      : 'text-[#FFF8EE]/90 hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Global Auth Modal & 3D Food Details Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <FoodDetail3DModal />
    </>
  );
};
