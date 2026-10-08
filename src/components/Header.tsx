'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Utensils, Clock, ShieldCheck, Menu, X } from 'lucide-react';
import { ZLogo } from './ZLogo';
import { NeonBadge } from './NeonBadge';
import { useCartStore } from '@/store/useCartStore';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { getTotalCount, getTotal, setIsOpen } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const itemCount = getTotalCount();
  const totalAmount = getTotal();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu & Pre-Order' },
    { href: '/orders', label: 'Track Order' },
    { href: '/admin', label: 'Kitchen Admin', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#120A0C]/90 backdrop-blur-md border-b border-[#3E1220] counter-led-glow transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Brand Logo & Tag */}
          <div className="flex items-center gap-4">
            <ZLogo size="md" />
            <div className="hidden lg:block ml-2">
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
                  className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#F7B52C] bg-[#3E1220]/70 border border-[#F7B52C]/30 shadow-glow-gold'
                      : 'text-[#FFF8EE]/80 hover:text-[#FFF8EE] hover:bg-[#3E1220]/40'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 text-[#F7B52C]" />}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Cart Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            {/* Cart Drawer Trigger Button */}
            <button
              onClick={() => setIsOpen(true)}
              aria-label="View Cart"
              className="relative flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#F7B52C] to-[#FF9F1C] text-[#120A0C] font-bold text-sm shadow-glow-gold hover:scale-105 active:scale-95 transition-all"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#3E1220] text-[#F7B52C] text-[10px] font-black flex items-center justify-center border border-[#F7B52C]">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
              {totalAmount > 0 && (
                <span className="font-extrabold border-l border-[#120A0C]/30 pl-2">
                  ₹{totalAmount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#FFF8EE] hover:bg-[#3E1220] md:hidden focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#3E1220] bg-[#120A0C] px-4 pt-3 pb-5 space-y-2">
          <div className="py-2">
            <NeonBadge />
          </div>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-base font-medium ${
                  isActive
                    ? 'text-[#F7B52C] bg-[#3E1220] font-bold'
                    : 'text-[#FFF8EE]/90 hover:bg-[#3E1220]/40'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
