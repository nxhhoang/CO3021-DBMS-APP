'use client'
import React, { useMemo } from 'react'
import { AdminOrder, Pagination as PaginationMeta } from '@/types'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Eye, RefreshCw, RotateCcw } from 'lucide-react'
import { SearchBar } from '@/components/common/SearchBar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ORDER_STATUS } from '@/constants/enum'
import {
  PremiumTable,
  PremiumTableCell,
  PremiumTableContainer,
  PremiumTableHead,
  PremiumTableHeader,
  PremiumTableRow,
} from '@/components/common/PremiumTable'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/common/StatusBadge'
import { DataPagination } from '@/components/common/DataPagination'

interface OrderTableProps {
  orders: AdminOrder[]
  loading: boolean
  pagination: PaginationMeta | null
  currentPage: number
  onPageChange: (newPage: number) => void
  onRefresh: () => void
  onViewDetails: (order: AdminOrder) => void
  searchQuery: string
  setSearchQuery: (val: string) => void
  filterStatus: string
  setFilterStatus: (val: string) => void
  sortOrder: string
  setSortOrder: (val: string) => void
}

const OrderTable = ({
  orders,
  loading,
  pagination,
  currentPage,
  onPageChange,
  onRefresh,
  onViewDetails,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  sortOrder,
  setSortOrder,
}: OrderTableProps) => {
  return (
    <PremiumTableContainer
      title="Danh sách đơn hàng"
      subtitle="Theo dõi và quản lý các đơn hàng trên toàn hệ thống."
    >
      <div className="p-8">
        <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_200px_200px] lg:items-center">
          <SearchBar
            variant="admin"
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Tìm theo mã đơn hàng (vd: 10001)..."
            className="w-full"
          />

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="select-premium-trigger">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent className="select-premium-content">
              <SelectItem value="ALL" className="select-premium-item">
                Tất cả trạng thái
              </SelectItem>
              {Object.entries(ORDER_STATUS).map(([key, value]) => (
                <SelectItem
                  key={key}
                  value={value}
                  className="select-premium-item"
                >
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="select-premium-trigger">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent className="select-premium-content">
              <SelectItem value="oldest" className="select-premium-item">
                Cũ nhất trước
              </SelectItem>
              <SelectItem value="newest" className="select-premium-item">
                Mới nhất trước
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <PremiumTable>
          <PremiumTableHeader>
            <PremiumTableRow>
              <PremiumTableHead>Mã đơn hàng</PremiumTableHead>
              <PremiumTableHead>Khách hàng</PremiumTableHead>
              <PremiumTableHead>Thời gian</PremiumTableHead>
              <PremiumTableHead>Trạng thái</PremiumTableHead>
              <PremiumTableHead className="text-right">
                Tổng tiền
              </PremiumTableHead>
              <PremiumTableHead className="text-center">
                Thao tác
              </PremiumTableHead>
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
                  <div className="font-sans text-sm font-bold text-slate-900 dark:text-white">
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
                  <div className="font-mono text-base font-black tracking-tighter text-slate-900 dark:text-white">
                    {new Intl.NumberFormat('vi-VN').format(order.totalAmount)}
                    <span className="ml-1 text-[10px] font-bold text-slate-400 uppercase">
                      đ
                    </span>
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
        <div className="border-t border-slate-100 bg-slate-50/30 p-6 dark:border-white/5 dark:bg-white/5">
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
      </div>
    </PremiumTableContainer>
  )
}

export default React.memo(OrderTable)
