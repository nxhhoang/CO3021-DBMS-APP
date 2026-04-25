'use client';

import { ReactNode } from 'react';
import { MeshBackground } from '@/components/common/MeshBackground';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-white">
      {/* BACKGROUND SYSTEM */}
      <MeshBackground />

      {/* TOP NAVIGATION */}
      <div className="absolute top-8 left-8 z-50">
        <Link 
          href="/" 
          className="group flex items-center gap-2 rounded-full border border-slate-200/60 bg-white/40 px-4 py-2 text-sm font-bold text-slate-600 backdrop-blur-md transition-all hover:bg-white hover:text-slate-900"
        >
          <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Quay lại trang chủ
        </Link>
      </div>

      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT SIDE - Branding Content */}
        <div className="relative hidden flex-col items-center justify-center p-12 lg:flex">
          <div className="relative z-10 max-w-lg space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-4 py-1.5 text-[11px] font-black tracking-widest text-blue-600 uppercase backdrop-blur-sm">
              Hệ thống mua sắm trực tuyến
            </div>
            
            <h1 className="font-display text-5xl font-black tracking-tight text-slate-900 sm:text-6xl">
              Chào mừng đến với{' '}
              <span className="text-gradient-primary">
                BKShop
              </span>
            </h1>
            
            <p className="font-sans text-xl font-medium text-slate-500 leading-relaxed">
              Khám phá thế giới công nghệ và phong cách sống với những sản phẩm cao cấp được tuyển chọn kỹ lưỡng.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-8">
              {[
                { label: 'Sản phẩm', value: '5000+' },
                { label: 'Khách hàng', value: '10k+' },
              ].map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <div className="font-display text-2xl font-black text-slate-900">{stat.value}</div>
                  <div className="text-xs font-bold tracking-widest text-slate-400 uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative element */}
          <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-blue-400/10 blur-[100px]" />
        </div>

        {/* RIGHT SIDE - Form Container */}
        <div className="relative flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
