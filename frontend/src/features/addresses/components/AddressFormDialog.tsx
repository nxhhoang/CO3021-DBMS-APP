'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Home, Building2, Landmark, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  formData: any;
  setFormData: any;
  editingAddressId: number | null;
  onSubmit: () => void;
}

export default function AddressFormDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  editingAddressId,
  onSubmit,
}: Props) {
  const isEditing = !!editingAddressId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] overflow-hidden border-none bg-white/80 p-0 shadow-2xl backdrop-blur-3xl sm:rounded-[2.5rem]">
        {/* Custom Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-6 top-6 z-10 rounded-full bg-slate-100 p-2 text-slate-400 transition-all hover:bg-slate-200 hover:text-slate-600 active:scale-90"
        >
          <X size={16} strokeWidth={3} />
        </button>

        <div className="relative overflow-hidden p-8 pt-10">
          {/* Header Section */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className={cn(
              "mb-4 flex h-16 w-16 items-center justify-center rounded-3xl shadow-xl transition-all duration-500",
              isEditing ? "bg-slate-900 text-white" : "bg-blue-600 text-white"
            )}>
              {isEditing ? <Building2 size={28} /> : <MapPin size={28} />}
            </div>
            
            <DialogTitle className="font-display text-2xl font-black tracking-tight text-slate-900">
              {isEditing ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
            </DialogTitle>
            <p className="mt-2 text-sm font-medium text-slate-500">
              {isEditing ? 'Cập nhật thông tin nhận hàng của bạn' : 'Cung cấp thông tin giao hàng chính xác'}
            </p>
          </div>

          <div className="grid gap-6">
            {/* Address Name */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <Home size={14} className="text-slate-400" />
                <Label className="font-display text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Tên địa chỉ (Ví dụ: Nhà riêng, Công ty)
                </Label>
              </div>
              <Input
                placeholder="Nhập tên gợi nhớ..."
                className="input-premium h-12 px-5"
                value={formData.addressName}
                onChange={(e) =>
                  setFormData({ ...formData, addressName: e.target.value })
                }
              />
            </div>

            {/* Address Line */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <MapPin size={14} className="text-slate-400" />
                <Label className="font-display text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Địa chỉ cụ thể
                </Label>
              </div>
              <Input
                placeholder="Số nhà, tên đường..."
                className="input-premium h-12 px-5"
                value={formData.addressLine}
                onChange={(e) =>
                  setFormData({ ...formData, addressLine: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* District */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <Building2 size={14} className="text-slate-400" />
                  <Label className="font-display text-[11px] font-black uppercase tracking-widest text-slate-400">
                    Quận/Huyện
                  </Label>
                </div>
                <Input
                  placeholder="Quận..."
                  className="input-premium h-12 px-5"
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                />
              </div>

              {/* City */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <Landmark size={14} className="text-slate-400" />
                  <Label className="font-display text-[11px] font-black uppercase tracking-widest text-slate-400">
                    Thành phố
                  </Label>
                </div>
                <Input
                  placeholder="Thành phố..."
                  className="input-premium h-12 px-5"
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
              className="h-14 flex-1 rounded-full border-slate-200 font-display text-[11px] font-black uppercase tracking-widest transition-all hover:bg-slate-50"
            >
              Hủy
            </Button>
            <Button 
              onClick={onSubmit}
              className="btn-premium-primary h-14 flex-1 shadow-xl shadow-blue-200/50"
            >
              <CheckCircle2 size={18} className="mr-2" />
              {isEditing ? 'Cập nhật' : 'Lưu địa chỉ'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
