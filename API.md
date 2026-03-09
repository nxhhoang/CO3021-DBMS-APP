# Thiết kế API

## 1. Quy chuẩn chung

- URL Base: `/api/v1`
- Authentication: Headers: `Authorization: Bearer <access_token>`
- Response Format (JSON):

```json
{
  "message": "Mô tả kết quả (Thành công/Lỗi)",
  "data": {}
}
```

- Cụ thể:

```json
{
  "message": "string",
  "data": "object | array | null"
}
```

## 2. Chi tiết các API

### Authentication & Authorization (PostgreSQL)

Chức năng: Đăng ký, Đăng nhập, Quản lý Token

#### Đăng ký

- Endpoint: `POST /auth/register`
- Request Body:

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "fullName": "Nguyen Van A",
  "phoneNum": "0909123456"
}
```

- Response:

```json
{
  "message": "Đăng ký thành công",
  "data": {
    "userId": "uuid-gen-123",
    "email": "user@example.com"
  }
}
```

#### Đăng nhập

- Endpoint: `POST /auth/login`
- Request Body:

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "userAgent": "Mozilla/5.0..."
}
```

- Response:

```json
{
  "message": "Đăng nhập thành công",
  "data": {
    "accessToken": "ey...",
    "refreshToken": "random-string-db-stored",
    "user": { "userId": "...", "role": "CUSTOMER" }
  }
}
```

#### Refresh Token (rotation)

- Endpoint: `POST /auth/refresh-token`
- Request Body:

```json
{
  "refreshToken": "random-string-db-stored"
}
```

- Response:

```json
{
  "message": "Cấp lại token thành công",
  "data": {
    "accessToken": "eyJhbGciOiJIUz...", // Token mới (hạn ngắn: 15p-1h)
    "refreshToken": "new_refresh_token_xyz..." // Token mới (hạn dài: 7-30 ngày)
  }
}
```

#### LogOut

- Endpoint: `POST /auth/logout`
- Auth: Required (Headers: `Authorization: Bearer <access_token>`)
- Request Body:

```json
{
  "refreshToken": "random-string-db-stored"
}
```

- Logic xử lý Backend:
  1. Xác thực `accessToken` hợp lệ.
  2. Tìm bản ghi chứa `refreshToken` này trong bảng `AUTH_TOKENS`.
  3. Xóa cứng bản ghi đó khỏi cơ sở dữ liệu để ngăn chặn việc dùng token này cấp lại `accessToken` mới.
- Response:

```json
{
  "message": "Đăng xuất thành công",
  "data": null
}
```

### Users & Profile (PostgreSQL)

Chức năng: Quản lý thông tin cá nhân, Sổ địa chỉ

#### Lấy thông tin cá nhân

- Endpoint: `GET /users/profile`
- Auth: Required
- Response:

```json
{
  "message": "Lấy thông tin thành công",
  "data": {
    "userId": "...",
    "fullName": "...",
    "email": "...",
    "phoneNum": "..."
  }
}
```

#### Cập nhật thông tin cá nhân

- Endpoint: `PUT /users/profile`
- Auth: Required (Headers: `Authorization: Bearer <access_token>`)
- Request Body:

```json
{
  "fullName": "Nguyen Van B",
  "phoneNum": "0987654321",
  "avatar": "url_moi" // Nếu có
}
```

- Response:

```
{
  "message": "Cập nhật hồ sơ thành công",
  "data": { "userId": "...", "fullName": "Nguyen Van B" }
}
```

#### Quản lý địa chỉ giao hàng

- Endpoint: `GET /users/addresses` (Danh sách) | `POST /users/addresses` (Thêm mới)
- Auth: Required (Headers: `Authorization: Bearer <access_token>`)
- Request Body (POST):

```json
{
  "addressLine": "123 Ly Thuong Kiet",
  "addressName": "Home",
  "city": "HCM",
  "district": "District 10",
  "isDefault": true
}
```

- Response:

```json
{
  "message": "Thêm địa chỉ thành công",
  "data": { "addressID": 1, "addressLine": "..." }
}
```

#### Cập nhật một địa chỉ cụ thể

- Endpoint: `PUT /users/addresses/:addressID`
- Mục đích: Sửa lỗi chính tả hoặc thay đổi chi tiết của một địa chỉ đã lưu.
- Auth: Required (Headers: `Authorization: Bearer <access_token>`)
- Request Body:

```json
{
  "addressLine": "So 1, Dai Co Viet",
  "addressName": "Obama's White House",
  "city": "Ha Noi",
  "district": "Hai Ba Trung",
  "isDefault": false
}
```

- Response:

```json
{
  "message": "Cập nhật địa chỉ thành công",
  "data": { "addressID": 10, "city": "Ha Noi", ... }
}
```

#### Xóa địa chỉ

