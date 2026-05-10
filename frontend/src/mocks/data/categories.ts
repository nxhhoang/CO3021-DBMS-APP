import { Category } from '@/types'

const MOCK_CATEGORIES: Category[] = [
  {
    _id: 'cat-laptop',
    name: 'Laptop',
    slug: 'laptop',
    description: 'Máy tính xách tay',
    isActive: true,
    dynamicAttributes: [
      {
        key: 'battery',
        label: 'Pin',
        dataType: 'number',
        options: ['40', '50', '60', '70', '80', '90'],
      },
      {
        key: 'brand',
        label: 'Thương hiệu',
        dataType: 'string',
        options: ['Apple', 'Dell', 'HP', 'ASUS', 'Lenovo'],
      },
      {
        key: 'cpu',
        label: 'CPU',
        dataType: 'string',
        options: [
          'Core i5',
          'Core i7',
          'Ryzen 5',
          'Ryzen 7',
          'Apple M1',
          'Apple M2',
        ],
      },
      {
        key: 'screenSize',
        label: 'Kích thước màn hình',
        dataType: 'number',
        options: ['13.3', '14', '15.6', '16'],
      },
      {
        key: 'os',
        label: 'Hệ điều hành',
        dataType: 'string',
        options: ['Windows 11', 'macOS', 'Linux'],
      },
    ],
    variantAttributes: [
      {
        key: 'color',
        label: 'Màu sắc',
        dataType: 'string',
        options: ['Silver', 'Space Gray', 'Black'],
      },
      {
        key: 'ram',
        label: 'RAM',
        dataType: 'string',
        options: ['8GB', '16GB', '32GB'],
      },
      {
        key: 'storage',
        label: 'Ổ cứng',
        dataType: 'string',
        options: ['256GB', '512GB', '1TB'],
      },
    ],
  },
  {
    _id: 'cat-dien-thoai',
    name: 'Điện thoại',
    slug: 'dien-thoai',
    description: 'Điện thoại thông minh',
    isActive: true,
    dynamicAttributes: [
      {
        key: 'brand',
        label: 'Thương hiệu',
        dataType: 'string',
        options: ['Apple', 'Samsung', 'Xiaomi', 'Oppo'],
      },
      {
        key: 'battery',
        label: 'Pin',
        dataType: 'number',
        options: ['3000', '4000', '5000'],
      },
      {
        key: 'os',
        label: 'Hệ điều hành',
        dataType: 'string',
        options: ['iOS', 'Android'],
      },
    ],
    variantAttributes: [
      {
        key: 'color',
        label: 'Màu sắc',
        dataType: 'string',
        options: ['Black', 'White', 'Blue', 'Gold'],
      },
      {
        key: 'storage',
        label: 'Dung lượng',
        dataType: 'string',
        options: ['128GB', '256GB', '512GB'],
      },
    ],
  },
  {
    _id: 'cat-dong-ho',
    name: 'Đồng hồ',
    slug: 'dong-ho',
    description: 'Đồng hồ thông minh và thời trang',
    isActive: true,
    dynamicAttributes: [
      {
        key: 'brand',
        label: 'Thương hiệu',
        dataType: 'string',
        options: ['Apple', 'Samsung', 'Garmin', 'Fossil'],
      },
      {
        key: 'gender',
        label: 'Giới tính',
        dataType: 'string',
        options: ['Nam', 'Nữ', 'Unisex'],
      },
      {
        key: 'material',
        label: 'Chất liệu',
        dataType: 'string',
        options: ['Thép không gỉ', 'Nhôm', 'Titan'],
      },
      {
        key: 'movement',
        label: 'Bộ máy',
        dataType: 'string',
        options: ['quartz', 'automatic'],
      },
      {
        key: 'waterResistance',
        label: 'Chống nước',
        dataType: 'number',
        options: ['30', '50', '100', '200'],
      },
    ],
    variantAttributes: [
      {
        key: 'color',
        label: 'Màu sắc',
        dataType: 'string',
        options: ['Black', 'Silver', 'Gold'],
      },
      {
        key: 'strapColor',
        label: 'Màu dây',
        dataType: 'string',
        options: ['Black', 'Brown', 'Silver'],
      },
      {
        key: 'size',
        label: 'Kích thước mặt',
        dataType: 'number',
        options: ['38', '40', '42', '44'],
      },
      {
        key: 'strapMaterial',
        label: 'Chất liệu dây',
        dataType: 'string',
        options: ['Leather', 'Metal', 'Silicone'],
      },
    ],
  },
  {
    _id: 'cat-giay',
    name: 'Giày',
    slug: 'giay',
    description: 'Giày dép thể thao và thời trang',
    isActive: true,
    dynamicAttributes: [
      {
        key: 'brand',
        label: 'Thương hiệu',
        dataType: 'string',
        options: ['Nike', 'Adidas', 'Puma', 'New Balance'],
      },
      {
        key: 'gender',
        label: 'Giới tính',
        dataType: 'string',
        options: ['Nam', 'Nữ', 'Unisex'],
      },
      {
        key: 'material',
        label: 'Chất liệu',
        dataType: 'string',
        options: ['Da', 'Vải', 'Lưới'],
      },
      {
        key: 'soleMaterial',
        label: 'Chất liệu đế',
        dataType: 'string',
        options: ['Cao su', 'EVA', 'PU'],
      },
      {
        key: 'sportType',
        label: 'Loại thể thao',
        dataType: 'string',
        options: ['Running', 'Basketball', 'Football', 'Tennis'],
      },
    ],
    variantAttributes: [
      {
        key: 'color',
        label: 'Màu sắc',
        dataType: 'string',
        options: ['Black', 'White', 'Red', 'Blue'],
      },
      {
        key: 'size',
        label: 'Kích cỡ',
        dataType: 'number',
        options: ['38', '39', '40', '41'],
      },
      {
        key: 'width',
        label: 'Độ rộng',
        dataType: 'string',
        options: ['normal', 'wide'],
      },
    ],
  },
  {
    _id: 'cat-camera',
    name: 'Camera',
    slug: 'camera',
    description: 'Máy ảnh và thiết bị quay phim',
    isActive: true,
    dynamicAttributes: [
      {
        key: 'brand',
        label: 'Thương hiệu',
        dataType: 'string',
        options: ['Canon', 'Nikon', 'Sony', 'Fujifilm'],
      },
      {
        key: 'resolution',
        label: 'Độ phân giải',
        dataType: 'string',
        options: ['20MP', '24MP', '30MP', '45MP'],
      },
      {
        key: 'sensorType',
        label: 'Loại cảm biến',
        dataType: 'string',
        options: ['CMOS', 'CCD'],
      },
      {
        key: 'lensMount',
        label: 'Ngàm ống kính',
        dataType: 'string',
        options: ['EF', 'F', 'E', 'X'],
      },
      {
        key: 'videoQuality',
        label: 'Chất lượng video',
        dataType: 'string',
        options: ['4K', '1080p', '720p'],
      },
    ],
    variantAttributes: [
      {
        key: 'color',
        label: 'Màu sắc',
        dataType: 'string',
        options: ['Black', 'Silver'],
      },
      {
        key: 'kit',
        label: 'Bộ kit',
        dataType: 'string',
        options: ['body', 'kit'],
      },
      {
        key: 'edition',
        label: 'Phiên bản',
        dataType: 'string',
        options: ['Standard', 'Pro', 'Limited'],
      },
    ],
  },
]

export { MOCK_CATEGORIES }
