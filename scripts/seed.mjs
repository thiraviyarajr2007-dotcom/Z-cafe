/**
 * Z CAFÉ - Firestore Menu Seed Script
 * Run with: npm run seed or node scripts/seed.mjs
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// All 38 Authentic Indian Menu Items with Tamil names and /menu/{id}.webp image paths
const MENU_ITEMS = [
  // 1. Snacks (10 items)
  { id: 'samosa', name: 'Crispy Samosa', tamilName: 'மசால் சமோசா', category: 'snacks', price: 15, isVeg: true, image: '/menu/samosa.webp', isAvailable: true, prepTimeMinutes: 5, dailyStock: 120, remainingStock: 120, tag: 'Bestseller' },
  { id: 'veg-puff', name: 'Veg Puff', tamilName: 'வெஜ் பஃப்', category: 'snacks', price: 20, isVeg: true, image: '/menu/veg-puff.webp', isAvailable: true, prepTimeMinutes: 5, dailyStock: 100, remainingStock: 100, tag: 'Fresh from Oven' },
  { id: 'egg-puff', name: 'Egg Puff', tamilName: 'முட்டை பஃப்', category: 'snacks', price: 25, isVeg: false, image: '/menu/egg-puff.webp', isAvailable: true, prepTimeMinutes: 5, dailyStock: 90, remainingStock: 90, tag: 'Campus Favorite' },
  { id: 'paneer-puff', name: 'Paneer Puff', tamilName: 'பனீர் பஃப்', category: 'snacks', price: 30, isVeg: true, image: '/menu/paneer-puff.webp', isAvailable: true, prepTimeMinutes: 5, dailyStock: 60, remainingStock: 60 },
  { id: 'chicken-puff', name: 'Chicken Puff', tamilName: 'சிக்கன் பஃப்', category: 'snacks', price: 35, isVeg: false, image: '/menu/chicken-puff.webp', isAvailable: true, prepTimeMinutes: 5, dailyStock: 80, remainingStock: 80, tag: 'Bestseller' },
  { id: 'onion-bajji', name: 'Crispy Onion Bajji', tamilName: 'வெங்காய பஜ்ஜி', category: 'snacks', price: 20, isVeg: true, image: '/menu/onion-bajji.webp', isAvailable: true, prepTimeMinutes: 8, dailyStock: 70, remainingStock: 70 },
  { id: 'banana-bajji', name: 'Raw Banana Bajji', tamilName: 'வாழைக்காய் பஜ்ஜி', category: 'snacks', price: 20, isVeg: true, image: '/menu/banana-bajji.webp', isAvailable: true, prepTimeMinutes: 8, dailyStock: 60, remainingStock: 60 },
  { id: 'medu-vada', name: 'Medu Vada (2 pcs)', tamilName: 'மெது வடை', category: 'snacks', price: 15, isVeg: true, image: '/menu/medu-vada.webp', isAvailable: true, prepTimeMinutes: 6, dailyStock: 80, remainingStock: 80 },
  { id: 'masala-vada', name: 'Crunchy Masala Vada', tamilName: 'மசால் வடை', category: 'snacks', price: 15, isVeg: true, image: '/menu/masala-vada.webp', isAvailable: true, prepTimeMinutes: 6, dailyStock: 75, remainingStock: 75 },
  { id: 'veg-cutlet', name: 'Golden Veg Cutlet', tamilName: 'வெஜ் கட்லெட்', category: 'snacks', price: 25, isVeg: true, image: '/menu/veg-cutlet.webp', isAvailable: true, prepTimeMinutes: 7, dailyStock: 50, remainingStock: 50 },

  // 2. Chicken & Starters (5 items)
  { 
    id: 'chicken-65', 
    name: 'Fiery Chicken 65', 
    tamilName: 'சிக்கன் 65', 
    category: 'chicken-starters', 
    price: 60, 
    sizeVariants: [{ name: 'Half Plate', price: 60 }, { name: 'Full Plate', price: 90 }],
    isVeg: false, 
    image: '/menu/chicken-65.webp',
    isAvailable: true, 
    prepTimeMinutes: 10, 
    dailyStock: 100, 
    remainingStock: 100, 
    tag: 'Spicy Signature' 
  },
  { id: 'chicken-lollipop', name: 'Chicken Lollipop (4 pcs)', tamilName: 'சிக்கன் லாலிபாப்', category: 'chicken-starters', price: 100, isVeg: false, image: '/menu/chicken-lollipop.webp', isAvailable: true, prepTimeMinutes: 12, dailyStock: 60, remainingStock: 60, tag: 'Bestseller' },
  { id: 'gobi-65', name: 'Crispy Gobi 65', tamilName: 'கோபி 65', category: 'chicken-starters', price: 70, isVeg: true, image: '/menu/gobi-65.webp', isAvailable: true, prepTimeMinutes: 9, dailyStock: 50, remainingStock: 50 },
  { id: 'paneer-65', name: 'Spicy Paneer 65', tamilName: 'பனீர் 65', category: 'chicken-starters', price: 90, isVeg: true, image: '/menu/paneer-65.webp', isAvailable: true, prepTimeMinutes: 10, dailyStock: 45, remainingStock: 45 },
  { id: 'chicken-pakoda', name: 'Street-Style Chicken Pakoda', tamilName: 'சிக்கன் பகோடா', category: 'chicken-starters', price: 80, isVeg: false, image: '/menu/chicken-pakoda.webp', isAvailable: true, prepTimeMinutes: 10, dailyStock: 55, remainingStock: 55 },

  // 3. Rice & Biryani (7 items)
  { id: 'chicken-biryani', name: 'Z Special Chicken Dum Biryani', tamilName: 'சிக்கன் பிரியாணி', category: 'rice-biryani', price: 120, isVeg: false, image: '/menu/chicken-biryani.webp', isAvailable: true, prepTimeMinutes: 8, dailyStock: 120, remainingStock: 120, tag: 'House Pride #1' },
  { id: 'mutton-biryani', name: 'Royal Mutton Biryani', tamilName: 'மட்டன் பிரியாணி', category: 'rice-biryani', price: 180, isVeg: false, image: '/menu/mutton-biryani.webp', isAvailable: true, prepTimeMinutes: 10, dailyStock: 45, remainingStock: 45, tag: 'Weekend Special' },
  { id: 'egg-biryani', name: 'Spiced Egg Biryani', tamilName: 'முட்டை பிரியாணி', category: 'rice-biryani', price: 90, isVeg: false, image: '/menu/egg-biryani.webp', isAvailable: true, prepTimeMinutes: 7, dailyStock: 60, remainingStock: 60 },
  { id: 'veg-biryani', name: 'Hyderabadi Veg Biryani', tamilName: 'வெஜ் பிரியாணி', category: 'rice-biryani', price: 80, isVeg: true, image: '/menu/veg-biryani.webp', isAvailable: true, prepTimeMinutes: 7, dailyStock: 50, remainingStock: 50 },
  { id: 'chicken-fried-rice', name: 'Chicken Fried Rice', tamilName: 'சிக்கன் ஃப்ரைட் ரைஸ்', category: 'rice-biryani', price: 90, isVeg: false, image: '/menu/chicken-fried-rice.webp', isAvailable: true, prepTimeMinutes: 10, dailyStock: 70, remainingStock: 70, tag: 'Wok Tossed' },
  { id: 'egg-fried-rice', name: 'Egg Fried Rice', tamilName: 'முட்டை ஃப்ரைட் ரைஸ்', category: 'rice-biryani', price: 80, isVeg: false, image: '/menu/egg-fried-rice.webp', isAvailable: true, prepTimeMinutes: 8, dailyStock: 65, remainingStock: 65 },
  { id: 'veg-fried-rice', name: 'Classic Veg Fried Rice', tamilName: 'வெஜ் ஃப்ரைட் ரைஸ்', category: 'rice-biryani', price: 70, isVeg: true, image: '/menu/veg-fried-rice.webp', isAvailable: true, prepTimeMinutes: 8, dailyStock: 60, remainingStock: 60 },

  // 4. Noodles (3 items)
  { id: 'veg-noodles', name: 'Street Style Veg Noodles', tamilName: 'வெஜ் நூடுல்ஸ்', category: 'noodles', price: 70, isVeg: true, image: '/menu/veg-noodles.webp', isAvailable: true, prepTimeMinutes: 8, dailyStock: 60, remainingStock: 60 },
  { id: 'egg-noodles', name: 'Egg Hakka Noodles', tamilName: 'முட்டை நூடுல்ஸ்', category: 'noodles', price: 80, isVeg: false, image: '/menu/egg-noodles.webp', isAvailable: true, prepTimeMinutes: 9, dailyStock: 55, remainingStock: 55 },
  { id: 'chicken-noodles', name: 'Spicy Chicken Noodles', tamilName: 'சிக்கன் நூடுல்ஸ்', category: 'noodles', price: 90, isVeg: false, image: '/menu/chicken-noodles.webp', isAvailable: true, prepTimeMinutes: 10, dailyStock: 70, remainingStock: 70, tag: 'Campus Favorite' },

  // 5. Fresh Juices (8 items)
  { id: 'orange-juice', name: 'Fresh Orange Juice', tamilName: 'ஆரஞ்சு ஜூஸ்', category: 'fresh-juices', price: 50, isVeg: true, image: '/menu/orange-juice.webp', isAvailable: true, prepTimeMinutes: 4, dailyStock: 80, remainingStock: 80 },
  { id: 'mosambi-juice', name: 'Sweet Lime (Mosambi) Juice', tamilName: 'சாத்துக்குடி ஜூஸ்', category: 'fresh-juices', price: 50, isVeg: true, image: '/menu/mosambi-juice.webp', isAvailable: true, prepTimeMinutes: 4, dailyStock: 90, remainingStock: 90, tag: 'Top Refreshment' },
  { id: 'watermelon-juice', name: 'Chilled Watermelon Juice', tamilName: 'தர்பூசணி ஜூஸ்', category: 'fresh-juices', price: 40, isVeg: true, image: '/menu/watermelon-juice.webp', isAvailable: true, prepTimeMinutes: 4, dailyStock: 100, remainingStock: 100, tag: 'Summer Cooler' },
  { id: 'pineapple-juice', name: 'Fresh Pineapple Juice', tamilName: 'அன்னாசி ஜூஸ்', category: 'fresh-juices', price: 40, isVeg: true, image: '/menu/pineapple-juice.webp', isAvailable: true, prepTimeMinutes: 4, dailyStock: 70, remainingStock: 70 },
  { id: 'sugarcane-juice', name: 'Fresh Sugarcane Juice', tamilName: 'கரும்பு சாறு', category: 'fresh-juices', price: 35, isVeg: true, image: '/menu/sugarcane-juice.webp', isAvailable: true, prepTimeMinutes: 3, dailyStock: 120, remainingStock: 120, tag: 'Natural Energy' },
  { id: 'grape-juice', name: 'Rich Black Grape Juice', tamilName: 'கருப்பு திராட்சை ஜூஸ்', category: 'fresh-juices', price: 50, isVeg: true, image: '/menu/grape-juice.webp', isAvailable: true, prepTimeMinutes: 4, dailyStock: 60, remainingStock: 60 },
  { id: 'mixed-fruit-juice', name: 'Special Mixed Fruit Juice', tamilName: 'மிக்ஸ்ட் ஃப்ரூட் ஜூஸ்', category: 'fresh-juices', price: 60, isVeg: true, image: '/menu/mixed-fruit-juice.webp', isAvailable: true, prepTimeMinutes: 5, dailyStock: 50, remainingStock: 50 },
  { id: 'lemon-mint-cooler', name: 'Lemon Mint Cooler', tamilName: 'லெமன் புதினா கூலர்', category: 'fresh-juices', price: 35, isVeg: true, image: '/menu/lemon-mint-cooler.webp', isAvailable: true, prepTimeMinutes: 3, dailyStock: 90, remainingStock: 90 },

  // 6. Tea & Coffee (5 items)
  { id: 'masala-tea', name: 'Kadak Masala Chai', tamilName: 'மசாலா டீ', category: 'tea-coffee', price: 15, isVeg: true, image: '/menu/masala-tea.webp', isAvailable: true, prepTimeMinutes: 4, dailyStock: 150, remainingStock: 150, tag: 'Bestseller' },
  { id: 'ginger-tea', name: 'Fresh Ginger Tea (Inji Chai)', tamilName: 'இஞ்சி டீ', category: 'tea-coffee', price: 15, isVeg: true, image: '/menu/ginger-tea.webp', isAvailable: true, prepTimeMinutes: 4, dailyStock: 130, remainingStock: 130 },
  { id: 'filter-coffee', name: 'Degree Filter Coffee', tamilName: 'ஃபில்டர் காபி', category: 'tea-coffee', price: 20, isVeg: true, image: '/menu/filter-coffee.webp', isAvailable: true, prepTimeMinutes: 4, dailyStock: 140, remainingStock: 140, tag: 'Authentic South' },
  { id: 'hot-coffee', name: 'Classic Hot Coffee', tamilName: 'சூடான காபி', category: 'tea-coffee', price: 20, isVeg: true, image: '/menu/hot-coffee.webp', isAvailable: true, prepTimeMinutes: 3, dailyStock: 80, remainingStock: 80 },
  { id: 'badam-milk', name: 'Royal Saffron Badam Milk', tamilName: 'பாதாம் பால்', category: 'tea-coffee', price: 35, isVeg: true, image: '/menu/badam-milk.webp', isAvailable: true, prepTimeMinutes: 4, dailyStock: 60, remainingStock: 60, tag: 'Chef Special' }
];

async function seed() {
  const serviceAccountPath = join(__dirname, '../serviceAccountKey.json');
  
  if (!existsSync(serviceAccountPath)) {
    console.log('ℹ️  No serviceAccountKey.json found.');
    console.log(`💡 The application automatically loads and serves all ${MENU_ITEMS.length} authentic Indian items directly from src/data/menu.ts!`);
    console.log('👉 To sync with Firestore, place serviceAccountKey.json in the project root and run "npm run seed".');
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
  console.log(`✅ Successfully seeded all ${MENU_ITEMS.length} items to Z CAFÉ Firestore collection!`);
}

seed().catch(console.error);