- Endpoint: `DELETE /users/addresses/:addressID`
- Mục đích: Xóa địa chỉ cũ không dùng nữa.
- Lưu ý: Backend nên kiểm tra xem địa chỉ này có đang gắn với đơn hàng nào đang xử lý (PENDING, PROCESSING) không trước khi cho xóa (hoặc chỉ soft-delete).
- Auth: Required
- Response:

```json
{ "message": "Đã xóa địa chỉ" }
```

#### Thiết lập địa chỉ mặc định

- Endpoint: `PATCH /users/addresses/:addressID/set-default`
- Mục đích: Chọn địa chỉ này làm địa chỉ giao hàng ưu tiên.
- Logic: Set `isDefault = true` cho ID này và false cho tất cả các địa chỉ còn lại của user đó.

### Products (MongoDB + Postgres Inventory)

Chức năng: Tìm kiếm nâng cao, Xem chi tiết, Quản lý kho

#### Tìm kiếm & Lọc sản phẩm (MongoDB)

Hỗ trợ tìm kiếm theo tên, categoryId, và attributes động (RAM, Color...)

- Endpoint: `GET /products`
- Query Params: `?keyword=macbook&categoryId=mongo_category_id&price_min=1000&attrs[ram]=16GB&page=1`
- Response:

```json
{
  "message": "Tìm thấy 10 sản phẩm",
  "data": [
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
  ]
}
```

#### Chi tiết sản phẩm (Hybrid: Mongo Info + Postgres Stock)

- Endpoint: `GET /products/:id`
- Response:

```json
{
  "message": "Lấy chi tiết sản phẩm thành công",
  "data": {
    "_id": "mongo_object_id",
    "name": "MacBook Pro M3",
    "description": "...",
    "attributes": { ... },
    "avg_rating": 4.8,
    "total_reviews": 150,
    "total_sold": 320,
    "inventory": [ // Dữ liệu từ Postgres bảng inventories
       { "sku": "M3-16-512", "stockQuantity": 50 },
       { "sku": "M3-32-1TB", "stockQuantity": 10 }
    ]
  }
}
```

#### Admin: Thêm sản phẩm (MongoDB)

- Endpoint: `POST /admin/products`
- Auth: Required (Role: ADMIN)
- Request Body:

```json
{
  "name": "Ao thun",
  "categoryId": "mongo_category_id",
  "base_price": 200,
  "attributes": { "size": "L", "material": "Cotton" }
}
```

- Response:

```json
{
  "message": "Tạo sản phẩm thành công",
  "data": { "_id": "new_mongo_id", ... }
}
```

#### Admin: Sửa sản phẩm (MongoDB)

- Endpoint: `PUT /admin/products/:id`
- Auth: Required (Role: ADMIN)
- Request Body:

```json
{
  "name": "Ao thun (Cập nhật)",
  "base_price": 250,
  "attributes": { "size": "XL", "material": "Cotton" }
}
```

- Response:
```json
{
  "message": "Cập nhật sản phẩm thành công",
  "data": { "_id": "mongo_id", "name": "Ao thun (Cập nhật)", ... }
}
```

#### Admin: Xoá sản phẩm (MongoDB)

- Endpoint: DELETE /admin/products/:id
- Auth: Required (Role: ADMIN)
- Mô tả: Hệ thống thực hiện xóa mềm (Soft Delete) bằng cách tự động cập nhật is_active = false. Dữ liệu không bị xóa cứng để đảm bảo toàn vẹn dữ liệu cho các hóa đơn (Order), chi tiết đơn hàng (Item) và lịch sử hoạt động (UserActivityLog) trong quá khứ.
- Response:
```json
{
  "message": "Xóa sản phẩm thành công (Đã ngừng bán)",
  "data": { "_id": "mongo_id", "isActive": false }
}
```

### Cart & Orders (PostgreSQL - Transaction)

Chức năng: Giỏ hàng, Tạo đơn, Xử lý kho, Lịch sử đơn hàng

#### Quản lý Giỏ hàng

Lưu ý: Có thể lưu ở Client hoặc DB. API này giả định lưu DB hoặc Session

- Endpoint: POST /cart/sync (Đồng bộ giỏ hàng local lên server)
- Auth: Required
- Request Body:

```json
{
  "items": [{ "productId": "mongo_id_1", "sku": "SKU_A", "quantity": 2 }]
}
```

- Response:

```json
{
  "message": "Đồng bộ giỏ hàng thành công",
  "data": { "cartTotal": 2, "items": [...] }
}
```

#### Tạo đơn hàng (Checkout - ACID Transaction)

Quan trọng: Đây là nơi thực hiện Transaction trừ kho và tạo đơn.

- Endpoint: `POST /orders`
- Auth: Required
- Request Body:

