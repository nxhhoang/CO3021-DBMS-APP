CREATE TRIGGER update_inventory_modtime
BEFORE UPDATE ON INVENTORY
FOR EACH ROW
EXECUTE FUNCTION update_last_updated_column();

CREATE TRIGGER trg_single_default_address
BEFORE INSERT OR UPDATE ON ADDRESSES
FOR EACH ROW
EXECUTE FUNCTION ensure_single_default_address();