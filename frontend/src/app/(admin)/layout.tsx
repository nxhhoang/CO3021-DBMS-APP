'use client'

import React, { useEffect, useState } from 'react'
import { getUserRole } from '@/utils/getUserRole'
import '@/lib/axios'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    setRole(getUserRole())
  }, [])

  if (!mounted) return null

  if (role !== 'ADMIN') {
    return <div>Access denied</div>
  }

  return <>{children}</>
}