'use client'

import React from 'react'
import PageBackground from '@/components/layout/PageBackground'
import {
  useCart,
  useCheckout,
  PaymentMethodSelector,
  OrderItemsList,
  CheckoutDialogs,
} from '@/features/cart'

import { Button } from '@/components/ui/button'
import {
  ShieldCheck,
  MapPin,
  CreditCard,
  Truck,
  ChevronLeft,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

export default function CheckoutPage() {
  const { selectedItems, totalPrice } = useCart()
  const {
    paymentMethod,
    setPaymentMethod,
    isLoading,
    isAddressLoading,
    orderID,
    setOrderID,
    dialogState,
    setDialogState,
    handleCheckout,
    defaultAddress,
  } = useCheckout(selectedItems)

  if (selectedItems.length === 0 && !dialogState.success) {
    return (
      <PageBackground
        variant="minimal"
        className="flex flex-col items-center justify-center overflow-hidden"
      >
        <div className="flex flex-col items-center gap-10 px-4 text-center">
          <div className="relative">
            <div className="rounded-full bg-slate-100 p-10 dark:bg-slate-800">
              <Truck className="h-16 w-16 text-slate-300" strokeWidth={1.5} />
            </div>
            <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/5" />
          </div>
          <div className="max-w-md space-y-4">
            <h1 className="font-display text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Hóa đơn đang trống
            </h1>
            <p className="text-base leading-relaxed font-medium text-slate-500">
              Bạn cần chọn ít nhất một sản phẩm từ giỏ hàng để có thể tiến hành
              thanh toán và nhận ưu đãi.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="font-display h-16 rounded-full px-12 text-[11px] font-black tracking-[0.2em] uppercase shadow-2xl shadow-slate-200/50 transition-all hover:scale-105 dark:bg-white dark:text-slate-900"
          >
            <Link href="/cart">Quay lại giỏ hàng</Link>
          </Button>
        </div>
      </PageBackground>
    )
  }

  return (
    <PageBackground variant="subtle" className="overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        {/* HEADER */}
        <div className="animate-in fade-in slide-in-from-top-6 mb-16 space-y-6 duration-1000">
          <Button
            asChild
            variant="ghost"
            className="group -ml-4 h-12 rounded-full px-6 text-slate-500 transition-all hover:bg-white hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <Link href="/cart" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span className="font-display text-[11px] font-black tracking-widest uppercase">
                Quay lại giỏ hàng
              </span>
            </Link>
          </Button>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6">
            <h1 className="font-display text-5xl font-black tracking-tight text-slate-900 sm:text-6xl dark:text-white">
              Thanh toán
            </h1>
            <div className="flex items-center gap-3 font-mono text-xl font-medium text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
              Review & Checkout
            </div>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-12">
          {/* MAIN FORM */}
          <div className="animate-in fade-in slide-in-from-left-6 space-y-10 duration-1000 lg:col-span-8">
            {/* SHIPPING ADDRESS */}
            <div className="glass-card">
              <div className="border-b border-slate-100 px-10 py-10 dark:border-white/5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/20">
                    <MapPin className="h-6 w-6" strokeWidth={2.5} />
                  </div>
                  <h2 className="font-display text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    Địa chỉ giao hàng
                  </h2>
                </div>
              </div>
              <div className="p-10">
                {isAddressLoading ? (
                  <div className="flex items-center gap-4 py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    <p className="font-display text-sm font-bold tracking-widest text-slate-400 uppercase">
                      Đang tải thông tin địa chỉ...
                    </p>
                  </div>
                ) : defaultAddress ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <p className="font-display text-2xl font-black text-slate-900 dark:text-white">
                        {defaultAddress.addressName}
                      </p>
                      <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 ring-1 ring-blue-100 dark:bg-blue-900/30 dark:ring-blue-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        <span className="font-display text-[10px] font-black tracking-widest text-blue-600 uppercase">
                          Địa chỉ mặc định
                        </span>
                      </div>
                    </div>
                    <p className="max-w-2xl text-lg leading-relaxed font-medium text-slate-500 dark:text-slate-400">
                      {`${defaultAddress.addressLine}, ${defaultAddress.district}, ${defaultAddress.city}`}
                    </p>
                    <div className="pt-4">
                      <Button
                        variant="outline"
                        className="font-display h-12 rounded-full border-slate-200 px-8 text-[10px] font-black tracking-widest text-slate-600 uppercase transition-all hover:bg-slate-50 hover:text-slate-900 dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                      >
                        Thay đổi địa chỉ giao hàng
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-6 py-12 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/20">
                      <MapPin className="h-10 w-10 text-rose-500 opacity-20" />
                    </div>
                    <p className="font-display text-lg font-bold tracking-widest text-rose-500 uppercase">
                      Chưa có địa chỉ giao hàng
                    </p>
                    <Button className="font-display h-14 rounded-full bg-slate-900 px-10 text-[11px] font-black tracking-widest text-white uppercase transition-all hover:scale-105 dark:bg-white dark:text-slate-900">
                      Thêm địa chỉ mới ngay
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* PAYMENT METHOD */}
            <div className="glass-card">
              <div className="border-b border-slate-100 px-10 py-10 dark:border-white/5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-xl shadow-cyan-500/20">
                    <CreditCard className="h-6 w-6" strokeWidth={2.5} />
                  </div>
                  <h2 className="font-display text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    Phương thức thanh toán
                  </h2>
                </div>
              </div>
              <div className="p-10">
                <PaymentMethodSelector
                  selected={paymentMethod}
                  onChange={setPaymentMethod}
                />
              </div>
            </div>

            {/* ORDER ITEMS REVIEW */}
            <div className="glass-card">
              <div className="border-b border-slate-100 px-10 py-10 dark:border-white/5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-xl dark:bg-white dark:text-slate-900">
                    <ShieldCheck className="h-6 w-6" strokeWidth={2.5} />
                  </div>
                  <h2 className="font-display text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    Kiểm tra đơn hàng
                  </h2>
                </div>
              </div>
              <div className="p-10">
                <div className="glass-container border border-slate-100 bg-white/60 p-10 dark:border-white/5 dark:bg-slate-900/60">
                  <div className="mb-8 flex items-center gap-3">
                    <div className="h-1.5 w-6 rounded-full bg-slate-300" />
                    <p className="font-display text-[11px] font-black tracking-widest text-slate-400 uppercase">
                      Sản phẩm ({selectedItems.length})
                    </p>
                  </div>
                  <OrderItemsList items={selectedItems} />
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR SUMMARY */}
          <div className="animate-in fade-in slide-in-from-right-6 relative duration-1000 lg:col-span-4">
            <div className="shadow-3xl sticky top-24 overflow-hidden rounded-[3rem] border-none bg-slate-900 p-12 text-white dark:bg-slate-900/90">
              <div className="relative z-10 space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-8 rounded-full bg-blue-400" />
                    <p className="font-display text-[11px] font-black tracking-widest text-blue-400 uppercase">
                      Tóm tắt đơn hàng
                    </p>
                  </div>
                  <h3 className="font-display text-4xl leading-tight font-black tracking-tight">
                    Review & Checkout
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-display text-[11px] font-black tracking-widest uppercase">
                      Tạm tính
                    </span>
                    <span className="font-mono text-sm font-bold">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-display text-[11px] font-black tracking-widest uppercase">
                      Phí vận chuyển
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="font-mono text-sm font-bold text-emerald-500">
                        MIỄN PHÍ
                      </span>
                    </div>
                  </div>

                  <div className="h-px bg-white/10" />

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-lg font-black tracking-tight uppercase">
                        Tổng thanh toán
                      </span>
                      <span className="font-mono text-4xl font-black tracking-tighter text-blue-400">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-2 text-slate-500">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-500 text-[10px] font-black">
                        i
                      </div>
                      <p className="text-[10px] font-black tracking-widest uppercase">
                        Đã bao gồm VAT
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  size="lg"
                  disabled={isLoading || !defaultAddress}
                  onClick={handleCheckout}
                  className="group relative h-20 w-full overflow-hidden rounded-full bg-white text-base font-black tracking-[0.2em] text-slate-900 uppercase transition-all hover:scale-[1.03] active:scale-[0.97]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-4">
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <>
                        Tiến hành đặt hàng
                        <ShieldCheck className="h-5 w-5" strokeWidth={3} />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-blue-400 to-cyan-300 transition-transform duration-500 group-hover:translate-x-0" />
                </Button>

                <div className="flex flex-col items-center gap-6 pt-4">
                  <div className="flex items-center justify-center gap-3 text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">
                    <div className="h-px w-8 bg-slate-800" />
                    Secure Checkout
                    <div className="h-px w-8 bg-slate-800" />
                  </div>
                  <div className="flex gap-6 opacity-20 grayscale transition-all group-hover:opacity-40">
                    {/* Brand icons placeholders */}
                    <div className="h-6 w-10 rounded-md bg-white/20" />
                    <div className="h-6 w-10 rounded-md bg-white/20" />
                    <div className="h-6 w-10 rounded-md bg-white/20" />
                    <div className="h-6 w-10 rounded-md bg-white/20" />
                  </div>
                </div>
              </div>

              {/* Background accent */}
              <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[80px]" />
            </div>
          </div>
        </div>
      </div>

      <CheckoutDialogs
        state={dialogState}
        setState={setDialogState}
        isLoading={isLoading}
        isAddressLoading={isAddressLoading}
        address={defaultAddress}
        onConfirm={handleCheckout}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        selectedItems={selectedItems}
        totalPrice={totalPrice}
        orderID={orderID}
        setOrderID={setOrderID}
      />
    </PageBackground>
  )
}
