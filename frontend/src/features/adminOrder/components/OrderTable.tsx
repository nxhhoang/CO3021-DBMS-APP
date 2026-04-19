import { AdminOrder, Pagination as PaginationMeta } from '@/types'
import { format } from 'date-fns'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Eye, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface OrderTableProps {
  orders: AdminOrder[]
  loading: boolean
  pagination: PaginationMeta | null
  currentPage: number
  onPageChange: (newPage: number) => void
  onRefresh: () => void
}

const getStatusBadge = (status: string) => {
  const statusMap: Record<
    string,
    {
      label: string
      variant: 'default' | 'secondary' | 'outline' | 'destructive'
    }
  > = {
    PENDING: { label: 'Chờ xử lý', variant: 'outline' },
    SHIPPING: { label: 'Đang giao', variant: 'secondary' },
    DELIVERED: { label: 'Đã giao', variant: 'default' },
    CANCELLED: { label: 'Đã hủy', variant: 'destructive' },
  }

  const config = statusMap[status] || {
    label: status,
    variant: 'outline',
  }

  return <Badge variant={config.variant}>{config.label}</Badge>
}

const OrderTable = ({
  orders,
  loading,
  pagination,
  currentPage,
  onPageChange,
  onRefresh,
}: OrderTableProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold">
          Danh sách đơn hàng chi tiết
        </CardTitle>
        <Button variant="outline" onClick={onRefresh} disabled={loading}>
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`}
          />
          Làm mới
        </Button>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b transition-colors">
                <th className="text-muted-foreground h-12 px-4 text-left font-semibold uppercase">
                  Mã đơn hàng
                </th>
                <th className="text-muted-foreground h-12 px-4 text-left font-semibold uppercase">
                  Khách hàng (ID)
                </th>
                <th className="text-muted-foreground h-12 px-4 text-left font-semibold uppercase">
                  Thời gian
                </th>
                <th className="text-muted-foreground h-12 px-4 text-center font-semibold uppercase">
                  Trạng thái
                </th>
                <th className="text-muted-foreground h-12 px-4 text-right font-semibold uppercase">
                  Tổng tiền
                </th>
                <th className="text-muted-foreground h-12 px-4 text-center font-semibold uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-muted-foreground p-8 text-center"
                  >
                    Đang tải danh sách đơn hàng...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-muted-foreground p-8 text-center"
                  >
                    Không tìm thấy đơn hàng nào.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.orderID}
                    className="hover:bg-muted/50 border-b transition-colors"
                  >
                    <td className="p-4 font-mono font-bold">
                      #{order.orderID}
                    </td>

                    <td className="text-muted-foreground p-4">
                      {order.userID}
                    </td>

                    <td className="p-4">
                      {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
                    </td>

                    <td className="p-4 text-center">
                      {getStatusBadge(order.status)}
                    </td>

                    <td className="text-primary p-4 text-right font-medium">
                      {order.totalAmount.toLocaleString()} VND
                    </td>

                    <td className="p-4 text-center">
                      <Link href={`/admin/orders/${order.orderID}`}>
                        <Button variant="ghost" size="icon">
                          <Eye size={18} />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER & PAGINATION */}
        {pagination && (
          <div className="mt-4 flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* INFO */}
            <p className="text-muted-foreground text-xs italic">
              Hiển thị {orders.length} trên {pagination.total} đơn hàng
            </p>

            {/* PAGINATION */}
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                {/* PREVIOUS */}
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (!loading && currentPage > 1)
                        onPageChange(currentPage - 1)
                    }}
                    className={
                      loading || currentPage <= 1
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>

                {/* PAGE NUMBERS */}
                {Array.from({ length: pagination.totalPages }, (_, i) => {
                  const page = i + 1
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (!loading && page !== currentPage)
                            onPageChange(page)
                        }}
                        isActive={page === currentPage}
                        className={
                          loading ? 'pointer-events-none opacity-50' : ''
                        }
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}

                {/* NEXT */}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (!loading && currentPage < pagination.totalPages)
                        onPageChange(currentPage + 1)
                    }}
                    className={
                      loading || currentPage >= pagination.totalPages
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default OrderTable
