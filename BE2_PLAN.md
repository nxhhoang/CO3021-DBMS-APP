# Kế hoạch triển khai Backend 2 (BE2)

> **Phạm vi**: MongoDB (Catalog, Reviews, Logging) + Hybrid API (Product Detail) + PostgreSQL Inventory Logic (hỗ trợ BE1)
> **Nhánh**: `BE2`

---

## 1. Tổng quan nhiệm vụ

| Nhóm | Công nghệ | API liên quan |
|---|---|---|
| Categories | MongoDB | `GET /categories`, `POST/PUT/DELETE /admin/categories` |
| Products (Catalog) | MongoDB | `GET /products`, `POST/PUT/DELETE /admin/products` |
| Product Detail (Hybrid) | MongoDB + PostgreSQL | `GET /products/:id` |
| Reviews | MongoDB | `GET/POST /products/:productId/reviews` |
| Logging | MongoDB | `POST /logs` |
| Inventory | PostgreSQL | Service nội bộ (hỗ trợ BE1 tạo đơn hàng) |

---

## 2. Cấu trúc database cần tạo

### 2.1 MongoDB Collections

#### Collection: `categories`
```json
{
  "_id": "ObjectId",
  "name": "string",
  "slug": "string (unique, indexed)",
  "description": "string",
  "isActive": "boolean (default: true)",
  "dynamicAttributes": [
    {
      "key": "string",
      "label": "string",
      "dataType": "string | number | boolean",
      "isRequired": "boolean",
      "options": ["string"]
    }
  ],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```
> **Index**: `slug` (unique), `isActive`

#### Collection: `products`
```json
{
  "_id": "ObjectId",
  "name": "string (text-indexed)",
  "categoryId": "ObjectId (ref: categories)",
  "base_price": "number",
  "description": "string",
  "images": ["string"],
  "attributes": "object (dynamic, e.g. { ram: '16GB', color: 'Silver' })",
  "avg_rating": "number (default: 0, computed)",
  "total_reviews": "number (default: 0, computed)",
  "total_sold": "number (default: 0, computed)",
  "isActive": "boolean (default: true, soft-delete flag)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```
> **Index**: `name` (text index cho search), `categoryId`, `isActive`, `base_price`

#### Collection: `reviews`
```json
{
  "_id": "ObjectId",
  "productId": "ObjectId (ref: products)",
  "userId": "string (UUID từ PostgreSQL)",
  "user_name": "string (snapshot tại lúc review)",
  "rating": "number (1-5)",
  "comment": "string",
  "images": ["string"],
  "createdAt": "Date"
}
```
> **Index**: `productId`, compound `{ productId, userId }` (optional: check mua hàng chưa)

#### Collection: `user_activity_logs`
```json
{
  "_id": "ObjectId",
  "userId": "string | null (UUID, null nếu guest)",
  "action_type": "string (VIEW_PRODUCT | SEARCH | ADD_TO_CART)",
  "target_id": "string",
  "metadata": "object",
  "createdAt": "Date (TTL index: tự xóa sau 90 ngày)"
}
```
> **Index**: `createdAt` (TTL), `userId`, `action_type`

### 2.2 PostgreSQL Table (Inventory)

#### Table: `inventories`
```sql
CREATE TABLE inventories (
  id          SERIAL PRIMARY KEY,
  product_id  VARCHAR(24) NOT NULL,        -- MongoDB ObjectId dạng string
  sku         VARCHAR(100) NOT NULL UNIQUE,
  stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_inventories_product_id ON inventories(product_id);
CREATE INDEX idx_inventories_sku ON inventories(sku);
```

---

## 3. Các file cần tạo / chỉnh sửa

### 3.1 Constants & Enums

- [ ] **`src/constants/enums.ts`** — Thêm enum:
  ```ts
  export enum ActionType {
    VIEW_PRODUCT = 'VIEW_PRODUCT',
    SEARCH = 'SEARCH',
    ADD_TO_CART = 'ADD_TO_CART'
  }

  export enum AttributeDataType {
    STRING = 'string',
    NUMBER = 'number',
    BOOLEAN = 'boolean'
  }
  ```

- [ ] **`src/constants/messages.ts`** — Thêm message strings cho:
  - Categories: `CATEGORY_NOT_FOUND`, `CATEGORY_CREATED`, `CATEGORY_UPDATED`, `CATEGORY_DELETED`, `CATEGORIES_FETCHED`
  - Products: `PRODUCT_NOT_FOUND`, `PRODUCT_CREATED`, `PRODUCT_UPDATED`, `PRODUCT_DELETED`, `PRODUCTS_FETCHED`, `PRODUCT_DETAIL_FETCHED`
  - Reviews: `REVIEW_CREATED`, `REVIEWS_FETCHED`
  - Logs: `LOG_CREATED`
  - Inventory: `INSUFFICIENT_STOCK`, `INVENTORY_NOT_FOUND`

