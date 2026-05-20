import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import BlogHeader from '@/components/BlogHeader';
import BlogFooter from '@/components/BlogFooter';

const geist = Geist({ variable: '--font-geist', subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'The Dev Blog',
    template: '%s | The Dev Blog',
  },
  description: 'Articles on React, TypeScript, CSS, and the modern web platform.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} antialiased`}>
      <body className="bg-zinc-950 text-white min-h-screen flex flex-col">
        <BlogHeader />
        <main className="flex-1">{children}</main>
        <BlogFooter />
      </body>
    </html>
  );
}
