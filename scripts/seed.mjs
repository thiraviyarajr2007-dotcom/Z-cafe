/**
 * Z CAFÉ - Firestore Menu Seed Script
 * Run with: node scripts/seed.mjs
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// All 35+ Authentic Indian Menu Items
const MENU_ITEMS = [
  // Snacks
  { id: 'samosa', name: 'Crispy Samosa', category: 'snacks', price: 15, isVeg: true, isAvailable: true, prepTimeMinutes: 5, dailyStock: 50, remainingStock: 50, tag: 'All-Time Favorite' },
  { id: 'veg-puff', name: 'Veg Puff', category: 'snacks', price: 20, isVeg: true, isAvailable: true, prepTimeMinutes: 5, dailyStock: 40, remainingStock: 40, tag: 'Little Joy in Every Puff' },
  { id: 'egg-puff', name: 'Egg Puff', category: 'snacks', price: 25, isVeg: false, isAvailable: true, prepTimeMinutes: 5, dailyStock: 40, remainingStock: 40, tag: 'Hot Seller' },
  { id: 'paneer-puff', name: 'Paneer Puff', category: 'snacks', price: 30, isVeg: true, isAvailable: true, prepTimeMinutes: 5, dailyStock: 30, remainingStock: 30 },
  { id: 'chicken-puff', name: 'Chicken Puff', category: 'snacks', price: 35, isVeg: false, isAvailable: true, prepTimeMinutes: 5, dailyStock: 45, remainingStock: 45, tag: 'Chef Choice' },
  { id: 'onion-bajji', name: 'Onion Bajji (4 pcs)', category: 'snacks', price: 20, isVeg: true, isAvailable: true, prepTimeMinutes: 8, dailyStock: 35, remainingStock: 35 },
  { id: 'banana-bajji', name: 'Raw Banana Bajji (3 pcs)', category: 'snacks', price: 20, isVeg: true, isAvailable: true, prepTimeMinutes: 8, dailyStock: 30, remainingStock: 30 },
  { id: 'medu-vada', name: 'Medu Vada (2 pcs)', category: 'snacks', price: 15, isVeg: true, isAvailable: true, prepTimeMinutes: 6, dailyStock: 40, remainingStock: 40 },
  { id: 'masala-vada', name: 'Crunchy Masala Vada (2 pcs)', category: 'snacks', price: 15, isVeg: true, isAvailable: true, prepTimeMinutes: 6, dailyStock: 35, remainingStock: 35 },
  { id: 'veg-cutlet', name: 'Veg Cutlet (2 pcs)', category: 'snacks', price: 25, isVeg: true, isAvailable: true, prepTimeMinutes: 8, dailyStock: 25, remainingStock: 25 },

  // Chicken & Starters
  { 
    id: 'chicken-65', 
    name: 'Z Special Chicken 65', 
    category: 'chicken-starters', 
    price: 60, 
    sizeVariants: [{ name: 'Half Plate', price: 60 }, { name: 'Full Plate', price: 90 }],
    isVeg: false, 
    isAvailable: true, 
    prepTimeMinutes: 12, 
    dailyStock: 45, 
    remainingStock: 45,
    tag: 'Crowd Favorite'
  },
  { id: 'chicken-lollipop', name: 'Chicken Lollipop (4 pcs)', category: 'chicken-starters', price: 100, isVeg: false, isAvailable: true, prepTimeMinutes: 15, dailyStock: 30, remainingStock: 30 },
  { id: 'gobi-65', name: 'Crispy Gobi 65', category: 'chicken-starters', price: 70, isVeg: true, isAvailable: true, prepTimeMinutes: 10, dailyStock: 35, remainingStock: 35 },
  { id: 'paneer-65', name: 'Spicy Paneer 65', category: 'chicken-starters', price: 90, isVeg: true, isAvailable: true, prepTimeMinutes: 10, dailyStock: 25, remainingStock: 25 },
  { id: 'chicken-pakoda', name: 'Chicken Pakoda', category: 'chicken-starters', price: 80, isVeg: false, isAvailable: true, prepTimeMinutes: 12, dailyStock: 30, remainingStock: 30 },

  // Rice & Biryani
  { 
    id: 'chicken-biryani', 
    name: 'Hyderabadi Chicken Biryani', 
    category: 'rice-biryani', 
    price: 120, 
    sizeVariants: [{ name: 'Regular', price: 120 }, { name: 'Special Double Meat', price: 170 }],
    isVeg: false, 
    isAvailable: true, 
    prepTimeMinutes: 10, 
    dailyStock: 40, 
    remainingStock: 40,
    tag: 'Bestseller'
  },
  { id: 'mutton-biryani', name: 'Z Royal Mutton Biryani', category: 'rice-biryani', price: 180, isVeg: false, isAvailable: true, prepTimeMinutes: 10, dailyStock: 20, remainingStock: 20, tag: 'Weekend Special' },
  { id: 'egg-biryani', name: 'Spiced Egg Biryani', category: 'rice-biryani', price: 90, isVeg: false, isAvailable: true, prepTimeMinutes: 8, dailyStock: 30, remainingStock: 30 },
  { id: 'veg-biryani', name: 'Dum Veg Biryani', category: 'rice-biryani', price: 80, isVeg: true, isAvailable: true, prepTimeMinutes: 8, dailyStock: 25, remainingStock: 25 },
  { id: 'chicken-fried-rice', name: 'Indian Fast Food Chicken Fried Rice', category: 'rice-biryani', price: 90, isVeg: false, isAvailable: true, prepTimeMinutes: 12, dailyStock: 35, remainingStock: 35 },
  { id: 'egg-fried-rice', name: 'Egg Fried Rice', category: 'rice-biryani', price: 80, isVeg: false, isAvailable: true, prepTimeMinutes: 10, dailyStock: 30, remainingStock: 30 },
  { id: 'veg-fried-rice', name: 'Veg Fried Rice', category: 'rice-biryani', price: 70, isVeg: true, isAvailable: true, prepTimeMinutes: 10, dailyStock: 30, remainingStock: 30 },

  // Noodles
  { id: 'veg-noodles', name: 'Desi Veg Hakka Noodles', category: 'noodles', price: 70, isVeg: true, isAvailable: true, prepTimeMinutes: 10, dailyStock: 30, remainingStock: 30 },
  { id: 'egg-noodles', name: 'Egg Noodles', category: 'noodles', price: 80, isVeg: false, isAvailable: true, prepTimeMinutes: 10, dailyStock: 30, remainingStock: 30 },
  { id: 'chicken-noodles', name: 'Spicy Chicken Noodles', category: 'noodles', price: 90, isVeg: false, isAvailable: true, prepTimeMinutes: 12, dailyStock: 35, remainingStock: 35, tag: 'Spicy Delight' },

  // Fresh Juices
  { id: 'orange-juice', name: 'Fresh Orange Juice', category: 'fresh-juices', price: 50, isVeg: true, isAvailable: true, prepTimeMinutes: 5, dailyStock: 40, remainingStock: 40 },
  { id: 'mosambi-juice', name: 'Mosambi (Sweet Lime) Juice', category: 'fresh-juices', price: 50, isVeg: true, isAvailable: true, prepTimeMinutes: 5, dailyStock: 35, remainingStock: 35 },
  { id: 'watermelon-juice', name: 'Chilled Watermelon Juice', category: 'fresh-juices', price: 40, isVeg: true, isAvailable: true, prepTimeMinutes: 4, dailyStock: 50, remainingStock: 50, tag: 'Cooler' },
  { id: 'pineapple-juice', name: 'Fresh Pineapple Juice', category: 'fresh-juices', price: 50, isVeg: true, isAvailable: true, prepTimeMinutes: 5, dailyStock: 30, remainingStock: 30 },
  { id: 'sugarcane-juice', name: 'Fresh Sugarcane Juice', category: 'fresh-juices', price: 35, isVeg: true, isAvailable: true, prepTimeMinutes: 4, dailyStock: 45, remainingStock: 45, tag: 'Customer Love' },
  { id: 'grape-juice', name: 'Black Grape Pulpy Juice', category: 'fresh-juices', price: 50, isVeg: true, isAvailable: true, prepTimeMinutes: 5, dailyStock: 30, remainingStock: 30 },
  { id: 'mixed-fruit-juice', name: 'Special Mixed Fruit Juice', category: 'fresh-juices', price: 60, isVeg: true, isAvailable: true, prepTimeMinutes: 6, dailyStock: 25, remainingStock: 25 },
  { id: 'lemon-mint-cooler', name: 'Lemon Mint Cooler', category: 'fresh-juices', price: 35, isVeg: true, isAvailable: true, prepTimeMinutes: 3, dailyStock: 60, remainingStock: 60, tag: 'Beat The Heat' },

  // Tea & Coffee
  { id: 'masala-tea', name: 'Authentic Masala Chai', category: 'tea-coffee', price: 15, isVeg: true, isAvailable: true, prepTimeMinutes: 3, dailyStock: 100, remainingStock: 100, tag: 'Always Steaming' },
  { id: 'ginger-tea', name: 'Kadak Inji (Ginger) Tea', category: 'tea-coffee', price: 15, isVeg: true, isAvailable: true, prepTimeMinutes: 3, dailyStock: 90, remainingStock: 90 },
  { id: 'filter-coffee', name: 'South Indian Filter Coffee', category: 'tea-coffee', price: 20, isVeg: true, isAvailable: true, prepTimeMinutes: 3, dailyStock: 100, remainingStock: 100, tag: 'Signature' },
  { id: 'hot-coffee', name: 'Creamy Hot Coffee', category: 'tea-coffee', price: 20, isVeg: true, isAvailable: true, prepTimeMinutes: 3, dailyStock: 80, remainingStock: 80 },
  { 
    id: 'badam-milk', 
    name: 'Kesar Badam Milk (Hot / Chilled)', 
    category: 'tea-coffee', 
    price: 35, 
    sizeVariants: [{ name: 'Hot Badam Milk', price: 35 }, { name: 'Chilled Badam Milk', price: 40 }],
    isVeg: true, 
    isAvailable: true, 
    prepTimeMinutes: 4, 
    dailyStock: 40, 
    remainingStock: 40,
    tag: 'Royal Treat'
  }
];

async function seed() {
  const serviceAccountPath = join(__dirname, '../serviceAccountKey.json');
  
  if (!existsSync(serviceAccountPath)) {
    console.log('ℹ️  No serviceAccountKey.json found.');
    console.log('💡 Note: The application automatically loads and serves the complete 35-item menu locally & via fallback storage.');
    console.log('👉 To seed a live Firebase project, download your service account key to "serviceAccountKey.json" and re-run.');
    return;
  }

  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
  initializeApp({
    credential: cert(serviceAccount)
  });

  const db = getFirestore();
  console.log(`🚀 Seeding ${MENU_ITEMS.length} authentic Indian items to Firestore collection "menu"...`);

  const batch = db.batch();
  for (const item of MENU_ITEMS) {
    const docRef = db.collection('menu').doc(item.id);
    batch.set(docRef, item, { merge: true });
  }

  await batch.commit();
  console.log('✅ Successfully seeded Z CAFÉ menu to Firestore!');
}

seed().catch(console.error);
