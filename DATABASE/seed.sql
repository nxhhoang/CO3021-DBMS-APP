-- ============================================================
-- Seed Data for E-Commerce App (Testing Purposes)
-- Passwords are SHA-256(plain_password + 'your-password-secret-key')
--
-- Account credentials:
--   admin@example.com   / Admin@123
--   alice@example.com   / Test@123
--   bob@example.com     / Customer@1
-- ============================================================

--  1. USERS
INSERT INTO
    users (
        email,
        password_hash,
        full_name,
        phone_num,
        role
    )
VALUES (
        'admin@example.com',
        '4adcf52803a61ec95f0d3d4f414881ad3a290ea65aa528b07ffe2d23716fd500',
        'System Admin',
        '0900000000',
        'ADMIN'
    ),
    (
        'alice@example.com',
        'e81fe87172c66edab9903f4931664e5c4993bbd2d2e6285c70ae0cbaa0cf7d5e',
        'Nguyen Thi Alice',
        '0912345678',
        'CUSTOMER'
    ),
    (
        'bob@example.com',
        '67e84c9997f615602f975ea6cf353b03208511c40b4b3b1d39fe939c381550bd',
        'Tran Van Bob',
        '0987654321',
        'CUSTOMER'
    )
ON CONFLICT (email) DO NOTHING;

--  2. ADDRESSES
-- Alice's addresses (user_id = 2)
INSERT INTO
    addresses (
        user_id,
        address_line,
        address_name,
        city,
        district,
        is_default
    )
VALUES (
        2,
        '123 Le Loi',
        'Home',
        'Ho Chi Minh',
        'Quan 1',
        true
    ),
    (
        2,
        '456 Nguyen Hue',
        'Office',
        'Ho Chi Minh',
        'Quan 1',
        false
    ),
    (
        3,
        '789 Tran Hung Dao',
        'Home',
        'Ho Chi Minh',
        'Quan 5',
        true
    );

--  3. INVENTORIES
-- mongo_product_id values are fake ObjectIds — BE2 will link real MongoDB docs
INSERT INTO
    inventories (
        mongo_product_id,
        sku,
        stock_quantity
    )
VALUES
    -- MacBook Pro M3
    (
        '507f1f77bcf86cd799439011',
        'MACBOOK-M3-16-512',
        10
    ),
    (
        '507f1f77bcf86cd799439011',
        'MACBOOK-M3-32-1TB',
        5
    ),
    -- iPhone 15
    (
        '507f1f77bcf86cd799439012',
        'IP15-PINK-128',
        20
    ),
    (
        '507f1f77bcf86cd799439012',
        'IP15-BLACK-256',
        15
    ),
    -- Samsung Galaxy S24
    (
        '507f1f77bcf86cd799439013',
        'S24-PURPLE-256',
        8
    ),
    -- AirPods Pro 2
    (
        '507f1f77bcf86cd799439014',
        'AIRPODS-PRO2',
        30
    ),
    -- Item for concurrency test (only 1 in stock!)
    (
        '507f1f77bcf86cd799439015',
        'LAST-ITEM-SKU',
        1
    );

--  4. ORDERS
-- A completed delivered order for Alice (user_id = 2, address_id = 1)
INSERT INTO
    orders (
        user_id,
        shipping_address_id,
        total_amount,
        status,
        created_at
    )
VALUES (
        2,
        1,
        2000.00,
        'DELIVERED',
        NOW() - INTERVAL '10 days'
    ),
    (
        2,
        1,
        300.00,
        'PROCESSING',
        NOW() - INTERVAL '3 days'
    ),
    (
        3,
        3,
        500.00,
        'PENDING',
        NOW() - INTERVAL '1 day'
    );

--  5. ORDER ITEMS
-- Order 1 items (MacBook + AirPods, DELIVERED)
INSERT INTO
    order_items (
        order_id,
        product_id,
        product_name,
        sku,
        quantity,
        unit_price
    )
VALUES (
        1,
        '507f1f77bcf86cd799439011',
        'MacBook Pro M3 (16GB/512GB)',
        'MACBOOK-M3-16-512',
        1,
        1800.00
    ),
    (
        1,
        '507f1f77bcf86cd799439014',
        'AirPods Pro 2',
        'AIRPODS-PRO2',
        1,
        200.00
    );

-- Order 2 items (iPhone 15, PROCESSING)
INSERT INTO
    order_items (
        order_id,
        product_id,
        product_name,
        sku,
        quantity,
        unit_price
    )
VALUES (
        2,
        '507f1f77bcf86cd799439012',
        'iPhone 15 Pink 128GB',
        'IP15-PINK-128',
        1,
        300.00
    );

-- Order 3 items (Samsung, PENDING)
INSERT INTO
    order_items (
        order_id,
        product_id,
        product_name,
        sku,
        quantity,
        unit_price
    )
VALUES (
        3,
        '507f1f77bcf86cd799439013',
        'Samsung Galaxy S24 Purple',
        'S24-PURPLE-256',
        1,
        500.00
    );

--  6. PAYMENTS
INSERT INTO
    payments (
        order_id,
        method,
        status,
        transaction_date
    )
VALUES (
        1,
        'BANKING',
        'COMPLETED',
        NOW() - INTERVAL '10 days'
    ), -- paid & delivered
    (
        2,
        'COD',
        'COMPLETED',
        NOW() - INTERVAL '3 days'
    ), -- paid, being processed
    (3, 'COD', 'PENDING', NULL);
-- not yet paid

--  Summary
-- After running this seed, you can verify with:
--   SELECT * FROM users;
--   SELECT * FROM addresses;
--   SELECT * FROM inventories;
--   SELECT * FROM orders;
--   SELECT * FROM order_items;
--   SELECT * FROM payments;