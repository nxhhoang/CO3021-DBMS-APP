import { ObjectId } from 'mongodb'
import Category from '~/models/schemas/Category.schema'

const mockCategories: Category[] = [
  new Category({
    _id: new ObjectId('665000000000000000000001'),
    name: 'Laptop',
    slug: 'laptop',
    description: 'All kinds of laptops',
    isActive: true,
    dynamicAttributes: [
      {
        key: 'brand',
        label: 'Brand',
        dataType: 'string',
        options: ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'MSI']
      },
      {
        key: 'ram',
        label: 'RAM Capacity',
        dataType: 'string',
        options: ['8GB', '16GB', '32GB', '64GB']
      },
      {
        key: 'storage',
        label: 'Internal Storage',
        dataType: 'string',
        options: ['256GB', '512GB', '1TB', '2TB']
      },
      {
        key: 'cpu',
        label: 'Processor (CPU)',
        dataType: 'string',
        options: []
      },
      {
        key: 'screen_size',
        label: 'Screen Size (inch)',
        dataType: 'number',
        options: []
      },
      {
        key: 'weight',
        label: 'Weight (kg)',
        dataType: 'number',
        options: []
      }
    ],
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z')
  }),

  new Category({
    _id: new ObjectId('665000000000000000000002'),
    name: 'Smartphone',
    slug: 'smartphone',
    description: 'All kinds of smartphones',
    isActive: true,
    dynamicAttributes: [
      {
        key: 'brand',
        label: 'Brand',
        dataType: 'string',
        options: ['Apple', 'Samsung', 'Xiaomi', 'OPPO', 'Vivo', 'Realme']
      },
      {
        key: 'ram',
        label: 'RAM Capacity',
        dataType: 'string',
        options: ['4GB', '6GB', '8GB', '12GB', '16GB']
      },
      {
        key: 'storage',
        label: 'Internal Storage',
        dataType: 'string',
        options: ['64GB', '128GB', '256GB', '512GB']
      },
      {
        key: 'color',
        label: 'Color',
        dataType: 'string',
        options: ['Black', 'White', 'Blue', 'Purple', 'Gold', 'Red']
      },
      {
        key: 'battery',
        label: 'Battery Capacity (mAh)',
        dataType: 'number',
        options: []
      }
    ],
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z')
  }),

  new Category({
    _id: new ObjectId('665000000000000000000003'),
    name: 'Tops',
    slug: 'tops',
    description: 'T-shirts, shirts, jackets, and all kinds of tops',
    isActive: true,
    dynamicAttributes: [
      {
        key: 'brand',
        label: 'Brand',
        dataType: 'string',
        options: ['Nike', 'Adidas', 'Uniqlo', 'Zara', 'H&M']
      },
      {
        key: 'size',
        label: 'Size',
        dataType: 'string',
        options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
      },
      {
        key: 'color',
        label: 'Color',
        dataType: 'string',
        options: ['Black', 'White', 'Gray', 'Navy', 'Red', 'Yellow']
      },
      {
        key: 'material',
        label: 'Material',
        dataType: 'string',
        options: ['Cotton', 'Polyester', 'Linen', 'Wool', 'Denim']
      }
    ],
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z')
  }),

  new Category({
    _id: new ObjectId('665000000000000000000004'),
    name: 'Bottoms',
    slug: 'bottoms',
    description: 'Jeans, trousers, sweatpants, and all kinds of bottoms',
    isActive: true,
    dynamicAttributes: [
      {
        key: 'size',
        label: 'Waist Size',
        dataType: 'string',
        options: ['28', '29', '30', '31', '32', '33', '34', '36', '38']
      },
      {
        key: 'color',
        label: 'Color',
        dataType: 'string',
        options: ['Dark Blue', 'Light Blue', 'Black', 'Gray', 'Beige']
      },
      {
        key: 'material',
        label: 'Material',
        dataType: 'string',
        options: ['Denim', 'Cotton', 'Khaki', 'Polyester']
      },
      {
        key: 'style',
        label: 'Fit Style',
        dataType: 'string',
        options: ['Slim fit', 'Regular fit', 'Skinny', 'Wide leg']
      }
    ],
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z')
  }),

  new Category({
    _id: new ObjectId('665000000000000000000005'),
    name: 'Tech Accessories',
    slug: 'tech-accessories',
    description: 'Headphones, mice, keyboards, power banks, and more',
    isActive: false,
    dynamicAttributes: [
      {
        key: 'brand',
        label: 'Brand',
        dataType: 'string',
        options: []
      },
      {
        key: 'compatible',
        label: 'Compatibility',
        dataType: 'string',
        options: ['iOS', 'Android', 'Windows', 'macOS', 'Universal']
      },
      {
        key: 'color',
        label: 'Color',
        dataType: 'string',
        options: ['Black', 'White', 'Silver', 'Pink']
      }
    ],
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z')
  })
]

export default mockCategories
