'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { DynamicAttributeInput } from '@/types/category.types'

interface Props {
  title: string
  attributes: DynamicAttributeInput[]
  setAttributes: (val: DynamicAttributeInput[]) => void
}

export default function AttributeInformation({
  title,
  attributes,
  setAttributes,
}: Props) {
  const addAttribute = () => {
    setAttributes([
      ...attributes,
      {
        key: '',
        label: '',
        dataType: 'string' as const,
        options: [],
      },
    ])
  }

  const updateAttr = (idx: number, field: string, value: any) => {
    const newAttrs = [...attributes]
    newAttrs[idx] = { ...newAttrs[idx], [field]: value }
    setAttributes(newAttrs)
  }

  const handleDataTypeChange = (idx: number, dataType: string) => {
    const newAttrs = [...attributes]
    newAttrs[idx] = {
      ...newAttrs[idx],
      dataType,
      options: dataType === 'boolean' ? [] : newAttrs[idx].options,
    }
    setAttributes(newAttrs)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="icon-box-premium h-10 w-10 border-slate-100 bg-slate-50 text-slate-400">
            <SlidersHorizontal size={20} />
          </div>
          <h2 className="font-display text-lg font-black tracking-tight text-slate-800">
            {title}
          </h2>
        </div>

        <Button
          variant="secondary"
          onClick={addAttribute}
          className="btn-premium-secondary h-9 px-4 text-xs"
        >
          <Plus size={16} className="mr-1.5" /> Thêm mới
        </Button>
      </div>

      {/* List - No internal scroll here to fix nested scrolling */}
      <div className="space-y-3">
        {attributes.map((attr, idx) => (
          <div
            key={idx}
            className="grid grid-cols-12 gap-4 rounded-2xl border border-slate-100 bg-slate-50/40 p-5"
          >
            {/* Key */}
            <div className="col-span-3">
              <Input
                value={attr.key}
                onChange={(e) => updateAttr(idx, 'key', e.target.value)}
                className="input-premium h-11 px-4 text-xs font-bold"
                placeholder="Key (vd: screen_size)"
              />
            </div>

            {/* Label */}
            <div className="col-span-3">
              <Input
                value={attr.label}
                onChange={(e) => updateAttr(idx, 'label', e.target.value)}
                className="input-premium h-11 px-4 text-xs font-bold"
                placeholder="Nhãn (vd: Kích thước màn hình)"
              />
            </div>

            {/* Type */}
            <div className="col-span-2">
              <Select
                value={attr.dataType}
                onValueChange={(value) => handleDataTypeChange(idx, value)}
              >
                <SelectTrigger className="select-premium-trigger h-11 rounded-xl px-4 text-xs">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent className="select-premium-content">
                  <SelectItem value="string" className="select-premium-item">
                    Văn bản
                  </SelectItem>
                  <SelectItem value="number" className="select-premium-item">
                    Số liệu
                  </SelectItem>
                  <SelectItem value="boolean" className="select-premium-item">
                    Có/Không
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Options */}
            {(attr.dataType === 'string' || attr.dataType === 'number') && (
              <div className="col-span-3">
                <OptionsInput
                  value={attr.options || []}
                  onChange={(newOptions) =>
                    updateAttr(idx, 'options', newOptions)
                  }
                />
              </div>
            )}

            {/* Delete */}
            <div className="col-span-1 flex items-center justify-end">
              <Button
                variant="ghost"
                onClick={() =>
                  setAttributes(attributes.filter((_, i) => i !== idx))
                }
                className="h-9 w-9 rounded-full p-0 text-slate-300 hover:bg-rose-50 hover:text-rose-500"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function OptionsInput({
  value,
  onChange,
}: {
  value: string[]
  onChange: (val: string[]) => void
}) {
  const [inputValue, setInputValue] = useState(value.join(', '))

  // Sync with parent value if it changes externally
  useEffect(() => {
    const currentJoined = value.join(', ')
    const normalizedInput = inputValue
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)
      .join(', ')

    if (currentJoined !== normalizedInput) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInputValue(currentJoined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)

    // Parse and notify parent
    const arr = val
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)
    onChange(arr)
  }

  return (
    <Input
      value={inputValue}
      onChange={handleChange}
      className="input-premium h-11 px-4 text-xs font-medium"
      placeholder="Lựa chọn (vd: Xanh, Đỏ, Tím)"
    />
  )
}
