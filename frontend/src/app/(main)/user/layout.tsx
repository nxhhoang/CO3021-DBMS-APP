import { Separator } from '@/components/ui/separator';
import { User, MapPin, Package } from 'lucide-react';
import Link from 'next/link';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const SIDEBAR_ITEMS: {
    title: string;
    href: string;
    icon: React.ReactNode;
  }[] = [
    {
      title: 'Hồ sơ cá nhân',
      href: '/user/profile',
      icon: <User className="h-4 w-4" />,
    },
    {
      title: 'Sổ địa chỉ',
      href: '/user/addresses',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      title: 'Đơn hàng',
      href: '/user/orders',
      icon: <Package className="h-4 w-4" />,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Cài đặt tài khoản</h2>
        <p className="text-muted-foreground">
          Quản lý thông tin cá nhân và địa chỉ giao hàng của bạn.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
        <aside className="lg:w-1/5">
          <nav className="flex space-x-2 lg:flex-col lg:space-y-1 lg:space-x-0">
            {SIDEBAR_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:bg-accent flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all"
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1 lg:max-w-3xl">{children}</div>
      </div>
    </div>
  );
}
