**Bước 1: Sinh file dữ liệu (Mở terminal tại thư mục gốc của project)**
```bash
python mongo_seeder.py
```
*(Đợi đến khi terminal báo "Hoàn tất việc sinh dữ liệu...")*

**Bước 2: Chạy kịch bản đo thời gian**
```bash
cd "scenario testing/storage and data management"
python storage_test.py
```
*(Kết quả thời gian I/O Write của Mongo và Postgres sẽ in thẳng ra màn hình)*

**Bước 3: Lấy số liệu dung lượng lưu trữ**
* **Đối với MongoDB:** Mở `mongosh` (hoặc MongoDB Compass) gõ: 
    ```javascript
    use('hybrid_db')
    db.TestingProduct.stats().storageSize
    ```
* **Đối với PostgreSQL:** Mở `DBeaver` hoặc `pgAdmin` chạy câu SQL: 
    ```sql
    SELECT pg_size_pretty(pg_total_relation_size('testingproduct'));
    ```