### 3.2 Database connections

- [ ] **`src/services/database.mongodb.service.ts`** — MongoDB connection & collection accessors:
  ```ts
  // Kết nối MongoDB, expose các collection:
  get categories(): Collection<CategoryDocument>
  get products(): Collection<ProductDocument>
  get reviews(): Collection<ReviewDocument>
  get userActivityLogs(): Collection<UserActivityLogDocument>
  ```

- [ ] **`src/services/database.postgres.service.ts`** *(nếu BE1 chưa tạo)* — PostgreSQL connection (pg Pool) dùng chung cho Inventory

### 3.3 Models / Schemas (TypeScript interfaces)

- [ ] **`src/models/schemas/Category.schema.ts`**
  ```ts
  interface DynamicAttribute { key, label, dataType, isRequired, options }
  interface CategoryDocument { _id, name, slug, description, isActive, dynamicAttributes, createdAt, updatedAt }
  ```

- [ ] **`src/models/schemas/Product.schema.ts`**
  ```ts
  interface ProductDocument { _id, name, categoryId, base_price, description, images, attributes, avg_rating, total_reviews, total_sold, isActive, createdAt, updatedAt }
  ```

- [ ] **`src/models/schemas/Review.schema.ts`**
  ```ts
  interface ReviewDocument { _id, productId, userId, user_name, rating, comment, images, createdAt }
  ```

- [ ] **`src/models/schemas/UserActivityLog.schema.ts`**
  ```ts
  interface UserActivityLogDocument { _id, userId, action_type, target_id, metadata, createdAt }
  ```

### 3.4 Request types (đã có khung, cần hoàn thiện)

- [ ] **`src/models/requests/Product.requests.ts`** — Thêm:
  ```ts
  interface UpdateProductReqBody { name?, base_price?, description?, images?, attributes? }
  interface ProductIdReqParams extends ParamsDictionary { id: string }
  ```

- [ ] **`src/models/requests/Category.requests.ts`** — Tạo mới:
  ```ts
  interface GetCategoriesQuery { isActive?: string }
  interface CategoryIdReqParams extends ParamsDictionary { id: string }
  interface CreateCategoryReqBody { name, slug, description?, isActive?, dynamicAttributes? }
  interface UpdateCategoryReqBody { name?, slug?, description?, isActive?, dynamicAttributes? }
  ```

- [ ] **`src/models/requests/Review.requests.ts`** — Đã có, kiểm tra đủ chưa

- [ ] **`src/models/requests/Log.requests.ts`** — Đã có, kiểm tra `action_type` có validate với enum không

### 3.5 Validators (Middleware)

- [ ] **`src/middlewares/category.middlewares.ts`**
  - `createCategoryValidator` — validate `name`, `slug` (required, unique check optional), `dynamicAttributes`
  - `updateCategoryValidator` — validate các field optional
  - `categoryIdValidator` — validate param `id` là ObjectId hợp lệ

- [ ] **`src/middlewares/product.middlewares.ts`**
  - `searchProductValidator` — validate query params (`price_min/max` là số, `page/limit`)
  - `createProductValidator` — validate `name`, `categoryId` (ObjectId), `base_price` (>0)
  - `updateProductValidator` — validate các field optional
  - `productIdValidator` — validate param `id` là ObjectId hợp lệ

- [ ] **`src/middlewares/review.middlewares.ts`**
  - `createReviewValidator` — validate `rating` (1-5, integer), `comment` (required)
  - `productIdParamValidator` — validate param `productId` là ObjectId hợp lệ

- [ ] **`src/middlewares/log.middlewares.ts`**
  - `createLogValidator` — validate `action_type` thuộc `ActionType` enum, `target_id` required

### 3.6 Services

- [ ] **`src/services/category.services.ts`**
  ```
  getCategories(filter)         → CategoryDocument[]
  createCategory(body)          → CategoryDocument
  updateCategory(id, body)      → CategoryDocument
  softDeleteCategory(id)        → { _id, isActive: false }
  ```

- [ ] **`src/services/product.services.ts`**
  ```
  searchProducts(query)         → ProductDocument[]   (MongoDB text search + filter + pagination)
  getProductById(id)            → ProductDocument + inventory[]  (HYBRID: join với PostgreSQL)
  createProduct(body)           → ProductDocument
  updateProduct(id, body)       → ProductDocument
  softDeleteProduct(id)         → { _id, isActive: false }
  ```
  > **Hybrid logic trong `getProductById`**:
  > 1. Query MongoDB lấy thông tin sản phẩm theo `_id`
  > 2. Query PostgreSQL `SELECT sku, stock_quantity FROM inventories WHERE product_id = $1`
  > 3. Merge kết quả, trả về object kết hợp

