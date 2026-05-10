'use client'

import { MapPin, MoreVertical, Trash2, Edit2, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

type Address = {
  addressID: number
  addressName: string
  addressLine: string
  city: string
  district: string
  isDefault: boolean
}

interface Props {
  address: Address
  onEdit: (addr: Address) => void
  onDelete: (id: number) => void
  onSetDefault: (id: number) => void
}

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: Props) {
  return (
    <Card
      className={cn(
        'group relative overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-blue-400 hover:shadow-md active:scale-[0.99] dark:border-slate-800 dark:bg-slate-900',
        address.isDefault && 'border-blue-600/50 ring-1 ring-blue-600/10',
      )}
    >
      <CardContent className="flex flex-col gap-5 p-5">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200',
                address.isDefault
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-400 group-hover:bg-blue-600 group-hover:text-white dark:bg-slate-800',
              )}
            >
              <MapPin size={18} strokeWidth={2.5} />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-base font-black tracking-tight text-slate-900 dark:text-white">
                  {address.addressName}
                </h3>
                {address.isDefault && (
                  <div className="flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 ring-1 ring-blue-600/20 dark:bg-blue-500/10 dark:ring-blue-500/30">
                    <span className="font-display text-[9px] font-black tracking-widest text-blue-600 uppercase">
                      Mặc định
                    </span>
                  </div>
                )}
              </div>
              <p className="font-display text-[10px] font-black tracking-widest text-slate-400 uppercase">
                {address.district}, {address.city}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-48 rounded-xl border-slate-200 bg-white p-1 shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <DropdownMenuItem
                onClick={() => onEdit(address)}
                className="font-display cursor-pointer rounded-lg px-3 py-2 text-[11px] font-bold tracking-wider uppercase transition-colors"
              >
                <Edit2 className="mr-3 h-4 w-4" strokeWidth={2.5} />
                Chỉnh sửa
              </DropdownMenuItem>

              <DropdownMenuItem
                className="font-display cursor-pointer rounded-lg px-3 py-2 text-[11px] font-bold tracking-wider text-rose-600 uppercase transition-colors focus:bg-rose-50 focus:text-rose-600 dark:focus:bg-rose-500/10"
                onClick={() => onDelete(address.addressID)}
              >
                <Trash2 className="mr-3 h-4 w-4" strokeWidth={2.5} />
                Xóa địa chỉ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Address Detail Section */}
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/50 dark:bg-slate-800/30">
          <p className="text-sm font-semibold leading-relaxed text-slate-600 dark:text-slate-400">
            {address.addressLine}
          </p>
        </div>

        {/* Footer Actions */}
        {!address.isDefault && (
          <Button
            onClick={() => onSetDefault(address.addressID)}
            className="font-display h-10 w-full rounded-xl bg-slate-900 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600"
          >
            Đặt làm địa chỉ mặc định
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
