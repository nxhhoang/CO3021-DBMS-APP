# Kịch bản 2: Indexing (Chỉ mục và Tối ưu truy vấn)

Thư mục này kiểm thử hiệu năng truy vấn dữ liệu (Đọc - Read Performance) thông qua các cơ chế Indexing đặc thù của RDBMS (PostgreSQL) và NoSQL (MongoDB).

Kịch bản tập trung vào 3 loại truy vấn cốt lõi của hệ thống E-commerce:
1. **Tìm kiếm toàn văn (Full-text Search):** Đo lường GIN Index (Postgres) vs Text Index (Mongo).
2. **Truy vấn thuộc tính động (Dynamic/Polymorphic Attributes):** Đo lường JSONB GIN Index (Postgres) vs Wildcard Index (Mongo).
3. **Compound Query (Lọc kết hợp Sắp xếp):** Áp dụng quy tắc ESR (Equality, Sort, Range) trên B-Tree Index (Postgres) và Compound Index (Mongo).

## 🚀 Cách chạy thử nghiệm

**Yêu cầu:**: Cần chạy `mongo_seeder.py` trước để sinh TestingProducts trong database

1. Mở terminal tại thư mục `scenario testing/indexing`.
2. Chạy lệnh:
   ```bash
   python indexing_test.py
   ```

## 📊 Kỳ vọng kết quả
Script sẽ in ra màn hình thời gian thực thi (mili-giây) của hai trạng thái:
* **Khi không có Index:** Cả hai database đều mất hàng chục tới hàng trăm mili-giây để quét toàn bộ 100.000 dòng.
* **Khi có Index:** Thời gian sẽ giảm xuống chỉ còn khoảng **dưới 1ms tới vài ms**. 
* **Nhận xét so sánh:** MongoDB có xu hướng nhanh hơn trong truy vấn JSON nhúng nhờ Wildcard Index (dữ liệu nằm sẵn trên memory). Postgres cực mạnh ở GIN Index cho Text Search, nhưng khi lấy dữ liệu JSONB ra đôi khi sẽ chậm hơn do cơ chế parse dữ liệu lúc đọc.