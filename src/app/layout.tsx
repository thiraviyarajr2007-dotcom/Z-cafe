import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ZCafe | Fresh Indian Snacks, Biryani & Pre-Order • Skip the Queue',
  description:
    'ZCafe campus food pre-order platform. Piping hot puffs, samosas, dum biryani, fresh juices & filter coffee. Pre-order in seconds and collect with your instant QR token.',
  keywords: [
    'ZCafe',
    'College Canteen Pre-Order',
    'Skip the Queue',
    'Indian Snacks',
    'Chicken Biryani',
    'Samosa',
    'Veg Puff',
    'Fresh Fruit Juices',
    'Filter Coffee',
    'QR Token Pickup'
  ],
  authors: [{ name: 'ZCafe Food-Tech Engineering' }],
  openGraph: {
    title: 'ZCafe | Order Ahead. Skip the Queue.',
    description: 'Little Joy in Every Puff. Pre-order from your phone and scan your QR code at the counter.',
    url: 'https://zcafe.in',
    siteName: 'ZCafe',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'ZCafe Food Platform',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#5A1A2B',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FastFoodRestaurant',
    name: 'ZCafe',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8',
    description: 'College canteen food-tech pre-order platform eliminating break queues.',
    servesCuisine: 'Indian',
    priceRange: '₹15 - ₹180',
    currenciesAccepted: 'INR',
    paymentAccepted: 'UPI, GPay, PhonePe, Cards, NetBanking',
  };

  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FFF8EE] dark:bg-[#120A0C] text-[#2A0E17] dark:text-[#FFF8EE] antialiased selection:bg-[#F7B52C] selection:text-[#120A0C] transition-colors duration-300">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </ThemeProvider>
      </body>
    </html>
  );
}
