# BE1 — Source Code Documentation

> **Role**: BE 1 (PostgreSQL) — Authentication & Authorization, User & Address, Orders & Payments, Statistics

---

### Enums

| Enum            | Values                                                       |
| --------------- | ------------------------------------------------------------ |
| `UserRole`      | `CUSTOMER`, `ADMIN`                                          |
| `OrderStatus`   | `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED` |
| `PaymentStatus` | `PENDING`, `COMPLETED`, `FAILED`, `REFUNDED`                 |
| `PaymentMethod` | `COD`, `BANKING`, `E_WALLET`                                 |

---

## API Reference

All routes are prefixed with `/api/v1`. Use `Authorization: Bearer <access_token>` where required.

### Authentication (`/auth`)

| Method | Path                  | Body                                      | Auth   |
| ------ | --------------------- | ----------------------------------------- | ------ |
| POST   | `/auth/register`      | `{ email, password, fullName, phoneNum }` | None   |
| POST   | `/auth/login`         | `{ email, password, userAgent? }`         | None   |
| POST   | `/auth/refresh-token` | `{ refreshToken }`                        | None   |
| POST   | `/auth/logout`        | `{ refreshToken }`                        | Bearer |

### Users & Address (`/users`)

| Method | Path                                      | Body                                                        | Auth   |
| ------ | ----------------------------------------- | ----------------------------------------------------------- | ------ |
| GET    | `/users/profile`                          | —                                                           | Bearer |
| PUT    | `/users/profile`                          | `{ fullName?, phoneNum?, avatar? }`                         | Bearer |
| GET    | `/users/addresses`                        | —                                                           | Bearer |
| POST   | `/users/addresses`                        | `{ addressLine, addressName?, city, district, isDefault? }` | Bearer |
| PUT    | `/users/addresses/:addressID`             | same optional fields                                        | Bearer |
| DELETE | `/users/addresses/:addressID`             | —                                                           | Bearer |
| PATCH  | `/users/addresses/:addressID/set-default` | —                                                           | Bearer |

### Orders (`/orders`)

| Method | Path               | Body                                            | Auth   |
| ------ | ------------------ | ----------------------------------------------- | ------ |
| POST   | `/orders`          | `{ shippingAddressId, paymentMethod, items[] }` | Bearer |
| GET    | `/orders`          | —                                               | Bearer |
| GET    | `/orders/:orderId` | —                                               | Bearer |

**Checkout `items[]` format:**

```json
[
  {
    "productId": "mongo_object_id",
    "productName": "MacBook Pro M3",
    "sku": "M3-16-512",
    "quantity": 1,
    "unitPrice": 2000
  }
]
```

### Payments (`/payments`)

| Method | Path                | Body                         | Auth   |
| ------ | ------------------- | ---------------------------- | ------ |
| POST   | `/payments/process` | `{ orderID, paymentMethod }` | Bearer |

### Admin Routes (`/admin`) — Role: ADMIN required

| Method | Path                            | Body                                                       |
| ------ | ------------------------------- | ---------------------------------------------------------- |
| PUT    | `/admin/orders/:orderId/status` | `{ status: "DELIVERED" }`                                  |
| GET    | `/admin/stats/revenue`          | Query: `?startDate=2026-01-01&endDate=2026-01-31&type=day` |

---

## Testing Guide

### 1. Setup

**Step 1 — Install dependencies**

```bash
cd BACKEND
npm install
```

**Step 2 — Create the PostgreSQL database**

```bash
psql -U postgres -c "CREATE DATABASE ecommerce_db;"
psql -U postgres -d ecommerce_db -f ../DATABASE/migration.sql
```

**Step 3 — Configure `.env`**

```env
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=your_password
PG_DATABASE=ecommerce_db

JWT_SECRET_ACCESS_TOKEN=any-secret-string
JWT_SECRET_REFRESH_TOKEN=another-secret-string
PASSWORD_SECRET=password-pepper-string
ACCESS_TOKEN_EXPIRES_IN=1d
REFRESH_TOKEN_EXPIRES_IN=7d
```

