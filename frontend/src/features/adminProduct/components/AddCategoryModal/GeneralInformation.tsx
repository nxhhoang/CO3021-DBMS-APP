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
      <div className="flex items-center gap-4">
        {/* <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#002366]/5 text-[#002366]">
          Thông tin
        </div> */}
        <Info size={20} className="text-[#002366]" />
        <h2 className="text-lg font-bold">Thông tin cơ bản</h2>
      </div>

      <div className="bg-primary/3 grid grid-cols-1 gap-8 rounded-lg p-4 md:grid-cols-2">
        {/* Name */}
        <Field className="gap-2">
          <Label className="text-sm font-semibold tracking-wider uppercase">
            Tên danh mục
          </Label>
          <Input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="bg-primary/6 w-full rounded-lg border-0 text-sm"
            placeholder="VD: Laptop Gaming"
          />
        </Field>

        {/* Slug */}
        <Field className="gap-2">
          <Label className="text-sm font-semibold tracking-wider uppercase">
            Slug
          </Label>
          <Input
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
            className="bg-primary/6 w-full rounded-lg border-0 text-sm"
            placeholder="laptop-gaming"
          />
        </Field>

        {/* Description */}
        <Field className="gap-2 md:col-span-2">
          <Label className="text-sm font-semibold tracking-wider uppercase">
            Mô tả
          </Label>
          <Textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="bg-primary/6 min-h-25 w-full resize-none rounded-lg border-0 text-sm"
            placeholder="Nhập mô tả..."
          />
        </Field>
      </div>
    </>
  )
}
