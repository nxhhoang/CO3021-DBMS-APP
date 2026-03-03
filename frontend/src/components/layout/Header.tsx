'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ShoppingCart, User, Menu, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { authService } from '@/services/auth.service';
import Logo from './Logo';

const NAV_ITEMS = [
  { label: 'Profile', href: '/user/profile' },
  { label: 'Addresses', href: '/user/addresses' },
  { label: 'Orders', href: '/user/orders' },
];

const Header = () => {
  const router = useRouter();

  const handleLogout = async () => {
    // Xóa ngay lập tức ở client để đảm bảo UX mượt mà
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    try {
      // Gọi API nhưng không "đợi" nó để chặn người dùng
      authService.logout();
    } catch (error) {
      console.error(error);
    } finally {
      router.push('/login');
      router.refresh();
    }
  };

  const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('q');
    if (query) router.push(`/search?q=${encodeURIComponent(query.toString())}`);
  };

  return (
    <header className="bg-background/95 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Logo />
        {/* Search (Desktop) */}
        <form
          onSubmit={onSearchSubmit}
          className="relative hidden w-full max-w-md items-center md:flex"
        >
          <Search className="text-muted-foreground absolute left-3 h-4 w-4" />
          <Input
            name="q"
            type="search"
            placeholder="Tìm sản phẩm..."
            className="focus-visible:ring-primary pl-9"
          />
        </form>

        <div className="flex items-center gap-2">
          {/* Cart */}
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/cart" aria-label="Giỏ hàng">
              <ShoppingCart className="h-5 w-5" />
              <Badge className="animate-in zoom-in absolute -top-1 -right-1 h-5 min-w-[20px] justify-center px-1">
                2
              </Badge>
            </Link>
          </Button>

          {/* Desktop Profile */}
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

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-left">Danh mục</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-4">
                <form onSubmit={onSearchSubmit} className="relative">
                  <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                  <Input name="q" placeholder="Tìm kiếm..." className="pl-9" />
                </form>
                <nav className="flex flex-col gap-2">
                  {NAV_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="hover:bg-accent rounded-md p-2 text-lg font-medium"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center p-2 text-lg font-medium text-red-500 hover:bg-red-50"
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    Đăng xuất
                  </button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