- [ ] **`src/services/review.services.ts`**
  ```
  getReviewsByProduct(productId)        → ReviewDocument[]
  createReview(productId, userId, body) → ReviewDocument
  ```
  > **Computed Pattern sau khi tạo review**:
  > Sau insert review, tính lại `avg_rating` và `total_reviews` bằng aggregation, rồi `$set` vào product document

- [ ] **`src/services/log.services.ts`**
  ```
  createLog(userId, body) → void  (fire-and-forget, không block response)
  ```

- [ ] **`src/services/inventory.services.ts`** *(dùng nội bộ + export cho BE1)*
  ```
  getInventoryByProductId(productId)        → { sku, stock_quantity }[]
  checkStock(items: { sku, quantity }[])    → void  (throws nếu thiếu hàng)
  decreaseStock(items: { sku, quantity }[]) → void  (dùng trong transaction PostgreSQL của BE1)
  increaseStock(items: { sku, quantity }[]) → void  (dùng nếu cancel đơn)
  ```
  > **Lưu ý**: `decreaseStock` phải chạy trong cùng transaction với `INSERT orders` của BE1. BE1 gọi hàm này từ `inventory.services.ts` để đảm bảo tính ACID.

### 3.7 Controllers

- [ ] **`src/controllers/category.controllers.ts`**
  - `getCategories` — Gọi service, trả list
  - `createCategory` — Gọi service, trả document mới
  - `updateCategory` — Gọi service, trả document đã update
  - `deleteCategory` — Gọi service, trả `{ _id, isActive: false }`

- [ ] **`src/controllers/product.controllers.ts`**
  - `searchProducts` — Gọi service với query params
  - `getProductDetail` — Gọi hybrid service
  - `createProduct` — Admin only
  - `updateProduct` — Admin only
  - `deleteProduct` — Admin only (soft delete)

- [ ] **`src/controllers/review.controllers.ts`**
  - `getReviews` — Public
  - `createReview` — Auth required, gọi service + trigger computed update

- [ ] **`src/controllers/log.controllers.ts`**
  - `createLog` — Fire-and-forget, luôn trả `200` dù có lỗi log hay không

### 3.8 Routes

- [ ] **`src/routes/category.routes.ts`**
  ```
  GET    /categories                    → getCategories
  POST   /admin/categories              → [accessTokenValidator, adminRoleValidator, createCategoryValidator] → createCategory
  PUT    /admin/categories/:id          → [accessTokenValidator, adminRoleValidator, categoryIdValidator, updateCategoryValidator] → updateCategory
  DELETE /admin/categories/:id          → [accessTokenValidator, adminRoleValidator, categoryIdValidator] → deleteCategory
  ```

- [ ] **`src/routes/product.routes.ts`**
  ```
  GET    /products                      → [searchProductValidator] → searchProducts
  GET    /products/:id                  → [productIdValidator] → getProductDetail
  POST   /admin/products                → [accessTokenValidator, adminRoleValidator, createProductValidator] → createProduct
  PUT    /admin/products/:id            → [accessTokenValidator, adminRoleValidator, productIdValidator, updateProductValidator] → updateProduct
  DELETE /admin/products/:id            → [accessTokenValidator, adminRoleValidator, productIdValidator] → deleteProduct
  ```

- [ ] **`src/routes/review.routes.ts`**
  ```
  GET    /products/:productId/reviews   → [productIdParamValidator] → getReviews
  POST   /products/:productId/reviews   → [accessTokenValidator, productIdParamValidator, createReviewValidator] → createReview
  ```

- [ ] **`src/routes/log.routes.ts`**
  ```
  POST   /logs                          → [createLogValidator] → createLog
  ```

- [ ] **`src/index.ts`** — Mount tất cả router mới vào app

---

## 4. Thứ tự triển khai (ưu tiên)

