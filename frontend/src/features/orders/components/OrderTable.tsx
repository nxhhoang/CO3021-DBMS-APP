'use client'

import { useState } from 'react'
import { Loader2, Eye, CheckCircle2, PackageSearch } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

import { Order, OrderStatus } from '@/types'
import { orderService } from '@/services/order.service'
import { ORDER_STATUS } from '@/constants/enum'
import { toast } from 'sonner'

import {
  PremiumTable,
  PremiumTableBody,
  PremiumTableCell,
  PremiumTableHead,
  PremiumTableHeader,
  PremiumTableRow,
} from '@/components/common/PremiumTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface OrderTableProps {
  orders: Order[]
  loading: boolean
  onRefresh: () => void
}

export default function OrderTable({
  orders,
  loading,
  onRefresh,
}: OrderTableProps) {
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const handleStatusChange = async (
    orderId: number,
    newStatus: OrderStatus,
  ) => {
    try {
      setUpdatingId(orderId)
      const response = await orderService.updateOrderStatus(orderId, {
        status: newStatus,
      })
      if (response.data) {
        toast.success(`Cập nhật đơn hàng #${orderId} thành công`)
        onRefresh()
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái')
    } finally {
      setUpdatingId(null)
    }
  }

  // Hàm helper để render màu sắc cho Badge trạng thái

  if (loading) {
    return (
      <Card>
        <CardContent className="flex h-64 items-center justify-center">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        {orders.length > 0 ? (
          <PremiumTable>
            <PremiumTableHeader>
              <PremiumTableRow>
                <PremiumTableHead className="w-[120px]">Mã đơn</PremiumTableHead>
                <PremiumTableHead>Ngày đặt</PremiumTableHead>
                <PremiumTableHead>Tổng tiền</PremiumTableHead>
                <PremiumTableHead>Trạng thái</PremiumTableHead>
                <PremiumTableHead className="text-right">Hành động</PremiumTableHead>
              </PremiumTableRow>
            </PremiumTableHeader>
            <tbody>
              {orders.map((order) => (
                <PremiumTableRow key={order.orderID}>
                  <PremiumTableCell>
                    <span className="font-mono font-black text-blue-600">#{order.orderID}</span>
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
                    <div className="font-mono text-base font-black tracking-tighter text-slate-900">
                      {order.totalAmount.toLocaleString()}
                      <span className="ml-1 text-[10px] font-bold uppercase text-slate-400">đ</span>
                    </div>
                  </PremiumTableCell>

                  <PremiumTableCell>
                    <StatusBadge status={order.status} />
                  </PremiumTableCell>

                  <PremiumTableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 rounded-xl transition-all hover:bg-blue-50 hover:text-blue-600"
                      onClick={() =>
                        (window.location.href = `/admin/orders/${order.orderID}`)
                      }
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Chi tiết
                    </Button>
                  </PremiumTableCell>
                </PremiumTableRow>
              ))}
            </tbody>
          </PremiumTable>
        ) : (
          <div className="text-muted-foreground flex flex-col items-center justify-center py-20">
            <PackageSearch className="mb-4 h-12 w-12 opacity-30" />
            <p>Chưa có đơn hàng nào được ghi nhận</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
