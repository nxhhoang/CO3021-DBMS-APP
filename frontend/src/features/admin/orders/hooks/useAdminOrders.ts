'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { AdminOrder, Pagination } from '@/types'
import { orderService } from '@/services/order.service'
import { addressService } from '@/services/address.service'
import { Address } from '@/types/address.types'
import { toast } from 'sonner'
import { ORDER_STATUS, getOrderStatusStyle } from '@/constants/enum'
import { useDebounce } from '@/hooks/useDebounce'

export function useAdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [addressLoading, setAddressLoading] = useState(false)

  // Filter, Sort & Search State
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [sortOrder, setSortOrder] = useState<string>('oldest')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const LIMIT = 10

  const fetchOrders = useCallback(
    async (page: number = 1) => {
      try {
        setLoading(true)
        const response = await orderService.getAdminOrders({
          page,
          limit: LIMIT,
          search: debouncedSearchQuery || undefined,
          status: filterStatus === 'ALL' ? undefined : filterStatus,
          sort: sortOrder,
        })

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
    },
    [debouncedSearchQuery, filterStatus, sortOrder],
  )

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

  return {
    orders,
    loading,
    selectedOrder,
    isModalOpen,
    setIsModalOpen,
    selectedStatus,
    setSelectedStatus,
    updatingStatus,
    addresses,
    addressLoading,
    filterStatus,
    setFilterStatus,
    sortOrder,
    setSortOrder,
    searchQuery,
    setSearchQuery,
    pagination,
    currentPage,
    handlePageChange,
    handleViewDetails,
    handleStatusUpdate,
    summaryCards,
    refresh: () => fetchOrders(currentPage),
  }
}