```
Phase 1 — Cơ sở hạ tầng
├── 1. Kết nối MongoDB (database.mongodb.service.ts)
├── 2. Kết nối PostgreSQL / tái dùng từ BE1 (database.postgres.service.ts)
├── 3. Tạo bảng inventories (migration SQL)
└── 4. Enums, Messages constants

Phase 2 — Inventory (ưu tiên vì BE1 phụ thuộc)
├── 5. inventory.services.ts (checkStock, decreaseStock, increaseStock, getInventoryByProductId)
└── 6. Viết unit test cho inventory service

Phase 3 — Categories
├── 7. Category schema, request types, validators
├── 8. category.services.ts
├── 9. category.controllers.ts
└── 10. category.routes.ts + mount vào index.ts

Phase 4 — Products (Catalog + Hybrid)
├── 11. Product schema, request types, validators
├── 12. product.services.ts (searchProducts + getProductById hybrid)
├── 13. product.controllers.ts
└── 14. product.routes.ts + mount vào index.ts

Phase 5 — Reviews
├── 15. Review schema, validators
├── 16. review.services.ts (+ computed avg_rating update)
├── 17. review.controllers.ts
└── 18. review.routes.ts + mount vào index.ts

Phase 6 — Logging
├── 19. UserActivityLog schema, validators
├── 20. log.services.ts
├── 21. log.controllers.ts
└── 22. log.routes.ts + mount vào index.ts

Phase 7 — Hoàn thiện
├── 23. Viết OpenAPI spec (openapi/paths.yaml, components.yaml) cho các endpoint mới
├── 24. Integration test theo TEST_PLAN.md
└── 25. Review & handoff cho BE1 (confirm interface inventory.services.ts)
```

---

## 5. Giao diện với BE1 (Inventory Contract)

BE1 sử dụng `inventory.services.ts` của BE2 để thực hiện logic trừ kho khi tạo đơn hàng. Hàm phải đảm bảo:

```ts
// Được gọi bên trong PostgreSQL transaction của BE1
export async function checkAndDecreaseStock(
  client: PoolClient,  // transaction client từ BE1 truyền vào
  items: Array<{ sku: string; quantity: number }>
): Promise<void>

// Ví dụ sử dụng trong BE1 (orders.services.ts):
// const client = await pool.connect()
// await client.query('BEGIN')
// await checkAndDecreaseStock(client, orderItems)  ← gọi BE2's service
// await client.query('INSERT INTO orders ...')
// await client.query('COMMIT')
```

> **Quan trọng**: Hàm trả về lỗi có type rõ ràng (`InsufficientStockError`) để BE1 có thể rollback đúng cách và trả `400` cho client.

---

## 6. Các điểm cần lưu ý

- **ObjectId validation**: Mọi param là MongoDB ObjectId đều phải validate bằng `mongoose.isValidObjectId()` hoặc regex `^[a-fA-F0-9]{24}$` trước khi query.
- **Hybrid query performance**: `getProductById` thực hiện 2 query song song (`Promise.all`) để giảm latency.
- **avg_rating computed**: Dùng MongoDB aggregation `$avg` sau mỗi review mới để đảm bảo chính xác, tránh race condition nếu dùng cộng dồn thủ công.
- **Soft delete**: Tất cả filter `find` trên products và categories phải thêm `{ isActive: true }` để tránh trả về dữ liệu đã xóa mềm.
- **Log fire-and-forget**: `log.services.ts` không được `await` bên trong controller — dùng pattern `.catch(console.error)` để không block response.
- **TTL Index**: Collection `user_activity_logs` cần TTL index `{ createdAt: 1 }, { expireAfterSeconds: 7776000 }` (90 ngày).
- **Admin role check**: Middleware `adminRoleValidator` phải được tái dùng từ BE1 (hoặc khai báo chung trong `auth.middlewares.ts`).

---

## 7. Chi tiết các API

> Ký hiệu: 🔓 = Public | 🔐 = Auth required | 👑 = Admin only

---

### 7.1 Categories

---

#### `GET /api/v1/categories` 🔓

**Mục đích**: Lấy danh sách danh mục đang hoạt động cho trang chủ / filter sản phẩm.

**Query Params**:
| Param | Type | Required | Mô tả |
|---|---|---|---|
| `isActive` | boolean | No | Default `true`. Client thường không cần truyền. |

**Business Logic**:
1. Filter `{ isActive: true }` (hoặc theo param nếu admin gọi)
2. Trả toàn bộ list (không cần pagination vì số category ít)

**Response `200`**:
```json
{
  "message": "Lấy danh sách danh mục thành công",
  "data": [
    {
      "_id": "mongo_category_id",
      "name": "Laptop",
      "slug": "laptop",
      "description": "Máy tính xách tay các loại",
      "isActive": true,
      "dynamicAttributes": [
        {
          "key": "ram",
          "label": "Dung lượng RAM",
          "dataType": "string",
          "isRequired": true,
          "options": ["8GB", "16GB", "32GB"]
        }
      ]
    }
  ]
}
```

---

#### `POST /api/v1/admin/categories` 👑

