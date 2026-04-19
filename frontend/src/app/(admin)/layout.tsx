'use client'

import React, { useEffect, useState } from 'react'
import { getUserRole } from '@/utils/getUserRole'
import '@/lib/axios'

import { LayoutDashboard, Package, Folder } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
    return <div className="p-10 text-red-500">Access denied</div>
  }

  const menu = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: Package,
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: Package,
    },
    {
      name: 'Categories',
      href: '/admin/categories',
      icon: Folder,
    },
  ]

  return (
    <div className="bg-surface flex min-h-screen">
      {/* SIDEBAR */}
      <aside className="fixed top-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
        {/* LOGO */}
        <div className="mb-10">
          <h1 className="text-primary text-lg font-black">BKShop Admin</h1>
          <p className="text-xs tracking-widest text-slate-400 uppercase">
            Management
          </p>
        </div>

        {/* MENU */}
        <nav className="flex flex-col gap-2">
          {menu.map((item) => {
            const isActive = pathname.startsWith(item.href)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-primary text-white shadow'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-64 w-full">
        {/* PAGE CONTENT */}
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}