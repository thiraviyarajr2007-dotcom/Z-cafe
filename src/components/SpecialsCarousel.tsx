'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { MenuItem } from '@/types';
import { MenuItemCard } from './MenuItemCard';

interface SpecialsCarouselProps {
  items: MenuItem[];
}

export const SpecialsCarousel: React.FC<SpecialsCarouselProps> = ({ items }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const specials = items.filter((i) => i.isBestseller || i.tag).slice(0, 8);

  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#F7B52C] mb-2">
            <Sparkles className="w-4 h-4 fill-current" /> Hot & Steaming Right Now
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
            Today&apos;s Specials
          </h2>
          <p className="text-xs sm:text-sm text-[#FFF8EE]/70 mt-1">
            Handcrafted fresh batches baked and fried continually through the day.
          </p>
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full border border-[#3E1220] bg-[#1A0C11] text-[#FFF8EE] hover:bg-[#3E1220] hover:text-[#F7B52C] flex items-center justify-center transition-all shadow-sm active:scale-95"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full border border-[#3E1220] bg-[#1A0C11] text-[#FFF8EE] hover:bg-[#3E1220] hover:text-[#F7B52C] flex items-center justify-center transition-all shadow-sm active:scale-95"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-6 overflow-x-auto pb-6 scrollbar-thin scroll-smooth no-scrollbar"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {specials.map((item) => (
          <div
            key={item.id}
            className="w-[280px] sm:w-[320px] shrink-0"
            style={{ scrollSnapAlign: 'start' }}
          >
            <MenuItemCard item={item} />
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-4 text-center">
        <Link
          href="/menu"
          className="text-xs font-bold text-[#F7B52C] hover:text-[#FF9F1C] transition-colors inline-flex items-center gap-1 group"
        >
          <span>View All 35+ Authentic Indian Menu Items</span>
          <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
        </Link>
      </div>
    </section>
  );
};
