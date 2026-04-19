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
    <div className="bg-surface min-h-screen px-6 py-8">
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h1 className="text-on-surface text-3xl font-extrabold">
              Quản lý đơn hàng
            </h1>
          </div>
          <p className="text-on-surface-variant max-w-2xl text-sm">
            {loading
              ? 'Đang tải dữ liệu...'
              : `Hiển thị ${orders.length} đơn hàng · Tổng số: ${pagination?.total || 0}`}
          </p>
        </div>
      </div>

      <SummaryCard
        totalOrders={summaryCards.totalOrders}
        statusCounts={summaryCards.statusCounts}
      />

      <div className="bg-surface-container-lowest border-outline-variant/10 overflow-hidden rounded-xl border shadow-sm">
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