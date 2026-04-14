# BE1 (Authentication & Authorization, User & Address, Orders & Payments and Statistics) — Logic Flow Documentation

> **Base URL**: `/api/v1`

---

## 1. Authentication

### 1.1 `register`

**Route**: `POST /auth/register`

```
Client
  │
  ├─ [Validator] registerValidator
  │     ├─ email: valid format
  │     ├─ password: min 6 chars, must have upper/lower/number/symbol
  │     ├─ fullName: non-empty string
  │     └─ phoneNum: 9–15 digits
  │
  └─ [Service] authService.register(payload)
        │
        ├─ 1. SELECT users WHERE email = $1
        │       └─ if found → throw 400 EMAIL_ALREADY_EXISTS
        │
        ├─ 2. hashedPassword = SHA-256(password + PASSWORD_SECRET)
        │
        ├─ 3. INSERT INTO users (email, password_hash, full_name, phone_num, role='CUSTOMER')
        │       RETURNING user_id, email
        │
        └─ 4. Return { user_id, email }
              → Response 201
```

---

### 1.2 `login`

**Route**: `POST /auth/login`

```
Client
  │
  ├─ [Validator] loginValidator
  │     ├─ email: valid format
  │     └─ password: non-empty
  │
  └─ [Service] authService.login(payload)
        │
        ├─ 1. hashedPassword = SHA-256(password + PASSWORD_SECRET)
        │
        ├─ 2. SELECT user_id, email, role FROM users
        │       WHERE email = $1 AND password_hash = $2
        │       └─ if not found → throw 401 EMAIL_OR_PASSWORD_IS_INCORRECT
        │
        ├─ 3. signAccessToken(user_id, role)
        │       └─ JWT payload: { user_id, role, token_type: AccessToken }
        │          expires in: ACCESS_TOKEN_EXPIRES_IN
        │
        ├─ 4. signRefreshToken(user_id, role)
        │       └─ JWT payload: { user_id, role, token_type: RefreshToken }
        │          expires in: REFRESH_TOKEN_EXPIRES_IN
        │
        ├─ 5. INSERT INTO auth_tokens (user_id, token, user_agent)
        │
        └─ 6. Return { accessToken, refreshToken, user: { userId, role } }
              → Response 200
```

---

### 1.3 `refreshToken`

**Route**: `POST /auth/refresh-token`

```
Client
  │
  ├─ [Validator] refreshTokenValidator
  │     └─ refreshToken: non-empty
  │
  └─ [Service] authService.refreshToken(oldRefreshToken)
        │
        ├─ 1. verifyToken(oldRefreshToken, JWT_SECRET_REFRESH_TOKEN)
        │       └─ invalid/expired → throw 401 REFRESH_TOKEN_IS_INVALID
        │
        ├─ 2. SELECT token_id FROM auth_tokens WHERE token = $1
        │       └─ not found (already used/revoked) → throw 401
        │
        ├─ 3. BEGIN transaction
        │       │
        │       ├─ DELETE FROM auth_tokens WHERE token = oldRefreshToken
        │       ├─ signTokenPair(user_id, role) → new accessToken + refreshToken
        │       └─ INSERT INTO auth_tokens (user_id, newRefreshToken)
        │
        ├─ 4. COMMIT
        │
        └─ 5. Return { accessToken, refreshToken }
              → Response 200
```

> **Why a transaction?** Ensures the old token is atomically deleted and the new one inserted — prevents replay attacks if the network fails mid-rotation.

---

### 1.4 `logout`

**Route**: `POST /auth/logout`

```
Client
  │
  ├─ [Middleware] accessTokenValidator
  │     └─ reads Authorization header, verifies JWT
  │
  ├─ [Validator] refreshTokenValidator
  │     └─ refreshToken: non-empty
  │
  └─ [Service] authService.logout(refreshToken)
        │
        └─ DELETE FROM auth_tokens WHERE token = $1
              → Response 200 (even if token was already gone)
```

---

