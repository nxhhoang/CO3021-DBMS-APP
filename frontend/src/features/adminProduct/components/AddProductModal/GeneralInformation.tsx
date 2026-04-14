'use client'

import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Card } from '@/components/ui/card'

import { type ProductFormInput } from '../schema'
import { Label } from '@/components/ui/label'

interface GeneralInformationProps {
  register: UseFormRegister<ProductFormInput>
  errors: FieldErrors<ProductFormInput>
}

export default function GeneralInformation({
  register,
  errors,
}: GeneralInformationProps) {
  return (
    <div className="bg-primary-foreground space-y-6 rounded-lg p-4">
      <Label className="text-lg font-semibold">Thông tin chung</Label>
      {/* Tên sản phẩm */}
      <Field className="gap-2">
        <FieldLabel className="text-md">Tên sản phẩm</FieldLabel>
        <Input className="bg-muted-foreground/6 border" {...register('name')} />
        {errors.name && <FieldError>{errors.name.message}</FieldError>}
      </Field>

      {/* Giá + Slug */}
      <div className="grid gap-4 md:grid-cols-2">
        <Field className="gap-2">
          <FieldLabel className="text-md">Giá cơ bản (VNĐ)</FieldLabel>
          <Input
            className="bg-muted-foreground/6 border"
            type="number"
            {...register('basePrice', { valueAsNumber: true })}
          />
          {errors.basePrice && (
            <FieldError>{errors.basePrice.message}</FieldError>
          )}
        </Field>

        <Field className="gap-2">
          <FieldLabel className="text-md">Slug</FieldLabel>
          <Input
            className="bg-muted-foreground/6 border"
            {...register('slug')}
            placeholder="product-slug"
          />
          {errors.slug && <FieldError>{errors.slug.message}</FieldError>}
        </Field>
      </div>

      {/* Mô tả */}
      <Field className="gap-2">
        <FieldLabel className="text-md">Mô tả sản phẩm</FieldLabel>
        <Textarea
          {...register('description')}
          className="bg-muted-foreground/6 min-h-30 resize-none border"
          placeholder="Mô tả chi tiết về sản phẩm..."
        />
        {errors.description && (
          <FieldError>{errors.description.message}</FieldError>
        )}
      </Field>
    </div>
  )
}
