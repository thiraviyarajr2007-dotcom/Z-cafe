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
  MessageSquare
} from 'lucide-react';
import { ZLogo } from '@/components/ZLogo';
import { NeonBadge } from '@/components/NeonBadge';
import { VineBorder } from '@/components/VineBorder';
import { SpecialsCarousel } from '@/components/SpecialsCarousel';
import { INITIAL_MENU, CATEGORIES_LIST } from '@/data/menu';

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#120A0C] overflow-hidden">
      
      {/* ===================== HERO SECTION ===================== */}
      <section className="relative pt-20 pb-20 sm:pt-28 sm:pb-32 bg-wood-slats border-b border-[#3E1220] counter-led-glow overflow-hidden">
        {/* Swaying hanging green vines border on the ceiling of the kiosk */}
        <VineBorder />

        {/* Ambient radial glow background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#3E1220]/80 via-[#180B0F]/90 to-[#120A0C] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          
          {/* Neon "Tea • Coffee • Available" Badge */}
          <div className="mb-6 animate-pulse-subtle">
            <NeonBadge />
          </div>

          {/* Glowing Brand Signage: Z CAFÉ */}
          <div className="mb-6 transform hover:scale-[1.02] transition-transform duration-300">
            <ZLogo size="xl" showWordmark={true} />
          </div>

          {/* Signboard Tagline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#FFF8EE] tracking-tight font-display max-w-3xl leading-tight">
            Little Joy in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F7B52C] via-[#FFAF38] to-[#FF9F1C]">Every Puff.</span>
          </h1>

          <p className="mt-4 text-base sm:text-xl text-[#F5EBE1]/85 max-w-2xl font-medium leading-relaxed">
            Authentic Indian street snacks, piping-hot chicken 65, fragrant dum biryani, fresh fruit coolers & authentic South Indian filter coffee.
          </p>

          <p className="mt-2 text-xs sm:text-sm text-[#F7B52C] font-semibold tracking-wider uppercase">
            ⚡ &ldquo;Perfect For A Quick Snack.&rdquo; Skip the food-court rush.
          </p>

          {/* Primary Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/menu"
              className="btn-gold-pill w-full sm:w-auto text-base py-3.5 px-8 font-extrabold group"
            >
              <span>Pre-Order Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/menu"
              className="btn-outline-pill w-full sm:w-auto text-base py-3.5 px-8"
            >
              <span>View Full Menu</span>
            </Link>
          </div>

          {/* Quick Perks / Trust Badges */}
          <div className="mt-12 pt-8 border-t border-[#3E1220]/70 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl text-left">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#1D0C13]/80 border border-[#3E1220]">
              <div className="w-9 h-9 rounded-xl bg-[#3E1220] flex items-center justify-center text-[#F7B52C] shrink-0 font-bold">
                ₹
              </div>
              <div>
                <div className="text-xs font-bold text-white">Starting ₹15</div>
                <div className="text-[11px] text-[#FFF8EE]/60">Affordable Bites</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#1D0C13]/80 border border-[#3E1220]">
              <div className="w-9 h-9 rounded-xl bg-[#3E1220] flex items-center justify-center text-[#F7B52C] shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">10-Min Pickup</div>
                <div className="text-[11px] text-[#FFF8EE]/60">Freshly Baked</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#1D0C13]/80 border border-[#3E1220]">
              <div className="w-9 h-9 rounded-xl bg-[#3E1220] flex items-center justify-center text-[#F7B52C] shrink-0">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">QR Token</div>
                <div className="text-[11px] text-[#FFF8EE]/60">Zero Queue Line</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#1D0C13]/80 border border-[#3E1220]">
              <div className="w-9 h-9 rounded-xl bg-[#3E1220] flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">100% Indian</div>
                <div className="text-[11px] text-[#FFF8EE]/60">No Western Items</div>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* ===================== TODAY'S SPECIALS CAROUSEL ===================== */}
      <SpecialsCarousel items={INITIAL_MENU} />


      {/* ===================== CATEGORIES SHOWCASE ===================== */}
      <section className="py-16 bg-[#0E0608] border-y border-[#3E1220] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-[#F7B52C] uppercase tracking-widest">
              Authentic Indian Variety
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-display mt-1">
              Explore By Category
            </h2>
            <p className="text-xs sm:text-sm text-[#FFF8EE]/70 mt-2">
              From crispy flaky bakery-style puffs to hot dum biryani and freshly squeezed sweet lime juice.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES_LIST.map((cat) => (
              <Link
                key={cat.id}
                href={`/menu?category=${cat.id}`}
                className="zcafe-card rounded-2xl p-5 flex flex-col items-center text-center group cursor-pointer border border-[#3E1220] hover:border-[#F7B52C]/50"
              >
                <div className="text-4xl mb-3 transform group-hover:scale-125 transition-transform duration-300">
                  {cat.icon}
                </div>
                <h3 className="font-bold text-sm text-white group-hover:text-[#F7B52C] transition-colors leading-snug">
                  {cat.label}
                </h3>
                <span className="text-[11px] text-[#FFF8EE]/50 mt-1 font-medium">
                  {cat.count} items
                </span>
                <span className="mt-3 text-[10px] text-[#F7B52C] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                  Order &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* ===================== HOW PRE-ORDER WORKS ===================== */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-extrabold text-[#F7B52C] uppercase tracking-widest">
            3 Simple Steps
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white font-display mt-1">
            How Pre-Ordering Works
          </h2>
          <p className="text-xs sm:text-sm text-[#FFF8EE]/70 mt-2">
            No more waiting around in crowded food-court queues. Order right from your phone and pick up when it&apos;s ready!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Step 1 */}
          <div className="zcafe-card rounded-3xl p-8 relative flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F7B52C] to-[#FF9F1C] text-[#120A0C] font-black text-xl flex items-center justify-center shadow-glow-gold mb-6">
              1
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Order Online</h3>
            <p className="text-xs text-[#FFF8EE]/70 leading-relaxed">
              Browse our Indian menu, select your portions (Half/Full), add preparation notes like &ldquo;less spicy&rdquo;, and pick your desired pickup slot.
            </p>
          </div>

          {/* Step 2 */}
          <div className="zcafe-card rounded-3xl p-8 relative flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F7B52C] to-[#FF9F1C] text-[#120A0C] font-black text-xl flex items-center justify-center shadow-glow-gold mb-6">
              2
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Pay Securely</h3>
            <p className="text-xs text-[#FFF8EE]/70 leading-relaxed">
              Complete your payment instantly via Razorpay using Google Pay, PhonePe, Paytm, UPI, Cards or NetBanking.
            </p>
          </div>

          {/* Step 3 */}
          <div className="zcafe-card rounded-3xl p-8 relative flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F7B52C] to-[#FF9F1C] text-[#120A0C] font-black text-xl flex items-center justify-center shadow-glow-gold mb-6">
              3
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Collect with Token / QR</h3>
            <p className="text-xs text-[#FFF8EE]/70 leading-relaxed">
              Receive your unique Token (e.g. Z-0247) and dynamic QR code. Track real-time progress, then flash your token at the counter and collect!
            </p>
          </div>

        </div>

        <div className="mt-12 text-center">
          <Link href="/menu" className="btn-gold-pill text-sm py-3 px-8 font-extrabold">
            Start Your Pre-Order &rarr;
          </Link>
        </div>
      </section>


      {/* ===================== LOCATION & TIMINGS ===================== */}
      <section className="py-16 bg-[#160A0D] border-t border-[#3E1220]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            {/* Left Info */}
            <div className="space-y-6">
              <div>
                <span className="text-xs font-extrabold text-[#F7B52C] uppercase tracking-widest">
                  Food Court Kiosk
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-display mt-1">
                  Visit Z CAFÉ Counter
                </h2>
                <p className="text-sm text-[#FFF8EE]/70 mt-2">
                  Find our illuminated burgundy signboard and warm amber lighting in the food court.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#1F0E14] border border-[#3E1220]">
                  <MapPin className="w-5 h-5 text-[#F7B52C] shrink-0 mt-0.5" />
                  <div className="text-xs text-[#FFF8EE]/80">
                    <strong className="text-white text-sm">Central Food Court, Kiosk #04</strong><br />
                    Rathinam Techzone Campus / Food Court Promenade, Eachanari, Coimbatore - 641021
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#1F0E14] border border-[#3E1220]">
                  <Clock className="w-5 h-5 text-[#F7B52C] shrink-0 mt-0.5" />
                  <div className="text-xs text-[#FFF8EE]/80">
                    <strong className="text-white text-sm">Operating Hours</strong><br />
                    Monday – Sunday: 10:00 AM – 10:30 PM (Hot batches every 30 mins)
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#1F0E14] border border-[#3E1220]">
                  <Phone className="w-5 h-5 text-[#F7B52C] shrink-0 mt-0.5" />
                  <div className="text-xs text-[#FFF8EE]/80">
                    <strong className="text-white text-sm">Direct Counter Hotline</strong><br />
                    +91 98765 43210 (Direct Kitchen Assistance & Bulk Orders)
                  </div>
                </div>
              </div>

              <div>
                <a
                  href="https://wa.me/919876543210?text=Hi%20Z%20Cafe,%20I%20am%20at%20the%20food%20court"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-black font-extrabold text-sm hover:scale-105 transition-all shadow-md"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  Chat on WhatsApp with Counter
                </a>
              </div>
            </div>

            {/* Right: Map Embed Placeholder with Food Court Mockup */}
            <div className="zcafe-card rounded-3xl p-6 border border-[#3E1220] flex flex-col justify-between h-[380px] relative overflow-hidden bg-gradient-to-br from-[#2A0F17] to-[#120A0C]">
              {/* Fluted texture backdrop */}
              <div className="absolute inset-0 bg-wood-slats opacity-30" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold text-emerald-400">COUNTER OPEN NOW</span>
                </div>
                <span className="text-xs text-[#FFF8EE]/60">Food Court Level 1</span>
              </div>

              {/* Graphical representation of the kiosk location */}
              <div className="relative z-10 my-auto text-center py-6 px-4 rounded-2xl bg-[#120A0C]/90 border border-[#F7B52C]/30 shadow-inner">
                <div className="inline-flex p-3 rounded-full bg-[#3E1220] text-[#F7B52C] mb-3 shadow-glow-gold">
                  <MapPin className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-white">Z CAFÉ Kiosk Location</h4>
                <p className="text-xs text-[#FFF8EE]/70 max-w-xs mx-auto mt-1">
                  Located directly opposite the main food-court fountain escalators. Look for our glowing golden &ldquo;Z&rdquo; and burgundy canopy.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#F7B52C] bg-[#3E1220]/60 px-3 py-1 rounded-full">
                  <span>📍 GPS: 10.9320° N, 76.9634° E</span>
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-between text-xs text-[#FFF8EE]/60 border-t border-[#3E1220] pt-3">
                <span>Free Mall Parking</span>
                <span className="text-[#F7B52C] font-semibold">Easy Wheelchair Access</span>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
