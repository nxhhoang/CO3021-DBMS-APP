import time
import concurrent.futures
import psycopg2
from psycopg2 import pool
from pymongo import MongoClient

# Cấu hình kịch bản Flash Sale
CONCURRENCY_LEVEL = 100
INITIAL_STOCK = 10
PRODUCT_ID = "IPHONE_16_PROMAX"

# --- KẾT NỐI DATABASE ---
# MongoDB Client mặc định đã an toàn với đa luồng (Thread-safe)
mongo_client = MongoClient("mongodb://localhost:27017/")
mongo_db = mongo_client["hybrid_db"]

# PostgreSQL cần Connection Pool cho đa luồng
pg_pool = psycopg2.pool.ThreadedConnectionPool(
    minconn=1,
    maxconn=150, # Cấp tối đa 150 kết nối để phục vụ 100 luồng đồng thời
    dbname="hybrid_db", user="postgres", password="admin123", host="localhost", port="5432"
)

def reset_test_data():
    """Khởi tạo lại tồn kho = 10 cho cả PG và Mongo trước mỗi bài test"""
    # Reset Postgres
    conn = pg_pool.getconn()
    cursor = conn.cursor()
    cursor.execute("DROP TABLE IF EXISTS flash_sale_inventory;")
    cursor.execute("CREATE TABLE flash_sale_inventory (product_id VARCHAR(50) PRIMARY KEY, stock INT);")
    cursor.execute("INSERT INTO flash_sale_inventory (product_id, stock) VALUES (%s, %s);", (PRODUCT_ID, INITIAL_STOCK))
    conn.commit()
    cursor.close()
    pg_pool.putconn(conn)

    # Reset Mongo
    mongo_db.flash_sale_inventory.drop()
    mongo_db.flash_sale_inventory.insert_one({"product_id": PRODUCT_ID, "stock": INITIAL_STOCK})

# =======================================================
# WORKER 1: PostgreSQL KHÔNG LOCK (Anti-pattern)
# =======================================================
def pg_worker_no_lock(_):
    conn = pg_pool.getconn()
    cursor = conn.cursor()
    success = False
    try:
        # Bước 1: Đọc tồn kho hiện tại
        cursor.execute("SELECT stock FROM flash_sale_inventory WHERE product_id = %s;", (PRODUCT_ID,))
        current_stock = cursor.fetchone()[0]
        
        # Bước 2: Xử lý logic trên code (Tạo độ trễ siêu nhỏ để dễ gây ra Race Condition)
        time.sleep(0.01) 
        
        if current_stock > 0:
            # Bước 3: Ghi đè tồn kho mới
            cursor.execute(
                "UPDATE flash_sale_inventory SET stock = %s WHERE product_id = %s;", 
                (current_stock - 1, PRODUCT_ID)
            )
            conn.commit()
            success = True
    except Exception:
        conn.rollback()
    finally:
        cursor.close()
        pg_pool.putconn(conn)
    return success

# =======================================================
# WORKER 2: PostgreSQL CÓ LOCK (Pessimistic Locking)
# =======================================================
def pg_worker_with_lock(_):
    conn = pg_pool.getconn()
    cursor = conn.cursor()
    success = False
    try:
        # Sử dụng SELECT ... FOR UPDATE để khóa dòng
        cursor.execute("SELECT stock FROM flash_sale_inventory WHERE product_id = %s FOR UPDATE;", (PRODUCT_ID,))
        current_stock = cursor.fetchone()[0]
        
        if current_stock > 0:
            cursor.execute(
                "UPDATE flash_sale_inventory SET stock = stock - 1 WHERE product_id = %s;", 
                (PRODUCT_ID,)
            )
            conn.commit()
            success = True
        else:
            conn.commit() # Nhả lock nếu hết hàng
    except Exception:
        conn.rollback()
    finally:
        cursor.close()
        pg_pool.putconn(conn)
    return success

