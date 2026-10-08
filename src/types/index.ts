export type ItemCategory = 
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
  dailyStock?: number; // Optional stock cap
  remainingStock?: number;
  tag?: string; // e.g. "Chef Special", "Spicy"
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

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'collected' | 'cancelled';

export interface OrderItem {
  menuItemId: string;
  name: string;
  size?: string;
  price: number;
  quantity: number;
  notes?: string;
  isVeg: boolean;
}

export interface Order {
  id: string;
  token: string; // e.g. "Z-0247"
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  gst: number; // 5%
  discount: number;
  total: number;
  status: OrderStatus;
  pickupSlot: string; // e.g. "ASAP (15 mins)", "12:45 PM"
  paymentId?: string;
  razorpayOrderId?: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: number;
  updatedAt: number;
  estimatedReadyTime?: number;
}

export interface DailySalesSummary {
  totalOrders: number;
  totalRevenue: number;
  topItems: { name: string; count: number; revenue: number }[];
  activeOrdersCount: number;
}
