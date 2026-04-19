'use client'

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

interface Attribute {
  key: string
  label: string
  dataType: string
  isRequired: boolean
  options: AttributeOptionValue[]
}

interface Props {
  attributes: DynamicAttributeInput[]
  setAttributes: (val: DynamicAttributeInput[]) => void
}

export default function AttributeInformation({
  attributes,
  setAttributes,
}: Props) {
  const addAttribute = () => {
    setAttributes([
      ...attributes,
      {
        key: '',
        label: '',
        dataType: 'string',
        isRequired: true,
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
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between">
        <div className="flex items-center gap-4">
          <SlidersHorizontal size={20} className="text-[#002366]" />
          <h2 className="text-lg font-bold">Thuộc tính động</h2>
        </div>

        <Button variant="secondary" onClick={addAttribute}>
          <Plus size={16} /> Thêm
        </Button>
      </div>

      {/* ✅ List scroll độc lập */}
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
        {attributes.map((attr, idx) => (
          <div
            key={idx}
            className="bg-primary/8 grid grid-cols-12 gap-4 rounded-lg p-4"
          >
            {/* Key */}
            <Input
              value={attr.key}
              onChange={(e) => updateAttr(idx, 'key', e.target.value)}
              className="bg-primary-foreground col-span-2 rounded-md border-0 text-sm shadow-none"
              placeholder="key"
            />

            {/* Label */}
            <Input
              value={attr.label}
              onChange={(e) => updateAttr(idx, 'label', e.target.value)}
              className="bg-primary-foreground col-span-3 rounded-md border-0 text-sm shadow-none"
              placeholder="label"
            />

            {/* Type */}
            <div className="bg-primary-foreground col-span-2 rounded-md">
              <Select
                value={attr.dataType}
                onValueChange={(value) => handleDataTypeChange(idx, value)}
              >
                <SelectTrigger className="rounded-md border-0 shadow-none">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Options */}
            {(attr.dataType === 'string' || attr.dataType === 'number') && (
              <Input
                value={attr.options.join(', ')}
                onChange={(e) => {
                  const arr = e.target.value
                    .split(',')
                    .map((v) => v.trim())
                    .filter(Boolean)
                  updateAttr(idx, 'options', arr)
                }}
                className="bg-primary-foreground col-span-3 rounded-md border-0 text-sm shadow-none"
                placeholder="vd: red, blue, green"
              />
            )}

            {/* Required */}
            <div className="col-span-1 flex items-center justify-center">
              <Switch
                checked={attr.isRequired}
                onCheckedChange={(val) => updateAttr(idx, 'isRequired', val)}
              />
            </div>

            {/* Delete */}
            <Button
              variant="ghost"
              onClick={() =>
                setAttributes(attributes.filter((_, i) => i !== idx))
              }
              className="col-span-1 text-red-500"
            >
              <Trash2 size={18} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}