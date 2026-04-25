'use client'

import { ORDER_STATUS } from '@/constants/enum'

// Hooks
import { useAdminOrders } from '@/features/admin/orders/hooks/useAdminOrders'

// Components
import { Button } from '@/components/ui/button'
import OrderTable from '@/features/adminOrder/components/OrderTable'
import OrderDetailModal from '@/features/adminOrder/components/OrderDetailModal'
import SummaryCard from '@/features/adminOrder/components/SummaryCard'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SearchBar } from '@/components/common/SearchBar'

export default function AdminOrdersPage() {
  const {
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
    refresh,
  } = useAdminOrders()

  return (
    <div className="relative isolate min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-8">
        <div className="animate-in fade-in slide-in-from-top-4 mb-6 flex flex-col gap-4 duration-700 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-4 py-1.5 text-[11px] font-black tracking-widest text-blue-600 uppercase backdrop-blur-sm dark:border-blue-900/30 dark:bg-blue-900/20 dark:text-blue-400">
              Hệ thống quản lý
            </div>
            <h1 className="font-display text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Quản lý{' '}
              <span className="bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Đơn hàng
              </span>
            </h1>
            <p className="font-sans text-base text-slate-500 dark:text-slate-400">
              {loading
                ? 'Đang chuẩn bị dữ liệu...'
                : `Theo dõi và xử lý ${pagination?.total || orders.length} đơn hàng trên toàn hệ thống.`}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={refresh}
              variant="outline"
              size="sm"
              className="btn-premium-secondary h-10 px-6 shadow-sm"
            >
              Làm mới dữ liệu
            </Button>
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-4 duration-700">
          <SummaryCard
            totalOrders={summaryCards.totalOrders}
            statusCounts={summaryCards.statusCounts}
          />

          {/* SEARCH, FILTER & SORT BAR */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-slate-900/50">
            <div className="flex min-w-[300px] flex-1 items-center gap-3">
              <SearchBar
                variant="admin"
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Tìm theo mã đơn hàng (vd: 10001)..."
                className="max-w-md"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-10 w-[160px] rounded-xl border-slate-200 bg-white font-bold text-slate-700 shadow-sm dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl dark:border-white/10 dark:bg-slate-900">
                    <SelectItem value="ALL" className="rounded-lg font-bold">
                      Tất cả trạng thái
                    </SelectItem>
                    {Object.entries(ORDER_STATUS).map(([key, value]) => (
                      <SelectItem
                        key={key}
                        value={value}
                        className="rounded-lg font-bold"
                      >
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3">
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="h-10 w-[160px] rounded-xl border-slate-200 bg-white font-bold text-slate-700 shadow-sm dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
                    <SelectValue placeholder="Sắp xếp" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl dark:border-white/10 dark:bg-slate-900">
                    <SelectItem value="oldest" className="rounded-lg font-bold">
                      Cũ nhất trước
                    </SelectItem>
                    <SelectItem value="newest" className="rounded-lg font-bold">
                      Mới nhất trước
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md dark:border-white/10 dark:bg-slate-900/50 dark:shadow-none">
            <OrderTable
              orders={orders}
              loading={loading}
              pagination={pagination}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onRefresh={refresh}
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
