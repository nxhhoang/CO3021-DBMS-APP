import React from 'react';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer';

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* <Footer /> */}
    </div>
  );
}
