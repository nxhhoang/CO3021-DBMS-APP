'use client'

import React, { useEffect } from 'react'
import Header from '@/components/layout/Header/Header'
import Footer from '@/components/layout/Footer'
import { useAuthContext } from '@/features/auth'
import { useRouter } from 'next/navigation'

type MainLayoutProps = {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, isLoading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user?.role === 'ADMIN') {
      router.replace('/admin/dashboard')
    }
  }, [user, isLoading, router])

  if (isLoading || user?.role === 'ADMIN') {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  )
}
