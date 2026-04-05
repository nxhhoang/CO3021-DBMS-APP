'use client'

import { useEffect, useState } from 'react'
import { ClipboardList, RefreshCw } from 'lucide-react'

// Types & Services
import { Order } from '@/types'
import { orderService } from '@/services/order.service'

// Components
import OrderTable from '@/features/orders/components/OrderTable'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await orderService.getAdminOrders()
      if (response.data) {
        setOrders(response.data)
      }
    } catch (error) {
      toast.error('Không thể tải danh sách đơn hàng')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <div className="container mx-auto min-h-screen px-4 py-6 md:py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <ClipboardList className="text-primary" size={28} />
            Quản lý đơn hàng
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {loading
              ? 'Đang tải...'
              : `Tổng số ${orders.length} đơn hàng đã đặt`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchOrders} disabled={loading}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`}
            />
            Làm mới
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* Main Table */}
        <main className="min-w-0 flex-1">
          <OrderTable
            orders={orders}
            loading={loading}
            onRefresh={fetchOrders}
          />
        </main>
      </div>
    </div>
  )
}
