import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import { CurrencyProvider } from '@/lib/currency';

const geist = Geist({ variable: '--font-geist', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FinanceTracker',
  description: 'Track your savings, expenses, income and subscriptions',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FinanceTracker',
  },
  icons: {
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#6366f1',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} antialiased`}>
      <body className="bg-zinc-950 text-white flex min-h-screen">
        <CurrencyProvider>
          {/* Sidebar: visible on md+ */}
          <div className="hidden md:flex">
            <Sidebar />
          </div>
          {/* Main content: extra bottom padding on mobile for bottom nav */}
          <main className="flex-1 p-4 md:p-8 overflow-auto pb-24 md:pb-8">
            {children}
          </main>
          {/* Bottom nav: visible on mobile only */}
          <div className="md:hidden">
            <BottomNav />
          </div>
        </CurrencyProvider>
      </body>
    </html>
  );
}
