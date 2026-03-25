db = db.getSiblingDB('hybrid_db');

const laptopResult = db.categories.insertOne({
    name: "Laptop",
    slug: "laptop",
    description: "Máy tính xách tay các loại",
    isActive: true,
    dynamicAttributes: [
        { key: "battery", label: "Pin", dataType: "number", options: [40, 50, 60, 70, 80, 90] },
        { key: "brand", label: "Thương hiệu", dataType: "string" },
        { key: "cpu", label: "CPU", dataType: "string" },
        { key: "gpu", label: "GPU", dataType: "string" },
        { key: "os", label: "Hệ điều hành", dataType: "string" },
        { key: "screenSize", label: "Kích thước màn hình", dataType: "number" },
        { key: "weight", label: "Trọng lượng", dataType: "number" }
    ],
    variantAttributes: [
        { key: "color", label: "Màu sắc", dataType: "string", options: ["silver", "black", "gray"] },
        { key: "ram", label: "Dung lượng RAM", dataType: "string", options: ["8GB", "16GB", "32GB"] },
        { key: "storage", label: "Ổ cứng", dataType: "string", options: ["256GB", "512GB", "1TB"] }
    ]
});

const otherCategoriesResult = db.categories.insertMany([
    {
        name: "Điện thoại", slug: "dien-thoai", description: "Điện thoại thông minh di động", isActive: true,
        dynamicAttributes: [
            { key: "battery", label: "Dung lượng pin", dataType: "number" },
            { key: "brand", label: "Thương hiệu", dataType: "string" },
            { key: "camera", label: "Camera", dataType: "string" },
            { key: "chipset", label: "Chipset", dataType: "string" },
            { key: "os", label: "Hệ điều hành", dataType: "string" },
            { key: "screenSize", label: "Kích thước màn hình", dataType: "number" }
        ],
        variantAttributes: [
            { key: "color", label: "Màu sắc", dataType: "string", options: ["black", "white", "blue"] },
            { key: "ram", label: "Dung lượng RAM", dataType: "string", options: ["6GB", "8GB", "12GB"] },
            { key: "storage", label: "Dung lượng lưu trữ", dataType: "string", options: ["128GB", "256GB", "512GB"] }
        ]
    },
    {
        name: "Quần áo", slug: "quan-ao", description: "Thời trang nam nữ", isActive: true,
        dynamicAttributes: [
            { key: "brand", label: "Thương hiệu", dataType: "string" },
            { key: "gender", label: "Giới tính", dataType: "string" },
            { key: "material", label: "Chất liệu", dataType: "string" },
            { key: "season", label: "Mùa", dataType: "string" },
            { key: "style", label: "Phong cách", dataType: "string" }
        ],
        variantAttributes: [
            { key: "color", label: "Màu sắc", dataType: "string" },
            { key: "fit", label: "Kiểu dáng", dataType: "string", options: ["slim", "regular", "oversized"] },
            { key: "size", label: "Kích cỡ", dataType: "string", options: ["S", "M", "L", "XL"] }
        ]
    },
    {
        name: "Giày", slug: "giay", description: "Giày dép thể thao và thời trang", isActive: true,
        dynamicAttributes: [
            { key: "brand", label: "Thương hiệu", dataType: "string" },
            { key: "gender", label: "Giới tính", dataType: "string" },
            { key: "material", label: "Chất liệu", dataType: "string" },
            { key: "soleMaterial", label: "Chất liệu đế", dataType: "string" },
            { key: "sportType", label: "Loại thể thao", dataType: "string" }
        ],
        variantAttributes: [
            { key: "color", label: "Màu sắc", dataType: "string" },
            { key: "size", label: "Kích cỡ", dataType: "number", options: [38, 39, 40, 41] },
            { key: "width", label: "Độ rộng", dataType: "string", options: ["normal", "wide"] }
        ]
    },
    {
        name: "Tai nghe", slug: "tai-nghe", description: "Tai nghe không dây và có dây", isActive: true,
        dynamicAttributes: [
            { key: "batteryLife", label: "Thời lượng pin", dataType: "number" },
            { key: "brand", label: "Thương hiệu", dataType: "string" },
            { key: "noiseCancelling", label: "Chống ồn", dataType: "boolean" },
            { key: "type", label: "Loại tai nghe", dataType: "string", options: ["in-ear", "over-ear"] },
            { key: "wireless", label: "Không dây", dataType: "boolean" }
        ],
        variantAttributes: [
            { key: "color", label: "Màu sắc", dataType: "string" },
            { key: "connectivity", label: "Kết nối", dataType: "string", options: ["bluetooth", "wired"] },
            { key: "edition", label: "Phiên bản", dataType: "string", options: ["standard", "pro"] }
        ]
    },
    {
        name: "Đồng hồ", slug: "dong-ho", description: "Đồng hồ thông minh và thời trang", isActive: true,
        dynamicAttributes: [
            { key: "brand", label: "Thương hiệu", dataType: "string" },
            { key: "gender", label: "Giới tính", dataType: "string" },
            { key: "material", label: "Chất liệu", dataType: "string" },
            { key: "movement", label: "Bộ máy", dataType: "string", options: ["quartz", "automatic"] },
            { key: "waterResistance", label: "Chống nước", dataType: "number" }
        ],
        variantAttributes: [
            { key: "color", label: "Màu sắc", dataType: "string" },
            { key: "size", label: "Kích thước mặt", dataType: "number" },
            { key: "strapMaterial", label: "Chất liệu dây", dataType: "string" }
        ]
    },
    {
        name: "Bàn phím", slug: "ban-phim", description: "Bàn phím máy tính", isActive: true,
        dynamicAttributes: [
            { key: "backlight", label: "Đèn nền", dataType: "boolean" },
            { key: "brand", label: "Thương hiệu", dataType: "string" },
            { key: "layout", label: "Bố cục", dataType: "string", options: ["fullsize", "TKL"] },
            { key: "switchType", label: "Loại Switch", dataType: "string" },
            { key: "wireless", label: "Không dây", dataType: "boolean" }
        ],
        variantAttributes: [
            { key: "color", label: "Màu sắc", dataType: "string" },
            { key: "languageLayout", label: "Ngôn ngữ bàn phím", dataType: "string", options: ["US", "UK"] },
            { key: "switch", label: "Switch", dataType: "string", options: ["red", "blue", "brown"] }
        ]
    },
    {
        name: "Chuột máy tính", slug: "chuot-may-tinh", description: "Chuột gaming và văn phòng", isActive: true,
        dynamicAttributes: [
            { key: "brand", label: "Thương hiệu", dataType: "string" },
            { key: "dpi", label: "DPI", dataType: "number" },
            { key: "ergonomic", label: "Công thái học", dataType: "boolean" },
            { key: "sensor", label: "Cảm biến", dataType: "string" },
            { key: "wireless", label: "Không dây", dataType: "boolean" }
        ],
        variantAttributes: [
            { key: "color", label: "Màu sắc", dataType: "string" },
            { key: "connectivity", label: "Kết nối", dataType: "string", options: ["bluetooth", "2.4GHz"] },
            { key: "edition", label: "Phiên bản", dataType: "string" }
        ]
    },
    {
        name: "Tivi", slug: "tivi", description: "Smart TV, TV OLED, QLED", isActive: true,
        dynamicAttributes: [
            { key: "brand", label: "Thương hiệu", dataType: "string" },
            { key: "os", label: "Hệ điều hành", dataType: "string" },
            { key: "panelType", label: "Loại tấm nền", dataType: "string", options: ["OLED", "QLED"] },
            { key: "resolution", label: "Độ phân giải", dataType: "string", options: ["4K", "8K"] },
            { key: "smartTV", label: "Smart TV", dataType: "boolean" }
        ],
        variantAttributes: [
            { key: "color", label: "Màu sắc", dataType: "string" },
            { key: "modelYear", label: "Năm sản xuất", dataType: "number" },
            { key: "screenSize", label: "Kích thước màn hình", dataType: "number", options: [43, 55, 65] }
        ]
    },
    {
        name: "Túi xách", slug: "tui-xach", description: "Túi xách thời trang", isActive: true,
        dynamicAttributes: [
            { key: "brand", label: "Thương hiệu", dataType: "string" },
            { key: "material", label: "Chất liệu", dataType: "string" },
            { key: "gender", label: "Giới tính", dataType: "string" },
            { key: "style", label: "Phong cách", dataType: "string" },
            { key: "waterproof", label: "Chống nước", dataType: "boolean" }
        ],
        variantAttributes: [
            { key: "color", label: "Màu sắc", dataType: "string" },
            { key: "size", label: "Kích cỡ", dataType: "string", options: ["small", "medium", "large"] },
            { key: "strapType", label: "Loại quai", dataType: "string", options: ["crossbody", "shoulder"] }
        ]
    }
]);

