# 4. DEMO ỨNG DỤNG

### 4.1. Tổng quan về kiến trúc và công nghệ sử dụng
Phần này tóm tắt lại các công nghệ cốt lõi đã trình bày ở chương 2 để làm nền tảng cho phần mô tả code.
* **Frontend**: ReactJS, TypeScript, TailwindCSS.
* **Backend**: NodeJS, ExpressJS.
* **Database**: PostgreSQL (Giao dịch) và MongoDB (Catalog).

### 4.2. Cấu trúc mã nguồn hệ thống
```
...
```

#### 4.2.1. Cấu trúc Frontend (Client-side)
Giải thích các thư mục chính:
* `src/components`: Các thành phần giao diện dùng chung (Button, Card, Navbar...).
* `src/pages`: Các trang chính của ứng dụng (Home, Product Detail, Cart, Admin...).
* `src/services`: Nơi gọi API từ Backend.
* `src/hooks/store`: Quản lý trạng thái ứng dụng (Context API/Redux).

#### 4.2.2. Cấu trúc Backend (Server-side)
Tập trung vào nơi xử lý logic Database:
* `src/controllers`: Xử lý logic yêu cầu và phản hồi.
* `src/services`: **Quan trọng nhất**, nơi chứa các câu lệnh truy vấn SQL (PostgreSQL) và các hàm xử lý dữ liệu NoSQL (MongoDB).
* [cite_start]`src/models`: Định nghĩa Schema cho MongoDB và Type/Interface cho dữ liệu[cite: 2].
* `src/routes`: Định nghĩa các Endpoint API.
* `src/middlewares`: Xử lý xác thực (JWT), kiểm tra quyền.

### 4.3. Mô tả chi tiết 10 chức năng chính
Mỗi chức năng cần được trình bày theo cấu trúc: **Mục tiêu -> Hình ảnh minh họa (Screenshot) -> Mô tả xử lý Database**. 

1.  **Tìm kiếm & Lọc sản phẩm nâng cao (MongoDB)**: Lọc theo tên, danh mục và các thuộc tính động (Màu, Size, RAM...).
2.  **Xem chi tiết sản phẩm (Hybrid)**: Truy vấn thông tin mô tả từ MongoDB và số lượng tồn kho thực tế từ PostgreSQL.
3. **Quản lý thông tin cá nhân (PostgreSQL)**: Cập nhật thông tin người dùng (USER) như họ tên, số điện thoại
4.  **Tạo đơn hàng & Thanh toán (PostgreSQL)**: Thực hiện giao dịch (Transaction) để lưu đơn hàng và chi tiết đơn hàng.
5.  **Quản lý tồn kho (PostgreSQL)**: Tự động trừ kho khi đặt hàng thành công và cộng lại khi hủy đơn (Sử dụng Concurrency Control).
6.  **Theo dõi lịch sử đơn hàng**: Người dùng xem danh sách đơn hàng đã mua và trạng thái xử lý.
7.  **Đánh giá & Nhận xét sản phẩm (MongoDB)**: Khách hàng gửi đánh giá sau khi mua hàng.
8.  **Quản lý danh mục & Thuộc tính động (Admin - MongoDB)**: Admin thiết kế các thuộc tính riêng cho từng loại sản phẩm (Ví dụ: Laptop có RAM, Quần áo có Size).
9.  **Quản lý sản phẩm (Admin - MongoDB)**: Thêm/Sửa/Xóa thông tin sản phẩm và các biến thể (SKUs).
10.  **Thống kê báo cáo doanh thu (PostgreSQL)**: Tổng hợp dữ liệu từ các bảng đơn hàng để vẽ biểu đồ thống kê theo thời gian.

### 4.4. Thống kê mức độ đáp ứng yêu cầu truy vấn
Bảng tổng kết để khẳng định nhóm đã hoàn thành các yêu cầu kỹ thuật (a-h) từ đề bài:

| STT | Chức năng | Hành động Database | Loại truy vấn đáp ứng |
| :--- | :--- | :--- | :--- |
| 1 | Tạo đơn hàng | INSERT vào bảng `ORDERS` | (a) Insert |
| 2 | Quản lý sản phẩm | Xóa bản ghi trong Collection `Products` | (b) Delete |
| 3 | Trừ tồn kho | UPDATE `stockQuantity` trong bảng `INVENTORY` | (c) Update |
| 4 | Xem chi tiết | Tìm sản phẩm theo `_id` duy nhất | (d) Single condition |
| 5 | Tìm kiếm nâng cao | Tìm theo Tên + Giá + Danh mục | (e) Composite condition |
| 6 | Lịch sử đơn hàng | JOIN bảng `ORDERS` và `ORDER_ITEMS` | (f) Query with a join |
| 7 | Thống kê top bán chạy | Query `ITEMS` lồng trong `ORDERS` | (g) Query with a subquery |
| 8 | Thống kê doanh thu | Sử dụng `SUM(totalAmount)` và `GROUP BY` | (h) Aggregate functions |

### 4.5. Tổng kết phần Demo
Đưa ra nhận xét về sự mượt mà khi kết hợp dữ liệu giữa hai hệ quản trị trong một ứng dụng thực tế.
