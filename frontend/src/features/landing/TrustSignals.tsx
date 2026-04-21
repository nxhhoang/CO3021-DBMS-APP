'use client'

import React from 'react'
import { Truck, ShieldCheck, Headphones, RotateCcw } from 'lucide-react'

const signals = [
  {
    icon: Truck,
    title: 'Miễn phí vận chuyển',
    description: 'Cho đơn hàng từ 500k',
  },
  {
    icon: ShieldCheck,
    title: 'Thanh toán bảo mật',
    description: '100% bảo mật thông tin',
  },
  {
    icon: Headphones,
    title: 'Hỗ trợ 24/7',
    description: 'Đội ngũ tận tâm',
  },
  {
    icon: RotateCcw,
    title: 'Đổi trả 30 ngày',
    description: 'Dễ dàng và nhanh chóng',
  },
]

export default function TrustSignals() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {signals.map((signal, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center group"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-200">
              <signal.icon size={28} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">{signal.title}</h3>
            <p className="mt-1 text-xs text-slate-500">{signal.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
