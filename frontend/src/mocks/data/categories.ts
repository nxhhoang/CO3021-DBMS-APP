import { Category } from '@/types/category.types';

export const MOCK_CATEGORIES: Category[] = [
  {
    _id: 'category-1',
    name: 'Laptops',
    slug: 'laptops',
    description: 'Máy tính xách tay các loại',
    isActive: true,
    dynamicAttributes: [
      {
        key: 'ram',
        label: 'Dung lượng RAM',
        dataType: 'string',
        isRequired: true,
        options: ['8GB', '16GB'],
      },
      {
        key: 'storage',
        label: 'Dung lượng lưu trữ',
        dataType: 'string',
        isRequired: true,
        options: ['256GB', '512GB'],
      },
    ],
  },
  {
    _id: 'category-2',
    name: 'Smartphones',
    slug: 'smartphones',
    description: 'Điện thoại thông minh các loại',
    isActive: true,
    dynamicAttributes: [
      {
        key: 'ram',
        label: 'Dung lượng RAM',
        dataType: 'string',
        isRequired: true,
        options: ['4GB', '6GB'],
      },
      {
        key: 'storage',
        label: 'Dung lượng lưu trữ',
        dataType: 'string',
        isRequired: true,
        options: ['64GB', '128GB'],
      },
      {
        key: 'color',
        label: 'Màu sắc',
        dataType: 'string',
        isRequired: false,
        options: ['Silver', 'Black', 'Gold'],
      },
    ],
  },
  {
    _id: 'category-3',
    name: 'Clothing',
    slug: 'clothing',
    description: 'Quần áo thời trang',
    isActive: true,
    dynamicAttributes: [
      {
        key: 'size',
        label: 'Kích thước',
        dataType: 'string',
        isRequired: true,
        options: ['S', 'M', 'L', 'XL'],
      },
      {
        key: 'color',
        label: 'Màu sắc',
        dataType: 'string',
        isRequired: false,
        options: ['Red', 'Blue', 'Green'],
      },
    ],
  },
  {
    _id: 'category-4',
    name: 'Footwear',
    slug: 'footwear',
    description: 'Giày dép các loại',
    isActive: true,
    dynamicAttributes: [
      {
        key: 'size',
        label: 'Kích thước',
        dataType: 'string',
        isRequired: true,
        options: ['6', '7', '8', '9', '10'],
      },
      {
        key: 'color',
        label: 'Màu sắc',
        dataType: 'string',
        isRequired: false,
        options: ['Black', 'White', 'Brown'],
      },
    ],
  },
  {
    _id: 'category-5',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Phụ kiện thời trang và công nghệ',
    isActive: true,
    dynamicAttributes: [
      {
        key: 'batteryLife',
        label: 'Thời lượng pin',
        dataType: 'string',
        isRequired: false,
        options: ['10 hours', '20 hours', '30 hours'],
      },
      {
        key: 'color',
        label: 'Màu sắc',
        dataType: 'string',
        isRequired: false,
        options: ['Black', 'White', 'Red'],
      },
    ],
  },
];
