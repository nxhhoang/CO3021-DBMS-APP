'use client'

import { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import categoryService from '@/services/category.service'
import { CreateCategoryRequest } from '@/types/category.types'

interface AddCategoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddCategoryModal({
  isOpen,
  onClose,
}: AddCategoryModalProps) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [attributes, setAttributes] = useState<any[]>([])

  if (!isOpen) return null

  // Hàm hỗ trợ tạo slug tự động từ tên
  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .trim()
      .normalize('NFD') // Chuyển tiếng Việt có dấu thành không dấu
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '') // Xóa ký tự đặc biệt
      .replace(/[\s_-]+/g, '-') // Thay khoảng trắng bằng gạch ngang
      .replace(/^-+|-+$/g, '')
  }

  const handleNameChange = (val: string) => {
    setName(val)
    setSlug(generateSlug(val)) // Tự động gợi ý slug khi gõ tên
  }

  const addAttribute = () => {
    setAttributes([
      ...attributes,
      { key: '', label: '', dataType: 'string', isRequired: true, options: [] },
    ])
  }

  const handleSave = async () => {
    try {
      const payload: CreateCategoryRequest = {
        name: name,
        slug: slug,
        description: description,
        isActive: true,
        dynamicAttributes: attributes,
      }

      const result = await categoryService.createCategory(payload)
      alert(result.message)
      onClose()
    } catch (error) {
      console.error('Lỗi khi tạo category:', error)
      alert('Có lỗi xảy ra khi tạo danh mục')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Thêm danh mục mới</h2>
          <button
            onClick={onClose}
            className="transition-colors hover:text-red-500"
          >
            <X size={24} />
          </button>
        </div>

        <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-2">
          {/* Tên danh mục */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Tên danh mục</label>
            <input
              value={name}
              placeholder="VD: Laptop Gaming"
              className="focus:ring-primary w-full rounded border p-2 outline-none focus:ring-2"
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>

          {/* Slug */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              Slug (Đường dẫn tĩnh)
            </label>
            <input
              value={slug}
              placeholder="vd-laptop-gaming"
              className="focus:ring-primary w-full rounded border bg-gray-50 p-2 font-mono text-sm outline-none focus:ring-2"
              onChange={(e) => setSlug(e.target.value)}
            />
            <p className="text-[10px] text-gray-400 italic">
              * Tự động tạo từ tên, bạn có thể chỉnh sửa lại.
            </p>
          </div>

          {/* Mô tả */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Mô tả</label>
            <textarea
              placeholder="Nhập mô tả ngắn gọn cho danh mục này..."
              className="focus:ring-primary w-full rounded border p-2 outline-none focus:ring-2"
              rows={3}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="border-t pt-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">
                Thuộc tính động (Dynamic Attributes)
              </h3>
              <button
                onClick={addAttribute}
                className="flex items-center gap-1 rounded bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
              >
                <Plus size={14} /> Thêm thuộc tính
              </button>
            </div>

            {attributes.length === 0 && (
              <p className="py-4 text-center text-sm text-gray-400 italic">
                Chưa có thuộc tính động nào được thêm.
              </p>
            )}

            {attributes.map((attr, idx) => (
              <div
                key={idx}
                className="mb-3 grid grid-cols-4 gap-2 rounded-lg border border-gray-100 bg-gray-50/50 p-3 shadow-sm"
              >
                <div className="col-span-1 space-y-1">
                  <input
                    placeholder="Key (vd: cpu)"
                    className="w-full rounded border bg-white p-1.5 text-sm"
                    onChange={(e) => {
                      const newAttrs = [...attributes]
                      newAttrs[idx].key = e.target.value
                      setAttributes(newAttrs)
                    }}
                  />
                </div>
                <div className="col-span-1 space-y-1">
                  <input
                    placeholder="Nhãn (vd: Vi xử lý)"
                    className="w-full rounded border bg-white p-1.5 text-sm"
                    onChange={(e) => {
                      const newAttrs = [...attributes]
                      newAttrs[idx].label = e.target.value
                      setAttributes(newAttrs)
                    }}
                  />
                </div>
                <div className="col-span-1 space-y-1">
                  <select
                    className="w-full rounded border bg-white p-1.5 text-sm"
                    onChange={(e) => {
                      const newAttrs = [...attributes]
                      newAttrs[idx].dataType = e.target.value
                      setAttributes(newAttrs)
                    }}
                  >
                    <option value="string">Chữ (String)</option>
                    <option value="number">Số (Number)</option>
                    <option value="boolean">Đúng/Sai (Bool)</option>
                  </select>
                </div>
                <div className="flex items-center justify-center">
                  <button
                    onClick={() =>
                      setAttributes(attributes.filter((_, i) => i !== idx))
                    }
                    className="rounded p-1 hover:bg-red-50"
                    title="Xóa thuộc tính"
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t pt-4">
          <button
            onClick={onClose}
            className="rounded border border-gray-300 px-5 py-2 font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="bg-primary rounded px-5 py-2 font-medium text-white transition-opacity hover:opacity-90"
          >
            Lưu danh mục
          </button>
        </div>
      </div>
    </div>
  )
}
