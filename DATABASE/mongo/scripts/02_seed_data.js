db = db.getSiblingDB('hybrid_db');

// ==========================================
// 1. SEED CATEGORY LAPTOP (Lấy ID cho Product)
// ==========================================
const laptopResult = db.categories.insertOne({
    name: "Laptop",
    slug: "laptop",
    description: "Máy tính xách tay các loại",
    isActive: true,
    dynamicAttributes: [
        { key: "brand", label: "Thương hiệu", dataType: "string" },
        { key: "cpu", label: "CPU", dataType: "string" },
        { key: "gpu", label: "GPU", dataType: "string" },
        { key: "screenSize", label: "Kích thước màn hình", dataType: "number" },
        { key: "battery", label: "Pin", dataType: "number" },
        { key: "weight", label: "Trọng lượng", dataType: "number" },
        { key: "os", label: "Hệ điều hành", dataType: "string" }
    ],
    variantAttributes: [
        { key: "ram", label: "Dung lượng RAM", dataType: "string", options: ["8GB", "16GB", "32GB"] },
        { key: "storage", label: "Ổ cứng", dataType: "string", options: ["256GB", "512GB", "1TB"] },
        { key: "color", label: "Màu sắc", dataType: "string", options: ["silver", "black", "gray"] }
    ]
});

const laptopCategoryId = laptopResult.insertedId;

// ==========================================
// 2. SEED CÁC CATEGORIES CÒN LẠI
// ==========================================
db.categories.insertMany([
    {
        name: "Điện thoại",
        slug: "dien-thoai",
        description: "Điện thoại thông minh di động",
        isActive: true,
        dynamicAttributes: [
            { key: "brand", label: "Thương hiệu", dataType: "string" },
            { key: "screenSize", label: "Kích thước màn hình", dataType: "number" },
            { key: "battery", label: "Dung lượng pin", dataType: "number" },
            { key: "camera", label: "Camera", dataType: "string" },
            { key: "os", label: "Hệ điều hành", dataType: "string" },
            { key: "chipset", label: "Chipset", dataType: "string" }
        ],
        variantAttributes: [
            { key: "storage", label: "Dung lượng lưu trữ", dataType: "string", options: ["128GB", "256GB", "512GB"] },
            { key: "ram", label: "Dung lượng RAM", dataType: "string", options: ["6GB", "8GB", "12GB"] },
            { key: "color", label: "Màu sắc", dataType: "string", options: ["black", "white", "blue"] }
        ]
    },
    {
        name: "Quần áo",
        slug: "quan-ao",
        description: "Thời trang nam nữ",
        isActive: true,
        dynamicAttributes: [
            { key: "brand", label: "Thương hiệu", dataType: "string" },
            { key: "material", label: "Chất liệu", dataType: "string" },
            { key: "gender", label: "Giới tính", dataType: "string" },
            { key: "style", label: "Phong cách", dataType: "string" },
            { key: "season", label: "Mùa", dataType: "string" }
        ],
        variantAttributes: [
            { key: "size", label: "Kích cỡ", dataType: "string", options: ["S", "M", "L", "XL"] },
            { key: "color", label: "Màu sắc", dataType: "string" },
            { key: "fit", label: "Kiểu dáng", dataType: "string", options: ["slim", "regular", "oversized"] }
        ]
    },
    {
        name: "Giày",
        slug: "giay",
        description: "Giày dép thể thao và thời trang",
        isActive: true,
        dynamicAttributes: [
            { key: "brand", label: "Thương hiệu", dataType: "string" },
            { key: "material", label: "Chất liệu", dataType: "string" },
            { key: "soleMaterial", label: "Chất liệu đế", dataType: "string" },
            { key: "gender", label: "Giới tính", dataType: "string" },
            { key: "sportType", label: "Loại thể thao", dataType: "string" }
        ],
        variantAttributes: [
            { key: "size", label: "Kích cỡ", dataType: "number", options: [38, 39, 40, 41] },
            { key: "color", label: "Màu sắc", dataType: "string" },
            { key: "width", label: "Độ rộng", dataType: "string", options: ["normal", "wide"] }
        ]
    },
    {
        name: "Tai nghe",
        slug: "tai-nghe",
        description: "Tai nghe không dây và có dây",
        isActive: true,
        dynamicAttributes: [
            { key: "brand", label: "Thương hiệu", dataType: "string" },
            { key: "type", label: "Loại tai nghe", dataType: "string", options: ["in-ear", "over-ear"] },
            { key: "wireless", label: "Không dây", dataType: "boolean" },
            { key: "batteryLife", label: "Thời lượng pin", dataType: "number" },
            { key: "noiseCancelling", label: "Chống ồn", dataType: "boolean" }
        ],
        variantAttributes: [
            { key: "color", label: "Màu sắc", dataType: "string" },
            { key: "connectivity", label: "Kết nối", dataType: "string", options: ["bluetooth", "wired"] },
            { key: "edition", label: "Phiên bản", dataType: "string", options: ["standard", "pro"] }
        ]
    },
    {
        name: "Đồng hồ",
        slug: "dong-ho",
        description: "Đồng hồ thông minh và thời trang",
        isActive: true,
        dynamicAttributes: [
            { key: "brand", label: "Thương hiệu", dataType: "string" },
            { key: "movement", label: "Bộ máy", dataType: "string", options: ["quartz", "automatic"] },
            { key: "waterResistance", label: "Chống nước", dataType: "number" },
            { key: "material", label: "Chất liệu", dataType: "string" },
            { key: "gender", label: "Giới tính", dataType: "string" }
        ],
        variantAttributes: [
            { key: "size", label: "Kích thước mặt", dataType: "number" },
            { key: "color", label: "Màu sắc", dataType: "string" },
            { key: "strapMaterial", label: "Chất liệu dây", dataType: "string" }
        ]
    },
    {
        name: "Bàn phím",
        slug: "ban-phim",
        description: "Bàn phím máy tính",
        isActive: true,
        dynamicAttributes: [
            { key: "brand", label: "Thương hiệu", dataType: "string" },
            { key: "layout", label: "Bố cục", dataType: "string", options: ["fullsize", "TKL"] },
            { key: "switchType", label: "Loại Switch", dataType: "string" },
            { key: "wireless", label: "Không dây", dataType: "boolean" },
            { key: "backlight", label: "Đèn nền", dataType: "boolean" }
        ],
        variantAttributes: [
            { key: "switch", label: "Switch", dataType: "string", options: ["red", "blue", "brown"] },
            { key: "color", label: "Màu sắc", dataType: "string" },
            { key: "languageLayout", label: "Ngôn ngữ bàn phím", dataType: "string", options: ["US", "UK"] }
        ]
    },
    {
        name: "Chuột máy tính",
        slug: "chuot-may-tinh",
        description: "Chuột gaming và văn phòng",
        isActive: true,
        dynamicAttributes: [
            { key: "brand", label: "Thương hiệu", dataType: "string" },
            { key: "dpi", label: "DPI", dataType: "number" },
            { key: "wireless", label: "Không dây", dataType: "boolean" },
            { key: "sensor", label: "Cảm biến", dataType: "string" },
            { key: "ergonomic", label: "Công thái học", dataType: "boolean" }
        ],
        variantAttributes: [
            { key: "color", label: "Màu sắc", dataType: "string" },
            { key: "connectivity", label: "Kết nối", dataType: "string", options: ["bluetooth", "2.4GHz"] },
            { key: "edition", label: "Phiên bản", dataType: "string" }
        ]
    },
    {
        name: "Tivi",
        slug: "tivi",
        description: "Smart TV, TV OLED, QLED",
        isActive: true,
        dynamicAttributes: [
            { key: "brand", label: "Thương hiệu", dataType: "string" },
            { key: "resolution", label: "Độ phân giải", dataType: "string", options: ["4K", "8K"] },
            { key: "panelType", label: "Loại tấm nền", dataType: "string", options: ["OLED", "QLED"] },
            { key: "smartTV", label: "Smart TV", dataType: "boolean" },
            { key: "os", label: "Hệ điều hành", dataType: "string" }
        ],
        variantAttributes: [
            { key: "screenSize", label: "Kích thước màn hình", dataType: "number", options: [43, 55, 65] },
            { key: "color", label: "Màu sắc", dataType: "string" },
            { key: "modelYear", label: "Năm sản xuất", dataType: "number" }
        ]
    },
    {
        name: "Túi xách",
        slug: "tui-xach",
        description: "Túi xách thời trang",
        isActive: true,
        dynamicAttributes: [
            { key: "brand", label: "Thương hiệu", dataType: "string" },
            { key: "material", label: "Chất liệu", dataType: "string" },
            { key: "gender", label: "Giới tính", dataType: "string" },
            { key: "style", label: "Phong cách", dataType: "string" },
            { key: "waterproof", label: "Chống nước", dataType: "boolean" }
        ],
        variantAttributes: [
            { key: "size", label: "Kích cỡ", dataType: "string", options: ["small", "medium", "large"] },
            { key: "color", label: "Màu sắc", dataType: "string" },
            { key: "strapType", label: "Loại quai", dataType: "string", options: ["crossbody", "shoulder"] }
        ]
    }
]);

