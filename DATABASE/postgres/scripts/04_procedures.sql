CREATE OR REPLACE PROCEDURE checkout_order(
    p_user_id VARCHAR,
    p_total_amount INT,
    p_shipping_addr JSONB,
    p_method VARCHAR,
    p_sku VARCHAR,
    p_product_id VARCHAR,
    p_product_name VARCHAR,
    p_quantity INT,
    p_unit_price INT
)
LANGUAGE plpgsql
AS $$
DECLARE 
    v_order_id INT;
    v_current_stock INT;
BEGIN
    -- 1. Khóa dòng Inventory để kiểm tra tồn kho (Pessimistic Locking)
    SELECT stockQuantity INTO v_current_stock
    FROM INVENTORY
    WHERE sku = p_sku FOR UPDATE;

    IF v_current_stock IS NULL OR v_current_stock < p_quantity THEN
        RAISE EXCEPTION 'NOT ENOUGH PRODUCTS: %', p_sku;
    END IF;

    -- 2. Trừ tồn kho
    UPDATE INVENTORY
    SET stockQuantity = stockQuantity - p_quantity
    WHERE sku = p_sku;

    -- 3. Tạo Đơn hàng
    INSERT INTO ORDERS (userID, status, totalAmount, shippingAddr)
    VALUES (p_user_id, 'PENDING', p_total_amount, p_shipping_addr)
    RETURNING orderID INTO v_order_id;

    -- 4. Thêm chi tiết Items
    INSERT INTO ITEMS (orderID, productID, sku, productName, quantity, unitPrice)
    VALUES (v_order_id, p_product_id, p_sku, p_product_name, p_quantity, p_unit_price);

    -- 5. Tạo thông tin Payment
    INSERT INTO PAYMENTS (orderID, method, status)
    VALUES (v_order_id, p_method, 'PENDING');
    
    COMMIT;
END;
$$;