# =======================================================
# WORKER 3: MongoDB ATOMIC UPDATE
# =======================================================
def mongo_worker_atomic(_):
    # Update nguyên tử: Tìm document thỏa điều kiện stock >= 1 thì mới trừ đi 1
    result = mongo_db.flash_sale_inventory.find_one_and_update(
        {"product_id": PRODUCT_ID, "stock": {"$gte": 1}},
        {"$inc": {"stock": -1}}
    )
    # Nếu result trả về có dữ liệu nghĩa là update thành công
    return result is not None

# =======================================================
# HÀM CHẠY TEST CHUNG
# =======================================================
def run_test_scenario(scenario_name, worker_function, get_final_stock_func):
    print(f"\n{'='*60}")
    print(f" KHỞI CHẠY KỊCH BẢN: {scenario_name}")
    print(f" Cấu hình: {CONCURRENCY_LEVEL} users tranh mua {INITIAL_STOCK} sản phẩm.")
    print(f"{'='*60}")
    
    reset_test_data()
    time.sleep(1) # Đợi hệ thống ổn định

    start_time = time.time()
    
    # Bắn 100 luồng đồng thời
    success_count = 0
    fail_count = 0
    with concurrent.futures.ThreadPoolExecutor(max_workers=CONCURRENCY_LEVEL) as executor:
        # Map worker function cho 100 request
        results = list(executor.map(worker_function, range(CONCURRENCY_LEVEL)))
        
    end_time = time.time()
    
    # Thống kê
    success_count = results.count(True)
    fail_count = results.count(False)
    execution_time = end_time - start_time
    tps = CONCURRENCY_LEVEL / execution_time
    
    final_stock = get_final_stock_func()
    
    print(f"[+] Số đơn đặt thành công: {success_count} đơn")
    print(f"[-] Số đơn báo hết hàng : {fail_count} đơn")
    print(f"[*] Tồn kho còn lại trên DB: {final_stock}")
    print(f"[⚡] Thời gian thực thi    : {execution_time:.3f} giây")
    print(f"[⚡] Thông lượng (TPS)     : {tps:.2f} req/s")
    
    # Đánh giá kết quả
    if success_count > INITIAL_STOCK:
        print("\n=> CẢNH BÁO: Xảy ra Lost Update! Đã bán vượt quá tồn kho thực tế!")
    elif final_stock < 0:
        print("\n=> CẢNH BÁO: Kho bị âm!")
    elif success_count == INITIAL_STOCK and final_stock == 0:
        print("\n=> CHÍNH XÁC: Toàn vẹn dữ liệu được đảm bảo tuyệt đối!")

def get_pg_stock():
    conn = pg_pool.getconn()
    cur = conn.cursor()
    cur.execute("SELECT stock FROM flash_sale_inventory WHERE product_id = %s;", (PRODUCT_ID,))
    val = cur.fetchone()[0]
    cur.close()
    pg_pool.putconn(conn)
    return val

def get_mongo_stock():
    return mongo_db.flash_sale_inventory.find_one({"product_id": PRODUCT_ID})["stock"]

if __name__ == "__main__":
    print("CHUẨN BỊ MÔ PHỎNG SỰ KIỆN FLASH SALE...\n")
    
    # 1. Trường hợp 1: Không Locking (Lỗi Lost Update)
    run_test_scenario("TRƯỜNG HỢP 1: POSTGRESQL (NO LOCKING - NGÂY THƠ)", pg_worker_no_lock, get_pg_stock)
    
    # 2. Trường hợp 2: PostgreSQL SELECT FOR UPDATE
    run_test_scenario("TRƯỜNG HỢP 2: POSTGRESQL (PESSIMISTIC LOCKING)", pg_worker_with_lock, get_pg_stock)
    
    # 3. Trường hợp 3: MongoDB Atomic Update
    run_test_scenario("TRƯỜNG HỢP 3: MONGODB (ATOMIC UPDATE)", mongo_worker_atomic, get_mongo_stock)

    pg_pool.closeall()