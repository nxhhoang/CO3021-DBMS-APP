import type { Metadata } from 'next';
import { Inter, Roboto_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import MockProvider from '@/components/layout/MockProvider';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'vietnamese'],
});

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin', 'vietnamese'],
});

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin', 'vietnamese'],
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jakarta.variable} ${robotoMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <MockProvider>
          {/* Main Content */}
          <main className="min-h-screen">{children}</main>
        </MockProvider>
      </body>
    </html>
  );
}
