db = db.getSiblingDB('hybrid_db');

// Products Indexes
db.products.createIndex({ "categoryID": 1 });
db.products.createIndex({ "categoryID": 1, "createdAt": -1 });
db.products.createIndex({ "name": "text" }); // Text index cho keyword search

// Categories Indexes
db.categories.createIndex({ "slug": 1 }, { unique: true });

// SKUs Indexes
db.skus.createIndex({ "sku": 1 }, { unique: true });
// Tạo TTL Index trên trường timestamp
db.userActivityLogs.createIndex(
    { "timestamp": 1 }, 
    { expireAfterSeconds: 2592000 } // 30 ngày * 24 giờ * 60 phút * 60 giây
);