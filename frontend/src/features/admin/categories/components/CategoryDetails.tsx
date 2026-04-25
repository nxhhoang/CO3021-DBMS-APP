'use client'

import React from 'react'
import { Category } from '@/types/category.types'

interface CategoryDetailsProps {
  category: Category
}

function getAttributeOptionsText(options?: Array<string | number | boolean>) {
  if (!Array.isArray(options) || options.length === 0) {
    return 'Không có'
  }
  return options.map((option) => String(option)).join(', ')
}

export const CategoryDetails = ({ category }: CategoryDetailsProps) => {
  const variantAttributes = category.variantAttributes || []

  return (
    <div className="animate-in fade-in-0 slide-in-from-top-1 grid gap-4 duration-200 lg:grid-cols-2">
      <div className="rounded-lg border border-slate-200/50 p-4">
        <p className="text-on-surface mb-3 text-sm font-semibold">
          Thuộc tính động ({category.dynamicAttributes.length})
        </p>

        {category.dynamicAttributes.length ? (
          <div className="space-y-3">
            {category.dynamicAttributes.map((attribute) => (
              <div
                key={attribute.key}
                className="glass-card flex flex-col gap-2 rounded-2xl border-white bg-white/60 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="font-display text-[10px] font-black tracking-widest text-slate-900 uppercase">
                    {attribute.label}
                  </p>
                  <span className="glass-badge-blue text-[9px] font-black uppercase">
                    {attribute.dataType}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-medium text-slate-400">
                    key: {attribute.key}
                  </p>
                  <p className="text-[10px] font-bold text-slate-600">
                    Lựa chọn:{' '}
                    <span className="text-slate-500">
                      {getAttributeOptionsText(attribute.options)}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-on-surface-variant text-xs">
            Chưa có thuộc tính động.
          </p>
        )}
      </div>

      <div className="rounded-lg border border-slate-200/50 p-4">
        <p className="text-on-surface mb-3 text-sm font-semibold">
          Thuộc tính biến thể ({variantAttributes.length})
        </p>

        {variantAttributes.length ? (
          <div className="space-y-3">
            {variantAttributes.map((attribute) => (
              <div
                key={attribute.key}
                className="glass-card flex flex-col gap-2 rounded-2xl border-white bg-white/60 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="font-display text-[10px] font-black tracking-widest text-slate-900 uppercase">
                    {attribute.label}
                  </p>
                  <span className="glass-badge-blue text-[9px] font-black uppercase">
                    {attribute.dataType}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-medium text-slate-400">
                    key: {attribute.key}
                  </p>
                  <p className="text-[10px] font-bold text-slate-600">
                    Lựa chọn:{' '}
                    <span className="text-slate-500">
                      {getAttributeOptionsText(attribute.options)}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] font-bold text-slate-400">
            Chưa có thuộc tính biến thể.
          </p>
        )}
      </div>
    </div>
  )
}