```json
{
  "shippingAddressId": 1,
  "paymentMethod": "COD", // COD (Thanh toán tiền mặt), BANKING (Chuyển khoản), E_WALLET (Ví điện tử).
  "items": [
    {
      "productId": "mongo_id_1", // Mapping ID Mongo
      "productName": "MacBook Pro", // Snapshot tên
      "sku": "M3-16-512",
      "quantity": 1,
      "unitPrice": 2000
    }
  ]
}
```

- Response:

```json
{
  "message": "Đặt hàng thành công",
  "data": {
    "orderID": 1001,
    "totalAmount": 2000,
    "status": "PENDING" // PENDING (Chờ xử lý), PROCESSING (Đang chuẩn bị hàng), SHIPPED (Đang giao), DELIVERED (Đã giao), CANCELLED (Đã hủy).
  }
}
```

#### Lịch sử đơn hàng

- Endpoint: `GET /orders`
- Auth: Required
- Response:

```json
{
  "message": "Danh sách đơn hàng",
  "data": [
    {
      "orderID": 1001,
      "status": "PENDING", // PENDING (Chờ xử lý), PROCESSING (Đang chuẩn bị hàng), SHIPPED (Đang giao), DELIVERED (Đã giao), CANCELLED (Đã hủy).
      "totalAmount": 2000,
      "createdAt": "..."
    }
  ]
}
```

#### Chi tiết đơn hàng

- Endpoint: `GET /orders/:orderId`
- Auth: Required
- Response:

```json
{
  "message": "Chi tiết đơn hàng",
  "data": {
    "orderID": 1001,
    "items": [
      { "productName": "MacBook Pro", "sku": "M3-16-512", "quantity": 1 }
    ],
    "payment": { "status": "PENDING", "method": "COD" }
    // PENDING (Chờ xử lý), PROCESSING (Đang chuẩn bị hàng), SHIPPED (Đang giao), DELIVERED (Đã giao), CANCELLED (Đã hủy).
    // COD (Thanh toán tiền mặt), BANKING (Chuyển khoản), E_WALLET (Ví điện tử).
  }
}
```

#### Admin: Cập nhật trạng thái đơn hàng
- Endpoint: `PUT /admin/orders/:orderId/status`
- Auth: Required (Role: ADMIN)
- Logic xử lý đặc biệt:
 - Hệ thống cập nhật trạng thái mới cho đơn hàng.
 - Computed Pattern (Quan trọng): Nếu status được chuyển sang DELIVERED (Đã giao), hệ thống sẽ trích xuất danh sách productId và quantity từ chi tiết đơn hàng (Items) hiện tại, sau đó thực hiện gọi sang MongoDB để cộng dồn số lượng quantity này vào trường total_sold của từng document Product tương ứng.

- Request Body:

```json
{
  "status": "DELIVERED" 
  // PENDING (Chờ xử lý), PROCESSING (Đang chuẩn bị hàng), SHIPPED (Đang giao), DELIVERED (Đã giao), CANCELLED (Đã hủy).
}
```
- Response:

```json
{
  "message": "Cập nhật trạng thái đơn hàng thành công",
  "data": {
    "orderID": 1001,
    "status": "DELIVERED",
    "updatedAt": "2026-03-09T10:00:00Z"
  }
}
```

### Payments (PostgreSQL)

Chức năng: Xử lý thanh toán

#### Thực hiện thanh toán (Mockup)

- Endpoint: `POST /payments/process`
- Request Body:

```json
{
  "orderID": 1001,
  "paymentMethod": "BANKING"
}
```

- Response:

```json
{
  "message": "Thanh toán thành công",
  "data": {
    "paymentID": 505,
    "status": "COMPLETED", // PENDING (Chờ thanh toán), COMPLETED (Đã thanh toán), FAILED (Thanh toán lỗi), REFUNDED (Đã hoàn tiền).
    "transactionDate": "..."
  }
}
```

### Reviews (MongoDB)

Chức năng: Đánh giá sản phẩm

#### Lấy danh sách Review

- Endpoint: `GET /products/:productId/reviews`
- Response:

```json
{
  "message": "Danh sách đánh giá",
  "data": [
    {
      "_id": "review_id_1",
      "user_name": "Nguyen Van A", // Snapshot từ lúc review
      "rating": 5,
      "comment": "Máy chạy nhanh",
      "images": ["url_img.jpg"]
    }
  ]
}
```

#### Gửi đánh giá mới

Logic: Check backend xem user đã mua hàng chưa (optional) rồi lưu vào Mongo. Sau khi lưu review thành công, hệ thống tính toán lại và cập nhật trường avg_rating và total_reviews trong document của Product tương ứng.

- Endpoint: `POST /products/:productId/reviews`
- Auth: Required
- Request Body:

```json
{
  "rating": 5,
  "comment": "Sản phẩm tốt",
  "images": []
}
```

