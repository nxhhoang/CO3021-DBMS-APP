'use client'
import React, { useMemo } from 'react'
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
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${config.bgColor} border border-white/20 shadow-xs`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dotColor}`} />
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
      <CardHeader className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <CardTitle className="font-display text-lg font-black tracking-tight text-slate-900 dark:text-white">
            Danh sách đơn hàng
          </CardTitle>
          <p className="font-sans text-xs font-medium text-slate-500">
            Tổng hợp thông tin chi tiết từ hệ thống.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={loading}
          className="h-9 rounded-xl border-slate-200 bg-white px-4 font-bold shadow-sm transition-all hover:bg-slate-50 active:scale-95 text-[11px]"
        >
          <RefreshCw
            className={`mr-2 h-3.5 w-3.5 text-blue-600 ${loading ? 'animate-spin' : ''}`}
          />
          Làm mới
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-y border-slate-200 bg-slate-100/80 dark:border-white/10 dark:bg-slate-900">
                <th className="font-display h-10 px-6 text-left text-[10px] font-black tracking-widest text-slate-500 uppercase">
                  Mã đơn hàng
                </th>
                <th className="font-display h-10 px-6 text-left text-[10px] font-black tracking-widest text-slate-500 uppercase">
                  Khách hàng
                </th>
                <th className="font-display h-10 px-6 text-left text-[10px] font-black tracking-widest text-slate-500 uppercase">
                  Thời gian
                </th>
                <th className="font-display h-10 px-6 text-left text-[10px] font-black tracking-widest text-slate-500 uppercase">
                  Trạng thái
                </th>
                <th className="font-display h-10 px-6 text-right text-[10px] font-black tracking-widest text-slate-500 uppercase">
                  Tổng tiền
                </th>
                <th className="font-display h-10 px-6 text-center text-[10px] font-black tracking-widest text-slate-500 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
                      <p className="font-display text-base font-bold text-slate-500">
                        Đang chuẩn bị dữ liệu...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-24 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-40">
                      <Eye size={40} className="text-slate-400" />
                      <p className="font-display text-base font-bold text-slate-500 italic">
                        Không tìm thấy dữ liệu.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.orderID}
                    className="group transition-all hover:bg-slate-50 dark:hover:bg-white/5"
                  >
                    <td className="px-5 py-3">
                      <div className="font-mono text-sm font-black tracking-tighter text-blue-600 dark:text-blue-400">
                        #{order.orderID}
                      </div>
                    </td>

                    <td className="px-5 py-3">
                      <div className="font-mono text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        ID: {order.userID.slice(0, 8)}...
                      </div>
                    </td>

                    <td className="px-5 py-3">
                      <div className="font-sans text-sm font-bold text-slate-900 dark:text-white">
                        {format(new Date(order.createdAt), 'dd/MM/yyyy')}
                      </div>
                      <p className="mt-0.5 font-mono text-[10px] font-bold text-slate-400">
                        {format(new Date(order.createdAt), 'HH:mm')}
                      </p>
                    </td>

                    <td className="px-5 py-3">{getStatusBadge(order.status)}</td>

                    <td className="px-5 py-3 text-right">
                      <div className="font-mono text-base font-black tracking-tighter text-slate-900 dark:text-white">
                        {new Intl.NumberFormat('vi-VN').format(
                          order.totalAmount,
                        )}
                        <span className="ml-1 text-[10px] font-bold uppercase text-slate-400">đ</span>
                      </div>
                    </td>

                    <td className="px-5 py-3 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg transition-all hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20"
                        onClick={() => onViewDetails(order)}
                      >
                        <Eye size={18} strokeWidth={2.5} />
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
          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 bg-slate-50/50 p-4 md:flex-row dark:border-white/10 dark:bg-slate-900">
            {/* INFO */}
             <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                   <div className="min-w-8 h-8 px-2 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center dark:border-slate-900 shadow-sm">
                      <span className="font-mono text-[10px] font-black text-blue-600">{orders.length}</span>
                   </div>
                   <div className="h-1 w-2 rounded-full bg-slate-300" />
                   <div className="min-w-8 h-8 px-2 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center dark:border-slate-900 shadow-sm">
                      <span className="font-mono text-[10px] font-black text-slate-600">{pagination.total.toLocaleString()}</span>
                   </div>
                </div>
               <p className="font-display text-[10px] font-black tracking-widest text-slate-500 uppercase">
                  Hiển thị / Tổng cộng
               </p>
            </div>

            {/* PAGINATION */}
            <Pagination className="mx-0 w-auto">
              <PaginationContent className="gap-1.5">
                <PaginationItem>
                  <PaginationPrevious
                    className={`h-9 px-3 rounded-xl border-slate-200 transition-all active:scale-90 ${
                      currentPage <= 1
                        ? 'pointer-events-none opacity-20'
                        : 'cursor-pointer hover:bg-white shadow-sm'
                    }`}
                    onClick={() => onPageChange(currentPage - 1)}
                  />
                </PaginationItem>

                {(() => {
                  const total = pagination.totalPages
                  const current = currentPage
                  const pages: (number | string)[] = []
                  
                  if (total <= 7) {
                    for (let i = 1; i <= total; i++) pages.push(i)
                  } else {
                    pages.push(1)
                    if (current > 4) pages.push('ellipsis-start')
                    
                    const start = Math.max(2, current - 2)
                    const end = Math.min(total - 1, current + 2)
                    
                    for (let i = start; i <= end; i++) {
                      pages.push(i)
                    }
                    
                    if (current < total - 3) pages.push('ellipsis-end')
                    pages.push(total)
                  }

                  return pages.map((page, index) => {
                    if (typeof page === 'string') {
                      return (
                        <PaginationItem key={`${page}-${index}`} className="hidden sm:block">
                          <span className="flex h-9 w-9 items-center justify-center text-slate-400">...</span>
                        </PaginationItem>
                      )
                    }
                    return (
                      <PaginationItem key={page} className="hidden sm:block">
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => onPageChange(page)}
                          className={`h-9 min-w-9 px-2 cursor-pointer rounded-xl font-mono text-sm font-bold transition-all active:scale-90 ${
                            page === currentPage
                              ? 'bg-slate-900 text-white shadow-md dark:bg-white dark:text-slate-900'
                              : 'border-transparent hover:bg-white hover:shadow-sm'
                          }`}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })
                })()}

                <PaginationItem>
                  <PaginationNext
                    className={`h-9 px-3 rounded-xl border-slate-200 transition-all active:scale-90 ${
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

export default React.memo(OrderTable)
