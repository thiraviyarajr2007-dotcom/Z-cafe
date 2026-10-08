'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Order } from '@/types';
import { Share2, Check, Download, MessageSquare, Copy } from 'lucide-react';

interface QRTokenCardProps {
  order: Order;
  compact?: boolean;
}

export function QRTokenCard({ order, compact = false }: QRTokenCardProps) {
  const [copied, setCopied] = useState(false);

  // Encode structured payload for staff scanner
  const qrPayload = JSON.stringify({
    token: order.token,
    orderId: order.id,
    date: order.pickupDate,
    slot: order.pickupSlot,
    customer: order.customerName,
    studentId: order.studentId || 'STUDENT',
  });

  // Formatted WhatsApp text matching prompt requirement
  const itemsText = order.items
    .map((i) => `🍛 ${i.name} × ${i.quantity}`)
    .join('\n');

  const whatsappMessage = `Hi ${order.customerName} 👋\n\nYour ZCafe order is confirmed!\n\n${itemsText}\n\n🎟 Token: ${order.token}\n📅 Date: ${order.pickupDate}\n⏰ Pickup: ${order.pickupSlot}\n🆔 Order ID: ${order.id}\n\nPlease show your QR code at the ZCafe pickup counter.\n\nThank you for ordering with ZCafe!`;

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(whatsappMessage);
    const url = `https://wa.me/${order.customerPhone ? `91${order.customerPhone.replace(/\D/g, '')}` : ''}?text=${encoded}`;
    window.open(url, '_blank');
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#2d121c] to-[#120A0C] border-2 border-[#F7B52C]/40 p-6 sm:p-8 shadow-[0_15px_50px_rgba(0,0,0,0.8)] text-center text-[#FFF8EE]">
      {/* Golden halo light */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-20 bg-[#F7B52C]/20 rounded-full blur-2xl pointer-events-none" />

      {/* Prominent Token Header */}
      <div className="mb-4">
        <span className="text-xs font-black uppercase tracking-widest text-[#F7B52C]">
          COLLEGE COUNTER PASS
        </span>
        <div className="mt-1 flex items-center justify-center gap-2">
          <span className="text-sm font-bold text-[#FFF8EE]/60 uppercase">Token</span>
          <span className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F7B52C] via-[#FFE29A] to-[#FF9F1C] tracking-tight drop-shadow-[0_4px_12px_rgba(247,181,44,0.4)]">
            #{order.token}
          </span>
        </div>
      </div>

      {/* Scannable QR Container with Token Overlay */}
      <div className="relative inline-block mx-auto p-4 sm:p-5 rounded-2xl bg-white shadow-[0_10px_35px_rgba(0,0,0,0.7)] border-4 border-[#F7B52C]">
        <QRCodeSVG
          value={qrPayload}
          size={compact ? 170 : 210}
          level="H" // High error correction to safely allow center logo/token
          includeMargin={false}
          imageSettings={{
            src: '/favicon.ico',
            x: undefined,
            y: undefined,
            height: 36,
            width: 36,
            excavate: true,
          }}
        />

        {/* Center Prominent Token Pill */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="px-3 py-1 rounded-lg bg-[#120A0C] border-2 border-[#F7B52C] shadow-lg text-[#F7B52C] font-black text-xs sm:text-sm tracking-wider">
            #{order.token}
          </div>
        </div>
      </div>

      {/* Subtext */}
      <p className="mt-4 text-xs sm:text-sm text-[#FFF8EE]/80 max-w-xs mx-auto">
        Show this QR code or Token <strong>#{order.token}</strong> at the ZCafe counter to collect your order.
      </p>

      {/* Details Box */}
      <div className="mt-5 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-left text-xs space-y-1.5">
        <div className="flex justify-between">
          <span className="text-white/60">Pickup Date:</span>
          <span className="font-semibold text-white">{order.pickupDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Pickup Window:</span>
          <span className="font-semibold text-[#F7B52C]">{order.pickupSlot}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Order ID:</span>
          <span className="font-mono text-white/90">{order.id}</span>
        </div>
        {order.studentId && (
          <div className="flex justify-between">
            <span className="text-white/60">Student ID:</span>
            <span className="font-medium text-emerald-400">{order.studentId}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={handleWhatsAppShare}
          className="w-full flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white shadow-lg shadow-emerald-900/30 transition-all active:scale-[0.98]"
        >
          <MessageSquare className="w-4 h-4 fill-white text-white" />
          <span>Add to WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={handleCopySummary}
          className="w-full sm:w-auto py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-[#FFF8EE] border border-white/15 transition-all"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-[#F7B52C]" />
              <span>Copy Pass</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
