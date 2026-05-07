import csv
import time
import json
from datetime import datetime
from pymongo import MongoClient
import psycopg2
from psycopg2 import extras

# Đường dẫn tới file sinh ra từ mongo_seeder.py
CSV_PATH = "product_test.csv"

# --- KẾT NỐI DATABASE ---
mongo_client = MongoClient("mongodb://localhost:27017/")
mongo_db = mongo_client["hybrid_db"]

pg_conn = psycopg2.connect(
    dbname="hybrid_db",
    user="postgres",
    password="admin123",
    host="localhost",
    port="5432"
)
pg_cursor = pg_conn.cursor()

def setup_dbs():
    print("Khởi tạo Collection TestingProduct (MongoDB)...")
    mongo_db.TestingProduct.drop()

    print("Khởi tạo Table TestingProduct (PostgreSQL)...")
    pg_cursor.execute("DROP TABLE IF EXISTS TestingProduct;")
    pg_cursor.execute("""
        CREATE TABLE TestingProduct (
            id SERIAL PRIMARY KEY,
            category_id VARCHAR(50),
            name VARCHAR(255),
            slug VARCHAR(255),
            base_price NUMERIC,
            description TEXT,
            attributes JSONB,
            is_active BOOLEAN,
            avg_rating NUMERIC(3,1),
            total_reviews INT,
            total_sold INT,
            created_at TIMESTAMP
        );
    """)
    pg_conn.commit()

def run_storage_test():
    setup_dbs()
    
    BATCH_SIZE = 5000
    mongo_batch = []
    pg_batch = []
    
    mongo_total_time = 0
    pg_total_time = 0
    
    print(f"\nĐang đọc dữ liệu từ {CSV_PATH} và tiến hành Bulk Insert 100k records...")
    
    with open(CSV_PATH, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        count = 0
        
        for row in reader:
            count += 1
            
            mongo_doc = {
                "categoryID": row['categoryID'],
                "name": row['name'],
                "slug": row['slug'],
                "basePrice": float(row['basePrice']),
                "description": row['description'],
                "attributes": json.loads(row['attributes']),
                "isActive": row['isActive'] == 'True',
                "avgRating": float(row['avgRating']),
                "totalReviews": int(row['totalReviews']),
                "totalSold": int(row['totalSold']),
                "createdAt": datetime.fromisoformat(row['createdAt'])
            }
            mongo_batch.append(mongo_doc)
            
            pg_tuple = (
                row['categoryID'],
                row['name'],
                row['slug'],
                float(row['basePrice']),
                row['description'],
                row['attributes'],
                row['isActive'] == 'True',
                float(row['avgRating']),
                int(row['totalReviews']),
                int(row['totalSold']),
                row['createdAt']
            )
            pg_batch.append(pg_tuple)
            
            if count % BATCH_SIZE == 0:
                start_m = time.time()
                mongo_db.TestingProduct.insert_many(mongo_batch)
                mongo_total_time += (time.time() - start_m)
                
                start_p = time.time()
                insert_query = """
                    INSERT INTO TestingProduct 
                    (category_id, name, slug, base_price, description, attributes, is_active, avg_rating, total_reviews, total_sold, created_at)
                    VALUES %s
                """
                extras.execute_values(pg_cursor, insert_query, pg_batch)
                pg_conn.commit()
                pg_total_time += (time.time() - start_p)
                
                print(f"Đã insert xong {count} records...")
                mongo_batch = []
                pg_batch = []
                
        if mongo_batch:
            start_m = time.time()
            mongo_db.TestingProduct.insert_many(mongo_batch)
            mongo_total_time += (time.time() - start_m)
            
            start_p = time.time()
            extras.execute_values(pg_cursor, insert_query, pg_batch)
            pg_conn.commit()
            pg_total_time += (time.time() - start_p)
            print(f"Đã insert xong {count} records...")

    print("\n=======================================================")
    print(" KẾT QUẢ THỬ NGHIỆM THỜI GIAN BULK INSERT (100k records)")
    print("=======================================================")
    print(f"MongoDB (BSON):    {mongo_total_time:.4f} giây")
    print(f"PostgreSQL (JSONB): {pg_total_time:.4f} giây")
    print("=======================================================")
    print("\nĐể lấy số liệu Storage Size cho Báo Cáo, hãy chạy lệnh sau:")
    print("1. MongoDB Compass (mongosh): db.TestingProduct.stats().storageSize")
    print("2. PostgreSQL DBeaver/pgAdmin: SELECT pg_size_pretty(pg_total_relation_size('testingproduct'));")

if __name__ == "__main__":
    run_storage_test()
    pg_cursor.close()
    pg_conn.close()