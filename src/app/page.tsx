'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Sparkles, 
  Clock, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Flame, 
  Coffee, 
  QrCode, 
  CheckCircle2, 
  MessageSquare,
  Users,
  GraduationCap,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { ZLogo } from '@/components/ZLogo';
import { NeonBadge } from '@/components/NeonBadge';
import { VineBorder } from '@/components/VineBorder';
import { LiveCrowdBadge } from '@/components/LiveCrowdBadge';
import { ThreeHeroCanvas } from '@/components/ThreeHeroCanvas';
import { MENU_ITEMS } from '@/data/menu';
import { MenuItemCard } from '@/components/MenuItemCard';

export default function HomePage() {
  const featuredBestsellers = MENU_ITEMS.filter((item) => item.isBestseller).slice(0, 4);

  return (
    <div className="relative min-h-screen bg-[#120A0C] overflow-hidden text-[#FFF8EE]">
      
      {/* ===================== 3D HERO SECTION ===================== */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 bg-wood-slats border-b border-white/10 counter-led-glow overflow-hidden">
        {/* Swaying hanging green vines border */}
        <VineBorder />

        {/* Interactive Three.js 3D Food Scene (Biryani bowl, Golden Samosa, Juice cup, Token hologram) */}
        <ThreeHeroCanvas />

        {/* Ambient radial glow background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#3E1220]/75 via-[#180B0F]/90 to-[#120A0C] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          
          {/* Live Crowd & Break Status Pill */}
          <div className="mb-5 animate-pulse-subtle">
            <LiveCrowdBadge />
          </div>

          {/* Glowing Brand Signage: ZCafe */}
          <div className="mb-4 transform hover:scale-[1.02] transition-transform duration-300">
            <ZLogo size="xl" showWordmark={true} />
          </div>

          {/* Subtitle tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#F7B52C]/30 text-xs font-black uppercase tracking-widest text-[#F7B52C] mb-4 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-[#F7B52C] fill-current" />
            Order Ahead. Skip the Crowd.
          </div>

          {/* Hero Main Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#FFF8EE] tracking-tight font-display max-w-4xl leading-tight drop-shadow-md">
            Your Campus Food, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F7B52C] via-[#FFAF38] to-[#FF9F1C]">
              Without The Crowd.
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#F5EBE1]/90 max-w-2xl font-medium leading-relaxed">
            Pre-order your favorite meals from ZCafe, pay online, and simply scan your QR when you arrive.
          </p>

          <p className="mt-2 text-xs sm:text-sm text-[#F7B52C] font-semibold tracking-wider">
            &ldquo;Your Food. Your Time. Zero Waiting.&rdquo;
          </p>

          {/* Primary Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/menu"
              className="btn-gold-pill w-full sm:w-auto text-base py-4 px-8 font-black flex items-center justify-center gap-2 shadow-[0_10px_35px_rgba(247,181,44,0.4)] hover:brightness-110 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-5 h-5 text-[#120A0C]" />
              <span>Order Now</span>
              <ArrowRight className="w-4 h-4 text-[#120A0C]" />
            </Link>

            <Link
              href="/menu"
              className="btn-outline-pill w-full sm:w-auto text-base py-4 px-8 font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
            >
              <span>Explore Menu</span>
            </Link>
          </div>

          {/* 3D Floating Token / QR Quick Preview Bar */}
          <div className="mt-12 w-full max-w-3xl p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#2a111a]/80 via-[#1a0a0f]/80 to-[#2a111a]/80 backdrop-blur-md border border-white/10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F7B52C]/20 border border-[#F7B52C]/40 flex items-center justify-center text-[#F7B52C] shrink-0 font-black text-lg">
                #104
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Fast Break Counter Pickup</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[11px] text-white/60">
                  Select slot e.g. 11:20 – 11:30 AM • Show QR • Instant Collection
                </div>
              </div>
            </div>

            <Link
              href="/menu"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-[#F7B52C] flex items-center gap-1.5 transition-all shrink-0"
            >
              <span>Pre-Order Break Snack</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== 4 CORE FOOD CATEGORIES ===================== */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-[#F7B52C]">
            CAMPUS CANTEEN SPECIALS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#FFF8EE] mt-1">
            What are you craving today?
          </h2>
          <p className="text-sm text-[#FFF8EE]/70 max-w-xl mx-auto mt-2">
            Authentic South Indian breakfast, spicy chicken 65 biryani, hot oven puffs, and cold pressed fruit juices.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              id: 'breakfast',
              name: 'Breakfast',
              emoji: '🍳',
              tagline: 'Idli, Dosa, Poori, Pongal',
              starting: '₹25',
              image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
            },
            {
              id: 'lunch',
              name: 'Lunch & Biryani',
              emoji: '🍛',
              tagline: 'Dum Biryani, Rice & Meals',
              starting: '₹50',
              image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
            },
            {
              id: 'evening-snacks',
              name: 'Evening Snacks',
              emoji: '🥪',
              tagline: 'Samosa, Puffs, Rolls & Fries',
              starting: '₹15',
              image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
            },
            {
              id: 'juices-beverages',
              name: 'Juices & Beverages',
              emoji: '🥤',
              tagline: 'Cold Juices, Chai & Coffee',
              starting: '₹15',
              image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=600&auto=format&fit=crop&q=80',
            },
          ].map((cat) => (
            <Link
              key={cat.id}
              href={`/menu?category=${cat.id}`}
              className="group relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#220e15] to-[#120A0C] border border-white/10 hover:border-[#F7B52C]/60 p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(247,181,44,0.18)]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Category Image with 3D Depth */}
              <div className="relative h-36 w-full rounded-2xl overflow-hidden mb-4 bg-black/40">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120A0C] via-transparent to-transparent opacity-80" />
                <span className="absolute top-2.5 left-2.5 text-2xl filter drop-shadow">
                  {cat.emoji}
                </span>
                <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-bold text-[#F7B52C] border border-white/10">
                  Starts {cat.starting}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-lg text-[#FFF8EE] group-hover:text-[#F7B52C] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#FFF8EE]/60 mt-0.5">
                  {cat.tagline}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#F7B52C]">
                <span>Browse Category</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===================== HOW IT WORKS (CAMPUS WORKFLOW) ===================== */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-[#180A0E] to-[#120A0C] border-y border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-[#F7B52C]">
              SIMPLE 3-STEP SYSTEM
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#FFF8EE] mt-1">
              Order Before The Crowd → Zero Waiting
            </h2>
            <p className="text-sm text-[#FFF8EE]/70 max-w-xl mx-auto mt-2">
              Designed specifically to eliminate 30-minute college canteen lunch queues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Order Before The Crowd',
                desc: 'Browse items from your phone in class, customize cooking notes, and lock your college break pickup slot.',
                icon: Clock,
              },
              {
                step: '02',
                title: 'Pay Online & Get Token QR',
                desc: 'Pay securely via UPI (GPay/PhonePe), get an instant Token number (e.g. #104) and scannable QR pass.',
                icon: QrCode,
              },
              {
                step: '03',
                title: 'Scan at Counter & Collect',
                desc: 'Arrive at the ZCafe collection counter during your slot, show your QR code, and collect your piping-hot meal.',
                icon: CheckCircle2,
              },
            ].map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.step}
                  className="p-6 sm:p-8 rounded-3xl bg-[#1d0c13]/70 border border-white/10 hover:border-[#F7B52C]/50 relative transition-all duration-300 hover:-translate-y-1 shadow-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#F7B52C]/20 border border-[#F7B52C]/40 flex items-center justify-center text-[#F7B52C]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-black text-white/15 font-mono">
                      {st.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#FFF8EE] mb-2">
                    {st.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#FFF8EE]/70 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== FEATURED CAMPUS BESTSELLERS ===================== */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#F7B52C]">
              TOP PICKS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#FFF8EE] mt-1">
              Today&apos;s Campus Favorites
            </h2>
            <p className="text-sm text-[#FFF8EE]/70 mt-1">
              Highest rated by students this week
            </p>
          </div>

          <Link
            href="/menu"
            className="text-xs font-bold text-[#F7B52C] hover:underline flex items-center gap-1.5"
          >
            <span>View All 35+ Items</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBestsellers.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* ===================== COLLEGE SCHEDULE CALLOUT ===================== */}
      <section className="py-12 border-t border-white/10 bg-gradient-to-r from-[#220e15] via-[#16080d] to-[#220e15]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7B52C]/20 text-[#F7B52C] text-xs font-bold uppercase tracking-wider mb-3">
            <Clock className="w-3.5 h-3.5" /> Break Time Surge Protection
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#FFF8EE]">
            Don&apos;t spend your 20-min college break waiting in queue.
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-white/70 max-w-xl mx-auto">
            Morning Break (11:15 AM) • Lunch Rush (1:15 PM) • Evening Snacks (4:15 PM)
          </p>
          <div className="mt-6">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-black text-sm bg-gradient-to-r from-[#F7B52C] to-[#FF9F1C] text-[#120A0C] shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <span>Lock Your Pickup Slot Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