- Response:

```json
{
  "message": "Gửi đánh giá thành công",
  "data": { "_id": "new_review_id" }
}
```

### System Logging (MongoDB)

Chức năng: Log hành vi người dùng

#### Ghi Log (User Tracking)

- Endpoint: `POST /logs`
- Request Body:

```json
{
  "action_type": "VIEW_PRODUCT", // hoặc SEARCH, ADD_TO_CART
  "target_id": "mongo_product_id",
  "metadata": {
    "search_keyword": "Laptop gaming",
    "device": "Mobile"
  }
}
```

- Response

```json
{
  "message": "Đã ghi log",
  "data": null
}
```

### Statistics (Postgres Aggregation)

Chức năng: Thống kê doanh thu

- Endpoint: `GET /admin/stats/revenue`
- Auth: Required (Role: ADMIN)
- Query Params: `?startDate=2026-01-01&endDate=2026-02-01&type=day` (theo ngày/tháng)
- Response:

```json
{
  "message": "Thống kê doanh thu",
  "data": [
    { "date": "2026-01-01", "totalRevenue": 50000000, "orderCount": 20 },
    { "date": "2026-01-02", "totalRevenue": 30000000, "orderCount": 15 }
  ]
}
```

### Categories (MongoDB)

Chức năng: Lấy danh sách Danh mục (Public)

- Endpoint: `GET /categories`
- Auth: No
- Query Params: `?isActive=true`
- Response:

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
          "options": ["8GB", "16GB"]
        }
      ]
    }
  ]
}
```

#### Admin: Tạo danh mục mới

- Endpoint: `POST /admin/categories`
- Auth: Required (Role: ADMIN)
- Request Body:

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

- Response:

```json
{
  "message": "Tạo danh mục thành công",
  "data": { "_id": "new_category_id" }
}
```


#### Admin: Cập nhật danh mục
- Endpoint: `PUT /admin/categories/:id`
- Auth: Required (Role: ADMIN)
- Request Body:

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

- Response:
```json
{
  "message": "Cập nhật danh mục thành công",
  "data": { "_id": "mongo_id", "name": "Laptop Gaming", "isActive": true }
}
```

#### Admin: Xóa danh mục (Soft Delete)
- Endpoint: DELETE /admin/categories/:id
- Auth: Required (Role: ADMIN)
- Mô tả: Hệ thống thực hiện xóa mềm (Soft Delete) bằng cách tự động cập nhật `isActive = false`. Dữ liệu vẫn tồn tại trong database để tránh ảnh hưởng đến các sản phẩm đang tham chiếu đến danh mục này.
- Response:
```json
{
  "message": "Xóa danh mục thành công (Đã ẩn)",
  "data": { "_id": "mongo_id", "isActive": false }
}
```


---

### Question:

- `isActive` của Category dùng để làm gì?
=> TL: isActive được sử dụng để quyết định xem danh mục đó có đang hoạt động và được phép hiển thị ra ngoài nền tảng cho người dùng hay không. Ngoài ra nếu Admin xoá 1 danh mục thì hệ thống cập nhật là isActive: false, phía người dùng API GET /categories sẽ mặc định truyền với tham số ?isActive=true để chỉ hiển thị các danh mục hoạt động

- Tại sao `POST /admin/categories` lại cần `_id: ObjectID('...')`?
=> TL: Do copy từ report ra mà quên xoá

- `addressID`, `orderID` là number hay string?
=> TL: Các ví dụ đưa ra với addressID và orderID trong file api.md đều ở dạng number nên dùng number

- Chưa có API "Admin sửa sản phầm" như mô tả
=> TL: Đã cập nhật

- Chưa có đầy đủ enum của order status, payment status và payment method
=> TL: Đã cập nhật

- Phần User ngoại trừ Get /users/profile thì các API khác không thấy Auth:Required?
=> TL: Đã cập nhật

- Có 1 hay nhiều tài khoản admin? Nếu có nhiều tài khoản admin thì Chi tiết sản phầm nên trả thêm `createdBy`
=> TL: Chỉ có 1 tài khoản admin

### Suggestion:

- Addess nên có thêm tên (`addressName`) để dễ quản lý. Ví dụ "Nhà", "Trường học", ... (Done)
- Cần thêm các API: (Done)
  - Admin sửa sản phẩm (`PUT /admin/products/:id`) (như mô tả)
  - Admin xóa sản phẩm (`DELETE /admin/products/:id`)
  - Admin sửa danh mục (`PUT /admin/categories/:id`)
  - Admin xóa danh mục (`DELETE /admin/categories/:id`)
- Chi tiết sản phẩm (`GET /product/:id`) nên có thêm:
  - `avg_rating`
  - `total_reviews`
  - Có thể có thêm `total_sold`
