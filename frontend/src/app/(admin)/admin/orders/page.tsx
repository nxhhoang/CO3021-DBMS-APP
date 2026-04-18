'use client'

import { useEffect, useState, useCallback } from 'react'
import { ClipboardList } from 'lucide-react'

// Types & Services
import { AdminOrder, Pagination } from '@/types'
import { orderService } from '@/services/order.service'

// Components
import { toast } from 'sonner'
import OrderTable from '@/features/adminOrder/components/OrderTable'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)

  // State phân trang
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const LIMIT = 10

  const fetchOrders = useCallback(async (page: number = 1) => {
    try {
      setLoading(true)
      const response = await orderService.getAdminOrders({ page, limit: LIMIT })

      if (response.data) {
        setOrders(response.data.orders)
        setPagination(response.data.pagination)
        setCurrentPage(page)
      }
    } catch (error) {
      toast.error('Không thể tải danh sách đơn hàng')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders(1)
  }, [fetchOrders])

  const handlePageChange = (newPage: number) => {
    if (pagination && newPage >= 1 && newPage <= pagination.totalPages) {
      fetchOrders(newPage)
    }
  }

  return (
    <div className="bg-surface min-h-screen px-6 py-8">
      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-on-surface flex items-center gap-3 text-3xl font-extrabold">
            <ClipboardList className="text-primary" size={28} />
            Quản lý đơn hàng
          </h1>
          <p className="text-on-surface-variant text-sm">
            {loading
              ? 'Đang tải dữ liệu...'
              : `Hiển thị ${orders.length} đơn hàng (Tổng số: ${pagination?.total || 0})`}
          </p>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-surface-container-lowest border-outline-variant/10 overflow-hidden rounded-xl border shadow-sm">
        <OrderTable
          orders={orders}
          loading={loading}
          pagination={pagination}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onRefresh={() => fetchOrders(currentPage)}
        />
      </div>
    </div>
  )
}