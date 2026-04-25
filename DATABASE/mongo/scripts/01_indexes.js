db = db.getSiblingDB('hybrid_db');

// Products Indexes
db.products.createIndex(
  { "name": "text", "description": "text" },
  { weights: { name: 10, description: 2 } }
);
db.products.createIndex({ "isActive": 1, "totalSold": -1 });
db.products.createIndex({ "isActive": 1, "categoryID": 1, "totalSold": -1 });
db.products.createIndex({ "isActive": 1, "categoryID": 1, "basePrice": 1 });
db.products.createIndex({ "isActive": 1, "categoryID": 1, "avgRating": -1 });
db.products.createIndex({ "attributes.$**": 1 });

// Categories Indexes
db.categories.createIndex({ "slug": 1 }, { unique: true });

// Phục vụ API GET /categories?isActive=true
db.categories.createIndex({ "isActive": 1 });

// Phục vụ API lấy danh sách đánh giá của sản phẩm
db.reviews.createIndex({ "productID": 1, "createdAt": -1 });

// SKUs Indexes
db.skus.createIndex({ "sku": 1 }, { unique: true });
// Tạo TTL Index trên trường timestamp
db.userActivityLogs.createIndex(
    { "timestamp": 1 }, 
    { expireAfterSeconds: 2592000 } // 30 ngày * 24 giờ * 60 phút * 60 giây
);