'use client';

import { MapPin, MoreVertical, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

type Address = {
  addressID: number;
  addressName: string;
  addressLine: string;
  city: string;
  district: string;
  isDefault: boolean;
};

interface Props {
  address: Address;
  onEdit: (addr: Address) => void;
  onDelete: (id: number) => void;
  onSetDefault: (id: number) => void;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: Props) {
  return (
    <Card className={cn(
      "overflow-hidden rounded-[2.5rem] border-white/40 bg-white/40 shadow-2xl shadow-slate-200/50 backdrop-blur-3xl transition-all duration-500 hover:shadow-3xl hover:shadow-slate-200/60",
      address.isDefault && "ring-2 ring-blue-600/50"
    )}>
      <CardContent className="flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center">
        <div className="flex gap-6">
          <div className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl shadow-xl transition-all duration-500",
            address.isDefault ? "bg-slate-900 text-white" : "bg-white text-slate-400 group-hover:bg-blue-50"
          )}>
            <MapPin size={24} strokeWidth={2.5} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-display text-lg font-black tracking-tight text-slate-900">{address.addressName}</span>
              {address.isDefault && (
                <div className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 ring-1 ring-blue-200/50">
                   <CheckCircle2 size={12} className="text-blue-600" />
                   <span className="font-display text-[9px] font-black uppercase tracking-widest text-blue-600">Mặc định</span>
                </div>
              )}
            </div>

            <p className="font-medium text-slate-500">{address.addressLine}</p>
            <p className="font-display text-[11px] font-black uppercase tracking-widest text-slate-400">
              Quận {address.district}, {address.city}
            </p>
          </div>
        </div>

        <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
          {!address.isDefault && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetDefault(address.addressID)}
              className="h-10 rounded-full border-slate-200 px-6 font-display text-[10px] font-black uppercase tracking-widest transition-all hover:bg-slate-900 hover:text-white"
            >
              Đặt mặc định
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-white/60">
                <MoreVertical className="h-5 w-5 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="rounded-2xl border-white/40 bg-white/80 p-2 backdrop-blur-xl">
              <DropdownMenuItem onClick={() => onEdit(address)} className="rounded-xl px-4 py-3 font-display text-[11px] font-bold uppercase tracking-wider">
                <Edit2 className="mr-3 h-4 w-4" strokeWidth={2.5} />
                Chỉnh sửa
              </DropdownMenuItem>

              <DropdownMenuItem
                className="rounded-xl px-4 py-3 font-display text-[11px] font-bold uppercase tracking-wider text-rose-600 focus:bg-rose-50 focus:text-rose-600"
                onClick={() => onDelete(address.addressID)}
              >
                <Trash2 className="mr-3 h-4 w-4" strokeWidth={2.5} />
                Xóa địa chỉ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