**Step 4 — Seed test inventory** (run in psql)

```sql
-- Add a product entry in inventories
INSERT INTO inventories (mongo_product_id, sku, stock_quantity)
VALUES ('507f1f77bcf86cd799439011', 'SKU-TEST-001', 5);
```

**Step 5 — Start the server**

```bash
npm run dev
```

Open Swagger UI: [http://localhost:4000/api-docs](http://localhost:4000/api-docs)

---

### 2. Test Scenarios (matching TEST_PLAN.md)

#### Scenario 1: Register & Login

```bash
# Register
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123","fullName":"Nguyen Van A","phoneNum":"0909123456"}'

# Login → save accessToken and refreshToken
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123"}'
```

#### Scenario 2: Refresh Token

```bash
curl -X POST http://localhost:4000/api/v1/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refreshToken_from_login>"}'
```

#### Scenario 3: Add Address with isDefault

```bash
curl -X POST http://localhost:4000/api/v1/users/addresses \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"addressLine":"123 Le Loi","addressName":"Home","city":"HCM","district":"Quan 1","isDefault":true}'

# Verify: only one address is default
curl http://localhost:4000/api/v1/users/addresses \
  -H "Authorization: Bearer <accessToken>"
```

#### Scenario 7: Concurrency / Out-of-Stock Test

```sql
-- Set stock to 1 in psql
UPDATE inventories SET stock_quantity = 1 WHERE sku = 'SKU-TEST-001';
```

Send two simultaneous checkout requests:

```bash
# Terminal 1 & 2 at the same time:
curl -X POST http://localhost:4000/api/v1/orders \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "shippingAddressId": 1,
    "paymentMethod": "COD",
    "items": [{"productId":"507f1f77bcf86cd799439011","productName":"Test","sku":"SKU-TEST-001","quantity":1,"unitPrice":100}]
  }'
```

**Expected**: One request returns `201 { status: "PENDING" }`, the other returns `409 { message: "OUT_OF_STOCK", sku: "SKU-TEST-001" }`.

#### Scenario 8: Payment

```bash
curl -X POST http://localhost:4000/api/v1/payments/process \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"orderID": 1, "paymentMethod": "BANKING"}'
```

#### Scenario 12: Revenue Stats (Admin token needed)
> logout from current account.
> The admin account is already created by `seed.sql`. Its password is **hashed the same way as the API does**, so you can log in normally.

```bash
# Logout
curl -X POST http://localhost:4000/api/v1/auth/logout \     
  -H "Authorization: Bearer <accessToken>" \  
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refreshToken>"}'
```

```bash
# Step 1 — Login as admin (credentials from seed.sql)
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin-email","password":"admin-password"}' ################ contact BE1
# save the accessToken from the response

# Step 2 — Call the stats API with that token
curl "http://localhost:4000/api/v1/admin/stats/revenue?startDate=2026-01-01&endDate=2026-12-31&type=day" \
  -H "Authorization: Bearer <admin_accessToken>"
```

---

## For BE2 — Inventory Helper

use `getStockByMongoId` from `~/utils/inventory.helper` to fetch inventory data for the **Hybrid Product Detail API** (`GET /products/:id`):

```typescript
import { getStockByMongoId } from '~/utils/inventory.helper'

// Inside BE2's product detail handler:
const mongoData = await mongoDb.collection('Products').findOne({ _id: new ObjectId(id) })
const inventory = await getStockByMongoId(id) // calls PostgreSQL

return {
  ...mongoData,
  inventory // [{ sku: 'M3-16-512', stockQuantity: 50 }, ...]
}
```

The function runs this SQL:

```sql
SELECT sku, stock_quantity AS "stockQuantity"
FROM inventories
WHERE mongo_product_id = $1
```
