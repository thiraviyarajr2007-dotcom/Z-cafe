import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ZCafe | Order Ahead. Skip the Crowd. • College Canteen Pre-Order & Food Commerce',
  description:
    'ZCafe reduces college break time crowding with instant pre-ordering, crowd tracking, smart pickup slots, and QR token collection. Your Food. Your Time. Zero Waiting.',
  keywords: [
    'ZCafe',
    'College Canteen Pre-Order',
    'Skip the Queue',
    'Campus Food Commerce',
    'QR Token Pickup',
    'Biryani',
    'Samosa',
    'Breakfast',
    'Fruit Juices',
    'Canteen Crowd Management'
  ],
  authors: [{ name: 'ZCafe Food-Tech Engineering' }],
  openGraph: {
    title: 'ZCafe | Order Ahead. Skip the Crowd.',
    description: 'Your Food. Your Time. Zero Waiting. Pre-order from your phone and scan your QR code at the counter.',
    url: 'https://zcafe.in',
    siteName: 'ZCafe',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'ZCafe 3D Food Commerce Platform',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#3E1220',
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
    priceRange: '₹15 - ₹165',
    currenciesAccepted: 'INR',
    paymentAccepted: 'UPI, GPay, PhonePe, Cards, NetBanking',
  };

  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} dark`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </head>
      <body className="min-h-screen flex flex-col bg-[#120A0C] text-[#FFF8EE] antialiased selection:bg-[#F7B52C] selection:text-[#120A0C]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
