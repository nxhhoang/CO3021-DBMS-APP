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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
  const getStatusBadge = (status: OrderStatus) => {
    const statusMap: Record<OrderStatus, string> = {
      PENDING: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
      PROCESSING: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
      SHIPPED: 'bg-purple-100 text-purple-700 hover:bg-purple-100',
      DELIVERED: 'bg-green-100 text-green-700 hover:bg-green-100',
      CANCELLED: 'bg-red-100 text-red-700 hover:bg-red-100',
    }
    return statusMap[status] || 'bg-gray-100 text-gray-700'
  }

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Mã đơn</TableHead>
                <TableHead>Ngày đặt</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.orderID}>
                  <TableCell className="font-bold">#{order.orderID}</TableCell>

                  <TableCell>
                    {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', {
                      locale: vi,
                    })}
                  </TableCell>

                  <TableCell className="text-primary font-semibold">
                    {order.totalAmount.toLocaleString()}đ
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select
                        disabled={updatingId === order.orderID}
                        defaultValue={order.status}
                        onValueChange={(value) =>
                          handleStatusChange(
                            order.orderID,
                            value as OrderStatus,
                          )
                        }
                      >
                        <SelectTrigger
                          className={`h-8 w-[140px] text-xs font-medium ${getStatusBadge(order.status)}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(ORDER_STATUS).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {updatingId === order.orderID && (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          (window.location.href = `/admin/orders/${order.orderID}`)
                        }
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        Chi tiết
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
