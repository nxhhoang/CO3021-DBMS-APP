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
import { tokenStorage } from '@/services/tokenStorage';

const NAV_ITEMS = [
  { label: 'Profile', href: '/user/profile' },
  { label: 'Addresses', href: '/user/addresses' },
  { label: 'Orders', href: '/user/orders' },
];

export const DropdownProfile = () => {
  const router = useRouter();
  const handleLogout = async () => {
    const refreshToken = tokenStorage.getRefreshToken();

    if (!refreshToken) {
      router.push('/login');
      return;
    }

    try {
      await authService.logout({ refreshToken });
    } catch (error) {
      console.error(error);
    } finally {
      tokenStorage.clear();
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
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {NAV_ITEMS.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href}>{item.label}</Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-red-500 focus:text-red-500"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
