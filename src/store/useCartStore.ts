import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, MenuItem, StudentUser, PickupSlot } from '@/types';
import { PICKUP_SLOTS } from '@/data/menu';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  pickupSlot: string; // "11:20 AM – 11:30 AM"
  pickupSlotId: string;
  customerName: string;
  customerPhone: string;
  studentId: string;
  department: string;
  studentUser: StudentUser | null;
  couponCode: string;
  discount: number;
  crowdStatus: 'normal' | 'moderate' | 'high';
  activeItemForDetail: MenuItem | null;
  
  // Actions
  setIsOpen: (isOpen: boolean) => void;
  addItem: (item: MenuItem, selectedSize?: string, notes?: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  updateNotes: (id: string, notes: string) => void;
  clearCart: () => void;
  setPickupSlot: (slot: string, slotId?: string) => void;
  setCustomerInfo: (name: string, phone: string, studentId?: string, department?: string) => void;
  setStudentUser: (user: StudentUser | null) => void;
  setCrowdStatus: (status: 'normal' | 'moderate' | 'high') => void;
  setActiveItemForDetail: (item: MenuItem | null) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  
  // Computed helpers
  getSubtotal: () => number;
  getGst: () => number;
  getTotal: () => number;
  getTotalCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      pickupSlot: '11:20 AM – 11:30 AM',
      pickupSlotId: 'slot-1120',
      customerName: 'Paranitharan',
      customerPhone: '9876543210',
      studentId: 'RATH2024CS042',
      department: 'Computer Science (3rd Yr)',
      studentUser: {
        id: 'std-104',
        fullName: 'Paranitharan',
        collegeDepartment: 'Computer Science & Engg (3rd Yr)',
        studentId: 'RATH2024CS042',
        mobileNumber: '9876543210',
        email: 'parani.cs24@rathinam.ac.in',
      },
      couponCode: '',
      discount: 0,
      crowdStatus: 'normal',
      activeItemForDetail: null,

      setIsOpen: (isOpen) => set({ isOpen }),

      setActiveItemForDetail: (item) => set({ activeItemForDetail: item }),

      addItem: (item, selectedSize, notes = '') => {
        const sizeVariant = item.sizeVariants?.find(v => v.name === selectedSize);
        const price = sizeVariant ? sizeVariant.price : item.price;
        const cartId = selectedSize ? `${item.id}-${selectedSize}` : item.id;

        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.id === cartId);
          if (existingIndex > -1) {
            const newItems = [...state.items];
            newItems[existingIndex].quantity += 1;
            if (notes && !newItems[existingIndex].notes) {
              newItems[existingIndex].notes = notes;
            }
            return { items: newItems, isOpen: true };
          } else {
            const newItem: CartItem = {
              id: cartId,
              menuItemId: item.id,
              name: item.name,
              price,
              quantity: 1,
              selectedSize: selectedSize || (item.sizeVariants ? item.sizeVariants[0].name : undefined),
              notes,
              isVeg: item.isVeg,
              image: item.image,
            };
            return { items: [...state.items, newItem], isOpen: true };
          }
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, delta) => {
        set((state) => {
          const newItems = state.items
            .map((item) => {
              if (item.id === id) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter((item): item is CartItem => item !== null);
          return { items: newItems };
        });
      },

      updateNotes: (id, notes) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, notes } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], couponCode: '', discount: 0 });
      },

      setPickupSlot: (slot, slotId) => set({ 
        pickupSlot: slot,
        pickupSlotId: slotId || 'slot-1120'
      }),

      setCustomerInfo: (customerName, customerPhone, studentId, department) =>
        set((state) => ({ 
          customerName, 
          customerPhone,
          studentId: studentId || state.studentId,
          department: department || state.department
        })),

      setStudentUser: (user) => set({
        studentUser: user,
        customerName: user ? user.fullName : '',
        customerPhone: user ? user.mobileNumber : '',
        studentId: user ? user.studentId : '',
        department: user ? user.collegeDepartment : '',
      }),

      setCrowdStatus: (status) => set({ crowdStatus: status }),

      applyCoupon: (code: string) => {
        const clean = code.trim().toUpperCase();
        const subtotal = get().getSubtotal();
        if (clean === 'ZCAFE50' || clean === 'ZPUFF') {
          if (subtotal < 100) {
            return { success: false, message: 'Minimum ₹100 required for ZCAFE50' };
          }
          const discount = Math.min(50, Math.round(subtotal * 0.2));
          set({ couponCode: clean, discount });
          return { success: true, message: `Coupon ${clean} applied! You saved ₹${discount}` };
        } else if (clean === 'COLLEGE10' || clean === 'FIRST10') {
          const discount = Math.round(subtotal * 0.1);
          set({ couponCode: clean, discount });
          return { success: true, message: `Campus student 10% discount applied! You saved ₹${discount}` };
        } else {
          return { success: false, message: 'Invalid coupon. Try COLLEGE10 or ZCAFE50' };
        }
      },

      removeCoupon: () => set({ couponCode: '', discount: 0 }),

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      getGst: () => {
        const subtotal = get().getSubtotal();
        const discounted = Math.max(0, subtotal - get().discount);
        return Math.round(discounted * 0.05); // 5% GST
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().discount;
        const taxable = Math.max(0, subtotal - discount);
        const gst = Math.round(taxable * 0.05);
        return taxable + gst;
      },

      getTotalCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'zcafe-cart-storage-v2',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
      partialize: (state) => ({
        items: state.items,
        pickupSlot: state.pickupSlot,
        pickupSlotId: state.pickupSlotId,
        customerName: state.customerName,
        customerPhone: state.customerPhone,
        studentId: state.studentId,
        department: state.department,
        studentUser: state.studentUser,
        crowdStatus: state.crowdStatus,
      }),
    }
  )
);
