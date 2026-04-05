'use client'

import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingBag, ArrowRight } from 'lucide-react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function AdminLandingPage() {
  const adminModules = [
    {
      title: 'Bảng điều khiển',
      description:
        'Xem thống kê doanh thu, biểu đồ tăng trưởng và hoạt động gần đây.',
      href: '/admin/dashboard',
      icon: <LayoutDashboard className="h-6 w-6" />,
      color: 'text-blue-500',
    },
    {
      title: 'Quản lý kho hàng',
      description:
        'Thêm mới, chỉnh sửa sản phẩm, kiểm kê số lượng và danh mục.',
      href: '/admin/products',
      icon: <Package className="h-6 w-6" />,
      color: 'text-orange-500',
    },
    {
      title: 'Quản lý đơn hàng',
      description:
        'Xử lý vận chuyển, cập nhật trạng thái đơn hàng và thanh toán.',
      href: '/admin/orders',
      icon: <ShoppingBag className="h-6 w-6" />,
      color: 'text-green-500',
    },
  ]

  return (
    <div className="bg-background min-h-screen p-6 md:p-12">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header Section */}
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Hệ thống Quản trị
          </h1>
          <p className="text-muted-foreground text-lg">
            Chào mừng quay trở lại. Vui lòng chọn một phân mục để bắt đầu làm
            việc.
          </p>
        </header>

        <hr className="border-border" />

        {/* Grid Selection */}
        <div className="grid gap-6 md:grid-cols-3">
          {adminModules.map((module) => (
            <Link key={module.href} href={module.href} className="group">
              <Card className="hover:border-primary h-full transition-all duration-200 hover:shadow-md">
                <CardHeader>
                  <div
                    className={`bg-secondary mb-4 w-fit rounded-lg p-2 ${module.color}`}
                  >
                    {module.icon}
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    {module.title}
                    <ArrowRight className="h-4 w-4 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </CardTitle>
                  <CardDescription className="leading-relaxed">
                    {module.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