## 2. User Profile

### 2.1 `getProfile`

**Route**: `GET /users/profile` **Auth**: Bearer

```
[Middleware] accessTokenValidator → req.decoded_authorization = { user_id, role }
  │
  └─ [Service] userService.getProfile(user_id)
        │
        ├─ SELECT user_id, full_name, email, phone_num, avatar, role
        │   FROM users WHERE user_id = $1
        │     └─ not found → throw 404 USER_NOT_FOUND
        │
        └─ Return user object → Response 200
```

---

### 2.2 `updateProfile`

**Route**: `PUT /users/profile` **Auth**: Bearer

```
[Middleware] accessTokenValidator
  │
  ├─ [Validator] updateProfileValidator
  │     └─ all fields optional: fullName (string), phoneNum (9-15 digits), avatar (string)
  │
  └─ [Service] userService.updateProfile(user_id, payload)
        │
        ├─ Build dynamic SET clause from provided fields only
        │   e.g. fullName → full_name = $1, phoneNum → phone_num = $2
        │
        ├─ If no fields provided → return current profile (no DB write)
        │
        └─ UPDATE users SET <fields>, updated_at = NOW()
              WHERE user_id = $n
              RETURNING user_id, full_name
              → Response 200
```

---

## 3. Address Management

### 3.1 `getAddresses`

**Route**: `GET /users/addresses` **Auth**: Bearer

```
[Middleware] accessTokenValidator
  │
  └─ SELECT address_id, address_line, address_name, city, district, is_default
       FROM addresses WHERE user_id = $1
       ORDER BY is_default DESC, address_id ASC
       → Response 200 (array, default address is always first)
```

---

### 3.2 `createAddress`

**Route**: `POST /users/addresses` **Auth**: Bearer

```
[Validator] createAddressValidator
  │  addressLine: required | city: required | district: required
  │  addressName: optional | isDefault: optional boolean
  │
  └─ [Service] userService.createAddress(user_id, payload)
        │
        ├─ BEGIN transaction
        │
        ├─ if isDefault === true:
        │     UPDATE addresses SET is_default = false WHERE user_id = $1
        │
        ├─ INSERT INTO addresses (user_id, address_line, address_name, city, district, is_default)
        │     RETURNING address_id, address_line
        │
        └─ COMMIT → Response 201
```

> **Invariant**: At most one address per user has `is_default = true` at any time.

---

### 3.3 `updateAddress`

**Route**: `PUT /users/addresses/:addressID` **Auth**: Bearer

```
[Validator] updateAddressValidator (all fields optional)
  │
  └─ [Service] userService.updateAddress(addressId, user_id, payload)
        │
        ├─ SELECT address_id WHERE address_id = $1 AND user_id = $2
        │     └─ not found / not owner → throw 404 ADDRESS_NOT_FOUND
        │
        ├─ BEGIN transaction
        │
        ├─ if payload.isDefault === true:
        │     UPDATE addresses SET is_default = false WHERE user_id = $1
        │
        ├─ Build dynamic SET clause from non-undefined fields
        │
        ├─ UPDATE addresses SET <fields> WHERE address_id = $n
        │     RETURNING address_id, city, district
        │
        └─ COMMIT → Response 200
```

---

### 3.4 `deleteAddress`

**Route**: `DELETE /users/addresses/:addressID` **Auth**: Bearer

```
[Service] userService.deleteAddress(addressId, user_id)
  │
  ├─ SELECT address_id WHERE address_id = $1 AND user_id = $2
  │     └─ not found → throw 404 ADDRESS_NOT_FOUND
  │
  └─ DELETE FROM addresses WHERE address_id = $1
        → Response 200
```

---

### 3.5 `setDefaultAddress`

**Route**: `PATCH /users/addresses/:addressID/set-default` **Auth**: Bearer

