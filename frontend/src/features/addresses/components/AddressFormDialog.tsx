'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  MapPin,
  Home,
  Building2,
  Landmark,
  CheckCircle2,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  formData: any
  setFormData: any
  editingAddressId: number | null
  onSubmit: () => void
}

export function AddressFormDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  editingAddressId,
  onSubmit,
}: Props) {
  const isEditing = !!editingAddressId

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[550px] overflow-hidden border border-slate-200 bg-white p-0 shadow-2xl sm:rounded-3xl"
      >
        {/* Custom Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="modal-close-btn-premium"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="relative overflow-hidden p-6 pt-12 sm:p-10">
          {/* Header Section - Compact */}
          <div className="mb-6 flex items-center gap-4 border-b border-slate-50 pb-6">
            <div
              className={cn(
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-md transition-all duration-500',
                isEditing ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white',
              )}
            >
              {isEditing ? <Building2 size={20} /> : <MapPin size={20} />}
            </div>

            <div>
              <DialogTitle className="font-display text-xl font-black tracking-tight text-slate-900">
                {isEditing ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
              </DialogTitle>
              <p className="mt-0.5 text-xs font-medium text-slate-400">
                {isEditing
                  ? 'Cập nhật thông tin nhận hàng'
                  : 'Cung cấp thông tin giao hàng'}
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            {/* Address Name */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 px-1">
                <Home size={12} className="text-slate-400" />
                <Label className="font-display text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Tên địa chỉ (Ví dụ: Nhà riêng, Công ty)
                </Label>
              </div>
              <Input
                placeholder="Nhập tên gợi nhớ..."
                className="h-11 rounded-xl border-slate-100 bg-slate-50/50 px-5 text-sm font-medium transition-all placeholder:text-slate-300 focus:ring-2 focus:ring-blue-600/20"
                value={formData.addressName}
                onChange={(e) =>
                  setFormData({ ...formData, addressName: e.target.value })
                }
              />
            </div>

            {/* Address Line */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 px-1">
                <MapPin size={12} className="text-slate-400" />
                <Label className="font-display text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Địa chỉ cụ thể
                </Label>
              </div>
              <Input
                placeholder="Số nhà, tên đường..."
                className="h-11 rounded-xl border-slate-100 bg-slate-50/50 px-5 text-sm font-medium transition-all placeholder:text-slate-300 focus:ring-2 focus:ring-blue-600/20"
                value={formData.addressLine}
                onChange={(e) =>
                  setFormData({ ...formData, addressLine: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* District */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 px-1">
                  <Building2 size={12} className="text-slate-400" />
                  <Label className="font-display text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Quận/Huyện
                  </Label>
                </div>
                <Input
                  placeholder="Quận..."
                  className="h-11 rounded-xl border-slate-100 bg-slate-50/50 px-5 text-sm font-medium transition-all placeholder:text-slate-300 focus:ring-2 focus:ring-blue-600/20"
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                />
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 px-1">
                  <Landmark size={12} className="text-slate-400" />
                  <Label className="font-display text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Thành phố
                  </Label>
                </div>
                <Input
                  placeholder="Thành phố..."
                  className="h-11 rounded-xl border-slate-100 bg-slate-50/50 px-5 text-sm font-medium transition-all placeholder:text-slate-300 focus:ring-2 focus:ring-blue-600/20"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="mt-10 flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="font-display h-12 flex-1 rounded-full border border-slate-200 bg-white text-[10px] font-black tracking-widest uppercase transition-all hover:bg-slate-50"
            >
              Hủy
            </Button>
            <Button
              onClick={onSubmit}
              className="btn-premium-primary h-12 flex-1 shadow-lg shadow-blue-500/10"
            >
              <CheckCircle2 size={16} className="mr-2" />
              {isEditing ? 'Cập nhật' : 'Lưu địa chỉ'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
