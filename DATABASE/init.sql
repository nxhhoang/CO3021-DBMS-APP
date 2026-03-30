-- ============================================================
-- PostgreSQL Migration Script for E-Commerce App
-- ============================================================

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

CREATE TABLE IF NOT EXISTS auth_tokens (
    token_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE, 
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ 
);

CREATE INDEX IF NOT EXISTS idx_auth_tokens_token ON auth_tokens (token);
CREATE INDEX IF NOT EXISTS idx_auth_tokens_user_id ON auth_tokens (user_id);

CREATE TABLE IF NOT EXISTS addresses (
    address_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    address_line VARCHAR(255) NOT NULL,
    address_name VARCHAR(100) DEFAULT 'Home', 
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses (user_id);

CREATE TABLE IF NOT EXISTS inventories (
    inventory_id SERIAL PRIMARY KEY,
    product_id VARCHAR(24) NOT NULL, 
    sku VARCHAR(100) NOT NULL UNIQUE,
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventories_product_id ON inventories (product_id);
CREATE INDEX IF NOT EXISTS idx_inventories_sku ON inventories (sku);

CREATE TABLE IF NOT EXISTS orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users (user_id),
    shipping_address_id INT NOT NULL REFERENCES addresses (address_id),
    total_amount NUMERIC(15, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);

CREATE TABLE IF NOT EXISTS order_items (
    item_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders (order_id) ON DELETE CASCADE,
    product_id VARCHAR(24) NOT NULL, 
    product_name VARCHAR(255) NOT NULL, 
    sku VARCHAR(100) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(15, 2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items (product_id);

CREATE TABLE IF NOT EXISTS payments (
    payment_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL UNIQUE REFERENCES orders (order_id),
    method VARCHAR(20) NOT NULL, 
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    transaction_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments (order_id);


-- ============================================================
-- Seed Data for E-Commerce App
-- ============================================================

INSERT INTO users (email, password_hash, full_name, phone_num, role)
VALUES 
    ('admin@example.com', '4adcf52803a61ec95f0d3d4f414881ad3a290ea65aa528b07ffe2d23716fd500', 'System Admin', '0900000000', 'ADMIN'),
    ('alice@example.com', 'e81fe87172c66edab9903f4931664e5c4993bbd2d2e6285c70ae0cbaa0cf7d5e', 'Nguyen Thi Alice', '0912345678', 'CUSTOMER'),
    ('bob@example.com', '67e84c9997f615602f975ea6cf353b03208511c40b4b3b1d39fe939c381550bd', 'Tran Van Bob', '0987654321', 'CUSTOMER')
ON CONFLICT (email) DO NOTHING;


-- Address for user=2 and user=3 (Assuming ID starts from 1 but safely we can just insert)
-- To make this idempotent for addresses, we can just TRUNCATE or carefully insert.
-- We will just insert exactly as provided by user.
INSERT INTO addresses (user_id, address_line, address_name, city, district, is_default)
VALUES 
    (2, '123 Le Loi', 'Home', 'Ho Chi Minh', 'Quan 1', true),
    (2, '456 Nguyen Hue', 'Office', 'Ho Chi Minh', 'Quan 1', false),
    (3, '789 Tran Hung Dao', 'Home', 'Ho Chi Minh', 'Quan 5', true)
ON CONFLICT DO NOTHING; -- Addresses doesn't have unique constraint but we proceed.


INSERT INTO inventories (product_id, sku, stock_quantity)
VALUES
    ('507f1f77bcf86cd799439011', 'MACBOOK-M3-16-512', 10),
    ('507f1f77bcf86cd799439011', 'MACBOOK-M3-32-1TB', 5),
    ('507f1f77bcf86cd799439012', 'IP15-PINK-128', 20),
    ('507f1f77bcf86cd799439012', 'IP15-BLACK-256', 15),
    ('507f1f77bcf86cd799439013', 'S24-PURPLE-256', 8),
    ('507f1f77bcf86cd799439014', 'AIRPODS-PRO2', 30),
    ('507f1f77bcf86cd799439015', 'LAST-ITEM-SKU', 1)
ON CONFLICT (sku) DO UPDATE SET stock_quantity = EXCLUDED.stock_quantity;


INSERT INTO orders (user_id, shipping_address_id, total_amount, status, created_at)
VALUES 
    (2, 1, 2000.00, 'DELIVERED', NOW() - INTERVAL '10 days'),
    (2, 1, 300.00, 'PROCESSING', NOW() - INTERVAL '3 days'),
    (3, 3, 500.00, 'PENDING', NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;


INSERT INTO order_items (order_id, product_id, product_name, sku, quantity, unit_price)
VALUES 
    (1, '507f1f77bcf86cd799439011', 'MacBook Pro M3 (16GB/512GB)', 'MACBOOK-M3-16-512', 1, 1800.00),
    (1, '507f1f77bcf86cd799439014', 'AirPods Pro 2', 'AIRPODS-PRO2', 1, 200.00),
    (2, '507f1f77bcf86cd799439012', 'iPhone 15 Pink 128GB', 'IP15-PINK-128', 1, 300.00),
    (3, '507f1f77bcf86cd799439013', 'Samsung Galaxy S24 Purple', 'S24-PURPLE-256', 1, 500.00)
ON CONFLICT DO NOTHING;


INSERT INTO payments (order_id, method, status, transaction_date)
VALUES 
    (1, 'BANKING', 'COMPLETED', NOW() - INTERVAL '10 days'),
    (2, 'COD', 'COMPLETED', NOW() - INTERVAL '3 days'),
    (3, 'COD', 'PENDING', NULL)
ON CONFLICT (order_id) DO NOTHING;
