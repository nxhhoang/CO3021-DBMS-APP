'use client'
import React, { useMemo } from 'react'
import { AdminOrder, Pagination as PaginationMeta } from '@/types'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Eye, RefreshCw } from 'lucide-react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import {
  PremiumTable,
  PremiumTableCell,
  PremiumTableHead,
  PremiumTableHeader,
  PremiumTableRow,
} from '@/components/common/PremiumTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { DataPagination } from '@/components/common/DataPagination'

interface OrderTableProps {
  orders: AdminOrder[]
  loading: boolean
  pagination: PaginationMeta | null
  currentPage: number
  onPageChange: (newPage: number) => void
  onRefresh: () => void
  onViewDetails: (order: AdminOrder) => void // Thêm prop để mở Modal
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
        <PremiumTable>
          <PremiumTableHeader>
            <PremiumTableRow>
              <PremiumTableHead>Mã đơn hàng</PremiumTableHead>
              <PremiumTableHead>Khách hàng</PremiumTableHead>
              <PremiumTableHead>Thời gian</PremiumTableHead>
              <PremiumTableHead>Trạng thái</PremiumTableHead>
              <PremiumTableHead className="text-right">Tổng tiền</PremiumTableHead>
              <PremiumTableHead className="text-center">Thao tác</PremiumTableHead>
            </PremiumTableRow>
          </PremiumTableHeader>

          <tbody>
            {loading ? (
              <PremiumTableRow>
                <PremiumTableCell colSpan={6} className="p-24 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
                    <p className="font-display text-base font-bold text-slate-500">
                      Đang chuẩn bị dữ liệu...
                    </p>
                  </div>
                </PremiumTableCell>
              </PremiumTableRow>
            ) : orders.length === 0 ? (
              <PremiumTableRow>
                <PremiumTableCell colSpan={6} className="p-24 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-40">
                    <Eye size={40} className="text-slate-400" />
                    <p className="font-display text-base font-bold text-slate-500 italic">
                      Không tìm thấy dữ liệu.
                    </p>
                  </div>
                </PremiumTableCell>
              </PremiumTableRow>
            ) : (
              orders.map((order) => (
                <PremiumTableRow key={order.orderID}>
                  <PremiumTableCell>
                    <div className="font-mono text-sm font-black tracking-tighter text-blue-600">
                      #{order.orderID}
                    </div>
                  </PremiumTableCell>

                  <PremiumTableCell>
                    <div className="font-mono text-[11px] font-bold text-slate-600">
                      ID: {order.userID.slice(0, 8)}...
                    </div>
                  </PremiumTableCell>

                  <PremiumTableCell>
                    <div className="font-sans text-sm font-bold text-slate-900">
                      {format(new Date(order.createdAt), 'dd/MM/yyyy')}
                    </div>
                    <p className="mt-0.5 font-mono text-[10px] font-bold text-slate-400">
                      {format(new Date(order.createdAt), 'HH:mm')}
                    </p>
                  </PremiumTableCell>

                  <PremiumTableCell>
                    <StatusBadge status={order.status} />
                  </PremiumTableCell>

                  <PremiumTableCell className="text-right">
                    <div className="font-mono text-base font-black tracking-tighter text-slate-900">
                      {new Intl.NumberFormat('vi-VN').format(order.totalAmount)}
                      <span className="ml-1 text-[10px] font-bold uppercase text-slate-400">đ</span>
                    </div>
                  </PremiumTableCell>

                  <PremiumTableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="icon-box-premium h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => onViewDetails(order)}
                    >
                      <Eye size={18} strokeWidth={2.5} />
                    </Button>
                  </PremiumTableCell>
                </PremiumTableRow>
              ))
            )}
          </tbody>
        </PremiumTable>

        {/* FOOTER & PAGINATION */}
        {!loading && pagination && pagination.totalPages > 1 && (
          <div className="border-t border-slate-200 bg-slate-50/50 p-4 dark:border-white/10 dark:bg-slate-900">
            <DataPagination
              variant="minimal"
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              onPageChange={onPageChange}
              label="đơn hàng"
              className="w-full"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default React.memo(OrderTable)
