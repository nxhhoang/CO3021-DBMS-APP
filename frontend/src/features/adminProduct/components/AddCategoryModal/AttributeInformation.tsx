'use client'

import { Plus, Trash2, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  options: any[]
}

interface Props {
  attributes: Attribute[]
  setAttributes: (val: Attribute[]) => void
}

export default function AttributeInformation({
  attributes,
  setAttributes,
}: Props) {
  const addAttribute = () => {
    setAttributes([
      ...attributes,
      { key: '', label: '', dataType: 'string', isRequired: true, options: [] },
    ])
  }

  return (
    <>
      <div className="flex items-center justify-between overflow-y-auto">
        <div className="flex items-center gap-4">
          <SlidersHorizontal size={20} className="text-[#002366]" />
          <h2 className="text-lg font-bold">Thuộc tính động</h2>
        </div>

        <Button
          variant="secondary"
          onClick={addAttribute}
          //   className="flex items-center gap-2 rounded-lg bg-[#002366]/5 px-5 py-2 text-xs font-bold text-[#002366]"
        >
          <Plus size={16} /> Thêm
        </Button>
      </div>

      <div className="space-y-4">
        {attributes.map((attr, idx) => (
          <div
            key={idx}
            className="bg-primary/3 grid grid-cols-12 gap-4 rounded-lg border-0 p-4"
          >
            {/* Key */}
            <Input
              value={attr.key}
              onChange={(e) => {
                const newAttrs = [...attributes]
                newAttrs[idx].key = e.target.value
                setAttributes(newAttrs)
              }}
              className="bg-primary/6 col-span-3 rounded-lg border-0 text-sm"
              placeholder="key"
            />

            {/* Label */}
            <Input
              value={attr.label}
              onChange={(e) => {
                const newAttrs = [...attributes]
                newAttrs[idx].label = e.target.value
                setAttributes(newAttrs)
              }}
              className="bg-primary/6 col-span-4 rounded-lg border-0 text-sm"
              placeholder="label"
            />

            {/* Type */}
            <div className="bg-primary/6 col-span-3 rounded-lg border-0">
              <Select
                value={attr.dataType}
                onValueChange={(value) => {
                  const newAttrs = [...attributes]
                  newAttrs[idx].dataType = value
                  setAttributes(newAttrs)
                }}
              >
                <SelectTrigger className="w-full border-0">
                  <SelectValue placeholder="Chọn kiểu" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Delete */}
            <button
              onClick={() =>
                setAttributes(attributes.filter((_, i) => i !== idx))
              }
              className="col-span-2 flex items-center justify-center text-red-500"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
