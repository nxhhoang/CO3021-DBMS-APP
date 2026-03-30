import { Category } from '@/types/category.types';

export const MOCK_CATEGORIES: Category[] = [
  {
    _id: 'category-1',
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
        options: ['Apple', 'Dell', 'HP'],
      },
      {
        key: 'os',
        label: 'Hệ điều hành',
        dataType: 'string',
        isRequired: true,
        options: ['Windows', 'macOS', 'Linux'],
      },
    ],
  },
  {
    _id: 'category-2',
    name: 'Smartphone',
    slug: 'smartphone',
    description: 'Điện thoại thông minh các loại',
    isActive: true,
    dynamicAttributes: [
      {
        key: 'brand',
        label: 'Thương hiệu',
        dataType: 'string',
        isRequired: true,
        options: ['Apple', 'Samsung', 'Xiaomi'],
      },
      {
        key: 'os',
        label: 'Hệ điều hành',
        dataType: 'string',
        isRequired: true,
        options: ['iOS', 'Android'],
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
        key: 'type',
        label: 'Loại',
        dataType: 'string',
        isRequired: true,
        options: ['Shirt', 'Pants', 'Dress'],
      },
      {
        key: 'sex',
        label: 'Giới tính',
        dataType: 'string',
        isRequired: false,
        options: ['Male', 'Female', 'Unisex'],
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
        key: 'brand',
        label: 'Thương hiệu',
        dataType: 'string',
        isRequired: true,
        options: ['Nike', 'Adidas', 'Reebok'],
      },
      {
        key: 'type',
        label: 'Loại',
        dataType: 'string',
        isRequired: false,
        options: ['Running', 'Casual', 'Formal'],
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
        key: 'brand',
        label: 'Thương hiệu',
        dataType: 'string',
        isRequired: false,
        options: ['Sony', 'Apple', 'Samsung'],
      },
      {
        key: 'type',
        label: 'Loại',
        dataType: 'string',
        isRequired: false,
        options: ['Headphones', 'Watches', 'Bags'],
      },
    ],
  },
];
