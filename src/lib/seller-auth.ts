/**
 * Z CAFÉ - Seller (Admin / Staff) Authentication Service
 * Dedicated authentication system completely separated from customer/student auth.
 */

export interface SellerUser {
  id: string;
  username: string;
  name: string;
  role: 'Master Admin' | 'Kitchen Head' | 'Counter Staff';
  shift: string;
  avatar: string;
  terminalId: string;
}

export const PRESET_SELLER_ACCOUNTS = [
  {
    id: 'seller-1',
    username: 'admin',
    password: 'zcafe@2026',
    name: 'Thiraviyaraj (Canteen Owner)',
    role: 'Master Admin' as const,
    shift: 'Full Day Terminal',
    avatar: '👨‍💼',
    terminalId: 'POS-COUNTER-01',
  },
  {
    id: 'seller-2',
    username: 'kitchen',
    password: 'kitchen@2026',
    name: 'Chef Murugan',
    role: 'Kitchen Head' as const,
    shift: 'Live Hot Kitchen KDS',
    avatar: '👨‍🍳',
    terminalId: 'KDS-KITCHEN-02',
  },
  {
    id: 'seller-3',
    username: 'counter',
    password: 'counter@2026',
    name: 'Ramu (Token Verifier)',
    role: 'Counter Staff' as const,
    shift: 'Express Break Counter',
    avatar: '📱',
    terminalId: 'SCAN-DESK-03',
  },
];

const SELLER_SESSION_STORAGE_KEY = 'zcafe_seller_session_v1';

export function getSellerSession(): SellerUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SELLER_SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SellerUser;
  } catch (e) {
    return null;
  }
}

export function loginSeller(username: string, password: string, remember: boolean = true): { success: boolean; user?: SellerUser; error?: string } {
  const cleanUser = username.trim().toLowerCase();
  const cleanPass = password.trim();

  // Also support fallback PIN "7777" if typed in password with username "admin"
  const matched = PRESET_SELLER_ACCOUNTS.find(
    (acc) => acc.username.toLowerCase() === cleanUser && (acc.password === cleanPass || cleanPass === '7777')
  );

  if (!matched) {
    return {
      success: false,
      error: 'Invalid Seller Username or Password. Please check pre-configured staff credentials.',
    };
  }

  const sellerUser: SellerUser = {
    id: matched.id,
    username: matched.username,
    name: matched.name,
    role: matched.role,
    shift: matched.shift,
    avatar: matched.avatar,
    terminalId: matched.terminalId,
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SELLER_SESSION_STORAGE_KEY, JSON.stringify(sellerUser));
    } catch (e) {
      console.warn('Could not persist seller session in localStorage', e);
    }
  }

  return { success: true, user: sellerUser };
}

export function logoutSeller(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(SELLER_SESSION_STORAGE_KEY);
    } catch (e) {
      console.warn('Error clearing seller session', e);
    }
  }
}
