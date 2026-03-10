-- ============================================================
-- PostgreSQL Migration Script for E-Commerce App
-- ============================================================

-- Enable UUID extension (optional, we use SERIAL for simplicity)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--  1. USERS
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(64) NOT NULL, -- SHA-256 hex
    full_name VARCHAR(100) NOT NULL,
    phone_num VARCHAR(20),
    avatar TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER', -- CUSTOMER | ADMIN
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

--  2. AUTH TOKENS (Refresh Token store)
CREATE TABLE IF NOT EXISTS auth_tokens (
    token_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE, -- the opaque refresh token string (JWT)
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ -- optional: set from refreshTokenExpiresIn
);

CREATE INDEX IF NOT EXISTS idx_auth_tokens_token ON auth_tokens (token);

CREATE INDEX IF NOT EXISTS idx_auth_tokens_user_id ON auth_tokens (user_id);

--  3. ADDRESSES
CREATE TABLE IF NOT EXISTS addresses (
    address_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    address_line VARCHAR(255) NOT NULL,
    address_name VARCHAR(100) DEFAULT 'Home', -- "Home", "Work", etc.
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses (user_id);

--  4. INVENTORIES (Managed by DB person, read/write by BE1 & BE2)
CREATE TABLE IF NOT EXISTS inventories (
    inventory_id SERIAL PRIMARY KEY,
    mongo_product_id VARCHAR(24) NOT NULL, -- MongoDB ObjectId string
    sku VARCHAR(100) NOT NULL UNIQUE,
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventories_mongo_product_id ON inventories (mongo_product_id);

CREATE INDEX IF NOT EXISTS idx_inventories_sku ON inventories (sku);

--  5. ORDERS
CREATE TABLE IF NOT EXISTS orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users (user_id),
    shipping_address_id INT NOT NULL REFERENCES addresses (address_id),
    total_amount NUMERIC(15, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    -- PENDING | PROCESSING | SHIPPED | DELIVERED | CANCELLED
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);

--  6. ORDER ITEMS (snapshot of product at purchase time)
CREATE TABLE IF NOT EXISTS order_items (
    item_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders (order_id) ON DELETE CASCADE,
    product_id VARCHAR(24) NOT NULL, -- Mongo ObjectId snapshot
    product_name VARCHAR(255) NOT NULL, -- snapshot name
    sku VARCHAR(100) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(15, 2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id);

CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items (product_id);

--  7. PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
    payment_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL UNIQUE REFERENCES orders (order_id),
    method VARCHAR(20) NOT NULL, -- COD | BANKING | E_WALLET
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    -- PENDING | COMPLETED | FAILED | REFUNDED
    transaction_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments (order_id);

--  Seed: Default Admin Account
-- Password: Admin@123  (sha256('Admin@123' + 'your-password-secret-key'))
-- You MUST update this hash if you change PASSWORD_SECRET in .env
-- INSERT INTO users (email, password_hash, full_name, role)
-- VALUES ('admin@ecommerce.com', '<hash>', 'System Admin', 'ADMIN')
-- ON CONFLICT (email) DO NOTHING;