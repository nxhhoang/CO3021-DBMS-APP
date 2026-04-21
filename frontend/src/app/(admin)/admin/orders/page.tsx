'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'

// Types & Services
import { AdminOrder, Pagination } from '@/types'
import { ORDER_STATUS, getOrderStatusStyle } from '@/constants/enum'
import { orderService } from '@/services/order.service'
import { addressService } from '@/services/address.service'
import { Address } from '@/types/address.types'

// Components
import { toast } from 'sonner'
import OrderTable from '@/features/adminOrder/components/OrderTable'
import OrderDetailModal from '@/features/adminOrder/components/OrderDetailModal'
import SummaryCard from '@/features/adminOrder/components/SummaryCard'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [addressLoading, setAddressLoading] = useState(false)

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

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setAddressLoading(true)
        const response = await addressService.getAddresses()

        if (response.data) {
          setAddresses(response.data)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setAddressLoading(false)
      }
    }

    fetchAddresses()
  }, [])

  const handlePageChange = (newPage: number) => {
    if (pagination && newPage >= 1 && newPage <= pagination.totalPages) {
      fetchOrders(newPage)
    }
  }

  const handleViewDetails = (order: AdminOrder) => {
    setSelectedOrder(order)
    setSelectedStatus(order.status)
    setIsModalOpen(true)
  }

  const summaryCards = useMemo(() => {
    const totalOrders = pagination?.total ?? orders.length

    const statusCounts = Object.keys(ORDER_STATUS).map((status) => ({
      status,
      count: orders.filter((order) => order.status === status).length,
      accentClass:
        status === 'PENDING'
          ? 'border-l-amber-500'
          : status === 'PROCESSING'
            ? 'border-l-blue-500'
            : status === 'SHIPPED'
              ? 'border-l-sky-500'
              : status === 'DELIVERED'
                ? 'border-l-green-500'
                : 'border-l-red-500',
      ...getOrderStatusStyle(status),
    }))

    return { totalOrders, statusCounts }
  }, [orders, pagination?.total])

  const handleStatusUpdate = async () => {
    if (
      !selectedOrder ||
      !selectedStatus ||
      selectedStatus === selectedOrder.status
    ) {
      return
    }

    try {
      setUpdatingStatus(true)
      const response = await orderService.updateOrderStatus(
        selectedOrder.orderID,
        {
          status: selectedStatus as keyof typeof ORDER_STATUS,
        },
      )

      if (response.data) {
        toast.success(
          `Đã cập nhật trạng thái đơn hàng #${selectedOrder.orderID}`,
        )
        setSelectedOrder((current) =>
          current ? { ...current, status: selectedStatus as any } : current,
        )
        await fetchOrders(currentPage)
      }
    } catch (error) {
      toast.error('Không thể cập nhật trạng thái đơn hàng')
      console.error(error)
    } finally {
      setUpdatingStatus(false)
    }
  }

  return (
    <div className="relative isolate min-h-screen w-full bg-slate-50 dark:bg-slate-950">
      {/* SUBTLE BACKGROUND SYSTEM FOR ADMIN */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
        <div
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #64748b 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-blue-400/5 blur-[100px] dark:bg-blue-900/5" />
      </div>

      <div className="container mx-auto px-6 py-10 md:py-16">
        <div className="animate-in fade-in slide-in-from-top-4 mb-12 flex flex-col gap-8 duration-700 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-4 py-1.5 text-[11px] font-black tracking-widest text-blue-600 uppercase backdrop-blur-sm dark:border-blue-900/30 dark:bg-blue-900/20 dark:text-blue-400">
              Hệ thống quản lý
            </div>
            <h1 className="font-display text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Quản lý{' '}
              <span className="bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Đơn hàng
              </span>
            </h1>
            <p className="font-sans text-lg text-slate-500 dark:text-slate-400">
              {loading
                ? 'Đang chuẩn bị dữ liệu...'
                : `Theo dõi và xử lý ${pagination?.total || orders.length} đơn hàng trên toàn hệ thống.`}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => fetchOrders(currentPage)}
              variant="outline"
              className="rounded-full border-slate-200 font-bold active:scale-95 transition-all hover:bg-white shadow-sm"
            >
              Làm mới dữ liệu
            </Button>
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-10 duration-700">
          <SummaryCard
            totalOrders={summaryCards.totalOrders}
            statusCounts={summaryCards.statusCounts}
          />

          <div className="overflow-hidden rounded-[2rem] border border-white/40 bg-white/40 shadow-2xl shadow-slate-200/50 backdrop-blur-3xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
            <OrderTable
              orders={orders}
              loading={loading}
              pagination={pagination}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onRefresh={() => fetchOrders(currentPage)}
              onViewDetails={handleViewDetails}
            />
          </div>
        </div>
      </div>

      <OrderDetailModal
        order={selectedOrder}
        isOpen={isModalOpen}
        selectedStatus={selectedStatus}
        updatingStatus={updatingStatus}
        addresses={addresses}
        addressLoading={addressLoading}
        onClose={() => setIsModalOpen(false)}
        onSelectedStatusChange={setSelectedStatus}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  )
}