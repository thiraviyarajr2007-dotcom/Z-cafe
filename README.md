# ☕ Z CAFÉ — Official Web Pre-Order & Kitchen System

> *"Little Joy in Every Puff." • "Perfect For A Quick Snack."*

An authentic, production-grade web application and pre-order management system built for **Z CAFÉ** — an Indian food-court cafe and kiosk. Designed specifically to match the shop's real-world aesthetic: deep burgundy signboard hues, warm counter amber LED strips, vertical fluted wood cladding, swaying green vines, and a flickering neon *"Tea • Coffee • Available"* sign.

---

## 🌟 Key Features

### 1. 🛍️ Customer Pre-Order Experience
- **100% Authentic Indian Menu**: Samosas, egg/chicken/paneer puffs, bajjis, vadas, Chicken 65, chicken lollipop, dum biryanis, Hakka noodles, fresh fruit coolers, and South Indian filter coffee. **Zero Western items** (no burgers, no pizza, no fries).
- **Portion & Size Variants**: Half plate vs. Full plate selector for Chicken 65 and biryani with instant dynamic pricing.
- **Stock Counter Alerts**: Real-time *"Only few left"* pulse badges when stock is below 8, and automatic *"Sold Out"* state.
- **Vegetarian Standards**: Official Indian green square dot (Veg) and red/maroon dot (Non-Veg) indicators.
- **Preparation Notes**: Quick buttons for cooking instructions (*"Less spicy"*, *"Extra gravy"*, *"Less sugar"*).
- **Scheduled Pickup Slots**: ASAP (10–15 mins), 20 mins, 30 mins, 45 mins, with fresh preparation warnings for dum biryani and fresh fried items.
- **Coupons & Promo Codes**: `ZCAFE50` (flat discount) and `FIRST10` (10% off).

### 2. 💳 Indian Payment Gateway (Razorpay)
- **Comprehensive Payment Options**: Full UPI support (Google Pay, PhonePe, Paytm, BHIM, UPI ID), RuPay / Visa / Mastercard credit/debit cards, and NetBanking.
- **Server-Side Price Validation**: Price and 5% GST calculated strictly on the backend (`/api/razorpay/create-order`) — client amounts are never trusted.
- **HMAC-SHA256 Signature Verification**: Cryptographic verification (`/api/razorpay/verify`) and async webhook support (`/api/razorpay/webhook`) to handle closed tabs.
- **Instant Simulator Mode**: Built-in test sandbox that works immediately without keys, and switches seamlessly to live Razorpay when keys are supplied in `.env.local`.

### 3. 🎫 Token & QR Code Live Pickup
- **Unique Order Token**: E.g. `Z-0247` prominently displayed in gold typography.
- **Dynamic QR Code**: Scalable SVG QR code generated with `qrcode.react` for counter scanning.
- **Live 4-Stage Kitchen Tracker**:
  1. `Order Received` (Queued at counter)
  2. `Preparing Fresh` (Frying, baking & brewing fresh batch)
  3. `Ready for Pickup` (Chime alert & pickup notice)
  4. `Collected` (Order completed)
- **Browser & WhatsApp Notifications**: Native browser notification permission trigger and one-tap WhatsApp shareable link.
- **One-Click Reorder**: Re-populates the cart for regular campus & mall visitors.

### 4. 👨‍🍳 Kitchen & Admin Dashboard (`/admin`)
- **Protected Access**: Master PIN protected (Default: `7777`).
- **Real-Time Kanban Board**: Live order cards grouped by state (`Received`, `Preparing`, `Ready`, `Collected`).
- **Web Audio Kitchen Bell**: Built-in synthesizer that chimes when a new order arrives or order becomes ready.
- **One-Tap Status Upgrades**: Advance an order in one tap.
- **Pickup Verification**: Quick token or QR input modal to verify customer and mark as collected.
- **Menu & Stock Controls**: Real-time availability toggles, daily capacity increment/decrement (`+5` / `-5`), and 1-tap stock reset.
- **Daily Analytics**: Total revenue, order count, velocity, and top-selling items breakdown.

---

## 🎨 Design System & Visuals

| Token | Hex Code | Visual Inspiration |
| :--- | :--- | :--- |
| **Primary Burgundy** | `#3E1220` to `#5A1A2B` | Shop fascia signboard |
| **Dark Charcoal** | `#120A0C` | Evening food-court ambience |
| **Glow Gold** | `#F7B52C` | Backlit letter "Z" logo |
| **Warm Amber** | `#FF9F1C` | Under-counter LED bleeding strip |
| **Neon Pink** | `#FF3B5C` | *"Tea • Coffee • Available"* neon sign |
| **Vine Green** | `#4F8F3A` | Swaying hanging top vine border |
| **Fluted Texture** | `CSS pattern` | Walnut timber counter slats |

---

## 📂 Project Structure

