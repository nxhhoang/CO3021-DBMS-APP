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
    'text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block'
  const inputStyles =
    'rounded-xl h-12 bg-white shadow-sm ring-1 ring-slate-100 focus-visible:ring-1 focus-visible:ring-slate-300 transition-all'

  return (
    <div className="space-y-8">
      {/* Tên sản phẩm */}
      <Field>
        <label className={labelStyles}>Product Name</label>
        <Input
          className={inputStyles}
          placeholder="Ethereal Silk Gown"
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
          <label className={labelStyles}>Slug</label>
          <div className="relative">
            <span className="absolute top-1/2 left-4 -translate-y-1/2 text-sm text-slate-400">
              /
            </span>
            <Input
              className={`${inputStyles} pl-8`}
              placeholder="silk-gown-01"
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
          <label className={labelStyles}>Base Price</label>
          <div className="relative">
            <span className="absolute top-1/2 left-4 -translate-y-1/2 text-sm text-slate-400">
              $
            </span>
            <Input
              type="number"
              inputMode="decimal"
              className={`${inputStyles} pl-8`}
              placeholder="0.00"
              {...register('basePrice', { valueAsNumber: true })}
            />
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
        <label className={labelStyles}>Description</label>
        <Textarea
          {...register('description')}
          className={`${inputStyles} min-h-30 resize-none py-4`}
          placeholder="Describe the tactile sensation and craftsmanship..."
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