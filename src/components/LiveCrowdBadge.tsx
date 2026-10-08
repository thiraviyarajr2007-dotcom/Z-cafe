'use client';

import React from 'react';
import { useCartStore } from '@/store/useCartStore';
import { Users, Clock, Sparkles } from 'lucide-react';

export function LiveCrowdBadge() {
  const { crowdStatus } = useCartStore();

  const config = {
    normal: {
      color: 'bg-emerald-500',
      border: 'border-emerald-500/40',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.35)]',
      text: 'Normal Crowd',
      dot: 'bg-emerald-400',
      estimate: '8–12 min',
      subtext: 'Fast counter pickup — perfect time to pre-order!',
    },
    moderate: {
      color: 'bg-amber-500',
      border: 'border-amber-500/40',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.35)]',
      text: 'Moderate Crowd',
      dot: 'bg-amber-400',
      estimate: '12–16 min',
      subtext: 'Order 15 mins ahead of your break time!',
    },
    high: {
      color: 'bg-rose-500',
      border: 'border-rose-500/40',
      glow: 'shadow-[0_0_20px_rgba(244,63,94,0.35)]',
      text: 'High Break Rush',
      dot: 'bg-rose-400',
      estimate: '18–22 min',
      subtext: 'Campus break surge: lock your pickup slot now!',
    },
  }[crowdStatus || 'normal'];

  return (
    <div className={`inline-flex flex-wrap items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#1a0c10]/80 backdrop-blur-md border ${config.border} ${config.glow} transition-all duration-300`}>
      <div className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`} />
          <span className={`relative inline-flex rounded-full h-3 w-3 ${config.dot}`} />
        </span>
        <span className="text-xs uppercase tracking-wider font-extrabold text-[#FFF8EE]/90">
          ZCafe Status: <span className="text-[#F7B52C]">{config.text}</span>
        </span>
      </div>

      <div className="hidden sm:block h-3.5 w-px bg-white/15" />

      <div className="flex items-center gap-1.5 text-xs text-[#FFF8EE]/80">
        <Clock className="w-3.5 h-3.5 text-[#F7B52C]" />
        <span>Estimated pickup: <strong className="text-white font-semibold">{config.estimate}</strong></span>
      </div>

      <div className="hidden md:flex items-center gap-1 text-[11px] text-amber-200/60 ml-1">
        <Sparkles className="w-3 h-3 text-[#F7B52C]" />
        <span>{config.subtext}</span>
      </div>
    </div>
  );
}
