'use client'

import React, { useEffect, useState } from 'react'
import { getUserRole } from '@/utils/getUserRole'
import '@/lib/axios'

import { 
  LayoutDashboard, 
  Package, 
  Folder, 
  ShoppingBag, 
  ArrowLeft,
  ChevronRight,
  LogOut
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { MeshBackground } from '@/components/common/MeshBackground'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const [role, setRole] = useState<string | null>(null)

  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    setRole(getUserRole())
  }, [])

  if (!mounted) return null

  if (role !== 'ADMIN') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="text-4xl font-black text-rose-500">403</div>
          <h2 className="text-xl font-bold text-slate-900">Truy cập bị từ chối</h2>
          <p className="text-slate-500">Bạn không có quyền truy cập vào khu vực này.</p>
          <Link href="/" className="inline-block btn-premium-primary px-6 py-2">
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    )
  }

  const menu = [
    {
      name: 'Tổng quan',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Sản phẩm',
      href: '/admin/products',
      icon: Package,
    },
    {
      name: 'Đơn hàng',
      href: '/admin/orders',
      icon: ShoppingBag,
    },
    {
      name: 'Danh mục',
      href: '/admin/categories',
      icon: Folder,
    },
  ]

  return (
    <div className="relative isolate min-h-screen bg-slate-50/50">
      <MeshBackground variant="admin" />

      {/* SIDEBAR */}
      <aside className="fixed top-0 left-0 z-50 flex h-screen w-72 flex-col p-6 transition-all duration-500">
        <div className="glass-sidebar flex h-full flex-col border-none shadow-2xl shadow-slate-200/50 ring-1 ring-white/20">
          {/* LOGO SECTION */}
          <div className="mb-10 p-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg">
                <Package size={20} strokeWidth={2.5} />
              </div>
              <div className="space-y-0.5">
                <h1 className="font-display text-lg font-black tracking-tight text-slate-900">BKShop</h1>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-black tracking-widest text-blue-600 uppercase">
                  Admin Panel
                </div>
              </div>
            </div>
          </div>

          {/* MENU SECTION */}
          <nav className="flex-1 space-y-1.5 overflow-y-auto px-2 scrollbar-none">
            <div className="mb-3 px-3 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
              Menu chính
            </div>
            {menu.map((item) => {
              const isActive = pathname.startsWith(item.href)
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-between rounded-2xl px-4 py-3.5 transition-all duration-300",
                    isActive
                      ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                      : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon 
                      size={20} 
                      className={cn(
                        "transition-transform duration-300 group-hover:scale-110",
                        isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900"
                      )} 
                    />
                    <span className="text-sm font-bold tracking-tight">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight size={14} className="opacity-50" />}
                </Link>
              )
            })}
          </nav>

          {/* FOOTER SECTION */}
          <div className="mt-auto space-y-2 border-t border-slate-100 p-2 pt-6">
            <Link
              href="/"
              className="group flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-500 transition-all hover:bg-blue-50 hover:text-blue-600"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 transition-colors group-hover:bg-blue-100 group-hover:text-blue-600">
                <ArrowLeft size={18} strokeWidth={2.5} />
              </div>
              Về cửa hàng
            </Link>
            <button
              className="group flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-bold text-rose-500 transition-all hover:bg-rose-50 hover:text-rose-600"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 transition-colors group-hover:bg-rose-100 group-hover:text-rose-600">
                <LogOut size={18} strokeWidth={2.5} />
              </div>
              Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-72 min-h-screen transition-all duration-500">
        <div className="p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  )
}