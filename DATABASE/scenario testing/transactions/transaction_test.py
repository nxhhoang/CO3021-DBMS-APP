import psycopg2
from pymongo import MongoClient
import time
import uuid

mongo_client = MongoClient("mongodb://localhost:27017/")
mongo_db = mongo_client["hybrid_db"]

pg_conn = psycopg2.connect(
    dbname="hybrid_db", user="postgres", password="admin123", host="localhost", port="5432"
)
pg_conn.autocommit = False 
pg_cursor = pg_conn.cursor()

def test_postgresql_transaction():
    print("==================================================")
    print("  KỊCH BẢN 1: POSTGRESQL (CÓ TRANSACTION - ACID)")
    print("==================================================")
    
    try:
        pg_cursor.execute("SELECT productid, stockQuantity FROM inventory WHERE stockQuantity >= 3 LIMIT 1;")
        row = pg_cursor.fetchone()
        if not row:
            print("Không tìm thấy sản phẩm nào có tồn kho >= 3 trong bảng INVENTORY để test.")
            return
            
        test_product_id = row[0]
        initial_stock = row[1]
        
        print(f"[*] Bắt đầu đặt hàng cho Product ID: {test_product_id}")
        print(f"[*] Tồn kho ban đầu: {initial_stock}")
        print("--------------------------------------------------")
        
        print("1. Bắt đầu Transaction (Lệnh: BEGIN)")
        
        print("2. Thực thi: UPDATE inventory (Trừ đi 3 sản phẩm)")
        pg_cursor.execute(
            "UPDATE inventory SET stockQuantity = stockQuantity - 3 WHERE productid = %s", 
            (test_product_id,)
        )
        
        print("3. [!] LỖI ĐỘT NGỘT: Server bị crash ngay trước khi INSERT vào bảng ORDERS!")
        raise Exception("Mô phỏng lỗi hệ thống (System Crash Simualtion)")
        
        print("4. Thực thi: INSERT INTO orders...")
        pg_cursor.execute("INSERT INTO orders (status, totalAmount) VALUES ('PENDING', 500000)")
        pg_conn.commit()
        
    except Exception as e:
        print(f"\n[!] Bắt được Exception: {e}")
        print("-> PostgreSQL tự động kích hoạt quá trình ROLLBACK...")
        pg_conn.rollback() 
        
    pg_cursor.execute("SELECT stockQuantity FROM inventory WHERE productid = %s", (test_product_id,))
    final_stock = pg_cursor.fetchone()[0]
    
    print(f"\n[KẾT QUẢ POSTGRESQL] Tồn kho hiện tại: {final_stock}")
    if final_stock == initial_stock:
        print("=> THÀNH CÔNG: Dữ liệu được bảo toàn nguyên vẹn (Tính Atomicity được đảm bảo)!\n")
    else:
        print("=> THẤT BẠI: Dữ liệu bị thay đổi.\n")

def test_mongodb_antipattern():
    print("==================================================")
    print("  KỊCH BẢN 2: MONGODB (ANTI-PATTERN - NO TRANSACTION)")
    print("==================================================")
    print("Giải thích: Mô phỏng nếu dùng MongoDB lưu trữ giao dịch chéo collection mà không có Multi-doc Transaction.\n")
    
    test_id = str(uuid.uuid4())
    
    mongo_db.inventory_anti_pattern.insert_one({"productid": test_id, "stock_quantity": 100})
    print(f"[*] Đã tạo sản phẩm test (ID: {test_id[:8]}...) trong collection 'inventory_anti_pattern'")
    print("[*] Tồn kho ban đầu: 100")
    print("--------------------------------------------------")
    
    try:
        print("1. Thực thi: update_one (Trừ đi 3 sản phẩm)")
        mongo_db.inventory_anti_pattern.update_one(
            {"productid": test_id}, 
            {"$inc": {"stockQuantity": -3}}
        )
        
        print("2. [!] LỖI ĐỘT NGỘT: Server bị crash ngay trước khi tạo Document đơn hàng!")
        raise Exception("Mô phỏng lỗi hệ thống (System Crash Simualtion)")
        
        mongo_db.orders_anti_pattern.insert_one({"productid": test_id, "qty": 3})
        
    except Exception as e:
        print(f"\n[!] Bắt được Exception: {e}")
        print("-> MongoDB không tự động khôi phục dữ liệu ở collection khác. Code kết thúc.")
        
    final_doc = mongo_db.inventory_anti_pattern.find_one({"productid": test_id})
    final_stock = final_doc["stockQuantity"]
    
    print(f"\n[KẾT QUẢ MONGODB] Tồn kho hiện tại: {final_stock}")
    if final_stock == 97:
        print("=> THẤT BẠI (DATA LOSS): Tồn kho bị trừ 3 sản phẩm, nhưng KHÔNG CÓ ĐƠN HÀNG nào được tạo.")
        print("=> Dữ liệu rác (Orphaned Data) đã sinh ra, hệ thống bị thất thoát tài sản!\n")

if __name__ == "__main__":
    print("\nĐANG KHỞI CHẠY KỊCH BẢN TEST TRANSACTION...\n")
    time.sleep(1)
    test_postgresql_transaction()
    time.sleep(1)
    test_mongodb_antipattern()
    
    pg_cursor.close()
    pg_conn.close()