import React from 'react';
import Link from 'next/link';
import { ZLogo } from './ZLogo';
import { Phone, MapPin, Clock, MessageSquare, Coffee, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#3E1220] bg-[#0B0507] text-[#FFF8EE]/80 relative overflow-hidden">
      {/* Fluted wood background accent line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#5A1A2B] via-[#F7B52C] to-[#5A1A2B]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <ZLogo size="md" />
            <p className="text-sm text-[#FFF8EE]/70 leading-relaxed">
              &ldquo;Little Joy in Every Puff.&rdquo; Fresh Indian snacks, piping hot puffs, fiery Chicken 65, fragrant biryani, authentic South Indian filter coffee & freshly squeezed juices.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3E1220]/60 border border-[#F7B52C]/30 text-xs text-[#F7B52C]">
              <Sparkles className="w-3.5 h-3.5" /> 100% Authentic Indian Flavours
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4 text-[#F7B52C]">
              Quick Access
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/menu" className="hover:text-[#F7B52C] transition-colors">
                  Explore Full Menu
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-[#F7B52C] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/menu?category=snacks" className="hover:text-[#F7B52C] transition-colors">
                  Fresh Puffs & Samosas
                </Link>
              </li>
              <li>
                <Link href="/menu?category=chicken-starters" className="hover:text-[#F7B52C] transition-colors">
                  Chicken 65 & Starters
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#F7B52C] transition-colors flex items-center gap-1 text-xs text-[#FFF8EE]/50 hover:text-white mt-4">
                  Kitchen Portal / Admin &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Timing & Kiosk Location */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4 text-[#F7B52C]">
              Hours & Location
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#F7B52C] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Daily:</strong> 10:00 AM – 10:30 PM<br />
                  <span className="text-xs text-[#FFF8EE]/60">Fresh batches every 30 mins</span>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F7B52C] shrink-0 mt-0.5" />
                <span>
                  <strong>Z CAFÉ Kiosk #04</strong><br />
                  Central Food Court, Rathinam Techzone Campus / Mall Promenade
                </span>
              </li>
            </ul>
          </div>

          {/* Direct WhatsApp Ordering */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4 text-[#F7B52C]">
              Counter Support
            </h3>
            <p className="text-xs text-[#FFF8EE]/70 mb-4">
              Need assistance or special bulk order requirements? Ping our counter master:
            </p>
            <a
              href="https://wa.me/919876543210?text=Hello%20Z%20Cafe,%20I%20have%20an%20order%20inquiry"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366] text-black font-bold text-sm hover:brightness-110 transition-all shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp Counter
            </a>
            <div className="mt-4 text-xs text-[#FFF8EE]/50 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#F7B52C]" />
              Direct Call: +91 98765 43210
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-[#230B13] flex flex-col sm:flex-row items-center justify-between text-xs text-[#FFF8EE]/50 gap-4">
          <p>&copy; {new Date().getFullYear()} Z CAFÉ. All Rights Reserved. Pure Indian Cafe Delights.</p>
          <div className="flex items-center gap-2">
            <span>Powered by Next.js & Razorpay</span>
            <span>•</span>
            <span className="text-[#F7B52C]">FSSAI Lic. #12423001000456</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
