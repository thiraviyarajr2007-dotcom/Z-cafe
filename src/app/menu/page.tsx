'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  ShoppingBag, 
  Flame, 
  X,
  Sparkles,
  ArrowRight,
  Clock,
  Filter
} from 'lucide-react';
import { MENU_ITEMS, CATEGORIES } from '@/data/menu';
import { MenuItemCard } from '@/components/MenuItemCard';
import { VegBadge } from '@/components/VegBadge';
import { LiveCrowdBadge } from '@/components/LiveCrowdBadge';
import { useCartStore } from '@/store/useCartStore';
import { ItemCategory } from '@/types';

type QuickFilter = 'all' | 'veg' | 'non-veg' | 'under-50' | 'under-100' | 'spicy' | 'bestsellers';

function MenuContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [activeCategory, setActiveCategory] = useState<string>(categoryParam || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');

  const { getTotalCount, getTotal, setIsOpen } = useCartStore();
  const itemCount = getTotalCount();
  const totalAmount = getTotal();

  // Filter items based on activeCategory, searchQuery, and quickFilter
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // 1. Category Filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }

      // 2. Quick Filters
      if (quickFilter === 'veg' && !item.isVeg) return false;
      if (quickFilter === 'non-veg' && item.isVeg) return false;
      if (quickFilter === 'under-50' && item.price > 50) return false;
      if (quickFilter === 'under-100' && item.price > 100) return false;
      if (quickFilter === 'spicy' && !item.isSpicy) return false;
      if (quickFilter === 'bestsellers' && !item.isBestseller) return false;

      // 3. Search query (English name, Tamil name, description, ingredients)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesTamil = item.tamilName ? item.tamilName.toLowerCase().includes(query) : false;
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesIngredients = item.ingredients?.some((ing) => ing.toLowerCase().includes(query));
        return matchesName || matchesTamil || matchesDesc || matchesIngredients;
      }

      return true;
    });
  }, [activeCategory, searchQuery, quickFilter]);

  const quickFilterChips: { id: QuickFilter; label: string; emoji: string }[] = [
    { id: 'all', label: 'All', emoji: '✨' },
    { id: 'veg', label: 'Pure Veg', emoji: '🌱' },
    { id: 'non-veg', label: 'Non-Veg', emoji: '🍗' },
    { id: 'bestsellers', label: 'Bestsellers', emoji: '🔥' },
    { id: 'spicy', label: 'Spicy', emoji: '🌶️' },
    { id: 'under-50', label: 'Under ₹50', emoji: '🏷️' },
    { id: 'under-100', label: 'Under ₹100', emoji: '💰' },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8EE] dark:bg-[#120A0C] pb-28 text-[#2A0E17] dark:text-[#FFF8EE] transition-colors duration-300">
      
      {/* Menu Header Banner */}
      <div className="bg-gradient-to-b from-[#FFF0DB] via-[#FFF8EE] to-[#FFF8EE] dark:from-[#3E1220] dark:via-[#1D0A11] dark:to-[#120A0C] border-b border-[#5A1A2B]/10 dark:border-white/10 py-10 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center">
          
          <div className="mb-4">
            <LiveCrowdBadge />
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#5A1A2B] dark:text-white font-display tracking-tight">
            Our Fresh Indian Menu
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#6E535C] dark:text-white/70 max-w-xl mx-auto">
            Order in advance, select your campus break pickup slot, and pick up without waiting in line.
          </p>

          {/* Search Bar */}
          <div className="mt-6 w-full max-w-lg relative">
            <Search className="w-4 h-4 text-[#5A1A2B]/50 dark:text-white/40 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search samosa, puff, biryani, chicken 65, juice, tea..."
              className="w-full pl-11 pr-11 py-3 rounded-full bg-white dark:bg-[#1D0E14] border border-[#5A1A2B]/15 dark:border-white/15 text-sm text-[#2A0E17] dark:text-white placeholder-[#6E535C]/50 dark:placeholder-white/40 focus:outline-none focus:border-[#5A1A2B] dark:focus:border-[#F7B52C] shadow-sm min-h-[44px]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3.5 text-[#5A1A2B]/50 dark:text-white/50 hover:text-[#5A1A2B] dark:hover:text-white"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Category Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 whitespace-nowrap border transition-all ${
              activeCategory === 'all'
                ? 'bg-[#5A1A2B] text-white border-[#5A1A2B] dark:bg-[#F7B52C] dark:text-[#120A0C] dark:border-[#F7B52C] shadow-md scale-105'
                : 'bg-white dark:bg-white/5 text-[#2A0E17] dark:text-white/80 border-[#5A1A2B]/10 dark:border-white/10 hover:border-[#5A1A2B]/30'
            }`}
          >
            <span>✨</span>
            <span>All Categories ({MENU_ITEMS.length})</span>
          </button>

          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count = MENU_ITEMS.filter((i) => i.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 whitespace-nowrap border transition-all ${
                  isActive
                    ? 'bg-[#5A1A2B] text-white border-[#5A1A2B] dark:bg-[#F7B52C] dark:text-[#120A0C] dark:border-[#F7B52C] shadow-md scale-105'
                    : 'bg-white dark:bg-white/5 text-[#2A0E17] dark:text-white/80 border-[#5A1A2B]/10 dark:border-white/10 hover:border-[#5A1A2B]/30'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name} ({count})</span>
              </button>
            );
          })}
        </div>

        {/* Quick Filter Sticky Chips */}
        <div className="sticky top-20 z-30 bg-[#FFF8EE]/95 dark:bg-[#120A0C]/95 backdrop-blur-md py-2.5 border-y border-black/5 dark:border-white/10 flex items-center gap-2 overflow-x-auto mb-6 scrollbar-none">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#6E535C] dark:text-white/50 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>
          {quickFilterChips.map((chip) => {
            const isSelected = quickFilter === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setQuickFilter(chip.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 whitespace-nowrap border transition-all ${
                  isSelected
                    ? 'bg-[#F7B52C] text-[#120A0C] border-[#F7B52C] shadow-sm'
                    : 'bg-white dark:bg-white/5 text-[#2A0E17] dark:text-white/80 border-[#5A1A2B]/10 dark:border-white/10 hover:border-[#5A1A2B]/30'
                }`}
              >
                <span>{chip.emoji}</span>
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>

        {/* Results Counter */}
        <div className="mb-6 flex items-center justify-between text-xs text-[#6E535C] dark:text-white/60">
          <span>
            Showing <strong className="text-[#5A1A2B] dark:text-white font-black">{filteredItems.length}</strong> fresh dishes
          </span>
          <span className="text-[11px] text-[#E63946] dark:text-[#F7B52C] font-extrabold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Ready in 3–12 mins &bull; Instant QR token
          </span>
        </div>

        {/* Food Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-white dark:bg-[#1D0E14] border border-[#5A1A2B]/10 dark:border-white/10 p-8 shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FFF0DB] dark:bg-white/10 flex items-center justify-center text-3xl mb-3">
              🔍
            </div>
            <h3 className="text-lg font-black text-[#5A1A2B] dark:text-white font-display">
              No matching dishes found
            </h3>
            <p className="text-xs text-[#6E535C] dark:text-white/60 mt-1">
              Try adjusting your search terms or resetting the filter chips.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
                setQuickFilter('all');
              }}
              className="mt-4 px-5 py-2.5 rounded-full text-xs font-black bg-[#F7B52C] text-[#120A0C] hover:scale-105 transition-all shadow-md"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {filteredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Bottom Cart Bar for Mobile */}
      {itemCount > 0 && (
        <div className="fixed bottom-4 inset-x-4 sm:hidden z-30 animate-in slide-in-from-bottom duration-300">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-[#F7B52C] via-[#FFAF38] to-[#FF9F1C] text-[#120A0C] font-black text-sm flex items-center justify-between shadow-2xl active:scale-95 transition-all min-h-[48px]"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
              <span>View Cart &bull; {itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
            </div>
            <span className="text-base font-black flex items-center gap-1">
              ₹{totalAmount} <ArrowRight className="w-4 h-4 stroke-[3]" />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF8EE] dark:bg-[#120A0C]" />}>
      <MenuContent />
    </Suspense>
  );
}