**Mục đích**: Admin tạo danh mục sản phẩm mới.

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "name": "Laptop",
  "slug": "laptop",
  "description": "Máy tính xách tay các loại",
  "isActive": true,
  "dynamicAttributes": [
    {
      "key": "ram",
      "label": "Dung lượng RAM",
      "dataType": "string",
      "isRequired": true,
      "options": ["8GB", "16GB", "32GB", "64GB"]
    },
    {
      "key": "cpu",
      "label": "Vi xử lý (CPU)",
      "dataType": "string",
      "isRequired": true,
      "options": []
    },
    {
      "key": "weight",
      "label": "Trọng lượng (kg)",
      "dataType": "number",
      "isRequired": false,
      "options": []
    }
  ]
}
```

**Validation**:
- `name`: required, string, không rỗng
- `slug`: required, string, chỉ chứa `[a-z0-9-]`, unique trong DB
- `dynamicAttributes[].key`: required, string, unique trong mảng
- `dynamicAttributes[].dataType`: phải thuộc `['string', 'number', 'boolean']`

**Business Logic**:
1. Kiểm tra `slug` chưa tồn tại trong collection
2. Insert document mới với `isActive: true`, `createdAt: now()`

**Response `201`**:
```json
{
  "message": "Tạo danh mục thành công",
  "data": { "_id": "new_category_id" }
}
```

**Errors**:
| Status | Trường hợp |
|---|---|
| `400` | Thiếu field required / sai dataType |
| `409` | `slug` đã tồn tại |
| `401` | Không có token |
| `403` | Không phải ADMIN |

---

#### `PUT /api/v1/admin/categories/:id` 👑

**Mục đích**: Admin cập nhật thông tin danh mục.

**Headers**: `Authorization: Bearer <access_token>`

**Path Params**: `id` — MongoDB ObjectId của category

**Request Body** (tất cả optional, chỉ gửi field cần thay đổi):
```json
{
  "name": "Laptop Gaming",
  "slug": "laptop-gaming",
  "description": "Máy tính xách tay cấu hình cao",
  "isActive": true,
  "dynamicAttributes": [
    {
      "key": "ram",
      "label": "Dung lượng RAM",
      "dataType": "string",
      "isRequired": true,
      "options": ["16GB", "32GB", "64GB"]
    },
    {
      "key": "vga",
      "label": "Card đồ họa",
      "dataType": "string",
      "isRequired": true,
      "options": ["RTX 4050", "RTX 4060", "RTX 4070"]
    }
  ]
}
```

**Validation**:
- `id`: phải là ObjectId hợp lệ (24 hex chars)
- `slug` (nếu có): chỉ `[a-z0-9-]`, unique (trừ chính document đang sửa)

**Business Logic**:
1. Validate `id` là ObjectId hợp lệ
2. Tìm category — nếu không tồn tại → `404`
3. Nếu có `slug` mới → check unique
4. `findOneAndUpdate` với `{ updatedAt: now() }`, trả về document sau update

**Response `200`**:
```json
{
  "message": "Cập nhật danh mục thành công",
  "data": { "_id": "mongo_id", "name": "Laptop Gaming", "isActive": true }
}
```

**Errors**:
| Status | Trường hợp |
|---|---|
| `400` | `id` không hợp lệ / Body sai kiểu |
| `404` | Không tìm thấy category |
| `409` | `slug` mới đã tồn tại ở category khác |

---

#### `DELETE /api/v1/admin/categories/:id` 👑

**Mục đích**: Admin xóa mềm danh mục (set `isActive = false`).

**Headers**: `Authorization: Bearer <access_token>`

**Path Params**: `id` — MongoDB ObjectId

**Business Logic**:
1. Validate `id`
2. Tìm category — nếu không tồn tại → `404`
3. Nếu `isActive` đã là `false` → vẫn trả `200` (idempotent)
4. `updateOne({ $set: { isActive: false, updatedAt: now() } })`
5. **Không** cascade xóa/ẩn các product thuộc category này (product tự quản lý `isActive`)

**Response `200`**:
```json
{
  "message": "Xóa danh mục thành công (Đã ẩn)",
  "data": { "_id": "mongo_id", "isActive": false }
}
```

---

### 7.2 Products (Catalog)

---

#### `GET /api/v1/products` 🔓

**Mục đích**: Tìm kiếm và lọc sản phẩm, hỗ trợ dynamic attributes.

**Query Params**:
| Param | Type | Required | Mô tả |
|---|---|---|---|
| `keyword` | string | No | Tìm theo tên sản phẩm (MongoDB text search) |
| `categoryId` | string | No | Filter theo ObjectId của category |
| `price_min` | number | No | Giá tối thiểu |
| `price_max` | number | No | Giá tối đa |
| `page` | number | No | Default `1` |
| `limit` | number | No | Default `20`, max `100` |
| `attrs[key]` | string | No | Dynamic attribute filter, ví dụ `attrs[ram]=16GB&attrs[color]=Silver` |

**Business Logic**:
1. Build MongoDB filter object:
   - `isActive: true` (bắt buộc)
   - Nếu `keyword` → dùng `$text: { $search: keyword }` (cần text index trên `name`)
   - Nếu `categoryId` → `categoryId: new ObjectId(categoryId)`
   - Nếu `price_min` hoặc `price_max` → `base_price: { $gte, $lte }`
   - Với mỗi `attrs[key]=value` → `attributes.<key>: value`
2. Tính `skip = (page - 1) * limit`
3. Thực hiện `find(filter).skip(skip).limit(limit)` trên collection `products`
4. Đồng thời đếm `countDocuments(filter)` cho metadata phân trang

**Response `200`**:
```json
{
  "message": "Tìm thấy 10 sản phẩm",
  "data": {
    "products": [
      {
        "_id": "mongo_object_id",
        "name": "MacBook Pro M3",
        "base_price": 2000,
        "categoryId": "mongo_category_id",
        "images": ["url1.jpg"],
        "attributes": { "ram": "16GB", "storage": "512GB" },
        "avg_rating": 4.8,
        "total_reviews": 150,
        "total_sold": 320
      }
    ],
    "pagination": {
      "total": 45,
      "page": 1,
      "limit": 20,
      "totalPages": 3
    }
  }
}
```

**Errors**:
| Status | Trường hợp |
|---|---|
| `400` | `categoryId` không phải ObjectId hợp lệ |
| `400` | `price_min` / `price_max` không phải số |
| `400` | `page` hoặc `limit` <= 0 |

---

#### `GET /api/v1/products/:id` 🔓 *(Hybrid)*

**Mục đích**: Lấy chi tiết sản phẩm kết hợp thông tin kho từ PostgreSQL.

**Path Params**: `id` — MongoDB ObjectId của product

**Business Logic**:
1. Validate `id` là ObjectId hợp lệ
2. Song song (`Promise.all`):
   - Query MongoDB: `findOne({ _id: new ObjectId(id), isActive: true })`
   - Query PostgreSQL: `SELECT sku, stock_quantity FROM inventories WHERE product_id = $1`
3. Nếu MongoDB trả `null` → `404`
4. Merge kết quả: gắn `inventory[]` vào product object

**Response `200`**:
```json
{
  "message": "Lấy chi tiết sản phẩm thành công",
  "data": {
    "_id": "mongo_object_id",
    "name": "MacBook Pro M3",
    "description": "...",
    "base_price": 2000,
    "images": ["url1.jpg"],
    "attributes": { "ram": "16GB", "storage": "512GB" },
    "avg_rating": 4.8,
    "total_reviews": 150,
    "total_sold": 320,
    "inventory": [
      { "sku": "M3-16-512", "stockQuantity": 50 },
      { "sku": "M3-32-1TB", "stockQuantity": 10 }
    ]
  }
}
```

**Errors**:
| Status | Trường hợp |
|---|---|
| `400` | `id` không phải ObjectId hợp lệ |
| `404` | Sản phẩm không tồn tại hoặc đã bị xóa mềm |

---

#### `POST /api/v1/admin/products` 👑

**Mục đích**: Admin thêm sản phẩm mới vào catalog.

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "name": "Áo thun",
  "categoryId": "mongo_category_id",
  "base_price": 200,
  "description": "Mô tả sản phẩm",
  "images": ["https://cdn.example.com/image1.jpg"],
  "attributes": { "size": "L", "material": "Cotton" }
}
```

