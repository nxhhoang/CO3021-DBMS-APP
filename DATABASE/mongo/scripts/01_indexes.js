db = db.getSiblingDB('hybrid_db');

// Products Indexes
db.products.createIndex({ "categoryID": 1 });
db.products.createIndex({ "categoryID": 1, "createdAt": -1 });
db.products.createIndex({ "name": "text" }); // Text index cho keyword search

// Categories Indexes
db.categories.createIndex({ "slug": 1 }, { unique: true });

// SKUs Indexes
db.skus.createIndex({ "sku": 1 }, { unique: true });