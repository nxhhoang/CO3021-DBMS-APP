'use client'

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import {
  Menu,
  LogOut,
  User,
  MapPin,
  Package,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/features/auth'
import { ProductSearch } from '@/features/products'
import { useState } from 'react'

const NAV_ITEMS = [
  { label: 'Hồ sơ cá nhân', href: '/user/profile', icon: User },
  { label: 'Sổ địa chỉ', href: '/user/addresses', icon: MapPin },
  { label: 'Đơn hàng', href: '/user/orders', icon: Package },
]

export const MobileMenu = () => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const { logout } = useAuthContext()

  const handleLogout = async () => {
    await logout()
    setIsOpen(false)
    router.push('/login')
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-900 transition-all hover:bg-slate-100 active:scale-90 md:hidden"
        >
          <Menu size={20} strokeWidth={2.5} />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[85%] border-none p-0 sm:w-80">
        <div className="relative h-full bg-white/80 backdrop-blur-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <SheetHeader>
              <SheetTitle className="font-display text-xl font-black tracking-tight text-slate-900">
                Menu
              </SheetTitle>
            </SheetHeader>
          </div>

          <div className="flex flex-col gap-8 p-6">
            {/* Search */}
            <div className="space-y-3">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Tìm kiếm
              </span>
              <ProductSearch
                variant="admin"
                onAfterSearch={() => setIsOpen(false)}
                className="w-full"
              />
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col gap-2">
              <span className="mb-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Tài khoản
              </span>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center justify-between rounded-2xl bg-slate-50/50 p-4 transition-all hover:bg-blue-50 hover:text-blue-600"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm transition-colors group-hover:bg-blue-600 group-hover:text-white">
                        <Icon size={18} strokeWidth={2.5} />
                      </div>
                      <span className="text-sm font-bold tracking-tight">
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-blue-600"
                    />
                  </Link>
                )
              })}
            </nav>

            <div className="mt-auto space-y-4 pt-8">
              <button
                onClick={handleLogout}
                className="group flex w-full items-center gap-3 rounded-2xl p-4 text-sm font-bold text-rose-500 transition-all hover:bg-rose-50 hover:text-rose-600"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 transition-colors group-hover:bg-rose-100 group-hover:text-rose-600">
                  <LogOut size={18} strokeWidth={2.5} />
                </div>
                Đăng xuất
              </button>
            </div>
          </div>

          {/* Footer Branding */}
          <div className="absolute bottom-8 left-0 w-full px-6 text-center">
            <p className="text-[10px] font-black tracking-widest text-slate-300 uppercase">
              BKShop © 2026
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
