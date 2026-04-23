'use client'

import { Info } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Field } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'

interface GeneralInformationProps {
  name: string
  slug: string
  description: string
  onNameChange: (val: string) => void
  onSlugChange: (val: string) => void
  onDescriptionChange: (val: string) => void
}

export default function GeneralInformation({
  name,
  slug,
  description,
  onNameChange,
  onSlugChange,
  onDescriptionChange,
}: GeneralInformationProps) {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="icon-box-premium h-10 w-10 border-slate-100 bg-slate-50 text-slate-400">
          <Info size={20} />
        </div>
        <h2 className="font-display text-lg font-black tracking-tight text-slate-800">
          Thông tin cơ bản
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-8 rounded-[2rem] border border-slate-100 bg-slate-50/40 p-8 md:grid-cols-2">
        {/* Name */}
        <Field className="gap-2.5">
          <Label className="font-display text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
            Tên danh mục
          </Label>
          <Input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="input-premium h-12 px-5 text-sm font-bold"
            placeholder="VD: Laptop Gaming"
          />
        </Field>

        {/* Slug */}
        <Field className="gap-2.5">
          <Label className="font-display text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
            Slug
          </Label>
          <Input
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
            className="input-premium h-12 px-5 text-sm font-bold"
            placeholder="laptop-gaming"
          />
        </Field>

        {/* Description */}
        <Field className="gap-2.5 md:col-span-2">
          <Label className="font-display text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
            Mô tả
          </Label>
          <Textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="input-premium min-h-24 px-5 py-4 text-sm font-medium"
            placeholder="Nhập mô tả chi tiết cho danh mục này..."
          />
        </Field>
      </div>
    </>
  )
}
