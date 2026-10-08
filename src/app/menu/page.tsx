'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  Filter, 
  Sparkles, 
  ShoppingBag, 
  Flame, 
  Clock, 
  X
} from 'lucide-react';
import { INITIAL_MENU, CATEGORIES_LIST } from '@/data/menu';
import { MenuItemCard } from '@/components/MenuItemCard';
import { VegBadge } from '@/components/VegBadge';
import { ItemCategory } from '@/types';
import { useCartStore } from '@/store/useCartStore';

function MenuContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') as ItemCategory | null;

  const [activeCategory, setActiveCategory] = useState<string>(categoryParam || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'non-veg'>('all');

  const { getTotalCount, getTotal, setIsOpen } = useCartStore();
  const itemCount = getTotalCount();
  const totalAmount = getTotal();

  // Filter items based on activeCategory, searchQuery, and dietFilter
  const filteredItems = useMemo(() => {
    return INITIAL_MENU.filter((item) => {
      // Category match
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
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
    <div className="min-h-screen bg-[#120A0C] pb-24">
      
      {/* Menu Header Banner */}
      <div className="bg-wood-slats border-b border-[#3E1220] py-10 px-4 sm:px-6 lg:px-8 relative counter-led-glow">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3E1220]/80 border border-[#F7B52C]/40 text-[#F7B52C] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> 100% Authentic Indian Snacks & Fresh Beverages
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-display">
            Z CAFÉ Menu
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#FFF8EE]/70 max-w-xl mx-auto">
            Order online, choose your pickup time slot, and collect fresh & hot at the food court counter.
          </p>

          {/* Search Bar */}
          <div className="mt-6 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-[#FFF8EE]/40 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search samosa, puff, biryani, chicken 65, juice..."
              className="w-full pl-10 pr-10 py-2.5 rounded-full bg-[#180B0F] border border-[#5A1A2B] text-white text-sm placeholder-[#FFF8EE]/40 focus:outline-none focus:border-[#F7B52C] shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-[#FFF8EE]/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Filters and Category Tabs */}
        <div className="space-y-4 mb-8">
          
          {/* Veg / Non-Veg Standard Indian Switch */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#3E1220]/60">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#FFF8EE]/60 uppercase tracking-wider">
                Dietary:
              </span>
              <button
                onClick={() => setDietFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  dietFilter === 'all'
                    ? 'bg-[#3E1220] text-[#F7B52C] border border-[#F7B52C]/40 shadow-sm'
                    : 'bg-[#180B0F] text-[#FFF8EE]/60 border border-[#3E1220] hover:text-white'
                }`}
              >
                All Items ({INITIAL_MENU.length})
              </button>
              
              <button
                onClick={() => setDietFilter('veg')}
                className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                  dietFilter === 'veg'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-600 shadow-sm'
                    : 'bg-[#180B0F] text-[#FFF8EE]/60 border border-[#3E1220] hover:text-emerald-400'
                }`}
              >
                <VegBadge isVeg={true} size="sm" />
                Pure Veg
              </button>

              <button
                onClick={() => setDietFilter('non-veg')}
                className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                  dietFilter === 'non-veg'
                    ? 'bg-rose-950 text-rose-300 border border-rose-600 shadow-sm'
                    : 'bg-[#180B0F] text-[#FFF8EE]/60 border border-[#3E1220] hover:text-rose-400'
                }`}
              >
                <VegBadge isVeg={false} size="sm" />
                Non-Veg
              </button>
            </div>

            <div className="text-xs text-[#FFF8EE]/50 font-medium">
              Showing <strong className="text-[#F7B52C]">{filteredItems.length}</strong> items
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === 'all'
                  ? 'bg-gradient-to-r from-[#F7B52C] to-[#FF9F1C] text-[#120A0C] shadow-glow-gold'
                  : 'bg-[#1D0C13] border border-[#3E1220] text-[#FFF8EE]/70 hover:border-[#F7B52C]/30 hover:text-white'
              }`}
            >
              🍽️ All Delights
            </button>

            {CATEGORIES_LIST.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-[#F7B52C] to-[#FF9F1C] text-[#120A0C] shadow-glow-gold'
                    : 'bg-[#1D0C13] border border-[#3E1220] text-[#FFF8EE]/70 hover:border-[#F7B52C]/30 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-[#1A0B10] rounded-3xl border border-[#3E1220] p-8">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-bold text-white">No items found</h3>
            <p className="text-xs text-[#FFF8EE]/60 max-w-sm mx-auto mt-1 mb-6">
              We couldn&apos;t find anything matching your filter. Note: Z Cafe serves strictly Indian snacks, biryani, starters, juices and chai/coffee!
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                setDietFilter('all');
              }}
              className="btn-gold-pill text-xs py-2 px-5"
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

      {/* Floating Mobile Cart Bar */}
      {itemCount > 0 && (
        <div className="fixed bottom-4 inset-x-4 z-40 sm:hidden">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full btn-gold-pill py-3 px-5 rounded-2xl flex items-center justify-between shadow-2xl border border-white/20"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span className="font-extrabold text-sm">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm">₹{totalAmount}</span>
              <span className="text-xs uppercase tracking-wider font-extrabold">&bull; View Cart &rarr;</span>
            </div>
          </button>
        </div>
      )}

    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#120A0C] flex items-center justify-center text-[#F7B52C]">Loading menu...</div>}>
      <MenuContent />
    </Suspense>
  );
}
