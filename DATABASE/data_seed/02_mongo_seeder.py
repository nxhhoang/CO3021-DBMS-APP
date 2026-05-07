import random
import string
from datetime import datetime
import os
import csv
import json
from pymongo import MongoClient
from pymongo.errors import BulkWriteError

client = MongoClient("mongodb://localhost:27017/")
db = client["hybrid_db"]

TOTAL_PRODUCTS = 100000
BATCH_SIZE = 5000

categories_data = [
    {
        "name": "Laptop", "slug": "laptop", "description": "Máy tính xách tay", "isActive": True,
        "dynamicAttributes": [
            {"key": "battery", "label": "Pin", "dataType": "number", "options": [40, 50, 60, 70, 80, 90]},
            {"key": "brand", "label": "Thương hiệu", "dataType": "string", "options": ["Apple", "Dell", "HP", "ASUS", "Lenovo"]},
            {"key": "cpu", "label": "CPU", "dataType": "string", "options": ["Core i5", "Core i7", "Ryzen 5", "Ryzen 7", "Apple M1", "Apple M2"]},
            {"key": "screenSize", "label": "Kích thước màn hình", "dataType": "number", "options": [13.3, 14, 15.6, 16]},
            {"key": "os", "label": "Hệ điều hành", "dataType": "string", "options": ["Windows 11", "macOS", "Linux"]}
        ],
        "variantAttributes": [
            {"key": "color", "label": "Màu sắc", "dataType": "string", "options": ["Silver", "Space Gray", "Black"]},
            {"key": "ram", "label": "RAM", "dataType": "string", "options": ["8GB", "16GB", "32GB"]},
            {"key": "storage", "label": "Ổ cứng", "dataType": "string", "options": ["256GB", "512GB", "1TB"]}
        ]
    },
    {
        "name": "Điện thoại", "slug": "dien-thoai", "description": "Điện thoại thông minh", "isActive": True,
        "dynamicAttributes": [
            {"key": "brand", "label": "Thương hiệu", "dataType": "string", "options": ["Apple", "Samsung", "Xiaomi", "Oppo"]},
            {"key": "battery", "label": "Pin", "dataType": "number", "options": [3000, 4000, 5000]},
            {"key": "os", "label": "Hệ điều hành", "dataType": "string", "options": ["iOS", "Android"]}
        ],
        "variantAttributes": [
            {"key": "color", "label": "Màu sắc", "dataType": "string", "options": ["Black", "White", "Blue", "Gold"]},
            {"key": "storage", "label": "Dung lượng", "dataType": "string", "options": ["128GB", "256GB", "512GB"]}
        ]
    },
    {
        "name": "Quần áo",
        "slug": "quan-ao",
        "description": "Thời trang nam nữ",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "gender", "label": "Giới tính", "dataType": "string" },
            { "key": "material", "label": "Chất liệu", "dataType": "string" },
            { "key": "season", "label": "Mùa", "dataType": "string" },
            { "key": "style", "label": "Phong cách", "dataType": "string" }
        ],
        "variantAttributes": [
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "fit", "label": "Kiểu dáng", "dataType": "string", "options": ["slim", "regular", "oversized"] },
            { "key": "size", "label": "Kích cỡ", "dataType": "string", "options": ["S", "M", "L", "XL"] }
        ]
    },
    {
        "name": "Giày",
        "slug": "giay",
        "description": "Giày dép thể thao và thời trang",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "gender", "label": "Giới tính", "dataType": "string" },
            { "key": "material", "label": "Chất liệu", "dataType": "string" },
            { "key": "soleMaterial", "label": "Chất liệu đế", "dataType": "string" },
            { "key": "sportType", "label": "Loại thể thao", "dataType": "string" }
        ],
        "variantAttributes": [
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "size", "label": "Kích cỡ", "dataType": "number", "options": [38, 39, 40, 41] },
            { "key": "width", "label": "Độ rộng", "dataType": "string", "options": ["normal", "wide"] }
        ]
    },
        {
        "name": "Tai nghe",
        "slug": "tai-nghe",
        "description": "Tai nghe không dây và có dây",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "batteryLife", "label": "Thời lượng pin", "dataType": "number" },
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "noiseCancelling", "label": "Chống ồn", "dataType": "boolean" },
            { "key": "type", "label": "Loại tai nghe", "dataType": "string", "options": ["in-ear", "over-ear"] },
            { "key": "wireless", "label": "Không dây", "dataType": "boolean" }
        ],
        "variantAttributes": [
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "connectivity", "label": "Kết nối", "dataType": "string", "options": ["bluetooth", "wired"] },
            { "key": "edition", "label": "Phiên bản", "dataType": "string", "options": ["standard", "pro"] }
        ]
    },
    {
        "name": "Đồng hồ",
        "slug": "dong-ho",
        "description": "Đồng hồ thông minh và thời trang",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "gender", "label": "Giới tính", "dataType": "string" },
            { "key": "material", "label": "Chất liệu", "dataType": "string" },
            { "key": "movement", "label": "Bộ máy", "dataType": "string", "options": ["quartz", "automatic"] },
            { "key": "waterResistance", "label": "Chống nước", "dataType": "number" }
        ],
        "variantAttributes": [
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "size", "label": "Kích thước mặt", "dataType": "number" },
            { "key": "strapMaterial", "label": "Chất liệu dây", "dataType": "string" }
        ]
    },
    {
        "name": "Bàn phím",
        "slug": "ban-phim",
        "description": "Bàn phím máy tính",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "backlight", "label": "Đèn nền", "dataType": "boolean" },
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "layout", "label": "Bố cục", "dataType": "string", "options": ["fullsize", "TKL"] },
            { "key": "switchType", "label": "Loại Switch", "dataType": "string" },
            { "key": "wireless", "label": "Không dây", "dataType": "boolean" }
        ],
        "variantAttributes": [
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "languageLayout", "label": "Ngôn ngữ bàn phím", "dataType": "string", "options": ["US", "UK"] },
            { "key": "switch", "label": "Switch", "dataType": "string", "options": ["red", "blue", "brown"] }
        ]
    },
    {
        "name": "Chuột máy tính",
        "slug": "chuot-may-tinh",
        "description": "Chuột gaming và văn phòng",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "dpi", "label": "DPI", "dataType": "number" },
            { "key": "ergonomic", "label": "Công thái học", "dataType": "boolean" },
            { "key": "sensor", "label": "Cảm biến", "dataType": "string" },
            { "key": "wireless", "label": "Không dây", "dataType": "boolean" }
        ],
        "variantAttributes": [
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "connectivity", "label": "Kết nối", "dataType": "string", "options": ["bluetooth", "2.4GHz"] },
            { "key": "edition", "label": "Phiên bản", "dataType": "string" }
        ]
    },
    {
        "name": "Tivi",
        "slug": "tivi",
        "description": "Smart TV, TV OLED, QLED",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "os", "label": "Hệ điều hành", "dataType": "string" },
            { "key": "panelType", "label": "Loại tấm nền", "dataType": "string", "options": ["OLED", "QLED"] },
            { "key": "resolution", "label": "Độ phân giải", "dataType": "string", "options": ["4K", "8K"] },
            { "key": "smartTV", "label": "Smart TV", "dataType": "boolean" }
        ],
        "variantAttributes": [
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "modelYear", "label": "Năm sản xuất", "dataType": "number" },
            { "key": "screenSize", "label": "Kích thước màn hình", "dataType": "number", "options": [43, 55, 65] }
        ]
    },
    {
        "name": "Túi xách",
        "slug": "tui-xach",
        "description": "Túi xách thời trang",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "material", "label": "Chất liệu", "dataType": "string" },
            { "key": "gender", "label": "Giới tính", "dataType": "string" },
            { "key": "style", "label": "Phong cách", "dataType": "string" },
            { "key": "waterproof", "label": "Chống nước", "dataType": "boolean" }
        ],
        "variantAttributes": [
        { "key": "color", "label": "Màu sắc", "dataType": "string" },
        { "key": "size", "label": "Kích cỡ", "dataType": "string", "options": ["small", "medium", "large"] },
        { "key": "strapType", "label": "Loại quai", "dataType": "string", "options": ["crossbody", "shoulder"] }
        ]
    },
    {
        "name": "Máy tính bảng",
        "slug": "may-tinh-bang",
        "description": "Tablet phục vụ học tập và giải trí",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "screenSize", "label": "Kích thước màn hình", "dataType": "number" },
            { "key": "battery", "label": "Dung lượng pin", "dataType": "number" },
            { "key": "os", "label": "Hệ điều hành", "dataType": "string" },
            { "key": "chipset", "label": "Chip xử lý", "dataType": "string" }
        ],
        "variantAttributes": [
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "ram", "label": "RAM", "dataType": "string", "options": ["4GB", "6GB", "8GB"] },
            { "key": "storage", "label": "Bộ nhớ", "dataType": "string", "options": ["64GB", "128GB", "256GB"] }
        ]
    },
    {
        "name": "Camera",
        "slug": "camera",
        "description": "Máy ảnh và thiết bị quay phim",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "resolution", "label": "Độ phân giải", "dataType": "string" },
            { "key": "sensorType", "label": "Loại cảm biến", "dataType": "string" },
            { "key": "lensMount", "label": "Ngàm ống kính", "dataType": "string" },
            { "key": "videoQuality", "label": "Chất lượng video", "dataType": "string" }
        ],
        "variantAttributes": [
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "kit", "label": "Bộ kit", "dataType": "string", "options": ["body", "kit"] },
            { "key": "edition", "label": "Phiên bản", "dataType": "string" }
        ]
    },
    {
        "name": "Loa",
        "slug": "loa",
        "description": "Loa bluetooth và loa gia đình",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "power", "label": "Công suất", "dataType": "number" },
            { "key": "batteryLife", "label": "Thời lượng pin", "dataType": "number" },
            { "key": "waterproof", "label": "Chống nước", "dataType": "boolean" },
            { "key": "bluetoothVersion", "label": "Bluetooth", "dataType": "string" }
        ],
        "variantAttributes": [
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "size", "label": "Kích thước", "dataType": "string", "options": ["small", "medium", "large"] },
            { "key": "edition", "label": "Phiên bản", "dataType": "string" }
        ]
    },
    {
        "name": "Màn hình",
        "slug": "man-hinh",
        "description": "Màn hình máy tính",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "resolution", "label": "Độ phân giải", "dataType": "string" },
            { "key": "refreshRate", "label": "Tần số quét", "dataType": "number" },
            { "key": "panelType", "label": "Tấm nền", "dataType": "string", "options": ["IPS", "VA", "TN"] },
            { "key": "size", "label": "Kích thước", "dataType": "number" }
        ],
        "variantAttributes": [
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "aspectRatio", "label": "Tỉ lệ", "dataType": "string", "options": ["16:9", "21:9"] },
            { "key": "edition", "label": "Phiên bản", "dataType": "string" }
        ]
    },
    {
        "name": "Phụ kiện điện thoại",
        "slug": "phu-kien-dien-thoai",
        "description": "Ốp lưng, sạc, cáp...",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "type", "label": "Loại phụ kiện", "dataType": "string" },
            { "key": "compatibility", "label": "Tương thích", "dataType": "string" },
            { "key": "material", "label": "Chất liệu", "dataType": "string" },
            { "key": "fastCharge", "label": "Sạc nhanh", "dataType": "boolean" }
        ],
        "variantAttributes": [
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "length", "label": "Độ dài", "dataType": "string", "options": ["1m", "2m"] },
            { "key": "edition", "label": "Phiên bản", "dataType": "string" }
        ]
    },
    {
        "name": "Ghế Gaming",
        "slug": "ghe-gaming",
        "description": "Ghế công thái học cho game thủ",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "material", "label": "Chất liệu", "dataType": "string" },
            { "key": "maxWeight", "label": "Trọng lượng tối đa", "dataType": "number" },
            { "key": "recline", "label": "Ngả lưng", "dataType": "boolean" },
            { "key": "armrest", "label": "Tay vịn", "dataType": "string" }
        ],
        "variantAttributes": [
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "size", "label": "Kích cỡ", "dataType": "string", "options": ["M", "L"] },
            { "key": "edition", "label": "Phiên bản", "dataType": "string" }
        ]
    },
    {
        "name": "Bàn làm việc",
        "slug": "ban-lam-viec",
        "description": "Bàn học, bàn làm việc",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "material", "label": "Chất liệu", "dataType": "string" },
            { "key": "heightAdjustable", "label": "Điều chỉnh độ cao", "dataType": "boolean" },
            { "key": "shape", "label": "Kiểu bàn", "dataType": "string" },
            { "key": "weightCapacity", "label": "Tải trọng", "dataType": "number" },
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" }
        ],
        "variantAttributes": [
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "size", "label": "Kích thước", "dataType": "string", "options": ["120cm", "140cm", "160cm"] },
            { "key": "style", "label": "Phong cách", "dataType": "string" }
        ]
    },
    {
        "name": "Router WiFi",
        "slug": "router-wifi",
        "description": "Thiết bị mạng không dây",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "wifiStandard", "label": "Chuẩn WiFi", "dataType": "string" },
            { "key": "band", "label": "Băng tần", "dataType": "string" },
            { "key": "maxSpeed", "label": "Tốc độ tối đa", "dataType": "number" },
            { "key": "antenna", "label": "Số ăng-ten", "dataType": "number" }
        ],
        "variantAttributes": [
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "ports", "label": "Cổng LAN", "dataType": "number", "options": [2, 4, 8] },
            { "key": "edition", "label": "Phiên bản", "dataType": "string" }
        ]
    },
    {
        "name": "Ổ cứng",
        "slug": "o-cung",
        "description": "SSD và HDD lưu trữ",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "type", "label": "Loại ổ", "dataType": "string", "options": ["SSD", "HDD"] },
            { "key": "interface", "label": "Giao tiếp", "dataType": "string" },
            { "key": "readSpeed", "label": "Tốc độ đọc", "dataType": "number" },
            { "key": "writeSpeed", "label": "Tốc độ ghi", "dataType": "number" }
        ],
        "variantAttributes": [
            { "key": "capacity", "label": "Dung lượng", "dataType": "string", "options": ["256GB", "512GB", "1TB", "2TB"] },
            { "key": "formFactor", "label": "Kích thước", "dataType": "string", "options": ["2.5", "M.2"] },
            { "key": "color", "label": "Màu sắc", "dataType": "string" }
        ]
    },
    {
        "name": "Máy in",
        "slug": "may-in",
        "description": "Máy in văn phòng và gia đình",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "printType", "label": "Loại in", "dataType": "string", "options": ["laser", "inkjet"] },
            { "key": "colorPrint", "label": "In màu", "dataType": "boolean" },
            { "key": "duplex", "label": "In 2 mặt", "dataType": "boolean" },
            { "key": "wifi", "label": "Kết nối WiFi", "dataType": "boolean" }
        ],
        "variantAttributes": [
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "edition", "label": "Phiên bản", "dataType": "string" },
            { "key": "trayCapacity", "label": "Khay giấy", "dataType": "number" }
        ]
    },
    {
        "name": "Máy lọc không khí",
        "slug": "may-loc-khong-khi",
        "description": "Thiết bị lọc không khí gia đình",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "coverage", "label": "Diện tích phòng", "dataType": "number" },
            { "key": "filterType", "label": "Bộ lọc", "dataType": "string" },
            { "key": "noiseLevel", "label": "Độ ồn", "dataType": "number" },
            { "key": "smartControl", "label": "Điều khiển thông minh", "dataType": "boolean" }
        ],
        "variantAttributes": [
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "mode", "label": "Chế độ", "dataType": "string", "options": ["basic", "advanced"] },
            { "key": "edition", "label": "Phiên bản", "dataType": "string" }
        ]
    },
    {
        "name": "Nồi chiên không dầu",
        "slug": "noi-chien-khong-dau",
        "description": "Thiết bị nấu ăn không dầu",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "capacity", "label": "Dung tích", "dataType": "number" },
            { "key": "power", "label": "Công suất", "dataType": "number" },
            { "key": "digital", "label": "Điều khiển điện tử", "dataType": "boolean" },
            { "key": "presetModes", "label": "Chế độ nấu", "dataType": "number" }
        ],
        "variantAttributes": [
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "size", "label": "Kích cỡ", "dataType": "string", "options": ["3L", "5L", "7L"] },
            { "key": "edition", "label": "Phiên bản", "dataType": "string" }
        ]
    },
    {
        "name": "Máy hút bụi",
        "slug": "may-hut-bui",
        "description": "Máy hút bụi gia đình",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "power", "label": "Công suất", "dataType": "number" },
            { "key": "batteryLife", "label": "Thời lượng pin", "dataType": "number" },
            { "key": "bagless", "label": "Không túi", "dataType": "boolean" },
            { "key": "noiseLevel", "label": "Độ ồn", "dataType": "number" }
        ],
        "variantAttributes": [
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "type", "label": "Loại", "dataType": "string", "options": ["handheld", "robot", "upright"] },
            { "key": "edition", "label": "Phiên bản", "dataType": "string" }
        ]
    },
    {
        "name": "Đồng hồ thông minh",
        "slug": "dong-ho-thong-minh",
        "description": "Smartwatch theo dõi sức khỏe",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "batteryLife", "label": "Thời lượng pin", "dataType": "number" },
            { "key": "waterproof", "label": "Chống nước", "dataType": "boolean" },
            { "key": "heartRate", "label": "Đo nhịp tim", "dataType": "boolean" },
            { "key": "gps", "label": "GPS", "dataType": "boolean" }
        ],
        "variantAttributes": [
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "size", "label": "Kích thước", "dataType": "number" },
            { "key": "strap", "label": "Dây đeo", "dataType": "string" }
        ]
    },
    {
        "name": "Mỹ phẩm",
        "slug": "my-pham",
        "description": "Sản phẩm làm đẹp",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "skinType", "label": "Loại da", "dataType": "string" },
            { "key": "origin", "label": "Xuất xứ", "dataType": "string" },
            { "key": "organic", "label": "Hữu cơ", "dataType": "boolean" },
            { "key": "spf", "label": "Chỉ số SPF", "dataType": "number" }
        ],
        "variantAttributes": [
            { "key": "shade", "label": "Tông màu", "dataType": "string" },
            { "key": "size", "label": "Dung tích", "dataType": "string", "options": ["30ml", "50ml", "100ml"] },
            { "key": "edition", "label": "Phiên bản", "dataType": "string" }
        ]
    },
    {
        "name": "Dụng cụ thể thao",
        "slug": "dung-cu-the-thao",
        "description": "Thiết bị tập luyện",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "sportType", "label": "Loại thể thao", "dataType": "string" },
            { "key": "material", "label": "Chất liệu", "dataType": "string" },
            { "key": "indoor", "label": "Trong nhà", "dataType": "boolean" },
            { "key": "weight", "label": "Trọng lượng", "dataType": "number" }
        ],
        "variantAttributes": [
            { "key": "size", "label": "Kích cỡ", "dataType": "string", "options": ["S", "M", "L"] },
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "level", "label": "Cấp độ", "dataType": "string", "options": ["beginner", "pro"] }
        ]
    },
    {
        "name": "Tủ lạnh",
        "slug": "tu-lanh",
        "description": "Tủ lạnh gia đình",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "capacity", "label": "Dung tích", "dataType": "number" },
            { "key": "inverter", "label": "Công nghệ Inverter", "dataType": "boolean" },
            { "key": "doorType", "label": "Kiểu cửa", "dataType": "string" },
            { "key": "energyRating", "label": "Tiết kiệm điện", "dataType": "number" }
        ],
        "variantAttributes": [
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "size", "label": "Kích thước", "dataType": "string" },
            { "key": "edition", "label": "Phiên bản", "dataType": "string" }
        ]
    },
    {
        "name": "Máy giặt",
        "slug": "may-giat",
        "description": "Máy giặt cửa trước và cửa trên",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "capacity", "label": "Khối lượng giặt", "dataType": "number" },
            { "key": "inverter", "label": "Inverter", "dataType": "boolean" },
            { "key": "washPrograms", "label": "Chương trình giặt", "dataType": "number" },
            { "key": "dryer", "label": "Sấy", "dataType": "boolean" }
        ],
        "variantAttributes": [
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "type", "label": "Loại máy", "dataType": "string", "options": ["front-load", "top-load"] },
            { "key": "edition", "label": "Phiên bản", "dataType": "string" }
        ]
    },
    {
        "name": "Điều hòa",
        "slug": "dieu-hoa",
        "description": "Máy lạnh, điều hòa không khí",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "capacity", "label": "Công suất (BTU)", "dataType": "number" },
            { "key": "inverter", "label": "Inverter", "dataType": "boolean" },
            { "key": "energySaving", "label": "Tiết kiệm điện", "dataType": "boolean" },
            { "key": "smartControl", "label": "Điều khiển thông minh", "dataType": "boolean" }
        ],
        "variantAttributes": [
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "type", "label": "Loại", "dataType": "string", "options": ["1 chiều", "2 chiều"] },
            { "key": "edition", "label": "Phiên bản", "dataType": "string" }
        ]
    },
    {
        "name": "Webcam",
        "slug": "webcam",
        "description": "Camera máy tính",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "resolution", "label": "Độ phân giải", "dataType": "string" },
            { "key": "fps", "label": "FPS", "dataType": "number" },
            { "key": "microphone", "label": "Micro tích hợp", "dataType": "boolean" },
            { "key": "autoFocus", "label": "Lấy nét tự động", "dataType": "boolean" }
        ],
        "variantAttributes": [
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "mountType", "label": "Gắn", "dataType": "string", "options": ["clip", "tripod"] },
            { "key": "edition", "label": "Phiên bản", "dataType": "string" }
        ]
    },
    {
        "name": "Microphone",
        "slug": "microphone",
        "description": "Micro thu âm, livestream",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "type", "label": "Loại micro", "dataType": "string", "options": ["condenser", "dynamic"] },
            { "key": "connectivity", "label": "Kết nối", "dataType": "string" },
            { "key": "frequencyResponse", "label": "Tần số", "dataType": "string" },
            { "key": "noiseReduction", "label": "Giảm nhiễu", "dataType": "boolean" }
        ],
        "variantAttributes": [
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "mount", "label": "Giá đỡ", "dataType": "string", "options": ["desk", "boom-arm"] },
            { "key": "edition", "label": "Phiên bản", "dataType": "string" }
        ]
    },
    {
        "name": "Đèn bàn",
        "slug": "den-ban",
        "description": "Đèn học, đèn làm việc",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "power", "label": "Công suất", "dataType": "number" },
            { "key": "brightnessLevels", "label": "Mức sáng", "dataType": "number" },
            { "key": "adjustable", "label": "Điều chỉnh góc", "dataType": "boolean" },
            { "key": "smart", "label": "Smart", "dataType": "boolean" }
        ],
        "variantAttributes": [
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "lightColor", "label": "Ánh sáng", "dataType": "string", "options": ["warm", "cool"] },
            { "key": "edition", "label": "Phiên bản", "dataType": "string" }
        ]
    },
    {
        "name": "Tay cầm chơi game",
        "slug": "tay-cam-choi-game",
        "description": "Controller cho PC, console",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "platform", "label": "Nền tảng", "dataType": "string" },
            { "key": "wireless", "label": "Không dây", "dataType": "boolean" },
            { "key": "batteryLife", "label": "Thời lượng pin", "dataType": "number" },
            { "key": "vibration", "label": "Rung", "dataType": "boolean" }
        ],
        "variantAttributes": [
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "edition", "label": "Phiên bản", "dataType": "string" },
            { "key": "connectivity", "label": "Kết nối", "dataType": "string", "options": ["bluetooth", "wired"] }
        ]
    },
    {
        "name": "Kính thực tế ảo",
        "slug": "kinh-thuc-te-ao",
        "description": "Thiết bị VR/AR",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "resolution", "label": "Độ phân giải", "dataType": "string" },
            { "key": "fov", "label": "Góc nhìn", "dataType": "number" },
            { "key": "tracking", "label": "Tracking", "dataType": "string" },
            { "key": "wireless", "label": "Không dây", "dataType": "boolean" }
        ],
        "variantAttributes": [
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "storage", "label": "Bộ nhớ", "dataType": "string", "options": ["128GB", "256GB"] },
            { "key": "edition", "label": "Phiên bản", "dataType": "string" }
        ]
    },
    {
        "name": "Phụ kiện ô tô",
        "slug": "phu-kien-o-to",
        "description": "Đồ dùng và phụ kiện xe hơi",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "type", "label": "Loại phụ kiện", "dataType": "string" },
            { "key": "compatibility", "label": "Tương thích", "dataType": "string" },
            { "key": "material", "label": "Chất liệu", "dataType": "string" },
            { "key": "waterproof", "label": "Chống nước", "dataType": "boolean" }
        ],
        "variantAttributes": [
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "size", "label": "Kích cỡ", "dataType": "string" },
            { "key": "edition", "label": "Phiên bản", "dataType": "string" }
        ]
    },
    {
        "name": "Đồ dùng thú cưng",
        "slug": "do-dung-thu-cung",
        "description": "Sản phẩm cho chó mèo",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "petType", "label": "Loại thú cưng", "dataType": "string" },
            { "key": "material", "label": "Chất liệu", "dataType": "string" },
            { "key": "ecoFriendly", "label": "Thân thiện môi trường", "dataType": "boolean" },
            { "key": "weightSupport", "label": "Tải trọng", "dataType": "number" }
        ],
        "variantAttributes": [
            { "key": "size", "label": "Kích cỡ", "dataType": "string", "options": ["S", "M", "L"] },
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "edition", "label": "Phiên bản", "dataType": "string" }
        ]
    },
    {
        "name": "Đồ văn phòng",
        "slug": "do-van-phong",
        "description": "Dụng cụ học tập và văn phòng",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "type", "label": "Loại sản phẩm", "dataType": "string" },
            { "key": "material", "label": "Chất liệu", "dataType": "string" },
            { "key": "ecoFriendly", "label": "Thân thiện môi trường", "dataType": "boolean" },
            { "key": "packSize", "label": "Số lượng", "dataType": "number" }
        ],
        "variantAttributes": [
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "size", "label": "Kích cỡ", "dataType": "string" },
            { "key": "edition", "label": "Phiên bản", "dataType": "string" }
        ]
    },
    {
        "name": "Đồ cho mẹ và bé",
        "slug": "me-va-be",
        "description": "Sản phẩm chăm sóc mẹ và bé",
        "isActive": True,
        "dynamicAttributes": [
            { "key": "brand", "label": "Thương hiệu", "dataType": "string" },
            { "key": "ageGroup", "label": "Độ tuổi", "dataType": "string" },
            { "key": "material", "label": "Chất liệu", "dataType": "string" },
            { "key": "organic", "label": "Hữu cơ", "dataType": "boolean" },
            { "key": "safetyCert", "label": "Chứng nhận an toàn", "dataType": "string" }
        ],
        "variantAttributes": [
            { "key": "size", "label": "Kích cỡ", "dataType": "string", "options": ["S", "M", "L"] },
            { "key": "color", "label": "Màu sắc", "dataType": "string" },
            { "key": "edition", "label": "Phiên bản", "dataType": "string" }
        ]
    }
]

