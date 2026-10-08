'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  Sparkles, 
  ShoppingBag, 
  Flame, 
  Clock, 
  X,
  Zap,
  Filter
} from 'lucide-react';
import { MENU_ITEMS } from '@/data/menu';
import { MenuItemCard } from '@/components/MenuItemCard';
import { VegBadge } from '@/components/VegBadge';
import { LiveCrowdBadge } from '@/components/LiveCrowdBadge';
import { useCartStore } from '@/store/useCartStore';

const CATEGORIES = [
  { id: 'all', label: 'All Items', icon: '✨' },
  { id: 'breakfast', label: 'Breakfast', icon: '🍳' },
  { id: 'lunch', label: 'Lunch', icon: '🍛' },
  { id: 'evening-snacks', label: 'Evening Snacks', icon: '🥪' },
  { id: 'juices-beverages', label: 'Juices & Beverages', icon: '🥤' },
];

function MenuContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [activeCategory, setActiveCategory] = useState<string>(categoryParam || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'non-veg'>('all');

  const { getTotalCount, getTotal, setIsOpen } = useCartStore();
  const itemCount = getTotalCount();
  const totalAmount = getTotal();

  // Filter items based on activeCategory, searchQuery, and dietFilter
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category match
      if (activeCategory !== 'all') {
        if (activeCategory === 'lunch') {
          // support legacy category ids if any
          if (item.category !== 'lunch' && item.category !== 'rice-biryani' && item.category !== 'noodles') {
            return false;
          }
        } else if (activeCategory === 'evening-snacks') {
          if (item.category !== 'evening-snacks' && item.category !== 'snacks' && item.category !== 'chicken-starters') {
            return false;
          }
        } else if (activeCategory === 'juices-beverages') {
          if (item.category !== 'juices-beverages' && item.category !== 'fresh-juices' && item.category !== 'tea-coffee') {
            return false;
          }
        } else if (item.category !== activeCategory) {
          return false;
        }
      }

      // Diet filter match
      if (dietFilter === 'veg' && !item.isVeg) return false;
      if (dietFilter === 'non-veg' && item.isVeg) return false;

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        return matchesName || matchesDesc || matchesCat;
      }

      return true;
    });
  }, [activeCategory, searchQuery, dietFilter]);

  return (
    <div className="min-h-screen bg-[#120A0C] pb-28 text-[#FFF8EE]">
      
      {/* Menu Header Banner */}
      <div className="bg-wood-slats border-b border-white/10 py-10 px-4 sm:px-6 lg:px-8 relative counter-led-glow">
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center">
          
          <div className="mb-4">
            <LiveCrowdBadge />
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight">
            What are you craving?
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#FFF8EE]/70 max-w-xl mx-auto">
            Order ahead, select your break pickup window, and grab your fresh food at the counter without waiting.
          </p>

          {/* Search Bar */}
          <div className="mt-6 w-full max-w-md relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search idli, biryani, samosa, puff, juice, coffee..."
              className="w-full pl-10 pr-10 py-2.5 rounded-full bg-[#180B0F] border border-white/15 text-white text-sm placeholder-white/40 focus:outline-none focus:border-[#F7B52C] shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Category Navigation Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          
          {/* Animated 4 Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 whitespace-nowrap border transition-all ${
                    isActive
                      ? 'bg-[#F7B52C] text-[#120A0C] border-[#F7B52C] shadow-[0_4px_18px_rgba(247,181,44,0.35)] scale-105'
                      : 'bg-white/5 text-white/80 border-white/10 hover:border-white/25 hover:bg-white/10'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Veg / Non-Veg Standard Indian Filter */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 self-start md:self-auto">
            <button
              onClick={() => setDietFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                dietFilter === 'all'
                  ? 'bg-white/20 text-white font-black'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              All Diet
            </button>

            <button
              onClick={() => setDietFilter('veg')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                dietFilter === 'veg'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-black'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <VegBadge isVeg={true} size="sm" />
              <span>Veg Only</span>
            </button>

            <button
              onClick={() => setDietFilter('non-veg')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                dietFilter === 'non-veg'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 font-black'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <VegBadge isVeg={false} size="sm" />
              <span>Non-Veg</span>
            </button>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-6 flex items-center justify-between text-xs text-white/60">
          <span>
            Showing <strong className="text-white">{filteredItems.length}</strong> fresh campus items
          </span>
          <span className="text-[11px] text-[#F7B52C]">
            💡 Tap any card for 3D visual & ingredients
          </span>
        </div>

        {/* Food Items Grid (3D Cards) */}
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-white/5 border border-white/10 p-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-white/10 flex items-center justify-center text-white/40 mb-3">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No items found</h3>
            <p className="text-xs text-white/60 mt-1">
              Try adjusting your search or category filters.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
                setDietFilter('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-[#F7B52C] text-[#120A0C]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Bottom Cart Bar for Mobile */}
      {itemCount > 0 && (
        <div className="fixed bottom-4 inset-x-4 sm:hidden z-30">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#F7B52C] via-[#FF9F1C] to-[#F7B52C] text-[#120A0C] font-black text-sm flex items-center justify-between shadow-[0_8px_30px_rgba(247,181,44,0.4)] active:scale-95 transition-all"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>{itemCount} {itemCount === 1 ? 'item' : 'items'} in Cart</span>
            </div>
            <span className="text-base font-black">₹{totalAmount} →</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#120A0C]" />}>
      <MenuContent />
    </Suspense>
  );
}
