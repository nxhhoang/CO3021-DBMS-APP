# 📊 Thực nghiệm Hệ quản trị Cơ sở dữ liệu Hybrid (PostgreSQL & MongoDB)

Dự án này tập trung vào việc nghiên cứu, so sánh hiệu năng và khả năng phối hợp giữa RDBMS (**PostgreSQL**) và NoSQL (**MongoDB**) trong bài toán Sàn thương mại điện tử.

## 📋 Mục tiêu thực nghiệm
1. Xác minh tính toàn vẹn dữ liệu và logic nghiệp vụ trên PostgreSQL.
2. Đánh giá hiệu năng truy vấn có điều kiện và sắp xếp trên MongoDB (Indexing).
3. So sánh hiệu năng tìm kiếm toàn văn (Full-text Search) giữa hai hệ thống.

---

## 🛠 Tiền đề (Prerequisites)
Trước khi chạy các kịch bản, hãy đảm bảo hệ thống đã được nạp dữ liệu đầy đủ bằng các script sau:
1. `python postgre_seeder.py`: Tạo User và Address.
2. `python mongo_seeder.py`: Tạo 100,000 Products và SKUs.
3. `python sync_inventory.py`: Đồng bộ kho hàng sang Postgres.
4. `python order_seeder.py`: Tạo 100,000 đơn hàng mẫu.

---

## 🚀 Kịch bản 1: Kiểm tra tính nhất quán & Logic nghiệp vụ (PostgreSQL)

Kịch bản này sử dụng các truy vấn phức tạp để kiểm tra mối quan hệ giữa các bảng và độ chính xác của dữ liệu tài chính.

### 1.1 Thống kê đơn hàng và sản phẩm theo User
```sql
SELECT 
    u.userid, 
    u.email,
    COUNT(DISTINCT o.orderid) AS count_order, 
    SUM(i.quantity) AS count_item 
FROM users u 
JOIN orders o ON u.userid = o.userid 
JOIN items i ON o.orderid = i.orderid 
GROUP BY u.userid, u.email
ORDER BY count_order DESC 
LIMIT 100;
```

### 1.2 Kiểm tra tính toàn vẹn (Data Integrity)
Chạy các lệnh sau để đảm bảo không có dữ liệu lỗi:
* **Kiểm tra đơn hàng "mồ côi":** `SELECT o.orderid FROM orders o LEFT JOIN users u ON o.userid = u.userid WHERE u.userid IS NULL;`
* **Kiểm tra chênh lệch tiền:**
```sql
SELECT o.orderid, o.totalamount, SUM(i.quantity * i.unitprice) 
FROM orders o JOIN items i ON o.orderid = i.orderid
GROUP BY o.orderid HAVING o.totalamount != SUM(i.quantity * i.unitprice);
```
**Kết quả mong đợi:** 0 dòng trả về (Dữ liệu hoàn hảo).

---

## 🚀 Kịch bản 2: Tối ưu hóa truy vấn khoảng giá & Sắp xếp (MongoDB)

So sánh hiệu năng truy vấn trên 100,000 sản phẩm khi có và không có Index.

### Truy vấn thực nghiệm:
```javascript
db.products.find({ 
    basePrice: { $gte: 100000, $lte: 500000 } 
}).sort({ createdAt: -1 }).limit(100).explain("executionStats");
```

### Kết quả đo lường:
| Trạng thái | Thuật toán (Stage) | Thời gian (ms) | Tài liệu đã quét (Docs Examined) |
| :--- | :--- | :--- | :--- |
| **Chưa Index** | COLLSCAN | ~50 - 100ms | 100,000 |
| **Có Index** | **IXSCAN (basePrice_1_createdAt_-1)** | **5ms** | **0 (Hiệu năng cực cao)** |

---

## 🚀 Kịch bản 3: So sánh tìm kiếm toàn văn (Full-text Search)

Thử nghiệm tìm kiếm từ khóa `"99"` trong tên sản phẩm trên tập dữ liệu >200,000 bản ghi.

### 3.1 PostgreSQL (Chưa có GIN Index)
```sql
EXPLAIN ANALYZE 
SELECT * FROM items 
WHERE productname ILIKE '%Sản phẩm tự động 99%';
```
* **Chiến lược:** `Seq Scan` (Quét tuần tự).
* **Thời gian thực thi:** **~155ms**.
* **Tình trạng:** Phải quét qua hơn 200,000 dòng dữ liệu.

### 3.2 MongoDB (Đã có Text Index)
```javascript
db.products.createIndex({ name: "text" });
db.products.find({ $text: { $search: "99" } }).explain("executionStats");
```
* **Chiến lược:** `TEXT_MATCH` (Sử dụng chỉ mục văn bản).
* **Thời gian thực thi:** **~1ms**.
* **Hiệu quả:** Nhanh gấp ~150 lần so với quét tuần tự trên SQL.

---

## 💡 Kết luận rút ra từ thực nghiệm
1. **PostgreSQL** vượt trội trong việc quản lý quan hệ phức tạp, đảm bảo tiền bạc và kho hàng luôn khớp 100% nhờ các ràng buộc Khóa ngoại (Foreign Keys).
2. **MongoDB** cung cấp khả năng truy xuất dữ liệu sản phẩm linh hoạt và cực nhanh. Đặc biệt, việc sử dụng `Compound Index` và `Text Index` giúp hệ thống chịu tải tốt hơn nhiều so với SQL truyền thống khi tìm kiếm.
3. **Kiến trúc Hybrid** (Lưu Order ở Postgres, lưu Product ở Mongo) là giải pháp tối ưu nhất cho hệ thống E-commerce hiện đại.
