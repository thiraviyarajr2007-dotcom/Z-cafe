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
  title: 'Z CAFÉ | Little Joy in Every Puff • Authentic Indian Snacks & Filter Coffee',
  description:
    'Order fresh Indian snacks, chicken 65, dum biryani, noodles, fresh juices and authentic filter coffee from Z CAFÉ. Skip the food court queue with instant pre-order and pickup tokens.',
  keywords: [
    'Z Cafe',
    'Z CAFÉ',
    'Indian Cafe',
    'Samosa',
    'Egg Puff',
    'Chicken 65',
    'Dum Biryani',
    'Filter Coffee',
    'Pre-order food court',
    'Indian snacks kiosk'
  ],
  authors: [{ name: 'Z Cafe Culinary Team' }],
  openGraph: {
    title: 'Z CAFÉ | Authentic Indian Snacks, Biryani & Filter Coffee',
    description: 'Little Joy in Every Puff. Skip the food court line with instant pre-ordering.',
    url: 'https://zcafe.in',
    siteName: 'Z CAFÉ',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Z CAFÉ Fresh Indian Snacks & Steaming Coffee',
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
    '@type': 'CafeOrCoffeeShop',
    name: 'Z CAFÉ',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950',
    description: 'Authentic Indian food kiosk serving fresh puffs, samosas, Chicken 65, biryani and filter coffee.',
    servesCuisine: 'Indian',
    priceRange: '₹15 - ₹180',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Credit Card, Razorpay',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '10:00',
        closes: '22:30',
      },
    ],
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