```
Z cafe/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.tsx              # Kitchen & Admin dashboard
│   │   ├── api/
│   │   │   ├── razorpay/
│   │   │   │   ├── create-order/     # Server-side price validation & order creation
│   │   │   │   ├── verify/           # HMAC-SHA256 signature verification
│   │   │   │   └── webhook/          # Razorpay webhook listener
│   │   │   └── menu/                 # Menu API
│   │   ├── menu/
│   │   │   └── page.tsx              # Full menu with filters & size variants
│   │   ├── orders/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx          # Live Order Tracking, Token & QR code
│   │   │   └── page.tsx              # Order lookup by mobile / history
│   │   ├── globals.css               # Burgundy theme, LED glow, fluted slats
│   │   ├── layout.tsx                # Layout with Schema.org & fonts
│   │   └── page.tsx                  # Landing page with hero, vines, carousel
│   ├── components/
│   │   ├── CartDrawer.tsx            # Slide-in cart with notes & slot selection
│   │   ├── Footer.tsx                # Kiosk location, hours, WhatsApp button
│   │   ├── Header.tsx                # Navbar with Z Logo, neon badge & cart badge
│   │   ├── MenuItemCard.tsx          # Card with portion variants, veg dot & stepper
│   │   ├── NeonBadge.tsx             # Flickering "Tea • Coffee • Available"
│   │   ├── RazorpayModal.tsx         # Razorpay checkout & interactive test sandbox
│   │   ├── SpecialsCarousel.tsx      # Today's specials horizontal carousel
│   │   ├── VegBadge.tsx              # Indian standard Veg / Non-Veg dot badge
│   │   ├── VineBorder.tsx            # Hanging swaying green vine SVG
│   │   └── ZLogo.tsx                 # Inline SVG Z with steaming cup & "CAFÉ"
│   ├── data/
│   │   └── menu.ts                   # 35+ authentic Indian items dataset
│   ├── lib/
│   │   ├── firebase.ts               # Safe Firebase client initialization
│   │   └── orders-db.ts              # Real-time synchronization bridge
│   ├── store/
│   │   └── useCartStore.ts           # Zustand cart store with localStorage persist
│   └── types/
│       └── index.ts                  # TypeScript interfaces
├── functions/
│   └── index.js                      # Firebase Cloud Functions (stock reset & alerts)
├── scripts/
│   └── seed.mjs                      # Firestore menu database seeder
├── firestore.rules                   # Security rules for Firestore
├── tailwind.config.js                # Custom theme & glow configurations
├── package.json
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js `18.x` or higher installed
- npm `9.x` or higher

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

If you wish to test with real Razorpay Test keys:
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```
> *Note: If keys are left blank, the app defaults to its built-in interactive Razorpay simulation with UPI/Cards, so you can test complete end-to-end flows immediately!*

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:
- **Home**: [http://localhost:3000](http://localhost:3000)
- **Menu & Pre-Order**: [http://localhost:3000/menu](http://localhost:3000/menu)
- **Track Orders**: [http://localhost:3000/orders](http://localhost:3000/orders)
- **Kitchen Admin**: [http://localhost:3000/admin](http://localhost:3000/admin) (PIN: `7777`)

---

## 🍽️ Complete Authentic Indian Menu (₹)

| Category | Items Included |
| :--- | :--- |
| **Snacks** | Samosa (₹15), Veg Puff (₹20), Egg Puff (₹25), Paneer Puff (₹30), Chicken Puff (₹35), Onion Bajji (₹20), Banana Bajji (₹20), Medu Vada (₹15), Masala Vada (₹15), Veg Cutlet (₹25) |
| **Chicken & Starters** | Chicken 65 (Half ₹60 / Full ₹90), Chicken Lollipop (₹100), Gobi 65 (₹70), Paneer 65 (₹90), Chicken Pakoda (₹80) |
| **Rice & Biryani** | Hyderabadi Chicken Biryani (₹120), Royal Mutton Biryani (₹180), Egg Biryani (₹90), Veg Biryani (₹80), Chicken Fried Rice (₹90), Egg Fried Rice (₹80), Veg Fried Rice (₹70) |
| **Desi Noodles** | Veg Hakka Noodles (₹70), Egg Noodles (₹80), Spicy Chicken Noodles (₹90) |
| **Fresh Juices** | Orange (₹50), Mosambi (₹50), Watermelon (₹40), Pineapple (₹50), Sugarcane (₹35), Grape (₹50), Mixed Fruit (₹60), Lemon Mint Cooler (₹35) |
| **Tea & Coffee** | Masala Tea (₹15), Ginger Tea (₹15), South Indian Filter Coffee (₹20), Creamy Hot Coffee (₹20), Kesar Badam Milk (₹35) |

---

## 🔐 Security & Reliability

- **Server-Side Price Validation**: Never trusts the client's cart total. Recalculates prices against server database records.
- **HMAC Signatures**: Every Razorpay order is verified with SHA-256 signatures before confirming payment.
- **Rate-Limiting & Idempotency**: Unique order receipts and duplicate prevention.
- **Offline / Tab-Close Protection**: Webhooks capture async payments and update the order state.
- **Zero Western Item Rule**: Strictly Indian street & food-court cuisine.
