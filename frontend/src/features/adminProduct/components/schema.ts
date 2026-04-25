import * as z from 'zod'

export const productSchema = z.object({
  name: z.string().min(3, 'Tên sản phẩm phải ít nhất 3 ký tự'),
  categoryID: z.string().min(1, 'Vui lòng chọn danh mục'),
  basePrice: z.coerce.number().min(0, 'Giá phải lớn hơn hoặc bằng 0'),
  slug: z.string().min(1, 'Slug không được để trống'),
  description: z.string().min(10, 'Mô tả ít nhất 10 ký tự'),
  images: z.array(z.string()).min(1, 'Cần ít nhất 1 hình ảnh'),
  attributes: z.record(z.string(), z.any()).default({}),
})

export type ProductFormInput = z.input<typeof productSchema>
export type ProductFormValues = z.output<typeof productSchema>
