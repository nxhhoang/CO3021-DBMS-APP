import React from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, Search, Store } from 'lucide-react';
import Header from '@/components/ui/layout/Header';

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer đơn giản */}
      <footer className="mt-20 border-t bg-slate-50/50 py-10">
        <div className="text-muted-foreground container mx-auto grid grid-cols-1 gap-8 px-4 text-sm md:grid-cols-3">
          <div>
            <h3 className="text-foreground mb-4 font-bold">Về SHOP.IO</h3>
            <p className="leading-relaxed">
              Hệ thống bán lẻ thiết bị điện tử và thời trang hàng đầu Việt Nam.
              Tận hưởng trải nghiệm mua sắm công nghệ hiện đại.
            </p>
          </div>
          <div>
            <h3 className="text-foreground mb-4 font-bold">
              Hỗ trợ khách hàng
            </h3>
            <ul className="space-y-2">
              <li className="hover:text-primary cursor-pointer transition-colors">
                Sổ địa chỉ giao hàng
              </li>
              <li className="hover:text-primary cursor-pointer transition-colors">
                Lịch sử đơn hàng
              </li>
              <li className="hover:text-primary cursor-pointer transition-colors">
                Chính sách bảo mật
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-foreground mb-4 font-bold">Liên hệ</h3>
            <p>Email: support@shop.io</p>
            <p>Hotline: 1900 1234</p>
          </div>
        </div>
        <div className="text-muted-foreground mt-10 border-t pt-6 text-center text-xs">
          © 2026 E-commerce Project. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
