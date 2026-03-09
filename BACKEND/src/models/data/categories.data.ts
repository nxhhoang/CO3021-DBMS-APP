import { ObjectId } from 'mongodb'
import Category from '~/models/schemas/Category.schema'

const mockCategories: Category[] = [
  new Category({
    _id: new ObjectId('6650000000000000000000001'),
    name: 'Laptop',
    slug: 'laptop',
    description: 'Máy tính xách tay các loại',
    isActive: true,
    dynamicAttributes: [
      {
        key: 'brand',
        label: 'Thương hiệu',
        dataType: 'string',
        isRequired: true,
        options: ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'MSI']
      },
      {
        key: 'ram',
        label: 'Dung lượng RAM',
        dataType: 'string',
        isRequired: true,
        options: ['8GB', '16GB', '32GB', '64GB']
      },
      {
        key: 'storage',
        label: 'Bộ nhớ trong',
        dataType: 'string',
        isRequired: true,
        options: ['256GB', '512GB', '1TB', '2TB']
      },
      {
        key: 'cpu',
        label: 'Vi xử lý (CPU)',
        dataType: 'string',
        isRequired: true,
        options: []
      },
      {
        key: 'screen_size',
        label: 'Kích thước màn hình (inch)',
        dataType: 'number',
        isRequired: false,
        options: []
      },
      {
        key: 'weight',
        label: 'Trọng lượng (kg)',
        dataType: 'number',
        isRequired: false,
        options: []
      }
    ],
    created_at: new Date('2026-01-01T00:00:00Z'),
    updated_at: new Date('2026-01-01T00:00:00Z')
  }),

  new Category({
    _id: new ObjectId('6650000000000000000000002'),
    name: 'Điện thoại',
    slug: 'dien-thoai',
    description: 'Điện thoại thông minh các loại',
    isActive: true,
    dynamicAttributes: [
      {
        key: 'brand',
        label: 'Thương hiệu',
        dataType: 'string',
        isRequired: true,
        options: ['Apple', 'Samsung', 'Xiaomi', 'OPPO', 'Vivo', 'Realme']
      },
      {
        key: 'ram',
        label: 'Dung lượng RAM',
        dataType: 'string',
        isRequired: true,
        options: ['4GB', '6GB', '8GB', '12GB', '16GB']
      },
      {
        key: 'storage',
        label: 'Bộ nhớ trong',
        dataType: 'string',
        isRequired: true,
        options: ['64GB', '128GB', '256GB', '512GB']
      },
      {
        key: 'color',
        label: 'Màu sắc',
        dataType: 'string',
        isRequired: false,
        options: ['Đen', 'Trắng', 'Xanh', 'Tím', 'Vàng', 'Đỏ']
      },
      {
        key: 'battery',
        label: 'Dung lượng pin (mAh)',
        dataType: 'number',
        isRequired: false,
        options: []
      }
    ],
    created_at: new Date('2026-01-01T00:00:00Z'),
    updated_at: new Date('2026-01-01T00:00:00Z')
  }),

  new Category({
    _id: new ObjectId('6650000000000000000000003'),
    name: 'Áo',
    slug: 'ao',
    description: 'Áo thun, áo sơ mi, áo khoác các loại',
    isActive: true,
    dynamicAttributes: [
      {
        key: 'brand',
        label: 'Thương hiệu',
        dataType: 'string',
        isRequired: false,
        options: ['Nike', 'Adidas', 'Uniqlo', 'Zara', 'H&M']
      },
      {
        key: 'size',
        label: 'Kích thước',
        dataType: 'string',
        isRequired: true,
        options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
      },
      {
        key: 'color',
        label: 'Màu sắc',
        dataType: 'string',
        isRequired: true,
        options: ['Đen', 'Trắng', 'Xám', 'Xanh navy', 'Đỏ', 'Vàng']
      },
      {
        key: 'material',
        label: 'Chất liệu',
        dataType: 'string',
        isRequired: true,
        options: ['Cotton', 'Polyester', 'Linen', 'Wool', 'Denim']
      }
    ],
    created_at: new Date('2026-01-01T00:00:00Z'),
    updated_at: new Date('2026-01-01T00:00:00Z')
  }),

  new Category({
    _id: new ObjectId('6650000000000000000000004'),
    name: 'Quần',
    slug: 'quan',
    description: 'Quần jeans, quần âu, quần thể thao các loại',
    isActive: true,
    dynamicAttributes: [
      {
        key: 'size',
        label: 'Kích thước (số)',
        dataType: 'string',
        isRequired: true,
        options: ['28', '29', '30', '31', '32', '33', '34', '36', '38']
      },
      {
        key: 'color',
        label: 'Màu sắc',
        dataType: 'string',
        isRequired: true,
        options: ['Xanh đậm', 'Xanh nhạt', 'Đen', 'Xám', 'Be']
      },
      {
        key: 'material',
        label: 'Chất liệu',
        dataType: 'string',
        isRequired: true,
        options: ['Denim', 'Cotton', 'Kaki', 'Polyester']
      },
      {
        key: 'style',
        label: 'Kiểu dáng',
        dataType: 'string',
        isRequired: false,
        options: ['Slim fit', 'Regular fit', 'Skinny', 'Wide leg']
      }
    ],
    created_at: new Date('2026-01-01T00:00:00Z'),
    updated_at: new Date('2026-01-01T00:00:00Z')
  }),

  new Category({
    _id: new ObjectId('6650000000000000000000005'),
    name: 'Phụ kiện công nghệ',
    slug: 'phu-kien-cong-nghe',
    description: 'Tai nghe, chuột, bàn phím, sạc dự phòng...',
    isActive: false,
    dynamicAttributes: [
      {
        key: 'brand',
        label: 'Thương hiệu',
        dataType: 'string',
        isRequired: false,
        options: []
      },
      {
        key: 'compatible',
        label: 'Tương thích',
        dataType: 'string',
        isRequired: false,
        options: ['iOS', 'Android', 'Windows', 'macOS', 'Universal']
      },
      {
        key: 'color',
        label: 'Màu sắc',
        dataType: 'string',
        isRequired: false,
        options: ['Đen', 'Trắng', 'Bạc', 'Hồng']
      }
    ],
    created_at: new Date('2026-01-01T00:00:00Z'),
    updated_at: new Date('2026-01-01T00:00:00Z')
  })
]

export default mockCategories