**Validation**:
- `name`: required, string, không rỗng
- `categoryId`: required, phải là ObjectId hợp lệ và tồn tại trong collection `categories` với `isActive: true`
- `base_price`: required, number, > 0
- `attributes`: required, object (có thể rỗng `{}`)

**Business Logic**:
1. Validate `categoryId` tồn tại và active
2. Insert document với `avg_rating: 0`, `total_reviews: 0`, `total_sold: 0`, `isActive: true`

**Response `201`**:
```json
{
  "message": "Tạo sản phẩm thành công",
  "data": { "_id": "new_mongo_id", "name": "Áo thun", "isActive": true }
}
```

**Errors**:
| Status | Trường hợp |
|---|---|
| `400` | Thiếu field required / sai kiểu |
| `404` | `categoryId` không tồn tại hoặc không active |

---

#### `PUT /api/v1/admin/products/:id` 👑

**Mục đích**: Admin cập nhật thông tin sản phẩm.

**Headers**: `Authorization: Bearer <access_token>`

**Path Params**: `id` — MongoDB ObjectId

**Request Body** (tất cả optional):
```json
{
  "name": "Áo thun (Cập nhật)",
  "base_price": 250,
  "description": "Mô tả mới",
  "images": ["https://cdn.example.com/image2.jpg"],
  "attributes": { "size": "XL", "material": "Cotton" }
}
```

