import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { CurrencyProvider } from '@/lib/currency';

const geist = Geist({ variable: '--font-geist', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FinanceTracker',
  description: 'Track your savings, expenses, income and subscriptions',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} antialiased`}>
      <body className="bg-zinc-950 text-white flex min-h-screen">
        <CurrencyProvider>
          <Sidebar />
          <main className="flex-1 p-8 overflow-auto">{children}</main>
        </CurrencyProvider>
      </body>
    </html>
  );
}
