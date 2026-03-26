'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/features/auth';
import { User, Home, MapPin, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function SidebarItem({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 ${
        active ? 'bg-muted font-medium' : 'hover:bg-muted'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export function UserSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const SIDEBAR_ITEMS: {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    href: string;
  }[] = [
    {
      icon: <User size={16} />,
      label: 'Profile',
      active: pathname === '/user/profile',
      href: '/user/profile',
    },
    {
      icon: <Home size={16} />,
      label: 'Orders',
      active: pathname === '/user/orders',
      href: '/user/orders',
    },
    {
      icon: <MapPin size={16} />,
      label: 'Address',
      active: pathname === '/user/addresses',
      href: '/user/addresses',
    },
  ];
  return (
    <Card>
      <CardContent className="space-y-2 p-4">
        {SIDEBAR_ITEMS.map((item, index) => (
          <SidebarItem
            key={index}
            icon={item.icon}
            label={item.label}
            active={item.active}
            href={item.href}
          />
        ))}

        <Separator />
        <Button variant="destructive" className="w-full gap-2" onClick={logout}>
          <LogOut size={16} /> Sign out
        </Button>
      </CardContent>
    </Card>
  );
}
