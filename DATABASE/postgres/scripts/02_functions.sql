-- Hàm tự động cập nhật trường lastUpdated
CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.lasUpdated = NOW();
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