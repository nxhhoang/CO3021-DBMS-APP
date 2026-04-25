# Kịch bản Thử nghiệm: Transaction & Data Integrity (Toàn vẹn dữ liệu)

Thư mục này chứa script kiểm thử nhằm chứng minh tính **Atomicity (Nguyên tử)** của hệ quản trị cơ sở dữ liệu khi xảy ra sự cố (Exception/Crash) trong một nghiệp vụ thanh toán phức tạp.

## 🎯 Mục đích Kịch bản
Đối chiếu giữa hai chiến lược xử lý giao dịch:
1. **PostgreSQL (Sử dụng Transaction):** Lấy một sản phẩm thật từ bảng `INVENTORY`, trừ tồn kho đi 3. Ngay sau đó tạo lỗi Exception giả lập. Hệ thống tự động gọi `ROLLBACK` để hoàn tác lệnh trừ kho, bảo vệ toàn vẹn tài sản.
2. **MongoDB (Anti-Pattern):** Trừ kho bằng lệnh `$inc`, sau đó xảy ra Exception. Do không đóng gói trong Multi-document Transaction, số lượng tồn kho bị trừ vĩnh viễn nhưng không sinh ra đơn hàng. Chứng minh lý do nhóm không sử dụng NoSQL cho luồng Order/Inventory.

## 🚀 Hướng dẫn chạy

1. Mở terminal tại thư mục `scenario testing/transactions`.
2. Đảm bảo docker `postgres` và `mongo` đang hoạt động bình thường, và Database đã có dữ liệu mẫu.
3. Chạy lệnh:
   ```bash
   python transaction_test.py
   ```
4. Copy lại Output trên màn hình Terminal dán vào đồ án để làm minh chứng thực nghiệm.
