'use client';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { authService } from '@/features/auth/services/auth.service';
import { useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'Profile', href: '/user/profile' },
  { label: 'Addresses', href: '/user/addresses' },
  { label: 'Orders', href: '/user/orders' },
];

export const DropdownProfile = () => {
  const router = useRouter();
  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      router.push('/login');
      return;
    }

    try {
      await authService.logout({ refreshToken });
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user')

      router.push('/login');
      router.refresh();
    }
  };
  return (
    <div className="hidden md:block">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 rounded-2xl border-white/40 bg-white/80 p-2 shadow-2xl backdrop-blur-xl">
          <DropdownMenuLabel className="px-3 py-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            Tài khoản của tôi
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {NAV_ITEMS.map((item) => (
            <DropdownMenuItem key={item.href} asChild className="cursor-pointer rounded-xl px-3 py-2.5 transition-colors focus:bg-blue-50 focus:text-blue-600">
              <Link href={item.href} className="flex w-full items-center font-medium">
                {item.label}
              </Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="mt-1 cursor-pointer rounded-xl px-3 py-2.5 text-red-500 transition-colors focus:bg-red-50 focus:text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span className="font-medium">Đăng xuất</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
