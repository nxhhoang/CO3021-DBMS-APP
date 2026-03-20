import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import MockProvider from '@/components/layout/MockProvider';
import { AuthProvider } from '@/features/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, Search, Store } from 'lucide-react';

const geistSans = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Roboto_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'E-commerce App | Modern Shopping',
  description: 'Nền tảng mua sắm trực tuyến thế hệ mới',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <MockProvider>
            {/* Main Content */}
            <main className="min-h-screen">{children}</main>
          </MockProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
