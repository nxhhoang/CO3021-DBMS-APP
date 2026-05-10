import axios from 'axios'
import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { orderService } from '@/services/order.service'
import { addressService } from '@/services/address.service'
import { PAYMENT_METHOD } from '@/constants/enum'
import { CartItem } from '@/types/cart.types'
import { Address, PaymentMethod } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { cartStorage } from '@/services/cartStorage'
import { useAuthContext } from '@/features/auth'
import { paymentService } from '@/services/payment.service'

type CheckoutApiError = {
  message?: string
  errorInfo?: {
    message?: string
  }
  errors?: Record<string, { msg?: string }>
}

export const useCheckout = (selectedItems: CartItem[]) => {
  const { isAuthenticated } = useAuthContext()
  const items = useCartStore((s) => s.items)
  const removeMultipleItemsStore = useCartStore((s) => s.removeMultipleItems)

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PAYMENT_METHOD.COD,
  )
  const [isLoading, setIsLoading] = useState(false)
  const [isAddressLoading, setIsAddressLoading] = useState(false)
  const [orderID, setOrderID] = useState<number | null>(null)
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [dialogState, setDialogState] = useState({
    confirm: false,
    success: false,
  })
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false)

  // Lấy địa chỉ mặc định
  const fetchDefaultAddress = useCallback(async () => {
    try {
      setIsAddressLoading(true)
      const res = await addressService.getAddresses()
      if (res.data && res.data.length > 0) {
        const addr = res.data.find((a) => a.isDefault)
        setSelectedAddress(addr || res.data[0])
      }
    } catch (error) {
      console.error('Fetch address error:', error)
    } finally {
      setIsAddressLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchDefaultAddress()
    }
  }, [fetchDefaultAddress, isAuthenticated])

  // Xử lý thanh toán
  const handleCheckout = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thanh toán')
      const currentPath = window.location.pathname
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`
      return
    }

    if (!selectedAddress) return toast.error('Vui lòng chọn địa chỉ giao hàng')
    setCheckoutError(null)

    try {
      setIsLoading(true)
      setOrderID(null)

      const payload = {
        shippingAddressId: selectedAddress.addressID,
        paymentMethod,
        items: selectedItems.map((item) => ({
          productId: (item.productId || item.productID)!,
          productName: item.productName,
          sku: item.sku,
          quantity: item.quantity,
          unitPrice: item.skuPrice || item.basePrice,
        })),
      }

      const res = await orderService.createOrder(payload)
      if (res && res.data) {
        // ✅ Cập nhật ID mới TRƯỚC khi mở modal
        const newOrderID = res.data.orderID
        console.log('Order created successfully:', newOrderID)
        setOrderID(newOrderID)

        const clearCart = () => {
          const skusToRemove = selectedItems.map((item) => item.sku)
          const nextItems = items.filter(
            (item) => !skusToRemove.includes(item.sku),
          )
          removeMultipleItemsStore(skusToRemove)
          cartStorage.setItems(nextItems)
          window.dispatchEvent(new CustomEvent('cart:updated'))
        }

        // ✅ If BANKING or E_WALLET, show QR slide without clearing cart yet
        if (paymentMethod === PAYMENT_METHOD.BANKING || paymentMethod === PAYMENT_METHOD.E_WALLET) {
          setIsPaymentProcessing(true)
          toast.success('Đơn hàng đã được khởi tạo. Vui lòng thanh toán.')
          return
        }

        // ✅ For COD, clear cart immediately
        clearCart()
        setDialogState((prev) => ({ ...prev, confirm: false }))

        // ✅ Tăng độ trễ lên 400ms để chắc chắn Radix UI đã đóng hoàn toàn dialog cũ
        setTimeout(() => {
          setDialogState({ confirm: false, success: true })
          toast.success('Đặt hàng thành công')
        }, 400)
      } else {
        throw new Error('Không nhận được phản hồi từ hệ thống')
      }
    } catch (error: unknown) {
      const axiosError = axios.isAxiosError<CheckoutApiError>(error)
        ? error
        : null
      const responseData = axiosError?.response?.data
      const validationMessage = responseData?.errors
        ? Object.values(responseData.errors)
            .map((item) => item?.msg)
            .filter(Boolean)
            .join(', ')
        : undefined

      if (axiosError) {
        console.warn('Checkout failed:', {
          status: axiosError.response?.status,
          data: responseData,
          message: axiosError.message,
        })
      } else {
        console.error('Unexpected checkout error:', error)
      }

      const message =
        responseData?.message ||
        responseData?.errorInfo?.message ||
        validationMessage ||
        axiosError?.message ||
        (error instanceof Error ? error.message : 'Lỗi đặt hàng')

      setCheckoutError(message)
      toast.error(`Lỗi thanh toán: ${message}`)
    } finally {
      setIsLoading(false)
    }
  }, [
    selectedAddress,
    items,
    paymentMethod,
    removeMultipleItemsStore,
    selectedItems,
  ])

  const handleConfirmPayment = useCallback(async () => {
    if (!orderID) return

    try {
      setIsLoading(true)
      await paymentService.processPayment({
        orderID,
        paymentMethod
      })

      // Success
      const skusToRemove = selectedItems.map((item) => item.sku)
      const nextItems = items.filter(
        (item) => !skusToRemove.includes(item.sku),
      )
      removeMultipleItemsStore(skusToRemove)
      cartStorage.setItems(nextItems)
      window.dispatchEvent(new CustomEvent('cart:updated'))

      setIsPaymentProcessing(false)
      setDialogState((prev) => ({ ...prev, confirm: false }))
      
      setTimeout(() => {
        setDialogState({ confirm: false, success: true })
        toast.success('Thanh toán thành công')
      }, 400)
    } catch (error) {
      console.error('Payment processing failed:', error)
      toast.error('Xác nhận thanh toán thất bại. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }, [orderID, paymentMethod, selectedItems, items, removeMultipleItemsStore])

  return {
    // States
    paymentMethod,
    isLoading,
    isAddressLoading,
    orderID,
    selectedAddress,
    checkoutError,
    dialogState,
    isPaymentProcessing,

    // Setters
    setPaymentMethod,
    setDialogState,
    setOrderID,
    setCheckoutError,
    setSelectedAddress,
    setIsPaymentProcessing,

    // Methods
    handleCheckout,
    handleConfirmPayment,
    refreshAddress: fetchDefaultAddress,
  }
}