// ==========================================
// 3. SEED PRODUCT (Dùng ID của danh mục Laptop)
// ==========================================
db.products.insertOne({
    categoryID: laptopCategoryId,
    name: "MacBook Pro M3",
    slug: "macbook-pro-m3",
    basePrice: 20000000,
    description: "Apple M3 Chip",
    images: ["https://example.com/macbook.jpg"],
    attributes: { 
        brand: "Apple",
        cpu: "M3",
        gpu: "10-core",
        screenSize: 14,
        battery: 70,
        weight: 1.55,
        os: "macOS"
    },
    isActive: true,
    avgRating: 0,
    totalReviews: 0,
    totalSold: 0,
    createdAt: new Date()
});

// Có thể seed thêm SKUs cho MacBook Pro M3 để hoàn thiện flow
db.skus.insertMany([
    {
        productID: laptopCategoryId, // Nên sửa thành id của product. Để đơn giản, mình demo cấu trúc. Bạn nhớ lấy product.insertedId để map đúng nhé!
        sku: "MBP-M3-8-256-SLV",
        skuPrice: 20000000,
        attributes: { ram: "8GB", storage: "256GB", color: "silver" }
    },
    {
        productID: laptopCategoryId, 
        sku: "MBP-M3-16-512-SLV",
        skuPrice: 25000000,
        attributes: { ram: "16GB", storage: "512GB", color: "silver" }
    }
]);