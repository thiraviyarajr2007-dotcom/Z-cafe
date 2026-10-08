/**
 * Z CAFÉ - Menu Images Downloader & Asset Generator
 * Downloads high quality, appetizing authentic food photography for all 38 menu items
 * and saves them into public/menu/[id].webp.
 * 
 * Run with: npm run images or node scripts/generate-images.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_MENU_DIR = path.join(__dirname, '../public/menu');

if (!fs.existsSync(PUBLIC_MENU_DIR)) {
  fs.mkdirSync(PUBLIC_MENU_DIR, { recursive: true });
}

export const DISH_IMAGE_MAP = {
  // 1. Snacks & Puffs
  'samosa': 'photo-1601050690597-df0568f70950',
  'veg-puff': 'photo-1509440159596-0249088772ff',
  'egg-puff': 'photo-1598373182133-52452f7691ef',
  'paneer-puff': 'photo-1608198093002-ad4e005484ec',
  'chicken-puff': 'photo-1589301760014-d929f3979dbc',
  'onion-bajji': 'photo-1606491956689-2ea866880c84',
  'banana-bajji': 'photo-1565557623262-b51c2513a641',
  'medu-vada': 'photo-1626777552726-4a6b54c97e46',
  'masala-vada': 'photo-1546833999-b9f581a1996d',
  'veg-cutlet': 'photo-1568901346375-23c9450c58cd',

  // 2. Chicken & Starters
  'chicken-65': 'photo-1610057099443-fde8c4d50f91',
  'chicken-lollipop': 'photo-1562967914-608f82629710',
  'gobi-65': 'photo-1567337710282-00832b415979',
  'paneer-65': 'photo-1631452180519-c014fe946bc7',
  'chicken-pakoda': 'photo-1626777552726-4a6b54c97e46',

  // 3. Rice & Biryani
  'chicken-biryani': 'photo-1563379091339-03b21ab4a4f8',
  'mutton-biryani': 'photo-1589302168068-964664d93dc0',
  'egg-biryani': 'photo-1633945274405-b6c8069047b0',
  'veg-biryani': 'photo-1645177628172-a94c1f96e6db',
  'chicken-fried-rice': 'photo-1603133872878-684f208fb84b',
  'egg-fried-rice': 'photo-1512058564366-18510be2db19',
  'veg-fried-rice': 'photo-1596797038530-2c107229654b',

  // 4. Wok Noodles
  'veg-noodles': 'photo-1585032226651-759b368d7246',
  'egg-noodles': 'photo-1612927601601-6638404737ce',
  'chicken-noodles': 'photo-1569718212165-3a8278d5f624',

  // 5. Fresh Juices
  'orange-juice': 'photo-1613478223719-2ab802602423',
  'mosambi-juice': 'photo-1621506289937-a8e4df240d0b',
  'watermelon-juice': 'photo-1589733955941-5eeaf752f6dd',
  'pineapple-juice': 'photo-1550258987-190a2d41a8ba',
  'sugarcane-juice': 'photo-1556881286-fc6915169721',
  'grape-juice': 'photo-1558818498-28c1e002b655',
  'mixed-fruit-juice': 'photo-1546173159-315724a31696',
  'lemon-mint-cooler': 'photo-1513558161293-cdaf765ed2fd',

  // 6. Tea & Coffee
  'masala-tea': 'photo-1576092768241-dec231879fc3',
  'ginger-tea': 'photo-1544787219-7f47ccb76574',
  'filter-coffee': 'photo-1514432324607-a09d9b4aefdd',
  'hot-coffee': 'photo-1509042239860-f550ce710b93',
  'badam-milk': 'photo-1572490122747-3968b75cc699'
};

async function downloadDishImages() {
  console.log('🍽️ Starting download of authentic dishes images to public/menu/ ...');
  const entries = Object.entries(DISH_IMAGE_MAP);
  let successCount = 0;

  for (const [id, photoId] of entries) {
    const destPath = path.join(PUBLIC_MENU_DIR, `${id}.webp`);
    const imageUrl = `https://images.unsplash.com/${photoId}?w=700&auto=format&fit=crop&q=80`;

    try {
      const res = await fetch(imageUrl);
      if (!res.ok) {
        console.error(`❌ Failed to fetch ${id}: ${res.statusText}`);
        continue;
      }
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(destPath, buffer);
      successCount++;
      console.log(`✅ [${successCount}/${entries.length}] Saved ${id}.webp (${Math.round(buffer.length / 1024)} KB)`);
    } catch (err) {
      console.error(`❌ Error downloading ${id}:`, err.message);
    }
  }

  console.log(`\n🎉 Completed! Successfully saved ${successCount}/${entries.length} dish images to public/menu/`);
}

downloadDishImages();