```
[Service] userService.setDefaultAddress(addressId, user_id)
  │
  ├─ SELECT address_id WHERE address_id = $1 AND user_id = $2
  │     └─ not found → throw 404 ADDRESS_NOT_FOUND
  │
  ├─ BEGIN transaction
  │     ├─ UPDATE addresses SET is_default = false WHERE user_id = $1
  │     └─ UPDATE addresses SET is_default = true  WHERE address_id = $1
  └─ COMMIT → Response 200
```

---

## 4. Orders

### 4.1 `checkout` — ACID Transaction

**Route**: `POST /orders` **Auth**: Bearer

```
[Validator] checkoutValidator
  │  shippingAddressId: positive integer (required)
  │  paymentMethod: one of COD | BANKING | E_WALLET (required)
  │  items[]: non-empty array (required)
  │    items[*].productId, productName, sku: non-empty strings
  │    items[*].quantity: integer >= 1
  │    items[*].unitPrice: float >= 0
  │
  └─ [Service] orderService.checkout(user_id, payload)
        │
        ├─ Validate paymentMethod against enum values
        │
        ├─ BEGIN transaction (getClient())
        │
        ├─ For each item in items[]:
        │     │
        │     ├─ SELECT stock_quantity FROM inventories
        │     │     WHERE sku = $1 FOR UPDATE          ← row-level lock (blocks other transactions)
        │     │
        │     ├─ if sku not found OR stock_quantity < quantity:
        │     │     ROLLBACK
        │     │     throw 409 OutOfStockError { sku, productId }
        │     │
        │     ├─ UPDATE inventories
        │     │     SET stock_quantity = stock_quantity - quantity
        │     │     WHERE sku = $1
        │     │
        │     └─ totalAmount += unitPrice * quantity
        │
        ├─ INSERT INTO orders (user_id, shipping_address_id, total_amount, status='PENDING')
        │     RETURNING order_id
        │
        ├─ For each item: INSERT INTO order_items (order_id, product_id, product_name, sku, qty, price)
        │
        ├─ INSERT INTO payments (order_id, method, status='PENDING')
        │
        ├─ COMMIT
        │
        └─ Return { orderID, totalAmount, status: 'PENDING' } → Response 201

  Error path (409):
  └─ { message: "OUT_OF_STOCK", sku: "...", productId: "..." }
```

> **Concurrency guarantee**: `SELECT ... FOR UPDATE` locks the inventory row for the duration of the transaction. A second concurrent request on the same SKU blocks until the first commits or rolls back — preventing overselling.

---

### 4.2 `getOrders`

**Route**: `GET /orders` **Auth**: Bearer

```
SELECT order_id, status, total_amount, created_at
FROM orders
WHERE user_id = $1
ORDER BY created_at DESC
→ Response 200 (array)
```

---

### 4.3 `getOrderById`

**Route**: `GET /orders/:orderId` **Auth**: Bearer

```
├─ SELECT order FROM orders WHERE order_id = $1 AND user_id = $2
│     └─ not found / wrong owner → throw 404 ORDER_NOT_FOUND
│
├─ SELECT items FROM order_items WHERE order_id = $1
│
├─ SELECT payment FROM payments WHERE order_id = $1 LIMIT 1
│
└─ Return { ...order, items[], payment } → Response 200
```

---

### 4.4 `updateOrderStatus` — Admin

**Route**: `PUT /admin/orders/:orderId/status` **Auth**: Bearer + ADMIN role

```
[Middleware] accessTokenValidator → verifyRoleMiddleware(ADMIN)
  │     └─ role !== ADMIN → throw 403
  │
  ├─ [Validator] updateOrderStatusValidator
  │     └─ status: one of PENDING | PROCESSING | SHIPPED | DELIVERED | CANCELLED
  │
  └─ [Service] orderService.updateOrderStatus(orderId, newStatus)
        │
        ├─ UPDATE orders SET status = $1, updated_at = NOW()
        │     WHERE order_id = $2
        │     RETURNING order_id, status, updated_at
        │     └─ not found → throw 404 ORDER_NOT_FOUND
        │
        ├─ if newStatus === 'DELIVERED':
        │     (TODO) call BE2's updateTotalSold(productId, quantity)
        │
        └─ Return updated order → Response 200
```