**Validation**:
- `id`: ObjectId hợp lệ
- `base_price` (nếu có): > 0
- `categoryId` (nếu có): ObjectId hợp lệ và tồn tại

**Business Logic**:
1. Chỉ `$set` các field được gửi lên (partial update — dùng `lodash.pick` hoặc manual spread)
2. Gắn `updatedAt: now()`
3. **Không** được phép cập nhật: `avg_rating`, `total_reviews`, `total_sold`, `isActive` qua endpoint này

**Response `200`**:
```json
{
  "message": "Cập nhật sản phẩm thành công",
  "data": { "_id": "mongo_id", "name": "Áo thun (Cập nhật)", "base_price": 250 }
}
```

**Errors**:
| Status | Trường hợp |
|---|---|
| `400` | `id` không hợp lệ |
| `404` | Sản phẩm không tồn tại |

---

#### `DELETE /api/v1/admin/products/:id` 👑

**Mục đích**: Admin xóa mềm sản phẩm (set `isActive = false`).

**Headers**: `Authorization: Bearer <access_token>`

**Path Params**: `id` — MongoDB ObjectId

**Business Logic**:
1. Validate `id`
2. Tìm product — nếu không tồn tại → `404`
3. `updateOne({ $set: { isActive: false, updatedAt: now() } })`
4. **Không** xóa dữ liệu cứng để bảo toàn lịch sử đơn hàng, review

**Response `200`**:
```json
{
  "message": "Xóa sản phẩm thành công (Đã ngừng bán)",
  "data": { "_id": "mongo_id", "isActive": false }
}
```

---

### 7.3 Reviews

---

#### `GET /api/v1/products/:productId/reviews` 🔓

**Mục đích**: Lấy danh sách đánh giá của một sản phẩm.

**Path Params**: `productId` — MongoDB ObjectId của product

**Query Params**:
| Param | Type | Required | Mô tả |
|---|---|---|---|
| `page` | number | No | Default `1` |
| `limit` | number | No | Default `10` |
| `rating` | number | No | Filter theo số sao (1-5) |

**Business Logic**:
1. Validate `productId` là ObjectId hợp lệ
2. Kiểm tra product tồn tại và `isActive: true` — nếu không → `404`
3. Query `reviews` collection: `find({ productId: new ObjectId(productId) }).sort({ createdAt: -1 }).skip().limit()`

**Response `200`**:
```json
{
  "message": "Danh sách đánh giá",
  "data": {
    "reviews": [
      {
        "_id": "review_id_1",
        "user_name": "Nguyen Van A",
        "rating": 5,
        "comment": "Máy chạy nhanh",
        "images": ["url_img.jpg"],
        "createdAt": "2026-01-15T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 10,
      "totalPages": 15
    }
  }
}
```

**Errors**:
| Status | Trường hợp |
|---|---|
| `400` | `productId` không phải ObjectId hợp lệ |
| `404` | Sản phẩm không tồn tại |

---

#### `POST /api/v1/products/:productId/reviews` 🔐

**Mục đích**: User đã đăng nhập gửi đánh giá sản phẩm.

**Headers**: `Authorization: Bearer <access_token>`

**Path Params**: `productId` — MongoDB ObjectId

**Request Body**:
```json
{
  "rating": 5,
  "comment": "Sản phẩm tốt, giao hàng nhanh",
  "images": ["https://cdn.example.com/review1.jpg"]
}
```

**Validation**:
- `productId`: ObjectId hợp lệ
- `rating`: required, integer, `1 ≤ rating ≤ 5`
- `comment`: required, string, không rỗng, max 1000 ký tự
- `images`: optional, array of URL strings

**Business Logic**:
1. Validate `productId`, kiểm tra product tồn tại và active
2. Lấy `userId` và `user_name` (fullName snapshot) từ decoded access token / DB
3. Insert review document vào `reviews` collection
4. **Computed Pattern** — Sau khi insert thành công, chạy aggregation để cập nhật product:
   ```js
   // Tính lại avg_rating và total_reviews
   const result = await reviews.aggregate([
     { $match: { productId: new ObjectId(productId) } },
     { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
   ])
   // Update vào product document
   await products.updateOne(
     { _id: new ObjectId(productId) },
     { $set: { avg_rating: result[0].avg, total_reviews: result[0].count } }
   )
   ```
5. Trả về `_id` của review vừa tạo

**Response `201`**:
```json
{
  "message": "Gửi đánh giá thành công",
  "data": { "_id": "new_review_id" }
}
```

**Errors**:
| Status | Trường hợp |
|---|---|
| `400` | `rating` ngoài [1,5] hoặc thiếu `comment` |
| `401` | Chưa đăng nhập |
| `404` | Sản phẩm không tồn tại |

