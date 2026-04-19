'use client'

import { AdminOrder, Pagination as PaginationMeta } from '@/types'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Eye, RefreshCw } from 'lucide-react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { getOrderStatusStyle } from '@/constants/enum'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface OrderTableProps {
  orders: AdminOrder[]
  loading: boolean
  pagination: PaginationMeta | null
  currentPage: number
  onPageChange: (newPage: number) => void
  onRefresh: () => void
  onViewDetails: (order: AdminOrder) => void // Thêm prop để mở Modal
}

const getStatusBadge = (status: string) => {
  const config = getOrderStatusStyle(status)

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 ${config.bgColor}`}
    >
      <span className={`h-2 w-2 rounded-full ${config.dotColor}`}></span>
      <span
        className={`text-xs font-semibold tracking-wide ${config.textColor}`}
      >
        {config.label}
      </span>
    </div>
  )
}

const OrderTable = ({
  orders,
  loading,
  pagination,
  currentPage,
  onPageChange,
  onRefresh,
  onViewDetails, // Destructure prop mới
}: OrderTableProps) => {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold">
          Danh sách đơn hàng chi tiết
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
          className="h-9"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`}
          />
          Làm mới
        </Button>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/80">
                <th className="h-14 px-6 text-left text-xs font-bold tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
                  Mã đơn hàng
                </th>
                <th className="h-14 px-6 text-left text-xs font-bold tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
                  Khách hàng (ID)
                </th>
                <th className="h-14 px-6 text-left text-xs font-bold tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
                  Ngày tạo
                </th>
                <th className="h-14 px-6 text-left text-xs font-bold tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
                  Trạng thái
                </th>
                <th className="h-14 px-6 text-right text-xs font-bold tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
                  Tổng tiền
                </th>
                <th className="h-14 px-6 text-center text-xs font-bold tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="relative divide-y divide-zinc-100 dark:divide-zinc-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="rounded-full bg-zinc-100 p-3 dark:bg-zinc-700">
                        <RefreshCw className="h-5 w-5 animate-spin text-zinc-400" />
                      </div>
                      <p className="text-sm font-medium text-zinc-500">
                        Đang tải dữ liệu...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-24 text-center">
                    <p className="text-sm text-zinc-400 italic">
                      Không tìm thấy đơn hàng nào.
                    </p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.orderID}
                    className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-700/30"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded-md bg-blue-50 px-2.5 py-1 font-mono text-xs font-bold text-blue-700 ring-1 ring-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:ring-blue-900/30">
                          #{order.orderID}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-700 dark:text-zinc-300">
                        {order.userID}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-700 dark:text-zinc-300">
                        {format(new Date(order.createdAt), 'dd/MM/yyyy')}
                      </div>
                      <p className="mt-0.5 text-xs text-zinc-400">
                        {format(new Date(order.createdAt), 'HH:mm')}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        {new Intl.NumberFormat('vi-VN').format(
                          order.totalAmount,
                        )}
                        <span className="ml-1 text-xs">đ</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="group relative h-9 w-9 rounded-lg hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20"
                        onClick={() => onViewDetails(order)}
                      >
                        <Eye
                          size={18}
                          className="transition-transform group-hover:scale-110"
                        />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER & PAGINATION */}
        {!loading && pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex flex-col items-center justify-between gap-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 md:flex-row dark:border-zinc-700 dark:bg-zinc-800/60">
            {/* INFO */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Hiển thị</span>
              <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-md bg-blue-100 font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                {orders.length}
              </span>
              <span className="text-zinc-600 dark:text-zinc-400">trên</span>
              <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-md bg-purple-100 font-bold text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                {pagination.total}
              </span>
              <span className="text-zinc-600 dark:text-zinc-400">đơn hàng</span>
            </div>

            {/* PAGINATION */}
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className={
                      currentPage <= 1
                        ? 'pointer-events-none opacity-40'
                        : 'cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-600'
                    }
                    onClick={() => onPageChange(currentPage - 1)}
                  />
                </PaginationItem>

                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1,
                ).map((page) => (
                  <PaginationItem key={page} className="hidden sm:block">
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => onPageChange(page)}
                      className={`cursor-pointer transition-all ${
                        page === currentPage
                          ? 'bg-blue-600 text-white hover:bg-blue-600'
                          : 'hover:bg-zinc-200 dark:hover:bg-zinc-600'
                      }`}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    className={
                      currentPage >= pagination.totalPages
                        ? 'pointer-events-none opacity-40'
                        : 'cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-600'
                    }
                    onClick={() => onPageChange(currentPage + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default OrderTable
