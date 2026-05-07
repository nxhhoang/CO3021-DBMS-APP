import psycopg2
from pymongo import MongoClient

def run_hybrid_query():
    print("\n--- Đang thực thi Kịch bản 4 (Hybrid Query) ---")
    
    # KẾT NỐI
    pg_conn = psycopg2.connect(dbname="hybrid_db", user="postgres", password="admin123", host="localhost", port="5432")
    pg_cursor = pg_conn.cursor()
    
    mongo_client = MongoClient("mongodb://localhost:27017/")
    mongo_db = mongo_client["hybrid_db"]

    try:
        # BƯỚC 1: PostgreSQL - Lấy Top 5 Product ID bán chạy nhất
        print("Bước 1: Lấy dữ liệu giao dịch từ PostgreSQL...")
        pg_query = """
        SELECT i.productid, SUM(i.quantity) as totalSold
        FROM ORDERS o
        JOIN ITEMS i ON o.orderid = i.orderid
        WHERE o.status = 'DELIVERED'
        GROUP BY i.productid
        ORDER BY totalSold DESC
        LIMIT 5;
        """
        pg_cursor.execute(pg_query)
        top_products = pg_cursor.fetchall() 
        
        if not top_products:
            print("  -> Không tìm thấy đơn hàng, sử dụng dữ liệu giả (mock data) cho Bước 2.")
            sample_docs = list(mongo_db.TestingProduct.find({}, {"_id": 1}).limit(5))
            top_products = [(str(doc["_id"]), 100) for doc in sample_docs]

        product_ids = [str(row[0]) for row in top_products]
        transaction_data = {str(row[0]): {"total_sold": row[1]} for row in top_products}

        # BƯỚC 2: MongoDB - Lấy Metadata theo danh sách ID
        from bson.objectid import ObjectId
        print(f"Bước 2: Lấy metadata từ MongoDB cho các ID: {product_ids}")
        object_ids = [ObjectId(pid) for pid in product_ids]
        
        mongo_results = list(mongo_db.products.find(
            {"_id": {"$in": object_ids}},
            {"name": 1, "attributes.brand": 1, "avgRating": 1}
        ))
        
        metadata_map = {str(doc["_id"]): doc for doc in mongo_results}
        print("Bước 3: Hợp nhất dữ liệu (Cross-database join) tại Application Layer...")
        final_results = []
        
        for pid in product_ids:
            if pid in metadata_map:
                merged_item = {
                    "productID": pid,
                    "name": metadata_map[pid].get("name", "N/A"),
                    "brand": metadata_map[pid].get("attributes", {}).get("brand", "N/A"),
                    "avgRating": metadata_map[pid].get("avgRating", 0),
                    "total_sold": transaction_data[pid]["total_sold"]
                }
                final_results.append(merged_item)
                
        print("\nKẾT QUẢ CUỐI CÙNG (HYBRID):")
        for item in final_results:
            print(item)

    except Exception as e:
        print(f"Lỗi: {e}")
    finally:
        pg_cursor.close()
        pg_conn.close()

if __name__ == "__main__":
    run_hybrid_query()