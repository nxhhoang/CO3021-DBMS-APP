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
    <div className="animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Đơn hàng
            </h1>
            <span className="flex h-5 items-center rounded-full bg-blue-50 px-2.5 text-[10px] font-black tracking-widest text-blue-600 uppercase ring-1 ring-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-900/30">
              Hệ thống quản lý
            </span>
          </div>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
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

        <OrderTable
          orders={orders}
          loading={loading}
          pagination={pagination}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onRefresh={refresh}
          onViewDetails={handleViewDetails}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
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