---

## 5. Payments

### 5.1 `processPayment`

**Route**: `POST /payments/process` **Auth**: Bearer

```
[Service] paymentService.processPayment(orderID, paymentMethod)
  │
  ├─ SELECT order_id FROM orders
  │     WHERE order_id = $1 AND status = 'PENDING'
  │     └─ not found → throw 400 ORDER_ALREADY_PAID
  │
  ├─ UPDATE payments
  │     SET status = 'COMPLETED', method = $1, transaction_date = NOW()
  │     WHERE order_id = $2
  │     RETURNING payment_id, status, transaction_date
  │     └─ not found → throw 404 PAYMENT_NOT_FOUND
  │
  ├─ UPDATE orders SET status = 'PROCESSING', updated_at = NOW()
  │     WHERE order_id = $1
  │
  └─ Return { paymentID, status: 'COMPLETED', transactionDate } → Response 200
```

---

## 6. Statistics — Admin

### 6.1 `getRevenueStats`

**Route**: `GET /admin/stats/revenue?startDate=&endDate=&type=` **Auth**: Bearer + ADMIN role

**Query params**:

- `startDate` — ISO date string e.g. `2026-01-01`
- `endDate` — ISO date string e.g. `2026-01-31`
- `type` — `day` (default) or `month`

```
[Middleware] accessTokenValidator → verifyRoleMiddleware(ADMIN)
  │
  └─ [Service] statService.getRevenueStats({ startDate, endDate, type })
        │
        ├─ if type === 'month': truncUnit = 'month', dateFormat = 'YYYY-MM'
        │  else:                truncUnit = 'day',   dateFormat = 'YYYY-MM-DD'
        │
        └─ SQL:
              SELECT
                TO_CHAR(DATE_TRUNC(truncUnit, created_at), dateFormat) AS date,
                SUM(total_amount)::BIGINT AS "totalRevenue",
                COUNT(*)::INT            AS "orderCount"
              FROM orders
              WHERE status = 'DELIVERED'
                AND created_at >= startDate::TIMESTAMPTZ
                AND created_at <= endDate::TIMESTAMPTZ + INTERVAL '1 day'
              GROUP BY DATE_TRUNC(truncUnit, created_at)
              ORDER BY DATE_TRUNC(truncUnit, created_at) ASC

        Return: [{ date, totalRevenue, orderCount }, ...] → Response 200
```

**Example response** (type=day):

```json
[
  { "date": "2026-03-01", "totalRevenue": 5200, "orderCount": 3 },
  { "date": "2026-03-02", "totalRevenue": 1800, "orderCount": 1 }
]
```

---

## 7. Categories

### 7.1 `getCategories`
**Route**: `GET /categories` (Public)

```
Client
  │
  └─ [Service] categoryService.getCategories(query)
        │
        └─ MongoDB: categories.find({ isActive: true })
              → Response 200 (Array)
```

### 7.2 `createCategory` (Admin)
**Route**: `POST /admin/categories` **Auth**: Admin

```
Client
  │
  ├─ [Middleware] accessTokenValidator + verifyRole(ADMIN)
  │
  ├─ [Validator] categoryValidator
  │     ├─ name, slug: required
  │     └─ dynamicAttributes: valid schema array
  │
  └─ [Service] categoryService.createCategory(payload)
        │
        └─ MongoDB: categories.insertOne({ ...payload, isActive: true })
              → Response 201
```

---

## 8. Products & Discovery (Hybrid)

### 8.1 `getProducts`
**Route**: `GET /products` (Public)

```
Client
  │
  ├─ [Validator] pagination & filter validator
  │
  └─ [Service] productService.getProducts(filters)
        │
        ├─ 1. Build MongoDB query (category, keyword, price range)
        ├─ 2. If attrs[key] provided → add to nested query
        └─ 3. MongoDB: products.find(query).sort(sort).limit(limit)
              → Response 200
```

