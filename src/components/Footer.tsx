import React from 'react';
import Link from 'next/link';
import { ZLogo } from './ZLogo';
import { Phone, MapPin, Clock, MessageSquare, Coffee, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#F7B52C]/20 bg-[#5A1A2B] text-[#FFF8EE] relative overflow-hidden transition-colors duration-300">
      {/* Golden accent bar on top */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#F7B52C] via-[#FF9F1C] to-[#E63946]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <ZLogo size="md" />
            <p className="text-sm text-[#FFF8EE]/80 leading-relaxed font-medium">
              &ldquo;Little Joy in Every Puff.&rdquo; Fresh South Indian snacks, hot oven puffs, fiery Chicken 65, dum biryani, authentic filter coffee &amp; freshly pressed fruit juices.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 border border-[#F7B52C]/40 text-xs text-[#F7B52C] font-bold">
              <Sparkles className="w-3.5 h-3.5" /> 100% Authentic Indian Cafe
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#F7B52C] font-extrabold text-sm tracking-wider uppercase mb-4">
              Quick Menu Access
            </h3>
            <ul className="space-y-2.5 text-sm font-semibold">
              <li>
                <Link href="/menu" className="hover:text-[#F7B52C] transition-colors">
                  Explore Full Menu
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-[#F7B52C] transition-colors">
                  Track Your QR Order
                </Link>
              </li>
              <li>
                <Link href="/menu?category=snacks" className="hover:text-[#F7B52C] transition-colors">
                  Samosas, Puffs &amp; Bajjis
                </Link>
              </li>
              <li>
                <Link href="/menu?category=chicken-starters" className="hover:text-[#F7B52C] transition-colors">
                  Chicken 65 &amp; Starters
                </Link>
              </li>
              <li>
                <Link href="/menu?category=rice-biryani" className="hover:text-[#F7B52C] transition-colors">
                  Chicken &amp; Mutton Biryani
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#F7B52C] transition-colors flex items-center gap-1 text-xs text-amber-300/80 hover:text-white mt-4 font-bold">
                  <span>🔒 Canteen Seller &amp; Staff Portal &rarr;</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Timing & Kiosk Location */}
          <div>
            <h3 className="text-[#F7B52C] font-extrabold text-sm tracking-wider uppercase mb-4">
              Hours &amp; Location
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#F7B52C] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Daily:</strong> 10:00 AM – 10:30 PM<br />
                  <span className="text-xs text-[#FFF8EE]/70">Fresh batches every 30 mins</span>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F7B52C] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Z CAFÉ Kiosk #04</strong><br />
                  <span className="text-xs text-[#FFF8EE]/70">Central Food Court, Rathinam Techzone Campus</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Direct WhatsApp Ordering */}
          <div>
            <h3 className="text-[#F7B52C] font-extrabold text-sm tracking-wider uppercase mb-4">
              Counter Support
            </h3>
            <p className="text-xs text-[#FFF8EE]/80 mb-4 font-medium leading-relaxed">
              Questions or special bulk orders for class events? Message our counter manager:
            </p>
            <a
              href="https://wa.me/919876543210?text=Hello%20Z%20Cafe,%20I%20have%20an%20order%20inquiry"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-black font-extrabold text-sm hover:brightness-105 active:scale-95 transition-all shadow-md min-h-[44px]"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp Counter
            </a>
            <div className="mt-4 text-xs text-[#FFF8EE]/70 flex items-center gap-1.5 font-bold">
              <Phone className="w-3.5 h-3.5 text-[#F7B52C]" />
              Call: +91 98765 43210
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FFF8EE]/70 gap-4">
          <p>&copy; {new Date().getFullYear()} Z CAFÉ. All Rights Reserved. Pure Indian Cafe Delights.</p>
          <div className="flex items-center gap-2 font-medium">
            <span>Powered by Next.js &amp; Razorpay</span>
            <span>&bull;</span>
            <span className="text-[#F7B52C] font-bold">FSSAI Lic. #12423001000456</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
