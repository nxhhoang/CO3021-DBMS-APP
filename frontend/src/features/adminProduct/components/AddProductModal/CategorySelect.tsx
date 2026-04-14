'use client'

import { Controller, Control, FieldErrors, UseFormWatch } from 'react-hook-form'
import { Category } from '@/types/category.types'

import { Field, FieldLabel, FieldError } from '@/components/ui/field'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Input } from '@/components/ui/input'

import { type ProductFormInput } from '../schema'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface CategoryAndAttributesProps {
  control: Control<ProductFormInput>
  errors: FieldErrors<ProductFormInput>
  categories: Category[]
  watch: UseFormWatch<ProductFormInput>
}

export default function CategorySelect({
  control,
  errors,
  categories,
  watch,
}: CategoryAndAttributesProps) {
  const getCategoryId = (category: Category) =>
    category._id || category.ID || ''

  const toSelectValue = (value: unknown) => {
    if (value === undefined || value === null || value === '') return undefined
    return String(value)
  }

  const selectedCategory = categories.find(
    (cat) => getCategoryId(cat) === watch('categoryID'),
  )

  return (
    <div className="bg-primary-foreground space-y-6 rounded-lg p-4">
      {/* Category */}
      <Field className="gap-2">
        <FieldLabel className="text-lg font-semibold">Danh mục</FieldLabel>
        <Controller
          control={control}
          name="categoryID"
          render={({ field }) => (
            <div className="relative">
              <Select
                value={field.value || undefined}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="bg-muted-foreground/6 border">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem
                      key={getCategoryId(cat)}
                      value={getCategoryId(cat)}
                    >
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {field.value && (
                <button
                  type="button"
                  onClick={() => field.onChange('')}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-8 -translate-y-1/2 text-sm"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        />
        {errors.categoryID && (
          <FieldError>{errors.categoryID.message}</FieldError>
        )}
      </Field>

      {/* Dynamic attributes */}
      {selectedCategory?.dynamicAttributes?.length ? (
        <div className="border-primary/30 bg-primary-foreground rounded-lg border border-dashed p-4">
          <h3 className="text-md mb-4 font-semibold">
            Thông số: {selectedCategory.name}
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            {selectedCategory.dynamicAttributes.map((attr) => (
              <Field key={attr.key} className="gap-2">
                <FieldLabel className="text-md">
                  {attr.label || attr.key}
                  {attr.isRequired ? ' *' : ''}
                </FieldLabel>

                <Controller
                  control={control}
                  name={`attributes.${attr.key}` as any}
                  render={({ field }) => {
                    /** BOOLEAN → Radio */
                    if (attr.dataType === 'boolean') {
                      return (
                        <RadioGroup
                          value={
                            field.value !== undefined
                              ? String(field.value)
                              : undefined
                          }
                          onValueChange={(value) => {
                            field.onChange(value === 'true')
                          }}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="true"
                              id={`${attr.key}-true`}
                            />
                            <label htmlFor={`${attr.key}-true`}>Có</label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="false"
                              id={`${attr.key}-false`}
                            />
                            <label htmlFor={`${attr.key}-false`}>Không</label>
                          </div>
                        </RadioGroup>
                      )
                    }

                    /** SELECT (có options) */
                    if (attr.options?.length) {
                      return (
                        <Select
                          value={
                            field.value !== undefined && field.value !== null
                              ? String(field.value)
                              : undefined
                          }
                          onValueChange={(value) => {
                            const converted =
                              attr.dataType === 'number' ? Number(value) : value

                            field.onChange(converted)
                          }}
                        >
                          <SelectTrigger className="bg-muted-foreground/6 h-9 w-full border">
                            <SelectValue
                              placeholder={`Chọn ${attr.label || attr.key}`}
                            />
                          </SelectTrigger>

                          <SelectContent>
                            {attr.options.map((opt) => (
                              <SelectItem key={opt} value={String(opt)}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )
                    }

                    /** INPUT */
                    return (
                      <Input
                        className="bg-muted-foreground/6 h-9 border"
                        type={attr.dataType === 'number' ? 'number' : 'text'}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const val = e.target.value
                          field.onChange(
                            attr.dataType === 'number' ? Number(val) : val,
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
      ) : null}
    </div>
  )
}
