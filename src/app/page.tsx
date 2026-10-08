'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Flame, 
  Coffee, 
  QrCode, 
  CheckCircle2, 
  Zap, 
  ShoppingBag,
  Tag,
  Star,
  ShieldCheck,
  Award,
  ChevronRight,
  TrendingUp,
  Percent
} from 'lucide-react';
import { LightweightHero } from '@/components/LightweightHero';
import { MENU_ITEMS } from '@/data/menu';
import { MenuItemCard } from '@/components/MenuItemCard';
import { useCartStore } from '@/store/useCartStore';

export default function HomePage() {
  const { addItem } = useCartStore();

  // Top bestsellers for the home page showcase
  const featuredBestsellers = MENU_ITEMS.filter((item) => item.isBestseller).slice(0, 4);

  // Six Real Indian Categories
  const categories = [
    {
      id: 'snacks',
      name: 'Snacks & Puffs',
      tamil: 'சிற்றுண்டிகள்',
      emoji: '🥟',
      tagline: 'Samosa, Hot Puffs, Bajjis & Vada',
      starting: '₹15',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
      badge: 'Hot from Oven',
    },
    {
      id: 'chicken-starters',
      name: 'Chicken & Starters',
      tamil: 'சிக்கன் & ஸ்டார்ட்டர்ஸ்',
      emoji: '🍗',
      tagline: 'Chicken 65, Lollipop, Gobi & Paneer',
      starting: '₹60',
      image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=600&auto=format&fit=crop&q=80',
      badge: 'Crispy & Spicy',
    },
    {
      id: 'rice-biryani',
      name: 'Rice & Biryani',
      tamil: 'பிரியாணி & சாதம்',
      emoji: '🍛',
      tagline: 'Dum Biryani, Egg, Veg & Fried Rice',
      starting: '₹70',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
      badge: 'Dum Cooked',
    },
    {
      id: 'noodles',
      name: 'Wok Noodles',
      tamil: 'நூடுல்ஸ்',
      emoji: '🍜',
      tagline: 'Veg, Egg & Chicken Hakka Style',
      starting: '₹70',
      image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80',
      badge: 'Wok Tossed',
    },
    {
      id: 'fresh-juices',
      name: 'Fresh Juices',
      tamil: 'புதிய ஜூஸ்',
      emoji: '🥤',
      tagline: 'Orange, Mosambi, Sugarcane & Coolers',
      starting: '₹35',
      image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80',
      badge: '100% Real Fruit',
    },
    {
      id: 'tea-coffee',
      name: 'Tea & Coffee',
      tamil: 'டீ & காபி',
      emoji: '☕',
      tagline: 'Masala Chai, Filter Coffee, Badam Milk',
      starting: '₹15',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
      badge: 'Piping Hot',
    },
  ];

  // Friendly Campus Testimonials
  const reviews = [
    {
      name: 'Kavitha R.',
      role: 'B.Tech IT, 3rd Year',
      avatar: '👩‍🎓',
      text: 'Pre-ordering during the 11:15 AM break saved my life. I just walked to the counter, showed my QR code, and my hot puff was ready!',
      rating: 5,
      dish: 'Egg Puff + Filter Coffee',
    },
    {
      name: 'Aravind Swaminathan',
      role: 'MBA Student',
      avatar: '👨‍💼',
      text: 'The Chicken Biryani is surprisingly authentic and dum cooked. Generous chicken pieces, spicy raita, and zero waiting at lunch.',
      rating: 5,
      dish: 'Chicken Biryani',
    },
    {
      name: 'Dr. Meenakshi S.',
      role: 'Faculty of Science',
      avatar: '👩‍🏫',
      text: 'Fresh mosambi juice made right in front of us without extra water or artificial syrups. Quick UPI payment makes it hassle-free.',
      rating: 5,
      dish: 'Mosambi Juice',
    },
    {
      name: 'Vignesh Kumar',
      role: 'Mechanical, 2nd Year',
      avatar: '🧑‍🎓',
      text: 'Chicken 65 is insanely crispy with curry leaves and green chilli! The spicy kick is unbeatable for evening hangout with friends.',
      rating: 5,
      dish: 'Chicken 65 + Tea',
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#FFF8EE] dark:bg-[#120A0C] text-[#2A0E17] dark:text-[#FFF8EE] transition-colors duration-300">
      
      {/* ===================== HERO SECTION ===================== */}
      <LightweightHero />

      {/* ===================== OFFERS & TODAY'S SPECIAL BANNER ===================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Offer Banner: 10% OFF */}
          <div className="md:col-span-2 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#5A1A2B] via-[#752438] to-[#94324B] text-[#FFF8EE] shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#F7B52C]/30">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-[#F7B52C] text-[#120A0C] flex items-center justify-center shrink-0 shadow-md">
                <Percent className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F7B52C]/20 text-[#F7B52C] text-[10px] font-black uppercase tracking-wider mb-1">
                  <Sparkles className="w-3 h-3" /> Special Welcome Offer
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight font-display">
                  Get 10% OFF on Your First Order!
                </h3>
                <p className="text-xs sm:text-sm text-white/80 mt-1">
                  Use coupon code <span className="font-mono font-black text-[#F7B52C] bg-black/30 px-2 py-0.5 rounded-lg border border-[#F7B52C]/40">FIRST10</span> at checkout.
                </p>
              </div>
            </div>

            <Link
              href="/menu"
              className="px-5 py-3 rounded-full bg-[#F7B52C] hover:bg-[#FFAF38] text-[#120A0C] font-black text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all shrink-0 flex items-center gap-1.5 min-h-[44px]"
            >
              <span>Claim Discount</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Today's Chef Special Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1D0E14] border border-[#5A1A2B]/10 dark:border-[#F7B52C]/25 shadow-md flex items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-black text-[#E63946] uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 fill-current" /> Chef&apos;s Special
              </div>
              <h4 className="text-lg font-black text-[#5A1A2B] dark:text-[#FFF8EE] mt-0.5">
                Chicken 65 + Chai
              </h4>
              <p className="text-xs text-[#6E535C] dark:text-[#DCCBBD] mt-0.5">
                Crispy spicy starter with piping hot masala tea.
              </p>
              <div className="mt-2 text-base font-black text-[#E63946] dark:text-[#F7B52C]">
                ₹75 <span className="text-xs text-black/40 dark:text-white/40 line-through font-normal">₹95</span>
              </div>
            </div>

            <Link
              href="/menu?category=chicken-starters"
              className="w-11 h-11 rounded-2xl bg-[#5A1A2B] dark:bg-[#F7B52C] text-[#FFF8EE] dark:text-[#120A0C] flex items-center justify-center hover:scale-105 transition-transform shrink-0 shadow-sm"
              aria-label="Order Today's Special"
            >
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

        </div>
      </section>

      {/* ===================== AUTHENTIC INDIAN CATEGORIES ===================== */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-[#E63946] dark:text-[#F7B52C]">
            PURE INDIAN CAFE FLAVOURS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#5A1A2B] dark:text-[#FFF8EE] mt-1 font-display">
            What are you craving today?
          </h2>
          <p className="text-sm text-[#6E535C] dark:text-[#DCCBBD] max-w-xl mx-auto mt-2">
            Freshly baked oven puffs, spicy chicken 65, fragrant dum biryani, and freshly pressed sugarcane juice.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/menu?category=${cat.id}`}
              className="group relative rounded-3xl overflow-hidden bg-white dark:bg-[#1D0E14] border border-[#5A1A2B]/10 dark:border-white/10 hover:border-[#F7B52C] dark:hover:border-[#F7B52C] p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-xl"
            >
              {/* Category Image */}
              <div className="relative h-28 sm:h-32 w-full rounded-2xl overflow-hidden mb-3 bg-black/10">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute top-2 left-2 text-2xl filter drop-shadow">
                  {cat.emoji}
                </span>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-sm text-[10px] font-black text-[#F7B52C]">
                  From {cat.starting}
                </span>
              </div>

              <div>
                <h3 className="font-black text-sm sm:text-base text-[#5A1A2B] dark:text-[#FFF8EE] group-hover:text-[#E63946] dark:group-hover:text-[#F7B52C] transition-colors leading-snug">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-[#6E535C] dark:text-white/60 line-clamp-1 mt-0.5">
                  {cat.tagline}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-[11px] font-black text-[#5A1A2B] dark:text-[#F7B52C]">
                <span>Order</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===================== FEATURED CAMPUS BESTSELLERS ===================== */}
      <section className="py-12 sm:py-16 bg-[#FFF2E0]/50 dark:bg-[#180A0E] border-y border-[#5A1A2B]/10 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#E63946] dark:text-[#F7B52C] flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 fill-current" /> MOST ORDERED THIS WEEK
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#5A1A2B] dark:text-[#FFF8EE] mt-1 font-display">
                Today&apos;s Campus Favorites
              </h2>
              <p className="text-xs sm:text-sm text-[#6E535C] dark:text-[#DCCBBD] mt-1">
                Highest rated by students and staff &bull; Ready in ~10 minutes
              </p>
            </div>

            <Link
              href="/menu"
              className="text-xs sm:text-sm font-black text-[#5A1A2B] dark:text-[#F7B52C] hover:underline flex items-center gap-1 self-start sm:self-end"
            >
              <span>View Full Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {featuredBestsellers.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== WHY Z CAFE ROW ===================== */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-[#4F8F3A] dark:text-[#F7B52C]">
            THE Z CAFÉ PROMISE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#5A1A2B] dark:text-[#FFF8EE] mt-1 font-display">
            Why Students &amp; Faculty Love Us
          </h2>
          <p className="text-sm text-[#6E535C] dark:text-[#DCCBBD] max-w-xl mx-auto mt-2">
            No long canteen queues, no cold food, no guesswork. Just fresh, hot meals ready on your schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: '🥤',
              title: 'Fresh Juices Made to Order',
              desc: '100% fresh fruits pressed when you order. No added sugar syrups or preservatives.',
              color: 'text-orange-500',
            },
            {
              icon: '🔥',
              title: 'Piping Hot & Fresh Batches',
              desc: 'Freshly baked puffs, bajjis, and samosas prepared every 30 minutes throughout the day.',
              color: 'text-red-500',
            },
            {
              icon: '⚡',
              title: 'Quick Counter QR Pickup',
              desc: 'Order from class, lock your break slot, scan your QR token, and pick up in under 60 seconds.',
              color: 'text-amber-500',
            },
            {
              icon: '📲',
              title: 'Instant UPI & Student Pass',
              desc: 'Pay seamlessly with GPay, PhonePe, Paytm or UPI without waiting for change at the counter.',
              color: 'text-emerald-500',
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white dark:bg-[#1D0E14] border border-[#5A1A2B]/10 dark:border-white/10 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-base font-extrabold text-[#5A1A2B] dark:text-[#FFF8EE] mb-1.5">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#6E535C] dark:text-[#DCCBBD] leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== HOW IT WORKS (3 SIMPLE STEPS) ===================== */}
      <section className="py-16 sm:py-20 bg-[#FFF0DB]/60 dark:bg-[#15080C] border-y border-[#5A1A2B]/10 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-[#E63946] dark:text-[#F7B52C]">
              SKIP THE BREAK QUEUE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#5A1A2B] dark:text-[#FFF8EE] mt-1 font-display">
              How Campus Pre-Ordering Works
            </h2>
            <p className="text-sm text-[#6E535C] dark:text-[#DCCBBD] max-w-xl mx-auto mt-2">
              Designed specifically to save your precious 20-minute college break.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Order Before The Rush',
                desc: 'Browse items from your phone, customize your spice level, and lock your break pickup slot.',
                icon: Clock,
              },
              {
                step: '02',
                title: 'Pay Online & Get Token QR',
                desc: 'Pay securely via UPI (GPay/PhonePe), receive your instant live token number (e.g. #104) and scannable QR pass.',
                icon: QrCode,
              },
              {
                step: '03',
                title: 'Scan at Counter & Enjoy',
                desc: 'Arrive at the ZCafe kiosk during your slot, show your QR code, and collect your piping-hot meal with zero waiting.',
                icon: CheckCircle2,
              },
            ].map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.step}
                  className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1D0E14] border border-[#5A1A2B]/10 dark:border-white/10 hover:border-[#F7B52C] relative transition-all duration-300 hover:-translate-y-1 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#5A1A2B]/10 dark:bg-[#F7B52C]/20 text-[#5A1A2B] dark:text-[#F7B52C] flex items-center justify-center font-bold">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-black text-black/10 dark:text-white/15 font-mono">
                      {st.step}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-[#5A1A2B] dark:text-[#FFF8EE] mb-2 font-display">
                    {st.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6E535C] dark:text-[#DCCBBD] leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== REVIEWS & TESTIMONIALS STRIP ===================== */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-[#E63946] dark:text-[#F7B52C]">
            STUDENT &amp; FACULTY VOICES
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#5A1A2B] dark:text-[#FFF8EE] mt-1 font-display">
            Loved Across the Campus
          </h2>
          <p className="text-sm text-[#6E535C] dark:text-[#DCCBBD] max-w-xl mx-auto mt-2">
            See what students and teachers have to say about eating at Z Cafe.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {reviews.map((rev, i) => (
            <div
              key={i}
              className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1D0E14] border border-[#5A1A2B]/10 dark:border-white/10 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-[#F7B52C] mb-3">
                  {[...Array(rev.rating)].map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#2A0E17] dark:text-[#FFF8EE] leading-relaxed italic">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{rev.avatar}</span>
                  <div>
                    <h5 className="text-xs font-black text-[#5A1A2B] dark:text-[#FFF8EE] leading-tight">
                      {rev.name}
                    </h5>
                    <p className="text-[10px] text-[#6E535C] dark:text-white/60">
                      {rev.role}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#5A1A2B]/10 dark:bg-white/10 font-bold text-[#5A1A2B] dark:text-[#F7B52C]">
                  {rev.dish}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== BREAK TIME SURGE CALLOUT ===================== */}
      <section className="py-12 border-t border-[#5A1A2B]/15 bg-[#5A1A2B] text-[#FFF8EE] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F7B52C] text-[#120A0C] text-xs font-black uppercase tracking-wider mb-3 shadow-md">
            <Clock className="w-3.5 h-3.5" /> Skip Break Rush
          </div>
          <h3 className="text-2xl sm:text-4xl font-black text-white font-display">
            Don&apos;t spend your 20-min break waiting in queue.
          </h3>
          <p className="mt-2 text-xs sm:text-base text-white/80 max-w-xl mx-auto">
            Morning Break (11:15 AM) &bull; Lunch Rush (1:15 PM) &bull; Evening Snacks (4:15 PM)
          </p>
          <div className="mt-6">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-black text-sm bg-gradient-to-r from-[#F7B52C] to-[#FF9F1C] text-[#120A0C] shadow-lg hover:scale-105 active:scale-95 transition-all min-h-[48px]"
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
