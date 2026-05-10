'use client'

import { useEffect, useState } from 'react'
import { Package, Eye, Search } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  OrderStatusBadge,
  OrderDetailModal,
  OrderCardSkeleton,
  OrderCard,
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
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-300">
      <div className="flex items-center gap-3">
        <div className="h-1.5 w-4 rounded-full bg-slate-900" />
        <h4 className="font-display text-[13px] font-black tracking-tight text-slate-900 uppercase">
          Đơn hàng của tôi
        </h4>
      </div>

      <Tabs defaultValue="current" className="w-full space-y-6">
        <TabsList className="h-10 w-full max-w-[400px] gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/50">
          <TabsTrigger
            value="current"
            className="font-display group h-full flex-1 rounded-lg text-[11px] font-black tracking-widest uppercase transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-white"
          >
            <div className="flex items-center gap-2">
              <span>Đang thực hiện</span>
              {processingOrders.length > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-bold text-white shadow-sm ring-1 ring-white/20">
                  {processingOrders.length}
                </span>
              )}
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="font-display group h-full flex-1 rounded-lg text-[11px] font-black tracking-widest uppercase transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-white"
          >
            <div className="flex items-center gap-2">
              <span>Lịch sử</span>
              {historyOrders.length > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-slate-400 px-1 text-[9px] font-bold text-white shadow-sm ring-1 ring-white/20 group-data-[state=active]:bg-blue-600">
                  {historyOrders.length}
                </span>
              )}
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="outline-none">
          <div className="grid gap-4">
            {processingOrders.map((order) => (
              <OrderCard
                key={order.orderID}
                order={order}
                onViewDetail={handleViewDetail}
              />
            ))}
            {processingOrders.length === 0 && <EmptyOrderState />}
          </div>
        </TabsContent>

        <TabsContent value="history" className="outline-none">
          <div className="grid gap-4">
            {historyOrders.map((order) => (
              <OrderCard
                key={order.orderID}
                order={order}
                onViewDetail={handleViewDetail}
              />
            ))}
            {historyOrders.length === 0 && <EmptyOrderState />}
          </div>
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

function EmptyOrderState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-12 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300 dark:bg-slate-800">
        <Package className="h-8 w-8" />
      </div>
      <h3 className="font-display text-lg font-black text-slate-900 dark:text-white">
        Trống trải quá...
      </h3>
      <p className="mt-2 max-w-[280px] text-center font-medium text-slate-400">
        Bạn chưa có đơn hàng nào trong danh sách này.
      </p>
      <Button
        className="mt-8 h-11 rounded-xl bg-slate-900 px-8 font-display text-[11px] font-black tracking-widest text-white uppercase transition-all hover:bg-blue-600"
        asChild
      >
        <Link href="/products">
          <Search className="mr-2 h-4 w-4" strokeWidth={2.5} />
          Khám phá cửa hàng
        </Link>
      </Button>
    </div>
  )
}
