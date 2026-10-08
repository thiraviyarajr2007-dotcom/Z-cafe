'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ChefHat, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Clock, 
  Bell, 
  ShoppingBag, 
  QrCode, 
  Search, 
  TrendingUp, 
  Sparkles, 
  Layers, 
  Plus, 
  Edit3, 
  Trash2, 
  RefreshCw,
  Lock,
  Unlock,
  DollarSign,
  AlertTriangle,
  Camera,
  Check,
  Users,
  Zap,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  XCircle,
  Sliders,
  User,
  LogOut,
  Eye,
  EyeOff,
  KeyRound
} from 'lucide-react';
import { Order, OrderStatus, MenuItem } from '@/types';
import { 
  subscribeToAllOrders, 
  updateOrderStatus, 
  verifyAndCollectQr,
  getLocalMenu,
  saveLocalMenu
} from '@/lib/orders-db';
import { 
  SellerUser, 
  PRESET_SELLER_ACCOUNTS, 
  getSellerSession, 
  loginSeller, 
  logoutSeller 
} from '@/lib/seller-auth';
import { VegBadge } from '@/components/VegBadge';
import { useCartStore } from '@/store/useCartStore';

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sellerUser, setSellerUser] = useState<SellerUser | null>(null);
  const [usernameInput, setUsernameInput] = useState('admin');
  const [passwordInput, setPasswordInput] = useState('zcafe@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberTerminal, setRememberTerminal] = useState(true);
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'orders' | 'scanner' | 'menu' | 'crowd' | 'analytics'>('orders');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Menu Management State
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchMenuQuery, setSearchMenuQuery] = useState('');

  // Staff QR Scanner State
  const [scannerInput, setScannerInput] = useState('');
  const [scannerResult, setScannerResult] = useState<{
    status: 'idle' | 'verified' | 'duplicate' | 'invalid';
    message: string;
    order?: Order;
    collectedAt?: number;
  }>({ status: 'idle', message: '' });

  // Crowd status store
  const { crowdStatus, setCrowdStatus } = useCartStore();

  const prevOrdersCountRef = useRef(0);

  // Restore seller session on terminal mount
  useEffect(() => {
    const existing = getSellerSession();
    if (existing) {
      setSellerUser(existing);
      setIsAuthenticated(true);
    }
  }, []);

  // Web Audio Synthesizer for Kitchen Chime (Zero external audio dependency)
  const playKitchenChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
      console.warn('Audio feedback', e);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    setMenuItems(getLocalMenu());

    const unsubscribe = subscribeToAllOrders((allOrders) => {
      if (allOrders.length > prevOrdersCountRef.current && prevOrdersCountRef.current > 0) {
        if (soundEnabled) {
          playKitchenChime();
        }
      }
      prevOrdersCountRef.current = allOrders.length;
      setOrders(allOrders);
    });

    return () => unsubscribe();
  }, [isAuthenticated, soundEnabled]);

  const handleSellerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = loginSeller(usernameInput, passwordInput, rememberTerminal);
    if (res.success && res.user) {
      setSellerUser(res.user);
      setIsAuthenticated(true);
      setAuthError('');
      playKitchenChime();
    } else {
      setAuthError(res.error || 'Invalid credentials');
    }
  };

  const handleQuickFillAccount = (acc: typeof PRESET_SELLER_ACCOUNTS[0]) => {
    setUsernameInput(acc.username);
    setPasswordInput(acc.password);
    setAuthError('');
  };

  const handleSellerLogout = () => {
    logoutSeller();
    setSellerUser(null);
    setIsAuthenticated(false);
  };

  const handleStatusChange = async (orderId: string, nextStatus: OrderStatus) => {
    await updateOrderStatus(orderId, nextStatus);
    if (nextStatus === 'ready' && soundEnabled) {
      playKitchenChime();
    }
  };

  // Staff QR Scanner handler with DUPLICATE PREVENTION
  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannerInput.trim()) return;

    let targetTokenOrId = scannerInput.trim();
    // Parse if raw JSON QR payload was scanned
    try {
      if (targetTokenOrId.startsWith('{')) {
        const parsed = JSON.parse(targetTokenOrId);
        targetTokenOrId = parsed.token || parsed.orderId || targetTokenOrId;
      }
    } catch (e) {}

    const result = verifyAndCollectQr(targetTokenOrId);

    if (result.success && result.order) {
      setScannerResult({
        status: 'verified',
        message: `ORDER VERIFIED ✓ Token #${result.order.token}`,
        order: result.order,
      });
      if (soundEnabled) playKitchenChime();
    } else if (result.alreadyUsed) {
      setScannerResult({
        status: 'duplicate',
        message: `QR ALREADY USED!`,
        order: result.order,
        collectedAt: result.collectedAt,
      });
    } else {
      setScannerResult({
        status: 'invalid',
        message: result.message || 'Invalid QR code. No active order found.',
      });
    }
  };

  // Menu items stock toggle
  const toggleItemAvailability = (id: string) => {
    const updated = menuItems.map((item) =>
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    );
    setMenuItems(updated);
    saveLocalMenu(updated);
  };

  const adjustStock = (id: string, delta: number) => {
    const updated = menuItems.map((item) => {
      if (item.id === id) {
        const cur = item.remainingStock ?? 20;
        const next = Math.max(0, cur + delta);
        return {
          ...item,
          remainingStock: next,
          isAvailable: next > 0 ? item.isAvailable : false,
        };
      }
      return item;
    });
    setMenuItems(updated);
    saveLocalMenu(updated);
  };

  // Overview metrics (matching Prompt spec)
  const totalRevenue = 28450 + orders.reduce((s, o) => s + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  const totalOrdersCount = 248 + orders.length;
  const pendingOrdersCount = 32 + orders.filter((o) => o.status !== 'collected').length;
  const completedOrdersCount = 216 + orders.filter((o) => o.status === 'collected').length;

  // Filtered menu
  const filteredMenuItems = menuItems.filter((m) =>
    m.name.toLowerCase().includes(searchMenuQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(searchMenuQuery.toLowerCase())
  );

  // Authentication Seller Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#120A0C] flex flex-col items-center justify-center p-4 py-12 text-[#FFF8EE]">
        {/* Top return navigation */}
        <div className="flex items-center justify-between w-full max-w-xl mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#FFF8EE]/70 hover:text-[#F7B52C] transition-colors bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Student App &amp; Menu
          </Link>
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 flex items-center gap-1.5">
            <Lock className="w-3 h-3" /> Seller Portal Only
          </span>
        </div>

        {/* Main Seller Login Card */}
        <div className="rounded-3xl p-6 sm:p-8 max-w-xl w-full bg-[#1b0d13] border border-white/10 shadow-2xl space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5A1A2B] to-[#3E1220] text-[#F7B52C] flex items-center justify-center mx-auto mb-4 border border-[#F7B52C]/40 shadow-glow-gold">
              <ChefHat className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white font-display">Canteen Seller Portal</h1>
            <p className="text-xs text-white/60 mt-1.5 max-w-md mx-auto">
              Separate backend terminal for Canteen Owner &amp; Kitchen Staff to manage orders, live stock, and QR tokens.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSellerLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/70 mb-1.5">
                Seller Username or Staff ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="e.g. admin or kitchen"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#120A0C] border border-white/15 text-white font-medium text-sm focus:outline-none focus:border-[#F7B52C] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/70 mb-1.5">
                Staff Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter seller password..."
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-2xl bg-[#120A0C] border border-white/15 text-white font-medium text-sm focus:outline-none focus:border-[#F7B52C] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-white/40 hover:text-white transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-white/60">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberTerminal}
                  onChange={(e) => setRememberTerminal(e.target.checked)}
                  className="rounded border-white/20 bg-white/5 text-[#F7B52C] focus:ring-0"
                />
                <span>Remember this terminal session</span>
              </label>
              <span className="text-[11px] text-[#F7B52C]/80 font-mono">Terminal: POS-KDS-01</span>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 font-semibold flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-[#F7B52C] to-[#FF9F1C] text-[#120A0C] hover:brightness-110 active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4 stroke-[2.5]" />
              <span>Sign In to Seller Dashboard</span>
            </button>
          </form>

          {/* Quick-Fill Pre-built Accounts */}
          <div className="pt-5 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#F7B52C]">
                ⚡ Pre-Configured Seller Accounts
              </span>
              <span className="text-[10px] text-white/40">Click any card to auto-fill</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {PRESET_SELLER_ACCOUNTS.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleQuickFillAccount(acc)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    usernameInput === acc.username
                      ? 'bg-[#F7B52C]/10 border-[#F7B52C] text-white shadow-sm'
                      : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{acc.avatar}</span>
                    <span className="font-extrabold text-xs text-white truncate">{acc.role}</span>
                  </div>
                  <div className="text-[10px] text-[#F7B52C] font-mono font-bold truncate">
                    user: {acc.username}
                  </div>
                  <div className="text-[10px] text-white/40 font-mono truncate">
                    pass: {acc.password}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0608] pb-24 text-[#FFF8EE]">
      
      {/* Top Admin Navbar */}
      <div className="bg-[#180A0E] border-b border-white/10 px-4 sm:px-6 lg:px-8 py-4 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#3E1220] text-[#F7B52C] border border-[#F7B52C]/30 shadow-md">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white font-display">ZCafe Canteen Master Kiosk</h1>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <p className="text-[11px] text-white/60">Live KDS • QR Counter Scanner • Break Rush Controls</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {[
              { id: 'orders', label: 'Live Orders', icon: ShoppingBag },
              { id: 'scanner', label: 'QR Scanner', icon: QrCode },
              { id: 'crowd', label: 'Crowd & Slots', icon: Sliders },
              { id: 'menu', label: 'Menu & Stock', icon: Layers },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#F7B52C] text-[#120A0C] shadow-md'
                      : 'bg-white/5 text-white/80 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            {/* Sound Mute Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Chime sound enabled' : 'Chime sound muted'}
              className={`p-2 rounded-xl text-xs border transition-all ${
                soundEnabled
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-white/5 text-white/40 border-white/10'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Seller Account Badge */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs">
              <span className="text-base">{sellerUser?.avatar || '👨‍💼'}</span>
              <div className="text-left">
                <div className="font-bold text-white text-[11px] leading-tight">
                  {sellerUser?.name || 'Canteen Staff'}
                </div>
                <div className="text-[10px] text-[#F7B52C] font-mono leading-none">
                  {sellerUser?.role || 'Seller'} • {sellerUser?.terminalId || 'POS-01'}
                </div>
              </div>
            </div>

            {/* Logout Seller Button */}
            <button
              onClick={handleSellerLogout}
              title="Log out of seller portal"
              className="px-3 py-2 rounded-xl text-xs font-bold bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* ===================== METRIC STATS OVERVIEW ===================== */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 mb-8">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-white/50">Today&apos;s Orders</span>
            <div className="text-2xl font-black text-white mt-0.5">{totalOrdersCount}</div>
            <span className="text-[11px] text-emerald-400 font-semibold">+18% vs yesterday</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-white/50">Gross Revenue</span>
            <div className="text-2xl font-black text-[#F7B52C] mt-0.5">₹{totalRevenue.toLocaleString()}</div>
            <span className="text-[11px] text-emerald-400 font-semibold">100% Verified Paid</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-white/50">Pending / Preparing</span>
            <div className="text-2xl font-black text-amber-400 mt-0.5">{pendingOrdersCount}</div>
            <span className="text-[11px] text-white/50">Active kitchen load</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-white/50">Completed & Collected</span>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">{completedOrdersCount}</div>
            <span className="text-[11px] text-white/50">Zero wait collected</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 col-span-2 lg:col-span-1">
            <span className="text-[10px] uppercase font-bold text-white/50">Live Crowd Mode</span>
            <div className="text-lg font-black text-white capitalize mt-1 flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-full ${
                crowdStatus === 'normal' ? 'bg-emerald-400' : crowdStatus === 'moderate' ? 'bg-amber-400' : 'bg-rose-400'
              }`} />
              {crowdStatus} Rush
            </div>
            <span className="text-[10px] text-white/50">Auto-slots active</span>
          </div>
        </div>

        {/* ===================== TAB 1: LIVE ORDERS MANAGEMENT ===================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white/60">Filter Status:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(['all', 'received', 'accepted', 'preparing', 'ready', 'collected'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                        statusFilter === st
                          ? 'bg-[#F7B52C] text-[#120A0C]'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <span className="text-xs text-white/50">
                Showing {orders.filter((o) => statusFilter === 'all' || o.status === statusFilter).length} orders
              </span>
            </div>

            {/* 4-Column Live Order Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {(['received', 'preparing', 'ready', 'collected'] as const).map((columnKey) => {
                const colOrders = orders.filter((o) => o.status === columnKey || (columnKey === 'received' && o.status === 'accepted'));
                const colTitle = {
                  received: 'New / Accepted',
                  preparing: 'Preparing Fresh',
                  ready: 'Ready for Pickup',
                  collected: 'Collected',
                }[columnKey];

                return (
                  <div key={columnKey} className="rounded-3xl bg-white/5 border border-white/10 p-4 space-y-3 flex flex-col">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-[#F7B52C]">
                        {colTitle}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/10 text-white">
                        {colOrders.length}
                      </span>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[70vh]">
                      {colOrders.length === 0 ? (
                        <div className="py-8 text-center text-xs text-white/30 italic">
                          No orders in this stage
                        </div>
                      ) : (
                        colOrders.map((ord) => (
                          <div
                            key={ord.id}
                            className="p-4 rounded-2xl bg-[#1d0d14] border border-white/10 shadow-lg space-y-3 hover:border-white/20 transition-all"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="px-2.5 py-1 rounded-xl bg-[#F7B52C] text-[#120A0C] font-black text-sm">
                                    #{ord.token}
                                  </span>
                                  <span className="font-extrabold text-sm text-white">
                                    {ord.customerName}
                                  </span>
                                </div>
                                <div className="text-[11px] text-white/60 mt-1">
                                  Slot: <strong className="text-[#F7B52C]">{ord.pickupSlot}</strong>
                                </div>
                              </div>

                              <span className="text-xs font-mono font-bold text-emerald-400">
                                ✓ Paid
                              </span>
                            </div>

                            {/* Items list */}
                            <div className="py-2 border-y border-white/5 space-y-1 text-xs">
                              {ord.items.map((it, idx) => (
                                <div key={idx} className="flex justify-between">
                                  <span>
                                    {it.quantity} × {it.name} {it.size ? `(${it.size})` : ''}
                                  </span>
                                  <span className="text-white/60">₹{it.price * it.quantity}</span>
                                </div>
                              ))}
                              {ord.items.some((i) => i.notes) && (
                                <div className="text-[11px] text-amber-300 italic pt-1">
                                  Notes: {ord.items.filter((i) => i.notes).map((i) => i.notes).join(', ')}
                                </div>
                              )}
                            </div>

                            {/* One-Tap Status Action Buttons */}
                            <div className="grid grid-cols-3 gap-1 pt-1">
                              <button
                                onClick={() => handleStatusChange(ord.id, 'preparing')}
                                className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                                  ord.status === 'preparing'
                                    ? 'bg-amber-500 text-black border-amber-500'
                                    : 'bg-white/5 text-white hover:bg-white/15 border-white/10'
                                }`}
                              >
                                Preparing
                              </button>
                              <button
                                onClick={() => handleStatusChange(ord.id, 'ready')}
                                className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                                  ord.status === 'ready'
                                    ? 'bg-emerald-500 text-black border-emerald-500 font-black'
                                    : 'bg-white/5 text-white hover:bg-white/15 border-white/10'
                                }`}
                              >
                                Ready
                              </button>
                              <button
                                onClick={() => handleStatusChange(ord.id, 'collected')}
                                className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                                  ord.status === 'collected'
                                    ? 'bg-white/20 text-emerald-400 border-white/20'
                                    : 'bg-white/5 text-white hover:bg-white/15 border-white/10'
                                }`}
                              >
                                Collected
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================== TAB 2: STAFF QR SCANNER WITH DUPLICATE PREVENTION ===================== */}
        {activeTab === 'scanner' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#251017] to-[#120A0C] border-2 border-[#F7B52C]/30 text-center shadow-2xl space-y-6">
              
              <div className="w-16 h-16 rounded-3xl bg-[#F7B52C]/20 border border-[#F7B52C]/40 flex items-center justify-center text-[#F7B52C] mx-auto shadow-glow-gold">
                <QrCode className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#F7B52C]">
                  CANTEEN COUNTER TERMINAL
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  Scan Customer QR
                </h2>
                <p className="text-xs sm:text-sm text-white/70 max-w-sm mx-auto mt-1">
                  Enter student Token # (e.g. <strong>104</strong>) or scan their digital QR code pass.
                </p>
              </div>

              {/* Input Form */}
              <form onSubmit={handleScanSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Scan or enter Token # (e.g. 104)..."
                  value={scannerInput}
                  onChange={(e) => setScannerInput(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-2xl bg-black/60 border border-white/20 text-white font-mono text-base placeholder-white/30 focus:outline-none focus:border-[#F7B52C]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl font-black text-sm bg-gradient-to-r from-[#F7B52C] to-[#FF9F1C] text-[#120A0C] hover:brightness-110 active:scale-95 transition-all shadow-lg shrink-0"
                >
                  Verify QR
                </button>
              </form>

              {/* Quick Scan Test Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <span className="text-[11px] text-white/40">Quick test tokens:</span>
                {['104', '098', '085', '112'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setScannerInput(t);
                    }}
                    className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-[#F7B52C] border border-white/10"
                  >
                    #{t}
                  </button>
                ))}
              </div>

              {/* SCANNER RESULT DISPLAY */}
              {scannerResult.status === 'verified' && scannerResult.order && (
                <div className="p-6 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500/80 text-left space-y-4 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-500/30">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      <span className="text-lg font-black text-emerald-400">
                        ORDER VERIFIED ✓
                      </span>
                    </div>
                    <span className="text-2xl font-black text-[#F7B52C]">
                      #{scannerResult.order.token}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-white/50">Student:</span>
                      <div className="font-bold text-white text-sm">{scannerResult.order.customerName}</div>
                      <div className="text-[11px] text-emerald-400 font-mono">{scannerResult.order.studentId || 'STUDENT'}</div>
                    </div>
                    <div>
                      <span className="text-white/50">Pickup Slot:</span>
                      <div className="font-bold text-white text-sm">{scannerResult.order.pickupSlot}</div>
                      <div className="text-[11px] text-white/60">Status: <strong className="text-emerald-400">✓ Ready</strong></div>
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/20 text-xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-white/50">Prepared Meal:</span>
                    {scannerResult.order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between font-medium text-white">
                        <span>🍛 {item.name} × {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-center font-black text-sm text-emerald-300">
                    ORDER COMPLETED ✓ (Hand over food to student)
                  </div>
                </div>
              )}

              {scannerResult.status === 'duplicate' && (
                <div className="p-6 rounded-2xl bg-rose-950/50 border-2 border-rose-500/80 text-left space-y-3 animate-in fade-in zoom-in-95">
                  <div className="flex items-center gap-2 text-rose-400">
                    <XCircle className="w-6 h-6 text-rose-400" />
                    <span className="text-lg font-black uppercase tracking-wider">
                      QR ALREADY USED!
                    </span>
                  </div>
                  <p className="text-xs text-rose-200">
                    This order token was already collected. Duplicate redemption is strictly prevented.
                  </p>
                  {scannerResult.order && (
                    <div className="p-3 rounded-xl bg-black/40 border border-rose-500/20 text-xs text-white/80">
                      <div>Token: <strong>#{scannerResult.order.token}</strong></div>
                      <div>Student: <strong>{scannerResult.order.customerName}</strong></div>
                      <div>Collected At: <strong>{scannerResult.collectedAt ? new Date(scannerResult.collectedAt).toLocaleTimeString() : 'Earlier'}</strong></div>
                    </div>
                  )}
                </div>
              )}

              {scannerResult.status === 'invalid' && (
                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 text-amber-300 text-xs text-center font-bold">
                  {scannerResult.message}
                </div>
              )}

            </div>
          </div>
        )}

        {/* ===================== TAB 3: CROWD MANAGEMENT & SLOTS ===================== */}
        {activeTab === 'crowd' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-6">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#F7B52C]">
                  CAMPUS BREAK SURGE PROTECTION
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  Crowd Status & Break Slot Controls
                </h3>
                <p className="text-xs text-white/70 mt-1">
                  Control how incoming students see canteen crowding and configure slot order limits.
                </p>
              </div>

              {/* Rush Toggle */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <span className="text-xs font-bold uppercase text-white/60">
                  Current Campus Crowd Indicator:
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'normal', label: '🟢 Normal Crowd', est: '8–12 min wait' },
                    { id: 'moderate', label: '🟡 Moderate Rush', est: '12–16 min wait' },
                    { id: 'high', label: '🔴 High Rush', est: '18–22 min wait' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      onClick={() => setCrowdStatus(lvl.id as any)}
                      className={`p-3 rounded-xl text-xs font-extrabold border transition-all text-left ${
                        crowdStatus === lvl.id
                          ? 'bg-[#F7B52C] text-[#120A0C] border-[#F7B52C] shadow-md'
                          : 'bg-white/5 text-white/80 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div>{lvl.label}</div>
                      <div className="text-[10px] font-normal opacity-80 mt-0.5">{lvl.est}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slot Rules Info */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs text-white/80">
                <span className="font-bold text-[#F7B52C] flex items-center gap-1.5">
                  <Zap className="w-4 h-4" /> Capacity Cap Rule: Max 20 Orders Per 10-Min Window
                </span>
                <p>
                  When a slot reaches 20 orders, the app automatically flags it as <strong>🔴 Fully booked</strong> and directs students to the next break window.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 4: MENU & STOCK MANAGEMENT ===================== */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchMenuQuery}
                  onChange={(e) => setSearchMenuQuery(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-[#F7B52C]"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const updated = menuItems.map((m) => ({ ...m, isAvailable: true }));
                    setMenuItems(updated);
                    saveLocalMenu(updated);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#F7B52C]" />
                  <span>Mark All Available</span>
                </button>
              </div>
            </div>

            {/* Menu Items Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMenuItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-3 transition-all ${
                    !item.isAvailable ? 'opacity-60 bg-red-950/10' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <VegBadge isVeg={item.isVeg} size="sm" />
                      <div>
                        <h4 className="font-bold text-sm text-white">{item.name}</h4>
                        <span className="text-xs text-[#F7B52C] font-black">₹{item.price}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleItemAvailability(item.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all ${
                        item.isAvailable
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                      }`}
                    >
                      {item.isAvailable ? 'In Stock' : 'Sold Out'}
                    </button>
                  </div>

                  {/* Stock Counters */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-white/60">
                      Remaining: <strong className="text-white">{item.remainingStock ?? 25}</strong>
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => adjustStock(item.id, -5)}
                        className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                      >
                        -5
                      </button>
                      <button
                        onClick={() => adjustStock(item.id, 5)}
                        className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                      >
                        +5
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 5: ANALYTICS & INSIGHTS ===================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
                <span className="text-xs font-black uppercase text-[#F7B52C]">
                  Peak Demand Window
                </span>
                <div className="text-3xl font-black text-white">12:00 PM – 1:00 PM</div>
                <p className="text-xs text-white/60">
                  College Lunch Break Rush accounted for 64% of total orders today.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
                <span className="text-xs font-black uppercase text-[#F7B52C]">
                  #1 Campus Favorite
                </span>
                <div className="text-3xl font-black text-white">Chicken Dum Biryani</div>
                <p className="text-xs text-white/60">
                  92 plates served today • Avg wait time 0 min (pre-ordered).
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
                <span className="text-xs font-black uppercase text-[#F7B52C]">
                  Average Order Value
                </span>
                <div className="text-3xl font-black text-emerald-400">₹114.70</div>
                <p className="text-xs text-white/60">
                  Students predominantly order snack + beverage combos.
                </p>
              </div>

            </div>

            {/* Popular Items Ranked Table */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-base font-black text-white uppercase tracking-wider">
                Top Selling Food Items Today
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { name: 'Z Special Chicken Dum Biryani', count: 92, revenue: '₹11,040', rank: 1 },
                  { name: 'Crispy Punjabi Samosa (2 pcs)', count: 85, revenue: '₹1,275', rank: 2 },
                  { name: 'Fresh Chilled Watermelon Juice', count: 64, revenue: '₹2,560', rank: 3 },
                  { name: 'Cutting Masala Chai', count: 58, revenue: '₹870', rank: 4 },
                  { name: 'Paneer Cheese Grilled Sandwich', count: 38, revenue: '₹2,280', rank: 5 },
                ].map((item) => (
                  <div key={item.rank} className="p-3 rounded-xl bg-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#F7B52C]/20 text-[#F7B52C] font-black flex items-center justify-center text-xs">
                        {item.rank}
                      </span>
                      <span className="font-bold text-white text-sm">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-white/60">{item.count} orders</span>
                      <span className="font-bold text-emerald-400">{item.revenue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
