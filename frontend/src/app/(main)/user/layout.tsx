'use client';

import { User, MapPin, Package } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const sidebarNavItems = [
    {
      title: 'Hồ sơ cá nhân',
      href: '/user/profile',
      icon: <User className="h-4 w-4" strokeWidth={2.5} />,
    },
    {
      title: 'Sổ địa chỉ',
      href: '/user/addresses',
      icon: <MapPin className="h-4 w-4" strokeWidth={2.5} />,
    },
    {
      title: 'Đơn hàng',
      href: '/user/orders',
      icon: <Package className="h-4 w-4" strokeWidth={2.5} />,
    },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Premium Background System */}
      {/* REUSABLE BACKGROUND SYSTEM */}
      <div className="mesh-gradient-container">
        <div className="mesh-gradient-base" />
        <div className="mesh-gradient-dots" />
        <div className="mesh-gradient-spotlight" />
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="mesh-gradient-blob -top-[10%] left-[15%] h-[600px] w-[600px] bg-blue-300/10 blur-[120px]" />
          <div className="mesh-gradient-blob top-[20%] right-[10%] h-[500px] w-[500px] bg-cyan-300/10 blur-[100px]" />
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-4 py-16">
        <div className="mb-12 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-8 rounded-full bg-blue-600" />
            <h4 className="font-display text-[11px] font-black tracking-[0.2em] text-blue-600 uppercase">
              Tài khoản người dùng
            </h4>
          </div>
          <h1 className="font-display text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Cài đặt tài khoản
          </h1>
          <p className="max-w-2xl text-base font-medium text-slate-500 leading-relaxed">
            Quản lý thông tin cá nhân, địa chỉ giao hàng và theo dõi lịch sử đơn hàng của bạn.
          </p>
        </div>

        <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-16">
          <aside className="lg:w-1/4">
            <nav className="flex flex-wrap gap-2 lg:flex-col lg:space-y-2">
              {sidebarNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-4 px-6 py-4 transition-all duration-300",
                      isActive 
                        ? "btn-premium-primary !rounded-2xl" 
                        : "btn-premium-secondary !rounded-2xl"
                    )}
                  >
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300",
                      isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600"
                    )}>
                      {item.icon}
                    </div>
                    <span className="font-display text-[13px] font-bold tracking-wide uppercase">
                      {item.title}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </aside>
          <main className="flex-1 lg:max-w-4xl">{children}</main>
        </div>
      </div>
    </div>
  );
}
