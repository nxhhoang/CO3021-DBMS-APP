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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-all">
      <div className="animate-in fade-in zoom-in w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl duration-200 dark:bg-zinc-900">
        <div className="flex items-start justify-between border-b border-zinc-200 bg-zinc-50 px-8 py-6 dark:border-zinc-700 dark:bg-zinc-800/80">
          <div>
            <h2 className="flex flex-wrap items-center gap-3 text-2xl font-bold text-zinc-900 dark:text-white">
              <span>Chi tiết đơn hàng</span>
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Tạo lúc{' '}
              {new Date(order.createdAt).toLocaleString('vi-VN', {
                dateStyle: 'long',
                timeStyle: 'short',
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
          >
            <X size={24} className="text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>

        <div className="space-y-6 p-8 lg:p-10">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-800/50">
              <p className="mb-3 text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                Thông tin đơn hàng
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900/40">
                  <p className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                    Mã đơn hàng
                  </p>
                  <p className="mt-1 font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    #{renderSafeValue(order.orderID)}
                  </p>
                </div>

                <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900/40">
                  <p className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                    Địa chỉ giao hàng (ID)
                  </p>
                  <p className="mt-1 text-sm leading-relaxed wrap-break-word text-zinc-700 dark:text-zinc-300">
                    {addressLoading
                      ? 'Đang tải địa chỉ...'
                      : getShippingAddressText(order.shippingAddr, addresses) ||
                        'Chưa cung cấp địa chỉ giao hàng'}
                  </p>
                </div>

                <div className="rounded-lg bg-zinc-50 p-3 sm:col-span-2 dark:bg-zinc-900/40">
                  <p className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                    Tổng giá trị
                  </p>
                  <p className="mt-1 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(Number(order.totalAmount || 0))}
                  </p>
                </div>

                <div className="rounded-lg bg-zinc-50 p-3 sm:col-span-2 dark:bg-zinc-900/40">
                  <p className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                    Khách hàng (ID)
                  </p>
                  <p className="mt-1 font-mono text-sm font-bold break-all text-zinc-900 dark:text-zinc-100">
                    {renderSafeValue(order.userID)}
                  </p>
                </div>

                <div className="rounded-lg bg-zinc-50 p-3 sm:col-span-2 dark:bg-zinc-900/40">
                  <p className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                    Thời gian đặt
                  </p>
                  <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {new Date(order.createdAt).toLocaleString('vi-VN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-800/50">
              <p className="mb-2 text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                Trạng thái đơn hàng
              </p>
              <div className="mb-4">
                {(() => {
                  const status = getOrderStatusStyle(String(order.status))

                  return (
                    <div
                      className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 ${status.bgColor}`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${status.dotColor}`}
                      ></span>
                      <span
                        className={`text-sm font-semibold ${status.textColor}`}
                      >
                        {status.label}
                      </span>
                    </div>
                  )
                })()}
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                  Cập nhật trạng thái
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Select
                    value={selectedStatus}
                    onValueChange={onSelectedStatusChange}
                    disabled={updatingStatus}
                  >
                    <SelectTrigger className="h-10 flex-1">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
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
                    className="h-10 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    {updatingStatus ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Lưu
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-zinc-200 bg-zinc-50/50 px-8 py-4 dark:border-zinc-700 dark:bg-zinc-800/30">
          <button
            onClick={onClose}
            className="rounded-lg bg-zinc-900 px-6 py-2.5 font-bold text-white transition-all hover:bg-zinc-800 active:scale-95 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
