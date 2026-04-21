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
      className={`inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 ${config.bgColor} border border-white/20 shadow-sm transition-all hover:scale-105`}
    >
      <span className={`h-2 w-2 rounded-full animate-pulse ${config.dotColor}`} />
      <span
        className={`text-[10px] font-black tracking-widest uppercase ${config.textColor}`}
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
  onViewDetails,
}: OrderTableProps) => {
  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardHeader className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <CardTitle className="font-display text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Danh sách đơn hàng
          </CardTitle>
          <p className="font-sans text-sm font-medium text-slate-500">
            Tổng hợp thông tin chi tiết từ hệ thống cơ sở dữ liệu.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={loading}
          className="h-12 rounded-full border-slate-200 bg-white px-6 font-bold shadow-sm transition-all hover:bg-slate-50 active:scale-95"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 text-blue-600 ${loading ? 'animate-spin' : ''}`}
          />
          Làm mới
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-y border-slate-100 bg-slate-50/50 dark:border-white/5 dark:bg-slate-900/50">
                <th className="font-display h-16 px-8 text-left text-[11px] font-black tracking-widest text-slate-400 uppercase">
                  Mã đơn hàng
                </th>
                <th className="font-display h-16 px-8 text-left text-[11px] font-black tracking-widest text-slate-400 uppercase">
                  Khách hàng
                </th>
                <th className="font-display h-16 px-8 text-left text-[11px] font-black tracking-widest text-slate-400 uppercase">
                  Thời gian
                </th>
                <th className="font-display h-16 px-8 text-left text-[11px] font-black tracking-widest text-slate-400 uppercase">
                  Trạng thái
                </th>
                <th className="font-display h-16 px-8 text-right text-[11px] font-black tracking-widest text-slate-400 uppercase">
                  Tổng tiền
                </th>
                <th className="font-display h-16 px-8 text-center text-[11px] font-black tracking-widest text-slate-400 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
                        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
                      </div>
                      <p className="font-display text-lg font-bold text-slate-500">
                        Đang xử lý dữ liệu...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-24 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-40">
                      <Eye size={48} className="text-slate-400" />
                      <p className="font-display text-lg font-bold text-slate-500 italic">
                        Dữ liệu hiện đang trống.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.orderID}
                    className="group transition-all hover:bg-slate-50/50 dark:hover:bg-white/5"
                  >
                    <td className="px-8 py-6">
                      <div className="font-mono text-sm font-black tracking-tighter text-blue-600 dark:text-blue-400">
                        #{order.orderID}
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className="font-mono text-xs font-bold text-slate-600 dark:text-slate-400">
                        ID: {order.userID}
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className="font-sans text-sm font-bold text-slate-900 dark:text-white">
                        {format(new Date(order.createdAt), 'dd/MM/yyyy')}
                      </div>
                      <p className="mt-1 font-mono text-[10px] font-bold text-slate-400">
                        {format(new Date(order.createdAt), 'HH:mm')}
                      </p>
                    </td>

                    <td className="px-8 py-6">{getStatusBadge(order.status)}</td>

                    <td className="px-8 py-6 text-right">
                      <div className="font-mono text-lg font-black tracking-tighter text-slate-900 dark:text-white">
                        {new Intl.NumberFormat('vi-VN').format(
                          order.totalAmount,
                        )}
                        <span className="ml-1 text-[10px] font-bold uppercase text-slate-400">đ</span>
                      </div>
                    </td>

                    <td className="px-8 py-6 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full transition-all hover:scale-110 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20"
                        onClick={() => onViewDetails(order)}
                      >
                        <Eye size={20} strokeWidth={2.5} />
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
          <div className="flex flex-col items-center justify-between gap-8 border-t border-slate-50 bg-slate-50/30 p-10 md:flex-row dark:border-white/5 dark:bg-slate-900/50">
            {/* INFO */}
            <div className="flex items-center gap-3">
               <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center dark:border-slate-900">
                     <span className="font-mono text-[10px] font-bold text-blue-600">{orders.length}</span>
                  </div>
                  <div className="h-8 w-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center dark:border-slate-900">
                     <span className="font-mono text-[10px] font-bold text-slate-500">{pagination.total}</span>
                  </div>
               </div>
               <p className="font-display text-[11px] font-black tracking-widest text-slate-400 uppercase">
                  Bản ghi hiển thị / Tổng số
               </p>
            </div>

            {/* PAGINATION */}
            <Pagination className="mx-0 w-auto">
              <PaginationContent className="gap-2">
                <PaginationItem>
                  <PaginationPrevious
                    className={`h-10 w-10 rounded-full border-slate-200 p-0 transition-all active:scale-90 ${
                      currentPage <= 1
                        ? 'pointer-events-none opacity-20'
                        : 'cursor-pointer hover:bg-white shadow-sm'
                    }`}
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
                      className={`h-10 w-10 cursor-pointer rounded-full font-mono text-sm font-bold transition-all active:scale-90 ${
                        page === currentPage
                          ? 'bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-900'
                          : 'border-transparent hover:bg-white hover:shadow-sm'
                      }`}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    className={`h-10 w-10 rounded-full border-slate-200 p-0 transition-all active:scale-90 ${
                      currentPage >= pagination.totalPages
                        ? 'pointer-events-none opacity-20'
                        : 'cursor-pointer hover:bg-white shadow-sm'
                    }`}
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
