db = db.getSiblingDB('hybrid_db');

db.createCollection("categories", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "slug", "isActive", "dynamicAttributes", "variantAttributes"],
            properties: {
                name: { bsonType: "string" },
                slug: { bsonType: "string" },
                description: { bsonType: "string" },
                isActive: { bsonType: "bool" },
                dynamicAttributes: { bsonType: "array" },
                variantAttributes: { bsonType: "array" }
            }
        }
    }
});

db.createCollection("products", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["categoryID", "name", "slug", "basePrice", "isActive", "createdAt"],
            properties: {
                categoryID: { bsonType: "objectId" },
                name: { bsonType: "string" },
                slug: { bsonType: "string" },
                basePrice: { bsonType: "number", minimum: 0 },
                isActive: { bsonType: "bool" },
                avgRating: { bsonType: ["number", "double"] },
                totalReviews: { bsonType: "int", minimum: 0 },
                totalSold: { bsonType: "int", minimum: 0 }
            }
        }
    }
});

db.createCollection("skus", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["productID", "sku", "skuPrice"],
            properties: {
                productID: { bsonType: "objectId" },
                sku: { bsonType: "string" },
                skuPrice: { bsonType: "number", minimum: 0 }
            }
        }
    }
});

db.createCollection("reviews", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["productID", "userID", "userName", "rating"],
            properties: {
                productID: { bsonType: "objectId" },
                userID: { bsonType: "string" },
                rating: { bsonType: "int", minimum: 1, maximum: 5 }
            }
        }
    }
});

db.createCollection("userActivityLogs", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["actionType", "targetID", "timestamp"],
            properties: {
                userID: { 
                    bsonType: ["string", "null"],
                    description: "Tham chiếu logic tới userID trong PostgreSQL (có thể null nếu user chưa đăng nhập)"
                },
                actionType: { 
                    bsonType: "string",
                    description: "Loại hành động (VD: VIEW_PRODUCT, SEARCH, ADD_TO_CART)"
                },
                targetID: { 
                    bsonType: ["string", "objectId"],
                    description: "ID của đối tượng liên quan (VD: productID, categoryID)"
                },
                metadata: { 
                    bsonType: "object",
                    description: "Các thông tin bổ sung tùy ngữ cảnh (VD: searchKeyword, device)"
                },
                timestamp: { 
                    bsonType: "date",
                    description: "Thời gian thực hiện hành vi"
                }
            }
        }
    }
});