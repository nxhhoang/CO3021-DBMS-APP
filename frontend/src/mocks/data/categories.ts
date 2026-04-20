const CATEGORIES = [
  {
    name: 'Laptop',
    slug: 'laptop',
    description: 'Máy tính xách tay',
    isActive: true,
    dynamicAttributes: [
      {
        key: 'battery',
        label: 'Pin',
        dataType: 'number',
        options: [40, 50, 60, 70, 80, 90],
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
        options: [13.3, 14, 15.6, 16],
      },
      {
        key: 'os',
        label: 'Hệ điều hành',
        dataType: 'string',
        options: ['Windows 11', 'macOS', 'Linux'],
      },
    ],
  },
  {
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
        options: [3000, 4000, 5000],
      },
      {
        key: 'os',
        label: 'Hệ điều hành',
        dataType: 'string',
        options: ['iOS', 'Android'],
      },
    ],
  },
  {
    name: 'Đồng hồ',
    slug: 'dong-ho',
    description: 'Đồng hồ thông minh và thời trang',
    isActive: true,
    dynamicAttributes: [
      {
        key: 'brand',
        label: 'Thương hiệu',
        dataType: 'string',
      },
      {
        key: 'gender',
        label: 'Giới tính',
        dataType: 'string',
      },
      {
        key: 'material',
        label: 'Chất liệu',
        dataType: 'string',
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
      },
    ],
  },
  {
    name: 'Giày',
    slug: 'giay',
    description: 'Giày dép thể thao và thời trang',
    isActive: true,
    dynamicAttributes: [
      {
        key: 'brand',
        label: 'Thương hiệu',
        dataType: 'string',
      },
      {
        key: 'gender',
        label: 'Giới tính',
        dataType: 'string',
      },
      {
        key: 'material',
        label: 'Chất liệu',
        dataType: 'string',
      },
      {
        key: 'soleMaterial',
        label: 'Chất liệu đế',
        dataType: 'string',
      },
      {
        key: 'sportType',
        label: 'Loại thể thao',
        dataType: 'string',
      },
    ],
  },
  {
    name: 'Camera',
    slug: 'camera',
    description: 'Máy ảnh và thiết bị quay phim',
    isActive: true,
    dynamicAttributes: [
      {
        key: 'brand',
        label: 'Thương hiệu',
        dataType: 'string',
      },
      {
        key: 'resolution',
        label: 'Độ phân giải',
        dataType: 'string',
      },
      {
        key: 'sensorType',
        label: 'Loại cảm biến',
        dataType: 'string',
      },
      {
        key: 'lensMount',
        label: 'Ngàm ống kính',
        dataType: 'string',
      },
      {
        key: 'videoQuality',
        label: 'Chất lượng video',
        dataType: 'string',
      },
    ],
  },
]

export default CATEGORIES
