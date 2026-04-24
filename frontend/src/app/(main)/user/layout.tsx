'use client';

import { User, MapPin, Package, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { MeshBackground } from '@/components/common/MeshBackground';

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
      icon: <User className="h-5 w-5" />,
    },
    {
      title: 'Sổ địa chỉ',
      href: '/user/addresses',
      icon: <MapPin className="h-5 w-5" />,
    },
    {
      title: 'Đơn hàng',
      href: '/user/orders',
      icon: <Package className="h-5 w-5" />,
    },
  ];

  return (
    <div className="relative isolate min-h-screen w-full bg-white">
      {/* Premium Background System */}
      <MeshBackground />

      <div className="container relative z-10 mx-auto px-4 py-12 md:py-20 lg:px-8">
        {/* Header Section */}
        <div className="mb-12 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-1 w-6 rounded-full bg-blue-600" />
            <span className="font-display text-[11px] font-black tracking-[0.2em] text-blue-600 uppercase">
              Khu vực khách hàng
            </span>
          </div>
          <h1 className="font-display text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Tài khoản <span className="text-gradient-primary">của bạn</span>
          </h1>
          <p className="max-w-2xl text-lg font-medium text-slate-500 leading-relaxed">
            Quản lý thông tin cá nhân, địa chỉ giao hàng và theo dõi hành trình đơn hàng của bạn một cách dễ dàng.
          </p>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Sidebar */}
          <aside className="shrink-0 lg:w-80">
            <nav className="flex flex-col gap-3">
              {sidebarNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center justify-between rounded-2xl border p-4 transition-all duration-300",
                      isActive 
                        ? "border-blue-100 bg-white shadow-xl shadow-blue-100/20 ring-1 ring-blue-50" 
                        : "border-transparent hover:border-slate-100 hover:bg-white/50"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300",
                        isActive 
                          ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" 
                          : "bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600"
                      )}>
                        {item.icon}
                      </div>
                      <span className={cn(
                        "text-sm font-bold tracking-tight transition-colors",
                        isActive ? "text-slate-900" : "text-slate-500 group-hover:text-slate-900"
                      )}>
                        {item.title}
                      </span>
                    </div>
                    {isActive && (
                      <ChevronRight size={18} className="text-blue-600" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            <div className="h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
