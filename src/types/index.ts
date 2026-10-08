export type ItemCategory = 
  | 'breakfast'
  | 'lunch'
  | 'evening-snacks'
  | 'juices-beverages'
  // Legacy aliases
  | 'snacks'
  | 'chicken-starters'
  | 'rice-biryani'
  | 'noodles'
  | 'fresh-juices'
  | 'tea-coffee';

export interface SizeVariant {
  name: string; // e.g. 'Half', 'Full', 'Regular', 'Large'
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: ItemCategory;
  description: string;
  price: number; // Base price
  sizeVariants?: SizeVariant[];
  isVeg: boolean;
  image: string;
  isBestseller?: boolean;
  isAvailable: boolean;
  prepTimeMinutes: number; // For scheduling slots
  prepTimeRange?: string; // e.g. "10–15 min"
  ingredients?: string[];
  dailyStock?: number;
  remainingStock?: number;
  tag?: string; // e.g. "Hot Seller", "Campus Favorite"
  modelType?: 'biryani' | 'juice' | 'samosa' | 'sandwich' | 'coffee' | 'noodles';
}

export interface CartItem {
  id: string; // Composite ID: itemId + (variant ? `-${variant}` : '')
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  notes?: string;
  isVeg: boolean;
  image: string;
}

export type OrderStatus = 'received' | 'accepted' | 'preparing' | 'ready' | 'collected' | 'cancelled';

export interface OrderItem {
  menuItemId: string;
  name: string;
  size?: string;
  price: number;
  quantity: number;
  notes?: string;
  isVeg: boolean;
}

export interface OrderTimelineStep {
  label: string;
  timestamp?: number;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  token: string; // e.g. "104" or "ZC-20261008-104"
  tokenNumber: number; // 104
  customerName: string;
  customerPhone: string;
  studentId?: string;
  department?: string;
  items: OrderItem[];
  subtotal: number;
  gst: number; // 5%
  discount: number;
  total: number;
  status: OrderStatus;
  pickupSlot: string; // e.g. "12:20 PM – 12:30 PM"
  pickupDate: string; // e.g. "08 October 2026"
  paymentId?: string;
  razorpayOrderId?: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod?: 'UPI' | 'Card' | 'NetBanking' | 'CashAtCounter';
  createdAt: number;
  updatedAt: number;
  collectedAt?: number;
  isQrUsed?: boolean;
  estimatedReadyTime?: number;
  whatsappSent?: boolean;
}

export interface PickupSlot {
  id: string;
  label: string; // "11:30 AM – 11:40 AM"
  start: string;
  end: string;
  capacity: number; // e.g. 20
  booked: number;
  status: 'available' | 'moderate' | 'full';
  breakTag?: string; // e.g. "Morning Break", "Lunch Break"
}

export interface StudentUser {
  id: string;
  fullName: string;
  collegeDepartment: string;
  studentId: string;
  mobileNumber: string;
  email: string;
}

export interface DailySalesSummary {
  totalOrders: number;
  totalRevenue: number;
  topItems: { name: string; count: number; revenue: number }[];
  activeOrdersCount: number;
  completedOrdersCount: number;
  pendingOrdersCount: number;
}