def generate_random_attribute_value(attr_def):
    if "options" in attr_def and attr_def["options"]:
        return random.choice(attr_def["options"])
    
    data_type = attr_def.get("dataType")
    if data_type == "string":
        return ''.join(random.choices(string.ascii_uppercase, k=5))
    elif data_type == "number":
        return random.randint(10, 100)
    elif data_type == "boolean":
        return random.choice([True, False])
    return "Unknown"

def seed_database():
    print("Xóa dữ liệu cũ...")
    db.categories.delete_many({})
    db.products.delete_many({})
    db.skus.delete_many({})

    print("Đang Insert Categories...")
    inserted_categories = db.categories.insert_many(categories_data)
    categories_db = list(db.categories.find({}))
    
    products_batch = []
    
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(current_dir)
    
    csv_dir = os.path.join(project_root, "scenario testing", "storage and data management")
    os.makedirs(csv_dir, exist_ok=True)
    csv_path = os.path.join(csv_dir, "product_test.csv")
    
    print(f"Bắt đầu sinh {TOTAL_PRODUCTS} Products và SKUs. Đồng thời xuất ra file: {csv_path}")
    
    with open(csv_path, mode='w', newline='', encoding='utf-8') as csv_file:
        fieldnames = ['categoryID', 'name', 'slug', 'basePrice', 'description', 'attributes', 'isActive', 'avgRating', 'totalReviews', 'totalSold', 'createdAt']
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        writer.writeheader()
    
        for i in range(1, TOTAL_PRODUCTS + 1):
            cat = random.choice(categories_db)
            
            product_attributes = {}
            for dyn_attr in cat["dynamicAttributes"]:
                product_attributes[dyn_attr["key"]] = generate_random_attribute_value(dyn_attr)
                
            base_price = random.randint(50, 500) * 100000
            created_at = datetime.now()

            product_doc = {
                "categoryID": cat["_id"],
                "name": f"Product {cat['name']} Model {i}",
                "slug": f"product-{cat['slug']}-model-{i}",
                "basePrice": base_price,
                "description": f"Mô tả sản phẩm {i} tự động sinh",
                "attributes": product_attributes, 
                "isActive": True,
                "avgRating": round(random.uniform(3.5, 5.0), 1),
                "totalReviews": random.randint(0, 100),
                "totalSold": random.randint(0, 500),
                "createdAt": created_at
            }
            
            csv_row = {
                'categoryID': str(cat["_id"]),
                'name': product_doc['name'],
                'slug': product_doc['slug'],
                'basePrice': product_doc['basePrice'],
                'description': product_doc['description'],
                'attributes': json.dumps(product_doc['attributes'], ensure_ascii=False),
                'isActive': product_doc['isActive'],
                'avgRating': product_doc['avgRating'],
                'totalReviews': product_doc['totalReviews'],
                'totalSold': product_doc['totalSold'],
                'createdAt': product_doc['createdAt'].isoformat()
            }
            writer.writerow(csv_row)
            
            skus_temp = []
            for j in range(1, random.randint(2, 4)): 
                sku_attributes = {}
                for var_attr in cat["variantAttributes"]:
                    sku_attributes[var_attr["key"]] = generate_random_attribute_value(var_attr)
                    
                skus_temp.append({
                    "sku": f"SKU-{cat['slug'].upper()}-{i}-V{j}",
                    "skuPrice": base_price + (j * 200000),
                    "attributes": sku_attributes 
                })
                
            product_doc["skus_temp"] = skus_temp
            products_batch.append(product_doc)
            
            if i % BATCH_SIZE == 0:
                result = db.products.insert_many([{k: v for k, v in p.items() if k != 'skus_temp'} for p in products_batch])
                
                skus_to_insert = []
                for idx, product_id in enumerate(result.inserted_ids):
                    for sku in products_batch[idx]["skus_temp"]:
                        sku["productID"] = product_id
                        skus_to_insert.append(sku)
                
                db.skus.insert_many(skus_to_insert)
                products_batch = []
                print(f"Đã insert thành công {i} Products...")

        if products_batch:
            result = db.products.insert_many([{k: v for k, v in p.items() if k != 'skus_temp'} for p in products_batch])
            skus_to_insert = []
            for idx, product_id in enumerate(result.inserted_ids):
                for sku in products_batch[idx]["skus_temp"]:
                    sku["productID"] = product_id
                    skus_to_insert.append(sku)
            db.skus.insert_many(skus_to_insert)

    print("✅ Hoàn tất việc sinh dữ liệu MongoDB và xuất file CSV test!")

if __name__ == "__main__":
    seed_database()