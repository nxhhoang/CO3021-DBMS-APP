import psycopg2
from psycopg2.extras import execute_values
from pymongo import MongoClient
import random

MONGO_URI = "mongodb://localhost:27017/"
PG_URI = "postgresql://postgres:admin123@127.0.0.1:5432/hybrid_db"

def sync_inventory():
    print("⏳ Đang kết nối đến các Databases...")
    
    mongo_client = MongoClient(MONGO_URI)
    mongo_db = mongo_client["hybrid_db"]
    skus_collection = mongo_db["skus"]

    try:
        pg_conn = psycopg2.connect(PG_URI)
        pg_cursor = pg_conn.cursor()
    except Exception as e:
        print("❌ Lỗi kết nối PostgreSQL:", e)
        mongo_client.close()
        return

    print("📥 Đang đọc dữ liệu SKUs thực tế từ MongoDB...")
    
    cursor = skus_collection.find({}, {"_id": 0, "productID": 1, "sku": 1}).batch_size(10000)

    inventory_data = []
    
    for doc in cursor:
        product_id = str(doc.get("productID")) 
        sku = doc.get("sku")
        stock_quantity = random.randint(10, 500) 
        inventory_data.append((product_id, sku, stock_quantity))

    total_skus = len(inventory_data)
    print(f"📦 Đã lấy thành công {total_skus} SKUs từ Mongo. Bắt đầu đẩy vào PostgreSQL...")

    query = """
        INSERT INTO INVENTORY (productID, sku, stockQuantity) 
        VALUES %s
        ON CONFLICT (sku) DO UPDATE 
        SET stockQuantity = EXCLUDED.stockQuantity, 
            productID = EXCLUDED.productID
    """

    try:
        execute_values(pg_cursor, query, inventory_data, page_size=5000)
        pg_conn.commit()
        print(f"✅ HOÀN TẤT! Đã đồng bộ {total_skus} bản ghi vào bảng INVENTORY trong PostgreSQL.")
    except Exception as e:
        pg_conn.rollback()
        print("❌ Lỗi trong quá trình Insert vào PostgreSQL:", e)
    finally:
        pg_cursor.close()
        pg_conn.close()
        mongo_client.close()
        print("🔒 Đã đóng kết nối Database.")

if __name__ == "__main__":
    sync_inventory()