import psycopg2
from psycopg2.extras import execute_values
from pymongo import MongoClient
import random
import json
from datetime import datetime, timedelta

MONGO_URI = "mongodb://localhost:27017/"
PG_URI = "postgresql://postgres:admin123@127.0.0.1:5432/hybrid_db"

TOTAL_ORDERS = 100000
STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
PAYMENT_METHODS = ['COD', 'BANKING', 'E_WALLET']

def seed_orders():
    print("⏳ Đang kết nối đến các Databases...")
    mongo_client = MongoClient(MONGO_URI)
    mongo_db = mongo_client["hybrid_db"]
    products_collection = mongo_db["products"]

    try:
        pg_conn = psycopg2.connect(PG_URI)
        pg_cursor = pg_conn.cursor()
    except Exception as e:
        print("❌ Lỗi kết nối PostgreSQL:", e)
        return

    print("📥 Đang đọc dữ liệu Products từ MongoDB...")
    products_cursor = products_collection.find({}, {"_id": 1, "name": 1, "basePrice": 1})
    products_list = list(products_cursor)
    if not products_list:
        print("❌ Không tìm thấy Product nào. Vui lòng chạy mongo_seeder.py trước.")
        return

    print("📥 Đang đọc dữ liệu Users và Address mặc định từ PostgreSQL...")
    # FIX 1: Bỏ dấu ngoặc kép và dùng chữ thường theo chuẩn format của Postgres
    pg_cursor.execute('''
        SELECT u.userid, a.addressid 
        FROM users u
        JOIN addresses a ON u.userid = a.userid
        WHERE u.role = 'CUSTOMER' AND a.isdefault = true
    ''')
    user_address_list = pg_cursor.fetchall()
    
    if not user_address_list:
        print("❌ Không tìm thấy User/Address nào. Vui lòng import users.csv và addresses.csv trước.")
        pg_cursor.close()
        pg_conn.close()
        mongo_client.close()
        return
    

    print(f"📦 Bắt đầu sinh {TOTAL_ORDERS} Orders, Items và Payments...")

    orders_data = []
    items_data = []
    payments_data = []

    order_id = 1
    item_id = 1
    payment_id = 1

    for _ in range(TOTAL_ORDERS):
        user_id, shipping_address_id = random.choice(user_address_list)
        
        status = random.choice(STATUSES)
        created_at = datetime.now() - timedelta(days=random.randint(0, 365), hours=random.randint(0, 23))

        total_amount = 0
        num_items = random.randint(1, 3)

        selected_products = random.sample(products_list, num_items)
        for product in selected_products:
            product_id = str(product["_id"])
            product_name = product.get("name", "Unknown Product")
            unit_price = product.get("basePrice", 0)
            quantity = random.randint(1, 3)
            total_amount += quantity * unit_price
            
            # FIX 3: Sinh mã SKU tạm thời để thỏa mãn NOT NULL constraint của bảng ITEMS
            mock_sku = f"SKU-{product_id[-6:].upper()}-{random.randint(10, 99)}"

            # Thứ tự value phải khớp với INSERT query bên dưới
            items_data.append((item_id, order_id, product_id, mock_sku, product_name, quantity, unit_price))
            item_id += 1

        # FIX 4: Convert addressID thành định dạng JSON string để thỏa mãn JSONB constraint
        shipping_json = json.dumps({"addressID": shipping_address_id})
        orders_data.append((order_id, user_id, status, total_amount, shipping_json, created_at))

        payment_status = 'COMPLETED' if status in ['SHIPPED', 'DELIVERED'] else 'PENDING'
        payment_method = random.choice(PAYMENT_METHODS)
        payments_data.append((payment_id, order_id, payment_method, payment_status, created_at))
        
        payment_id += 1
        order_id += 1

    # FIX 2: Sửa lại tên bảng (orders, items, payments) và bỏ ngoặc kép ở các cột
    print("🚀 Đang đẩy dữ liệu Orders vào PostgreSQL...")
    order_query = """
        INSERT INTO orders (orderid, userid, status, totalamount, shippingaddr, createdat) 
        VALUES %s
    """
    
    print("🚀 Đang đẩy dữ liệu Items vào PostgreSQL...")
    item_query = """
        INSERT INTO items (itemid, orderid, productid, sku, productname, quantity, unitprice) 
        VALUES %s
    """

    print("🚀 Đang đẩy dữ liệu Payments vào PostgreSQL...")
    payment_query = """
        INSERT INTO payments (paymentid, orderid, method, status, transactiondate) 
        VALUES %s
    """

    try:
        execute_values(pg_cursor, order_query, orders_data, page_size=5000)
        execute_values(pg_cursor, item_query, items_data, page_size=5000)
        execute_values(pg_cursor, payment_query, payments_data, page_size=5000)
        
        # Reset sequence để backend code insert sau này không bị lỗi Duplicate Key
        pg_cursor.execute("SELECT setval('orders_orderid_seq', (SELECT MAX(orderid) FROM orders));")
        pg_cursor.execute("SELECT setval('items_itemid_seq', (SELECT MAX(itemid) FROM items));")
        pg_cursor.execute("SELECT setval('payments_paymentid_seq', (SELECT MAX(paymentid) FROM payments));")

        pg_conn.commit()
        print(f"✅ HOÀN TẤT! Đã đồng bộ {len(orders_data)} Orders, {len(items_data)} Items và {len(payments_data)} Payments.")
    except Exception as e:
        pg_conn.rollback()
        print("❌ Lỗi trong quá trình Insert vào PostgreSQL:", e)
    finally:
        pg_cursor.close()
        pg_conn.close()
        mongo_client.close()
        print("🔒 Đã đóng kết nối Database.")

if __name__ == "__main__":
    seed_orders()