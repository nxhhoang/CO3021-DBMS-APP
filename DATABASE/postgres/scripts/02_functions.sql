-- Hàm tự động cập nhật trường lastUpdated
CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.lastUpdated = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';


-- Hàm đảm bảo chỉ có 1 địa chỉ mặc định duy nhất cho mỗi user
CREATE OR REPLACE FUNCTION ensure_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.isDefault = TRUE THEN
        UPDATE ADDRESSES SET isDefault = FALSE WHERE userID = NEW.userID AND addressID <> NEW.addressID;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';


-- Hàm đảm bảo các status dieenx ra theo luồng
CREATE OR REPLACE FUNCTION check_order_status_transition()
RETURNS TRIGGER AS $$
BEGIN
    -- Nếu trạng thái không thay đổi thì bỏ qua
    IF OLD.status = NEW.status THEN
        RETURN NEW;
    END IF;

    IF OLD.status = 'PENDING' AND NEW.status NOT IN ('PROCESSING', 'CANCELLED') THEN
        RAISE EXCEPTION 'Lỗi: Từ PENDING chỉ có thể chuyển sang PROCESSING hoặc CANCELLED';
    ELSIF OLD.status = 'PROCESSING' AND NEW.status NOT IN ('SHIPPED', 'CANCELLED') THEN
        RAISE EXCEPTION 'Lỗi: Từ PROCESSING chỉ có thể chuyển sang SHIPPED hoặc CANCELLED';
    ELSIF OLD.status = 'SHIPPED' AND NEW.status NOT IN ('DELIVERED', 'CANCELLED') THEN
        RAISE EXCEPTION 'Lỗi: Từ SHIPPED chỉ có thể chuyển sang DELIVERED hoặc CANCELLED';
    ELSIF OLD.status IN ('DELIVERED', 'CANCELLED') THEN
        RAISE EXCEPTION 'Lỗi: Đơn hàng đã hoàn tất (DELIVERED) hoặc đã hủy (CANCELLED) thì không thể đổi trạng thái';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Thêm vào 03_triggers.sql
CREATE TRIGGER trg_strict_order_status
BEFORE UPDATE OF status ON ORDERS
FOR EACH ROW
EXECUTE FUNCTION check_order_status_transition();


-- Hàm đảm bảo người dùng chỉ có thể đánh giá khi đã mua hàng
CREATE OR REPLACE FUNCTION can_user_review_product(
    p_user_id VARCHAR,
    p_product_id VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
    v_completed_orders INT;
BEGIN
    -- Đếm số lượng đơn hàng đã DELIVERED có chứa sản phẩm này của user
    SELECT COUNT(*)
    INTO v_completed_orders
    FROM ORDERS o
    JOIN ITEMS i ON o.orderID = i.orderID
    WHERE o.userID = p_user_id
      AND i.productID = p_product_id
      AND o.status = 'DELIVERED';

    -- Trả về true nếu count > 0 (tức là đã từng mua và nhận hàng thành công)
    RETURN v_completed_orders > 0;
END;
$$ LANGUAGE plpgsql;