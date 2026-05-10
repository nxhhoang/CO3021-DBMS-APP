'use client'

import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldError } from '@/components/ui/field'
import { type ProductFormInput } from '../schema'

interface GeneralInformationProps {
  register: UseFormRegister<ProductFormInput>
  errors: FieldErrors<ProductFormInput>
}

export default function GeneralInformation({
  register,
  errors,
}: GeneralInformationProps) {
  const labelStyles =
    'text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block'
  const inputStyles = 'input-premium h-11'

  return (
    <div className="space-y-8">
      {/* Tên sản phẩm */}
      <Field>
        <label className={labelStyles}>Tên sản phẩm</label>
        <Input
          className={inputStyles}
          placeholder="VD: iPhone 15 Pro Max 256GB"
          autoComplete="off"
          {...register('name')}
        />
        {errors.name && (
          <FieldError className="text-xs">{errors.name.message}</FieldError>
        )}
      </Field>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Slug */}
        <Field>
          <label className={labelStyles}>Đường dẫn (Slug)</label>
          <div className="relative">
            <span className="absolute top-1/2 left-4 -translate-y-1/2 text-sm text-slate-400">
              /
            </span>
            <Input
              className={`${inputStyles} pl-8`}
              placeholder="iphone-15-pro-max"
              autoComplete="off"
              {...register('slug')}
            />
          </div>
          {errors.slug && (
            <FieldError className="text-xs">{errors.slug.message}</FieldError>
          )}
        </Field>

        {/* Base Price */}
        <Field>
          <label className={labelStyles}>Giá bán cơ bản</label>
          <div className="relative">
            <Input
              type="number"
              inputMode="decimal"
              className={`${inputStyles} pr-12`}
              placeholder="0"
              {...register('basePrice', { valueAsNumber: true })}
            />
            <span className="absolute top-1/2 right-4 -translate-y-1/2 text-sm font-bold text-slate-400">
              ₫
            </span>
          </div>
          {errors.basePrice && (
            <FieldError className="text-xs">
              {errors.basePrice.message}
            </FieldError>
          )}
        </Field>
      </div>

      {/* Mô tả */}
      <Field>
        <label className={labelStyles}>Mô tả chi tiết</label>
        <Textarea
          {...register('description')}
          className={`${inputStyles} min-h-32 resize-none py-4`}
          placeholder="Nhập mô tả chi tiết về sản phẩm, tính năng, và thông số kỹ thuật..."
        />
        {errors.description && (
          <FieldError className="text-xs">
            {errors.description.message}
          </FieldError>
        )}
      </Field>
    </div>
  )
}
