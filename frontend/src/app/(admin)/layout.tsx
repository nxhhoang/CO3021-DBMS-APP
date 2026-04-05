'use client'

import React from 'react'
import { getUserRole } from '@/utils/getUserRole'
import '@/lib/axios'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const role = getUserRole()

  if (role !== 'ADMIN') {
    return <div>Access denied</div>
  }

  return <>{children}</>
}
