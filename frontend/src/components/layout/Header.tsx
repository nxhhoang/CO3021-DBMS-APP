import React from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Store, Search, ShoppingCart, User, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';

const Header = () => {
  return (
    <header className="bg-background/95 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* ===== LEFT: Logo ===== */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight"
        >
          <Store className="text-primary h-6 w-6" />
          <span>((BRAND))</span>
        </Link>

        {/* ===== CENTER: Search (Desktop) ===== */}
        <div className="relative hidden w-full max-w-md items-center md:flex">
          <Search className="text-muted-foreground absolute left-3 h-4 w-4" />
          <Input
            type="search"
            placeholder="Tìm sản phẩm, thương hiệu..."
            className="pl-9"
          />
        </div>

        {/* ===== RIGHT: Actions ===== */}
        <div className="flex items-center gap-2">
          {/* Cart */}
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 min-w-[20px] justify-center px-1">
                2
              </Badge>
            </Link>
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/user/profile">Trang cá nhân</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/user/addresses">Sổ địa chỉ</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/orders">Đơn hàng</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* ===== Mobile Menu ===== */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-64">
              <div className="mt-6 flex flex-col gap-4">
                <Input placeholder="Tìm sản phẩm..." />
                <Link href="/cart">Giỏ hàng</Link>
                <Link href="/profile">Trang cá nhân</Link>
                <Link href="/orders">Đơn hàng</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