---

### 7.4 Logging

---

#### `POST /api/v1/logs` 🔓 *(Auth optional)*

**Mục đích**: Ghi lại hành vi người dùng (view sản phẩm, tìm kiếm, thêm giỏ hàng).

**Headers**: `Authorization: Bearer <access_token>` *(optional — nếu có sẽ gắn userId)*

**Request Body**:
```json
{
  "action_type": "VIEW_PRODUCT",
  "target_id": "mongo_product_id",
  "metadata": {
    "search_keyword": "Laptop gaming",
    "device": "Mobile"
  }
}
```

**Validation**:
- `action_type`: required, phải thuộc `['VIEW_PRODUCT', 'SEARCH', 'ADD_TO_CART']`
- `target_id`: required, string không rỗng
- `metadata`: optional, object

**Business Logic**:
1. Nếu có `Authorization` header hợp lệ → decode token, lấy `userId`; nếu không có hoặc token hết hạn → `userId = null` (vẫn ghi log)
2. Insert vào `user_activity_logs` collection với `createdAt: now()`
3. **Fire-and-forget**: Controller không `await` service call — trả `200` ngay lập tức
4. Lỗi log (DB down...) chỉ ghi ra `console.error`, không trả lỗi cho client

**Response `200`**:
```json
{
  "message": "Đã ghi log",
  "data": null
}
```

> **Lưu ý**: API này luôn trả `200` dù log có ghi thành công hay không — không để lỗi logging ảnh hưởng UX.

---

### 7.5 Inventory (Internal Service — không expose HTTP)

> Đây **không** phải HTTP endpoint. Đây là module TypeScript được import bởi `orders.services.ts` của BE1.

#### `getInventoryByProductId(productId: string)`

**Mục đích**: Lấy danh sách SKU và tồn kho của một sản phẩm (dùng trong `GET /products/:id` hybrid).

```ts
// Input
productId: string  // MongoDB ObjectId dạng string

// Output
Array<{ sku: string; stockQuantity: number }>

// SQL
SELECT sku, stock_quantity AS "stockQuantity"
FROM inventories
WHERE product_id = $1
ORDER BY sku
```

---

#### `checkAndDecreaseStock(client: PoolClient, items: Array<{ sku: string; quantity: number }>)`

**Mục đích**: Kiểm tra và trừ tồn kho trong cùng một PostgreSQL transaction với việc tạo đơn hàng của BE1.

```ts
// Throws InsufficientStockError nếu bất kỳ SKU nào không đủ hàng

// SQL (FOR EACH item — chạy trong transaction):
UPDATE inventories
SET stock_quantity = stock_quantity - $1,
    updated_at = NOW()
WHERE sku = $2
  AND stock_quantity >= $1  -- CHECK CONSTRAINT đảm bảo không âm
RETURNING sku, stock_quantity

-- Nếu affected rows = 0 → SKU không đủ hàng → throw InsufficientStockError
```

**Ví dụ sử dụng trong BE1**:
```ts
// orders.services.ts (BE1)
const client = await pgPool.connect()
try {
  await client.query('BEGIN')
  // BE2's inventory service — nhận client để chạy trong cùng transaction
  await checkAndDecreaseStock(client, [
    { sku: 'M3-16-512', quantity: 1 },
    { sku: 'SHIRT-L-RED', quantity: 2 }
  ])
  await client.query(
    'INSERT INTO orders (user_id, total_amount, ...) VALUES ($1, $2, ...)',
    [userId, totalAmount]
  )
  await client.query('COMMIT')
} catch (err) {
  await client.query('ROLLBACK')
  throw err  // InsufficientStockError → BE1 trả 400 cho client
} finally {
  client.release()
}
```

---

#### `increaseStock(client: PoolClient, items: Array<{ sku: string; quantity: number }>)`

**Mục đích**: Hoàn lại tồn kho khi đơn hàng bị hủy (`CANCELLED`). Được gọi bởi BE1.

```sql
UPDATE inventories
SET stock_quantity = stock_quantity + $1,
    updated_at = NOW()
WHERE sku = $2
```

---

#### Error Type Contract

```ts
// src/models/Errors.ts (BE2 export, BE1 import)
export class InsufficientStockError extends Error {
  public sku: string
  public requested: number
  public available: number

  constructor(sku: string, requested: number, available: number) {
    super(`Insufficient stock for SKU: ${sku}`)
    this.name = 'InsufficientStockError'
    this.sku = sku
    this.requested = requested
    this.available = available
  }
}
```

> BE1 `catch` lỗi này và trả `HTTP 400` với message `"Sản phẩm ${sku} không đủ hàng (còn ${available}, yêu cầu ${requested})"` cho client.