const catIds = {
    laptop: laptopResult.insertedId,
    phone: otherCategoriesResult.insertedIds[0],
    clothing: otherCategoriesResult.insertedIds[1],
    shoes: otherCategoriesResult.insertedIds[2],
    headphone: otherCategoriesResult.insertedIds[3],
    watch: otherCategoriesResult.insertedIds[4],
    keyboard: otherCategoriesResult.insertedIds[5],
    mouse: otherCategoriesResult.insertedIds[6],
    tv: otherCategoriesResult.insertedIds[7],
    bag: otherCategoriesResult.insertedIds[8]
};

const seedData = [
    {
        product: { categoryID: catIds.laptop, name: "MacBook Pro M3", slug: "macbook-pro-m3", basePrice: 40000000, description: "Apple M3 Chip", attributes: { brand: "Apple", cpu: "M3", gpu: "10-core", screenSize: 14, battery: 70, weight: 1.55, os: "macOS" }, isActive: true, avgRating: 4.9, totalReviews: 12, totalSold: 50, createdAt: new Date() },
        skus: [
            { sku: "MBP-M3-8-256-SLV", skuPrice: 40000000, attributes: { ram: "8GB", storage: "256GB", color: "silver" } },
            { sku: "MBP-M3-16-512-SLV", skuPrice: 50000000, attributes: { ram: "16GB", storage: "512GB", color: "silver" } },
            { sku: "MBP-M3-16-512-GRY", skuPrice: 50000000, attributes: { ram: "16GB", storage: "512GB", color: "gray" } }
        ]
    },
    {
        product: { categoryID: catIds.laptop, name: "Dell XPS 15", slug: "dell-xps-15", basePrice: 35000000, description: "Dell XPS 15 Ultra", attributes: { brand: "Dell", cpu: "Core i7", gpu: "RTX 4050", screenSize: 15.6, battery: 86, weight: 1.9, os: "Windows 11" }, isActive: true, avgRating: 4.7, totalReviews: 8, totalSold: 30, createdAt: new Date() },
        skus: [
            { sku: "DXPS-16-512-BLK", skuPrice: 35000000, attributes: { ram: "16GB", storage: "512GB", color: "black" } },
            { sku: "DXPS-32-1TB-BLK", skuPrice: 45000000, attributes: { ram: "32GB", storage: "1TB", color: "black" } },
            { sku: "DXPS-32-1TB-SLV", skuPrice: 45000000, attributes: { ram: "32GB", storage: "1TB", color: "silver" } }
        ]
    },
    {
        product: { categoryID: catIds.phone, name: "iPhone 15 Pro", slug: "iphone-15-pro", basePrice: 28000000, description: "Titanium design", attributes: { brand: "Apple", battery: 3274, camera: "48MP", chipset: "A17 Pro", os: "iOS", screenSize: 6.1 }, isActive: true, avgRating: 5.0, totalReviews: 150, totalSold: 500, createdAt: new Date() },
        skus: [
            { sku: "IP15P-128-NAT", skuPrice: 28000000, attributes: { ram: "8GB", storage: "128GB", color: "white" } },
            { sku: "IP15P-256-NAT", skuPrice: 31000000, attributes: { ram: "8GB", storage: "256GB", color: "white" } },
            { sku: "IP15P-256-BLK", skuPrice: 31000000, attributes: { ram: "8GB", storage: "256GB", color: "black" } }
        ]
    },
    {
        product: { categoryID: catIds.phone, name: "Samsung Galaxy S24 Ultra", slug: "samsung-s24-ultra", basePrice: 30000000, description: "Galaxy AI", attributes: { brand: "Samsung", battery: 5000, camera: "200MP", chipset: "Snapdragon 8 Gen 3", os: "Android", screenSize: 6.8 }, isActive: true, avgRating: 4.8, totalReviews: 120, totalSold: 400, createdAt: new Date() },
        skus: [
            { sku: "SS24U-256-BLK", skuPrice: 30000000, attributes: { ram: "12GB", storage: "256GB", color: "black" } },
            { sku: "SS24U-512-BLK", skuPrice: 34000000, attributes: { ram: "12GB", storage: "512GB", color: "black" } },
            { sku: "SS24U-512-BLU", skuPrice: 34000000, attributes: { ram: "12GB", storage: "512GB", color: "blue" } }
        ]
    },
    {
        product: { categoryID: catIds.clothing, name: "Áo thun nam Basic", slug: "ao-thun-nam-basic", basePrice: 200000, description: "Áo thun 100% cotton", attributes: { brand: "Coolmate", gender: "Nam", material: "Cotton", season: "Hè", style: "Casual" }, isActive: true, avgRating: 4.5, totalReviews: 30, totalSold: 1000, createdAt: new Date() },
        skus: [
            { sku: "AT-M-BLK", skuPrice: 200000, attributes: { size: "M", color: "Black", fit: "regular" } },
            { sku: "AT-L-BLK", skuPrice: 200000, attributes: { size: "L", color: "Black", fit: "regular" } },
            { sku: "AT-L-WHT", skuPrice: 200000, attributes: { size: "L", color: "White", fit: "regular" } }
        ]
    },
    {
        product: { categoryID: catIds.clothing, name: "Quần Jeans Ống Rộng", slug: "quan-jeans-ong-rong", basePrice: 450000, description: "Jeans phong cách Hàn Quốc", attributes: { brand: "Zara", gender: "Nữ", material: "Denim", season: "Quanh năm", style: "Streetwear" }, isActive: true, avgRating: 4.6, totalReviews: 45, totalSold: 600, createdAt: new Date() },
        skus: [
            { sku: "QJ-S-BLU", skuPrice: 450000, attributes: { size: "S", color: "Blue", fit: "oversized" } },
            { sku: "QJ-M-BLU", skuPrice: 450000, attributes: { size: "M", color: "Blue", fit: "oversized" } },
            { sku: "QJ-M-BLK", skuPrice: 450000, attributes: { size: "M", color: "Black", fit: "oversized" } }
        ]
    },
    {
        product: { categoryID: catIds.shoes, name: "Nike Air Force 1", slug: "nike-air-force-1", basePrice: 2500000, description: "Giày sneaker cổ điển", attributes: { brand: "Nike", gender: "Unisex", material: "Da", soleMaterial: "Cao su", sportType: "Lifestyle" }, isActive: true, avgRating: 4.9, totalReviews: 80, totalSold: 300, createdAt: new Date() },
        skus: [
            { sku: "AF1-39-WHT", skuPrice: 2500000, attributes: { size: 39, color: "White", width: "normal" } },
            { sku: "AF1-40-WHT", skuPrice: 2500000, attributes: { size: 40, color: "White", width: "normal" } },
            { sku: "AF1-41-WHT", skuPrice: 2500000, attributes: { size: 41, color: "White", width: "normal" } }
        ]
    },
    {
        product: { categoryID: catIds.shoes, name: "Adidas Ultraboost 22", slug: "adidas-ultraboost-22", basePrice: 3200000, description: "Giày chạy bộ êm ái", attributes: { brand: "Adidas", gender: "Unisex", material: "Primeknit", soleMaterial: "Boost", sportType: "Running" }, isActive: true, avgRating: 4.8, totalReviews: 60, totalSold: 200, createdAt: new Date() },
        skus: [
            { sku: "UB-40-BLK", skuPrice: 3200000, attributes: { size: 40, color: "Black", width: "normal" } },
            { sku: "UB-41-BLK", skuPrice: 3200000, attributes: { size: 41, color: "Black", width: "normal" } },
            { sku: "UB-41-GRY", skuPrice: 3200000, attributes: { size: 41, color: "Gray", width: "wide" } }
        ]
    },
    {
        product: { categoryID: catIds.headphone, name: "AirPods Pro Gen 2", slug: "airpods-pro-2", basePrice: 5500000, description: "Tai nghe chống ồn chủ động", attributes: { brand: "Apple", type: "in-ear", wireless: true, batteryLife: 30, noiseCancelling: true }, isActive: true, avgRating: 4.9, totalReviews: 200, totalSold: 1500, createdAt: new Date() },
        skus: [
            { sku: "APP2-WHT-PRO", skuPrice: 5500000, attributes: { color: "White", connectivity: "bluetooth", edition: "pro" } },
            { sku: "APP2-WHT-PRO-CC", skuPrice: 5800000, attributes: { color: "White", connectivity: "bluetooth", edition: "pro" } }, 
            { sku: "APP2-BLK-CUS", skuPrice: 6500000, attributes: { color: "Black", connectivity: "bluetooth", edition: "pro" } } 
        ]
    },
    {
        product: { categoryID: catIds.headphone, name: "Sony WH-1000XM5", slug: "sony-wh-1000xm5", basePrice: 7000000, description: "Chống ồn đầu bảng", attributes: { brand: "Sony", type: "over-ear", wireless: true, batteryLife: 40, noiseCancelling: true }, isActive: true, avgRating: 4.8, totalReviews: 90, totalSold: 400, createdAt: new Date() },
        skus: [
            { sku: "XM5-BLK", skuPrice: 7000000, attributes: { color: "Black", connectivity: "bluetooth", edition: "standard" } },
            { sku: "XM5-SLV", skuPrice: 7000000, attributes: { color: "Silver", connectivity: "bluetooth", edition: "standard" } },
            { sku: "XM5-BLU", skuPrice: 7200000, attributes: { color: "Midnight Blue", connectivity: "bluetooth", edition: "standard" } }
        ]
    },
    {
        product: { categoryID: catIds.watch, name: "Apple Watch Series 9", slug: "apple-watch-s9", basePrice: 10000000, description: "Smartwatch đa năng", attributes: { brand: "Apple", gender: "Unisex", material: "Nhôm", movement: "quartz", waterResistance: 50 }, isActive: true, avgRating: 4.8, totalReviews: 110, totalSold: 600, createdAt: new Date() },
        skus: [
            { sku: "AWS9-41-MID", skuPrice: 10000000, attributes: { size: 41, color: "Midnight", strapMaterial: "Sport Band" } },
            { sku: "AWS9-45-MID", skuPrice: 11000000, attributes: { size: 45, color: "Midnight", strapMaterial: "Sport Band" } },
            { sku: "AWS9-45-SLV", skuPrice: 11000000, attributes: { size: 45, color: "Silver", strapMaterial: "Sport Loop" } }
        ]
    },
    {
        product: { categoryID: catIds.watch, name: "Casio G-Shock GA-2100", slug: "casio-g-shock-ga2100", basePrice: 3000000, description: "Đồng hồ chống sốc, siêu bền", attributes: { brand: "Casio", gender: "Nam", material: "Nhựa/Carbon", movement: "quartz", waterResistance: 200 }, isActive: true, avgRating: 4.9, totalReviews: 250, totalSold: 1200, createdAt: new Date() },
        skus: [
            { sku: "GA2100-BLK", skuPrice: 3000000, attributes: { size: 45, color: "Black", strapMaterial: "Resin" } },
            { sku: "GA2100-RED", skuPrice: 3000000, attributes: { size: 45, color: "Red", strapMaterial: "Resin" } },
            { sku: "GA2100-BLU", skuPrice: 3000000, attributes: { size: 45, color: "Blue", strapMaterial: "Resin" } }
        ]
    },
    {
        product: { categoryID: catIds.keyboard, name: "Keychron K2 V2", slug: "keychron-k2-v2", basePrice: 1800000, description: "Bàn phím cơ không dây", attributes: { brand: "Keychron", layout: "TKL", switchType: "Gateron", wireless: true, backlight: true }, isActive: true, avgRating: 4.7, totalReviews: 180, totalSold: 800, createdAt: new Date() },
        skus: [
            { sku: "K2-RED-RGB", skuPrice: 1800000, attributes: { switch: "red", color: "Black/Gray", languageLayout: "US" } },
            { sku: "K2-BLU-RGB", skuPrice: 1800000, attributes: { switch: "blue", color: "Black/Gray", languageLayout: "US" } },
            { sku: "K2-BRN-RGB", skuPrice: 1800000, attributes: { switch: "brown", color: "Black/Gray", languageLayout: "US" } }
        ]
    },
    {
        product: { categoryID: catIds.keyboard, name: "Logitech MX Keys", slug: "logitech-mx-keys", basePrice: 2500000, description: "Bàn phím văn phòng cao cấp", attributes: { brand: "Logitech", layout: "fullsize", switchType: "Membrane", wireless: true, backlight: true }, isActive: true, avgRating: 4.8, totalReviews: 120, totalSold: 500, createdAt: new Date() },
        skus: [
            { sku: "MXK-BLK-US", skuPrice: 2500000, attributes: { switch: "brown", color: "Graphite", languageLayout: "US" } },
            { sku: "MXK-SLV-US", skuPrice: 2500000, attributes: { switch: "brown", color: "Pale Gray", languageLayout: "US" } },
            { sku: "MXK-BLK-UK", skuPrice: 2500000, attributes: { switch: "brown", color: "Graphite", languageLayout: "UK" } }
        ]
    },
    {
        product: { categoryID: catIds.mouse, name: "Logitech G Pro X Superlight", slug: "logitech-g-pro-x", basePrice: 2900000, description: "Chuột gaming siêu nhẹ", attributes: { brand: "Logitech", dpi: 25600, wireless: true, sensor: "HERO 25K", ergonomic: false }, isActive: true, avgRating: 4.9, totalReviews: 300, totalSold: 2000, createdAt: new Date() },
        skus: [
            { sku: "GPX-BLK", skuPrice: 2900000, attributes: { color: "Black", connectivity: "2.4GHz", edition: "Standard" } },
            { sku: "GPX-WHT", skuPrice: 2900000, attributes: { color: "White", connectivity: "2.4GHz", edition: "Standard" } },
            { sku: "GPX-RED", skuPrice: 3000000, attributes: { color: "Red", connectivity: "2.4GHz", edition: "Limited" } }
        ]
    },
    {
        product: { categoryID: catIds.mouse, name: "Razer DeathAdder V3 Pro", slug: "razer-deathadder-v3", basePrice: 3500000, description: "Chuột gaming công thái học", attributes: { brand: "Razer", dpi: 30000, wireless: true, sensor: "Focus Pro 30K", ergonomic: true }, isActive: true, avgRating: 4.8, totalReviews: 150, totalSold: 700, createdAt: new Date() },
        skus: [
            { sku: "DAV3-BLK", skuPrice: 3500000, attributes: { color: "Black", connectivity: "2.4GHz", edition: "Pro" } },
            { sku: "DAV3-WHT", skuPrice: 3500000, attributes: { color: "White", connectivity: "2.4GHz", edition: "Pro" } },
            { sku: "DAV3-FAKER", skuPrice: 4000000, attributes: { color: "Red", connectivity: "2.4GHz", edition: "Faker Edition" } }
        ]
    },
    {
        product: { categoryID: catIds.tv, name: "Samsung Neo QLED 4K QN90C", slug: "samsung-neo-qled-qn90c", basePrice: 25000000, description: "Tivi thông minh QLED", attributes: { brand: "Samsung", resolution: "4K", panelType: "QLED", smartTV: true, os: "Tizen" }, isActive: true, avgRating: 4.8, totalReviews: 40, totalSold: 120, createdAt: new Date() },
        skus: [
            { sku: "QN90C-55", skuPrice: 25000000, attributes: { screenSize: 55, color: "Titan Black", modelYear: 2023 } },
            { sku: "QN90C-65", skuPrice: 32000000, attributes: { screenSize: 65, color: "Titan Black", modelYear: 2023 } },
            { sku: "QN90C-75", skuPrice: 45000000, attributes: { screenSize: 75, color: "Titan Black", modelYear: 2023 } } 
        ]
    },
    {
        product: { categoryID: catIds.tv, name: "LG OLED Evo C3", slug: "lg-oled-evo-c3", basePrice: 28000000, description: "Tivi OLED đỉnh cao điện ảnh", attributes: { brand: "LG", resolution: "4K", panelType: "OLED", smartTV: true, os: "WebOS" }, isActive: true, avgRating: 4.9, totalReviews: 55, totalSold: 150, createdAt: new Date() },
        skus: [
            { sku: "OLED-C3-48", skuPrice: 28000000, attributes: { screenSize: 48, color: "Dark Silver", modelYear: 2023 } },
            { sku: "OLED-C3-55", skuPrice: 35000000, attributes: { screenSize: 55, color: "Dark Silver", modelYear: 2023 } },
            { sku: "OLED-C3-65", skuPrice: 48000000, attributes: { screenSize: 65, color: "Dark Silver", modelYear: 2023 } }
        ]
    },
    {
        product: { categoryID: catIds.bag, name: "Túi Xách Charles & Keith", slug: "tui-charles-keith", basePrice: 1500000, description: "Túi đeo chéo nữ thời trang", attributes: { brand: "Charles & Keith", material: "Da PU", gender: "Nữ", style: "Thanh lịch", waterproof: false }, isActive: true, avgRating: 4.6, totalReviews: 210, totalSold: 900, createdAt: new Date() },
        skus: [
            { sku: "CK-S-BLK", skuPrice: 1500000, attributes: { size: "small", color: "Black", strapType: "crossbody" } },
            { sku: "CK-S-BEI", skuPrice: 1500000, attributes: { size: "small", color: "Beige", strapType: "crossbody" } },
            { sku: "CK-M-BLK", skuPrice: 1800000, attributes: { size: "medium", color: "Black", strapType: "shoulder" } }
        ]
    },
    {
        product: { categoryID: catIds.bag, name: "Balo Đi Học Xiaomi", slug: "balo-xiaomi", basePrice: 450000, description: "Balo đa năng chống nước nhẹ", attributes: { brand: "Xiaomi", material: "Polyester", gender: "Unisex", style: "Casual", waterproof: true }, isActive: true, avgRating: 4.7, totalReviews: 400, totalSold: 3000, createdAt: new Date() },
        skus: [
            { sku: "MI-M-BLK", skuPrice: 450000, attributes: { size: "medium", color: "Black", strapType: "shoulder" } },
            { sku: "MI-M-BLU", skuPrice: 450000, attributes: { size: "medium", color: "Blue", strapType: "shoulder" } },
            { sku: "MI-L-BLK", skuPrice: 550000, attributes: { size: "large", color: "Black", strapType: "shoulder" } }
        ]
    }
];

seedData.forEach(item => {
    const productResult = db.products.insertOne(item.product);
    
    const skusWithProductId = item.skus.map(sku => {
        return {
            ...sku,
            productID: productResult.insertedId
        };
    });
    
    db.skus.insertMany(skusWithProductId);
});

print("Seed data completed successfully!");