### 8.2 `getProductById`
**Route**: `GET /products/:id` (Public)

```
Client
  │
  └─ [Service] productService.getProductById(productId)
        │
        ├─ 1. MongoDB: products.findOne({ _id: productId })
        │       └─ if not found → throw 404
        │
        ├─ 2. PostgreSQL: SELECT sku, stock_quantity, sku_price 
        │       FROM inventories WHERE product_id = $1
        │
        └─ 3. Merge Mongo metadata + Postgres stock array
              → Response 200
```

---

## 9. Inventory Management

### 9.1 `createInventory` (Admin)
**Route**: `POST /admin/inventories` **Auth**: Admin

```
Admin
  │
  ├─ [Validator] inventoryValidator (productId, sku, stock)
  │
  └─ [Service] inventoryService.createInventory(payload)
        │
        └─ PostgreSQL: INSERT INTO inventories (product_id, sku, stock_quantity)
              → Response 200/201
```

---

## 10. Reviews & Ratings

### 10.1 `createReview`
**Route**: `POST /products/:id/reviews` **Auth**: Bearer

```
Client
  │
  ├─ [Validator] reviewValidator (rating 1-5, comment)
  │
  └─ [Service] reviewService.createReview(user_id, productId, payload)
        │
        ├─ 1. [Invariant Check] Verified Purchase
        │     PostgreSQL: SELECT order_id FROM orders 
        │     JOIN order_items ON ...
        │     WHERE user_id = $1 AND product_id = $2 AND status = 'DELIVERED'
        │       └─ if none → throw 403 (Must buy to review)
        │
        ├─ 2. MongoDB: reviews.insertOne({ user_id, product_id, ... })
        │
        └─ 3. [Computed Pattern] Sync Average Rating
              MongoDB: products.updateOne({ _id: productId }, {
                $set: { avgRating: newAvg, totalReviews: newTotal }
              })
              → Response 201
```

---

## 11. System Logging (Event Sourcing Light)

### 11.1 `createLog`
**Route**: `POST /logs` (Public/Fire-and-forget)

```
Browser/App
  │
  └─ [Service] logService.createLog(payload)
        │
        └─ PostgreSQL: INSERT INTO user_activity_logs (user_id?, action_type, target_id, metadata)
              → Response 200
```

---

## Testing & Verification

A comprehensive test suite is provided to verify the hybrid architecture and ACID transactions.

### 1. Ensure Environment
- PostgreSQL and MongoDB are running.
- `.env` is configured (Secrets must match `init.sql`).
- Admin seeded: `npx tsx src/scripts/seedAdmin.ts`.

### 2. Run All Tests
```bash
cd backend
node run_be_all_tests.js
```

**Coverage**:
- **Auth**: Rotation, Logout revocation.
- **Transactions**: Stock locking (`FOR UPDATE`) during concurrent checkout.
- **Hybrid Sync**: MongoDB update-sold and update-rating triggers.
- **Validation**: Schema-less attribute filtering in Mongo.

---

## Request/Response Conventions

| Case                             | HTTP Status | Response shape                          |
| -------------------------------- | ----------- | --------------------------------------- |
| Success                          | 200 / 201   | `{ message, data }` (or `{ result }`)   |
| Validation error                 | 422         | `{ message, errors: { field: { msg } } }`|
| Unauthorized (no/bad token)      | 401         | `{ message }`                           |
| Forbidden (Verified Purchase)    | 403         | `{ message }`                           |
| Not found                        | 404         | `{ message }`                           |
| Business conflict (out of stock) | 409         | `{ message, sku, productId }`           |

---

## Middleware Execution Order

```
Request
  → rateLimit (Global/Scoped)
  → accessTokenValidator (verify JWT)
  → [verifyRoleMiddleware(ADMIN)]
  → [Validator] (express-validator)
  → wrapRequestHandler(controller)
  → defaultErrorHandler
```

