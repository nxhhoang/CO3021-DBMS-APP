'use client'

import { useEffect, useState } from 'react'
import { Package, Eye, Search } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  OrderStatusBadge,
  OrderDetailModal,
  OrderCardSkeleton,
} from '@/features/orders'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { orderService } from '@/services/order.service'
import type { Order } from '@/types'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getOrders()
        if (response && response.data) {
          setOrders(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const handleViewDetail = (orderId: number) => {
    setSelectedOrderId(orderId)
    setIsModalOpen(true)
  }

  const processingOrders = orders.filter(
    (o) => o.status === 'PROCESSING' || o.status === 'PENDING',
  )
  const historyOrders = orders.filter(
    (o) => o.status !== 'PROCESSING' && o.status !== 'PENDING',
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <OrderCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 space-y-10 duration-700">
      <Tabs defaultValue="current" className="w-full space-y-10">
        <TabsList className="h-12 w-full max-w-md gap-1 rounded-2xl bg-slate-100/80 p-1 dark:bg-slate-800/50">
          <TabsTrigger
            value="current"
            className="font-display h-full flex-1 rounded-xl text-[11px] font-bold tracking-tight transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-white"
          >
            Đang thực hiện ({processingOrders.length})
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="font-display h-full flex-1 rounded-xl text-[11px] font-bold tracking-tight transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-white"
          >
            Lịch sử ({historyOrders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6 outline-none">
          {processingOrders.map((order) => (
            <OrderCard
              key={order.orderID}
              order={order}
              onViewDetail={handleViewDetail}
            />
          ))}
          {processingOrders.length === 0 && <EmptyOrderState />}
        </TabsContent>

        <TabsContent value="history" className="space-y-6 outline-none">
          {historyOrders.map((order) => (
            <OrderCard
              key={order.orderID}
              order={order}
              onViewDetail={handleViewDetail}
            />
          ))}
          {historyOrders.length === 0 && <EmptyOrderState />}
        </TabsContent>
      </Tabs>

      <OrderDetailModal
        orderId={selectedOrderId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

function OrderCard({
  order,
  onViewDetail,
}: {
  order: Order
  onViewDetail: (id: number) => void
}) {
  const formattedDate = format(new Date(order.createdAt), 'dd MMMM, yyyy', {
    locale: vi,
  })
  const formattedAmount = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(order.totalAmount)

  return (
    <div
      className="glass-card group relative cursor-pointer p-8 transition-all duration-300 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/5 active:scale-[0.99]"
      onClick={() => onViewDetail(order.orderID)}
    >
      <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-slate-900 text-white shadow-2xl transition-transform duration-500 group-hover:scale-105">
            <Package size={28} strokeWidth={2.5} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-lg font-black tracking-tighter text-blue-600">
                #{order.orderID}
              </span>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="font-sans text-sm font-bold text-slate-500 italic">
              Đặt ngày:{' '}
              <span className="font-mono text-slate-900 not-italic">
                {formattedDate}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="font-display text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Tổng cộng
            </p>
            <p className="font-mono text-2xl font-black tracking-tighter text-slate-900">
              {formattedAmount}
            </p>
          </div>
          <Button
            className="btn-premium-primary h-14 px-8 shadow-none group-hover:shadow-lg group-hover:shadow-blue-500/20"
            onClick={(e) => {
              e.stopPropagation()
              onViewDetail(order.orderID)
            }}
          >
            <Eye className="mr-2 h-4 w-4" strokeWidth={2.5} />
            Chi tiết
          </Button>
        </div>
      </div>
    </div>
  )
}

function EmptyOrderState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[3rem] border border-slate-100 bg-white/40 py-24 shadow-sm backdrop-blur-xl dark:bg-slate-900/40">
      <div className="relative mb-8">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 text-slate-200 dark:bg-slate-800">
          <Package className="h-10 w-10" />
        </div>
        <div className="absolute inset-0 animate-pulse rounded-full bg-blue-500/5 blur-[40px]" />
      </div>
      <h3 className="font-display text-xl font-black text-slate-900 dark:text-white">
        Trống trải quá...
      </h3>
      <p className="mt-2 max-w-[280px] text-center leading-relaxed font-medium text-slate-400">
        Bạn chưa có đơn hàng nào trong danh sách này. Hãy bắt đầu mua sắm ngay!
      </p>
      <Button className="btn-premium-primary mt-10 h-14 px-10" asChild>
        <Link href="/products">
          <Search className="mr-2 h-4 w-4" strokeWidth={2.5} />
          Khám phá cửa hàng
        </Link>
      </Button>
    </div>
  )
}
