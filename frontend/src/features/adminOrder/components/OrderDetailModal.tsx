'use client'

import { Loader2, X } from 'lucide-react'

import { AdminOrder } from '@/types'
import { ORDER_STATUS, getOrderStatusStyle } from '@/constants/enum'
import { Address } from '@/types/address.types'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface OrderDetailModalProps {
  order: AdminOrder | null
  isOpen: boolean
  selectedStatus: string
  updatingStatus: boolean
  addresses: Address[]
  addressLoading: boolean
  onClose: () => void
  onSelectedStatusChange: (value: string) => void
  onStatusUpdate: () => void
}

const renderSafeValue = (value: any) => {
  if (typeof value === 'object' && value !== null) {
    return value.id || JSON.stringify(value)
  }

  return String(value || '')
}

const getShippingAddressId = (shippingAddr: any) => {
  if (!shippingAddr) return null

  if (typeof shippingAddr === 'object' && shippingAddr !== null) {
    const id = shippingAddr.id
    return id ? Number(id) : null
  }

  const id = Number(shippingAddr)
  return Number.isFinite(id) ? id : null
}

const getShippingAddressText = (shippingAddr: any, addresses: Address[]) => {
  const addressId = getShippingAddressId(shippingAddr)

  if (!addressId) {
    return ''
  }

  const matchedAddress = addresses.find(
    (address) => address.addressID === addressId,
  )

  if (!matchedAddress) {
    return `#${addressId}`
  }

  return [
    matchedAddress.addressName,
    matchedAddress.addressLine,
    matchedAddress.district,
    matchedAddress.city,
  ]
    .filter(Boolean)
    .join(' · ')
}

export default function OrderDetailModal({
  order,
  isOpen,
  selectedStatus,
  updatingStatus,
  addresses,
  addressLoading,
  onClose,
  onSelectedStatusChange,
  onStatusUpdate,
}: OrderDetailModalProps) {
  if (!isOpen || !order) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md transition-all duration-500">
      <div className="animate-in fade-in zoom-in-95 w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl duration-300 dark:bg-slate-900">
        {/* MODAL HEADER */}
        <div className="flex items-start justify-between border-b border-slate-100 bg-slate-50/50 px-8 py-6 backdrop-blur-xl dark:border-white/10 dark:bg-slate-800/50">
          <div className="space-y-1">
            <h2 className="font-display flex items-center gap-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              <span>Chi tiết đơn hàng</span>
            </h2>
            <p className="font-sans text-xs font-medium text-slate-500 dark:text-slate-400">
              Khởi tạo vào lúc{' '}
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {new Date(order.createdAt).toLocaleString('vi-VN', {
                  dateStyle: 'long',
                  timeStyle: 'short',
                })}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 p-3 text-slate-400 transition-all hover:scale-110 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="custom-scrollbar max-h-[70vh] overflow-y-auto p-8 lg:p-10">
          <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1.15fr_0.85fr]">
            {/* LEFT COLUMN: INFORMATION */}
            <div className="space-y-6 rounded-2xl border border-slate-100 bg-white p-6 dark:border-white/5 dark:bg-slate-800/40">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-4 dark:border-white/5">
                <div className="h-1.5 w-6 rounded-full bg-blue-600" />
                <p className="font-display text-[11px] font-black tracking-widest text-slate-400 uppercase">
                  Thông tin cơ bản
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Mã đơn hàng
                  </p>
                  <p className="font-mono text-lg font-black tracking-tighter text-blue-600 dark:text-blue-400">
                    #{renderSafeValue(order.orderID)}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Tổng giá trị
                  </p>
                  <p className="font-mono text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(Number(order.totalAmount || 0))}
                  </p>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Địa chỉ nhận hàng
                  </p>
                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50">
                    <p className="text-sm leading-relaxed font-medium text-slate-700 dark:text-slate-300">
                      {addressLoading
                        ? 'Đang tải thông tin địa chỉ...'
                        : getShippingAddressText(
                            order.shippingAddr,
                            addresses,
                          ) || 'Thông tin địa chỉ không khả dụng'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Khách hàng
                  </p>
                  <p className="font-mono text-xs font-bold break-all text-slate-500">
                    ID: {renderSafeValue(order.userID)}
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: ACTIONS & STATUS */}
            <div className="space-y-6 rounded-2xl border border-slate-100 bg-slate-50/30 p-6 dark:border-white/5 dark:bg-slate-800/20">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-white/5">
                <div className="h-1.5 w-6 rounded-full bg-cyan-500" />
                <p className="font-display text-[11px] font-black tracking-widest text-slate-400 uppercase">
                  Quản lý trạng thái
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Trạng thái hiện tại
                  </p>
                  {(() => {
                    const status = getOrderStatusStyle(String(order.status))
                    return (
                      <div
                        className={`inline-flex items-center gap-3 rounded-full px-5 py-2 ${status.bgColor} border border-white/40 shadow-sm`}
                      >
                        <span
                          className={`h-2 w-2 animate-pulse rounded-full ${status.dotColor}`}
                        />
                        <span
                          className={`text-xs font-black tracking-widest uppercase ${status.textColor}`}
                        >
                          {status.label}
                        </span>
                      </div>
                    )
                  })()}
                </div>

                <div className="space-y-4 pt-6">
                  <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Thay đổi trạng thái
                  </p>
                  <div className="flex flex-col gap-4">
                    <Select
                      value={selectedStatus}
                      onValueChange={onSelectedStatusChange}
                      disabled={updatingStatus}
                    >
                      <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-white font-bold shadow-sm dark:border-white/10 dark:bg-slate-900">
                        <SelectValue placeholder="Chọn trạng thái mới" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        {Object.keys(ORDER_STATUS).map((status) => (
                          <SelectItem key={status} value={status}>
                            {getOrderStatusStyle(status).label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      onClick={onStatusUpdate}
                      disabled={
                        updatingStatus ||
                        !selectedStatus ||
                        selectedStatus === order.status
                      }
                      className="h-12 rounded-xl bg-slate-900 text-xs font-black tracking-widest text-white uppercase transition-all hover:bg-slate-800 active:scale-95 disabled:bg-slate-100 disabled:text-slate-400 dark:bg-white dark:text-slate-900"
                    >
                      {updatingStatus ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : null}
                      Cập nhật trạng thái
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="flex justify-end gap-4 border-t border-slate-100 bg-slate-50/50 px-8 py-4 dark:border-white/10 dark:bg-slate-800/50">
          <Button
            onClick={onClose}
            variant="ghost"
            className="rounded-full px-8 font-bold text-slate-500 transition-all hover:bg-slate-100 active:scale-95"
          >
            Đóng
          </Button>
        </div>
      </div>
    </div>
  )
}
