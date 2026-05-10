'use client'

import { useEffect, useMemo } from 'react'
import {
  Controller,
  Control,
  FieldErrors,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form'
import { Category } from '@/types/category.types'
import { Field, FieldError } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { type ProductFormInput } from '../schema'

interface CategoryAndAttributesProps {
  control: Control<ProductFormInput>
  errors: FieldErrors<ProductFormInput>
  categories: Category[]
  setValue: UseFormSetValue<ProductFormInput>
}

export default function CategorySelect({
  control,
  errors,
  categories,
  setValue,
}: CategoryAndAttributesProps) {
  const categoryID = useWatch({ control, name: 'categoryID' })
  const attributes = useWatch({ control, name: 'attributes' })

  const getCategoryId = (category: Category) =>
    category._id || category.ID || ''

  const getNormalizedAttributeValue = (
    attr: Category['dynamicAttributes'][number],
    value: unknown,
  ) => {
    if (attr.dataType === 'boolean') {
      return typeof value === 'boolean' ? value : false
    }

    if (attr.dataType === 'number') {
      return typeof value === 'number' && !Number.isNaN(value) ? value : ''
    }

    if (attr.options?.length) {
      return typeof value === 'string' && attr.options.includes(value)
        ? value
        : ''
    }

    return typeof value === 'string' ? value : ''
  }

  const selectedCategory = useMemo(() => {
    if (!categoryID) return null
    return categories.find((cat) => getCategoryId(cat) === categoryID) || null
  }, [categories, categoryID])

  useEffect(() => {
    const categoryAttributes = selectedCategory?.dynamicAttributes ?? []
    const currentAttributes = attributes ?? {}

    if (!categoryAttributes.length) {
      if (Object.keys(currentAttributes).length > 0) {
        setValue('attributes', {}, { shouldDirty: true, shouldValidate: true })
      }
      return
    }

    const nextAttributes = categoryAttributes.reduce<Record<string, unknown>>(
      (accumulator, attr) => {
        const currentValue = currentAttributes[attr.key]
        accumulator[attr.key] = getNormalizedAttributeValue(attr, currentValue)
        return accumulator
      },
      {},
    )

    const hasChanged =
      JSON.stringify(nextAttributes) !== JSON.stringify(currentAttributes)

    if (hasChanged) {
      setValue('attributes', nextAttributes, {
        shouldDirty: true,
        shouldValidate: true,
      })
    }
  }, [selectedCategory, setValue]) // attributes is intentionally omitted to avoid loops

  const labelStyles =
    'text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block'
  const inputStyles = 'input-premium'

  return (
    <div className="space-y-8">
      <Field>
        <label className={labelStyles}>Danh mục sản phẩm</label>
        <Controller
          control={control}
          name="categoryID"
          render={({ field }) => (
            <Select value={field.value || ''} onValueChange={field.onChange}>
              <SelectTrigger className="select-premium-trigger h-12">
                <SelectValue placeholder="Chọn danh mục sản phẩm" />
              </SelectTrigger>
              <SelectContent className="select-premium-content">
                {categories.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    Không có danh mục nào
                  </div>
                ) : (
                  categories.map((cat) => (
                    <SelectItem
                      key={getCategoryId(cat)}
                      value={getCategoryId(cat)}
                      className="select-premium-item"
                    >
                      {cat.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        />
        {errors.categoryID && (
          <FieldError className="text-xs">
            {errors.categoryID.message}
          </FieldError>
        )}
      </Field>

      {selectedCategory?.dynamicAttributes?.length ? (
        <div className="space-y-6 rounded-2xl border border-slate-100 bg-slate-50/30 p-5 dark:border-white/5 dark:bg-white/5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
              Thuộc tính danh mục
            </h3>
            <span className="text-[10px] font-bold text-slate-400">
              {selectedCategory.dynamicAttributes.length} trường thông tin
            </span>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
            {selectedCategory.dynamicAttributes.map((attr) => (
              <Field key={attr.key}>
                <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  {attr.label || attr.key}
                </label>

                <Controller
                  control={control}
                  name={`attributes.${attr.key}` as any}
                  render={({ field }) => {
                    if (attr.dataType === 'boolean') {
                      return (
                        <div className="flex h-11 items-center justify-between rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-xs dark:border-white/5 dark:bg-slate-900">
                          <span className="text-xs font-medium text-slate-500">
                            {attr.label || attr.key}
                          </span>
                          <Switch
                            checked={!!field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-blue-600"
                          />
                        </div>
                      )
                    }

                    if (attr.options?.length) {
                      return (
                        <Select
                          value={
                            typeof field.value === 'string' ? field.value : ''
                          }
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="select-premium-trigger h-11">
                            <SelectValue
                              placeholder={`${attr.label || attr.key}`}
                            />
                          </SelectTrigger>
                          <SelectContent className="select-premium-content">
                            {attr.options.map((option) => (
                              <SelectItem key={option} value={option} className="select-premium-item">
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )
                    }

                    return (
                      <Input
                        className="input-premium h-11 text-xs"
                        type={attr.dataType === 'number' ? 'number' : 'text'}
                        placeholder={
                          attr.dataType === 'number'
                            ? `Nhập ${attr.label || attr.key}`
                            : `Nhập ${attr.label || attr.key}`
                        }
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const val = e.target.value
                          field.onChange(
                            attr.dataType === 'number' && val !== ''
                              ? Number(val)
                              : val,
                          )
                        }}
                      />
                    )
                  }}
                />
              </Field>
            ))}
          </div>
        </div>
      ) : selectedCategory ? (
        <div className="rounded-[24px] border border-dashed border-slate-200 bg-white p-5 text-sm text-slate-500">
          Danh mục này không có thuộc tính bổ sung.
        </div>
      ) : null}
    </div>
  )
}
