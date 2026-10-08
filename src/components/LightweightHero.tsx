'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Zap, Sparkles, Clock, Flame, Heart } from 'lucide-react';
import { ZLogo } from './ZLogo';
import { LiveCrowdBadge } from './LiveCrowdBadge';

export const LightweightHero: React.FC = () => {
  return (
    <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-28 overflow-hidden bg-gradient-to-b from-[#FFF0DB] via-[#FFF8EE] to-[#FFF8EE] dark:from-[#3E1220] dark:via-[#1D0A11] dark:to-[#120A0C] border-b border-[#5A1A2B]/10 dark:border-white/10 transition-colors duration-300">
      
      {/* Decorative Warm Ambient Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-r from-[#F7B52C]/20 via-[#FF9F1C]/20 to-[#E63946]/10 blur-3xl pointer-events-none rounded-full dark:opacity-30" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">
            
            {/* Live Break & Crowd Pill */}
            <div className="mb-4">
              <LiveCrowdBadge />
            </div>

            {/* Sub-pill with Indian Flag colors / Fresh Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5A1A2B]/8 dark:bg-white/10 border border-[#5A1A2B]/15 dark:border-[#F7B52C]/30 text-xs font-black uppercase tracking-wider text-[#5A1A2B] dark:text-[#F7B52C] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#4F8F3A] animate-ping" />
              <span>Authentic Campus Canteen • Order Ahead & Skip the Queue</span>
            </div>

            {/* Giant Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#5A1A2B] dark:text-[#FFF8EE] tracking-tight font-display leading-[1.08]">
              Your Food, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5A1A2B] via-[#E63946] to-[#F7B52C] dark:from-[#F7B52C] dark:via-[#FFAF38] dark:to-[#FF9F1C]">
                Hot &amp; Waiting.
              </span>
            </h1>

            {/* Appetizing Subtitle */}
            <p className="mt-4 text-base sm:text-lg text-[#6E535C] dark:text-[#F5EBE1]/90 max-w-xl font-medium leading-relaxed">
              Crispy hot samosas, steaming chicken dum biryani, golden puffs &amp; cold-pressed fruit juices. Pre-order in seconds, pay with UPI, pick up without the break-time crowd.
            </p>

            {/* Motto */}
            <p className="mt-2 text-xs sm:text-sm font-extrabold text-[#E63946] dark:text-[#F7B52C] tracking-wide flex items-center gap-1.5">
              <span>&ldquo;Little Joy in Every Puff &bull; Zero Break Time Waiting&rdquo;</span>
            </p>

            {/* Action Buttons */}
            <div className="mt-7 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
              <Link
                href="/menu"
                className="btn-gold-pill w-full sm:w-auto text-base py-4 px-8 font-black flex items-center justify-center gap-2.5 min-h-[48px] shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
              >
                <ShoppingBag className="w-5 h-5 text-[#120A0C]" />
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4 text-[#120A0C]" />
              </Link>

              <Link
                href="/menu"
                className="btn-outline-pill w-full sm:w-auto text-base py-4 px-8 font-bold flex items-center justify-center gap-2 min-h-[48px] hover:scale-[1.02] active:scale-95 transition-all"
              >
                <span>View Full Menu</span>
              </Link>
            </div>

            {/* Token / Pickup Slot Sneak-peek */}
            <div className="mt-8 w-full max-w-lg p-4 rounded-2xl bg-white dark:bg-[#1D0E14] border border-[#5A1A2B]/10 dark:border-white/10 shadow-sm dark:shadow-xl flex items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#F7B52C] to-[#FF9F1C] flex items-center justify-center text-[#120A0C] font-black text-base shadow-sm shrink-0">
                  #104
                </div>
                <div>
                  <div className="text-xs font-black text-[#5A1A2B] dark:text-white flex items-center gap-1.5">
                    <span>Fast Break Counter Pickup</span>
                    <span className="w-2 h-2 rounded-full bg-[#4F8F3A] animate-pulse" />
                  </div>
                  <div className="text-[11px] text-[#6E535C] dark:text-white/60">
                    Slot 11:20 – 11:30 AM &bull; Scan QR &bull; Zero queue
                  </div>
                </div>
              </div>

              <Link
                href="/menu"
                className="px-3.5 py-1.5 rounded-xl bg-[#5A1A2B]/10 dark:bg-white/10 hover:bg-[#5A1A2B]/15 text-xs font-black text-[#5A1A2B] dark:text-[#F7B52C] shrink-0 transition-colors"
              >
                Pre-Order &rarr;
              </Link>
            </div>

          </div>

          {/* Right Column: Floating Appetizing Food Showcase */}
          <div className="lg:col-span-5 relative flex items-center justify-center pt-4 lg:pt-0">
            <div className="relative w-72 sm:w-96 h-72 sm:h-96">
              
              {/* Golden circular glowing backdrop */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#F7B52C]/30 via-[#FF9F1C]/25 to-[#E63946]/20 blur-2xl animate-pulse" />
              <div className="absolute inset-8 rounded-full border-2 border-dashed border-[#F7B52C]/40 animate-[spin_40s_linear_infinite]" />

              {/* Main Floating Center Plate: Chicken Dum Biryani */}
              <motion.div
                animate={{
                  y: [-8, 8, -8],
                  rotate: [0, 2, -1, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative z-10 w-64 h-64 sm:w-80 sm:h-80 mx-auto"
              >
                {/* CSS Steam rising above biryani */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-28 h-20 pointer-events-none flex justify-center gap-3 z-30">
                  <svg className="w-6 h-16 text-[#5A1A2B]/40 dark:text-white/60 steam-path" viewBox="0 0 20 60" fill="none">
                    <path d="M10 50 Q 5 35 15 25 Q 5 15 10 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  <svg className="w-6 h-16 text-[#5A1A2B]/50 dark:text-white/70 steam-path-2" viewBox="0 0 20 60" fill="none">
                    <path d="M10 50 Q 15 35 5 25 Q 15 15 10 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  <svg className="w-6 h-16 text-[#5A1A2B]/40 dark:text-white/60 steam-path-3" viewBox="0 0 20 60" fill="none">
                    <path d="M10 50 Q 5 35 12 25 Q 8 15 10 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>

                <div className="relative w-full h-full rounded-full p-2 bg-gradient-to-br from-[#FFF8EE] to-[#F5EBE1] dark:from-[#2A101A] dark:to-[#120A0C] shadow-[0_20px_50px_rgba(90,26,43,0.25)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-4 border-white dark:border-[#F7B52C]/30 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80"
                    alt="Authentic Chicken Dum Biryani"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                {/* Floating Dish Badge */}
                <div className="absolute -bottom-2 right-4 z-20 px-4 py-2 rounded-2xl bg-white dark:bg-[#1D0E14] text-[#2A0E17] dark:text-[#FFF8EE] border border-[#5A1A2B]/15 dark:border-[#F7B52C]/40 shadow-xl flex items-center gap-2.5">
                  <span className="text-xl">🍗</span>
                  <div>
                    <div className="text-xs font-black text-[#5A1A2B] dark:text-[#F7B52C] leading-none">Dum Biryani</div>
                    <div className="text-[11px] font-bold text-[#E63946] mt-0.5">₹120 &bull; Dum Cooked</div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Top Left Satellite: Hot Crispy Samosa */}
              <motion.div
                animate={{
                  y: [6, -6, 6],
                  x: [-3, 3, -3],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5,
                }}
                className="absolute -top-4 -left-4 sm:-left-8 z-20 w-28 h-28 sm:w-32 sm:h-32 rounded-3xl p-1.5 bg-white dark:bg-[#1D0E14] border-2 border-white dark:border-[#F7B52C]/30 shadow-xl overflow-hidden flex flex-col justify-between"
              >
                <img
                  src="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop&q=80"
                  alt="Hot Samosa"
                  className="w-full h-16 sm:h-20 object-cover rounded-2xl"
                />
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-black text-[#5A1A2B] dark:text-[#F7B52C]">Samosa</span>
                  <span className="text-[10px] font-black text-[#4F8F3A]">₹15</span>
                </div>
              </motion.div>

              {/* Floating Bottom Left Satellite: Fresh Chilled Juice */}
              <motion.div
                animate={{
                  y: [-5, 7, -5],
                  x: [4, -4, 4],
                }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
                className="absolute -bottom-4 -left-2 sm:-left-6 z-20 px-3.5 py-2 rounded-2xl bg-white dark:bg-[#1D0E14] border border-[#5A1A2B]/15 dark:border-[#F7B52C]/40 shadow-xl flex items-center gap-2"
              >
                <span className="text-xl">🥤</span>
                <div>
                  <div className="text-xs font-black text-[#5A1A2B] dark:text-white">Fresh Juices</div>
                  <div className="text-[10px] text-[#4F8F3A] font-bold">100% Real Fruit &bull; ₹35</div>
                </div>
              </motion.div>

              {/* Top Right Floating Sticker Badge */}
              <div className="absolute top-2 -right-4 sm:-right-8 z-20 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#F7B52C] to-[#FFAF38] text-[#120A0C] font-black text-[11px] uppercase tracking-wider shadow-lg flex items-center gap-1.5 rotate-3">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>Hot Oven Puffs</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
