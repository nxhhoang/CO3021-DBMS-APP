import time
import psycopg2
from pymongo import MongoClient

mongo_client = MongoClient("mongodb://localhost:27017/")
mongo_db = mongo_client["hybrid_db"]

pg_conn = psycopg2.connect(
    dbname="hybrid_db", user="postgres", password="admin123", host="localhost", port="5432"
)
pg_cursor = pg_conn.cursor()

def drop_all_indexes():
    print("[-] Đang xóa toàn bộ Index (để test trạng thái No Index)...")
    # Postgres
    pg_cursor.execute("DROP INDEX IF EXISTS idx_pg_name_text;")
    pg_cursor.execute("DROP INDEX IF EXISTS idx_pg_attributes;")
    pg_cursor.execute("DROP INDEX IF EXISTS idx_pg_cat_price;")
    pg_conn.commit()
    
    # Mongo
    mongo_db.TestingProduct.drop_indexes()

def create_indexes():
    print("[+] Đang tạo lại các Index tối ưu...")
    
    # POSTGRESQL INDEXES
    pg_cursor.execute("""
        CREATE EXTENSION IF NOT EXISTS pg_trgm;
        CREATE INDEX idx_pg_name_text ON TestingProduct USING GIN(name gin_trgm_ops);
        CREATE INDEX idx_pg_attributes ON TestingProduct USING GIN(attributes);
        CREATE INDEX idx_pg_cat_price ON TestingProduct(category_id, base_price);
    """)
    pg_conn.commit()

    # MONGODB INDEXES
    mongo_db.TestingProduct.create_index([("name", "text")])
    mongo_db.TestingProduct.create_index([("attributes.$**", 1)])
    mongo_db.TestingProduct.create_index([("categoryID", 1), ("basePrice", 1)])

def measure_pg_query(query, params=None):
    explain_query = "EXPLAIN ANALYZE " + query
    pg_cursor.execute(explain_query, params)
    result = pg_cursor.fetchall()
    
    exec_time_str = result[-1][0] 
    if "Execution Time" in exec_time_str:
        return float(exec_time_str.split(" ")[2])
    return 0.0

def measure_mongo_query(query_func):
    start = time.time()
    list(query_func())
    return (time.time() - start) * 1000

def run_tests(state_name):
    print(f"\n==================================================")
    print(f"  BẮT ĐẦU TEST: {state_name}")
    print(f"==================================================")

    # --- TEST 1: Full-text Search ---
    print("\n[Query 1] Tìm kiếm Full-text từ khóa 'Laptop'")
    pg_q1 = "SELECT id FROM TestingProduct WHERE name ILIKE '%Laptop%'"
    pg_time1 = measure_pg_query(pg_q1)
    if "KHÔNG CÓ INDEX" in state_name:
        mongo_time1 = measure_mongo_query(lambda: mongo_db.TestingProduct.find({"name": {"$regex": "Laptop", "$options": "i"}}))
    else:
        mongo_time1 = measure_mongo_query(lambda: mongo_db.TestingProduct.find({"$text": {"$search": "Laptop"}}))
    print(f"  - PostgreSQL: {pg_time1:.2f} ms")
    print(f"  - MongoDB:    {mongo_time1:.2f} ms")


    # --- TEST 2: Lọc JSONB / Thuộc tính động ---
    print("\n[Query 2] Tìm sản phẩm có Thương hiệu (brand) = Apple")
    pg_q2 = "SELECT id FROM TestingProduct WHERE attributes @> '{\"brand\": \"Apple\"}'"
    pg_time2 = measure_pg_query(pg_q2)
    mongo_time2 = measure_mongo_query(lambda: mongo_db.TestingProduct.find({"attributes.brand": "Apple"}))
    print(f"  - PostgreSQL: {pg_time2:.2f} ms")
    print(f"  - MongoDB:    {mongo_time2:.2f} ms")


    # --- TEST 3: Lọc (Equality) + Sắp xếp (Sort) ---
    print("\n[Query 3] Lọc sản phẩm theo Danh mục và Sắp xếp giá tăng dần (Limit 50)")
    pg_cursor.execute("SELECT category_id FROM TestingProduct WHERE category_id IS NOT NULL LIMIT 1")
    sample_cat_id = pg_cursor.fetchone()[0]
    pg_q3 = "SELECT id FROM TestingProduct WHERE category_id = %s ORDER BY base_price ASC LIMIT 50"
    pg_time3 = measure_pg_query(pg_q3, (sample_cat_id,))
    mongo_time3 = measure_mongo_query(lambda: mongo_db.TestingProduct.find({"categoryID": sample_cat_id}).sort("basePrice", 1).limit(50))
    print(f"  - PostgreSQL: {pg_time3:.2f} ms")
    print(f"  - MongoDB:    {mongo_time3:.2f} ms")

if __name__ == "__main__":
    drop_all_indexes()
    run_tests("KHÔNG CÓ INDEX (TABLE SCAN / COLLSCAN)")
    
    create_indexes()
    run_tests("ĐÃ TẠO INDEX (B-TREE, GIN, WILDCARD, TEXT)")
    
    pg_cursor.close()
    pg_conn.close()