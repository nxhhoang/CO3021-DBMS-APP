# Kịch bản Thử nghiệm: Điều khiển đồng thời (Concurrency Control)

Thư mục này chứa script giả lập sự kiện Flash Sale, nơi 100 người dùng (100 threads) gửi request truy cập mua hàng **cùng một thời điểm** nhằm vào một sản phẩm chỉ có **10 tồn kho**.

Mục tiêu là chứng minh tầm quan trọng của cơ chế Khóa (Locking) trong cơ sở dữ liệu để ngăn chặn hiện tượng **Race Condition** và **Lost Update**.

## 🚀 Cách chạy thử nghiệm

1. Mở terminal tại thư mục `scenario testing/concurrency control`.
2. Chạy lệnh:
   ```bash
   python concurrency_test.py
   ```

## 📊 Giải thích Kết quả (Kỳ vọng)

1. **Trường hợp 1 (PostgreSQL Không Lock):** Sẽ xảy ra thảm họa. Do nhiều luồng cùng đọc dữ liệu tại một thời điểm, kết quả số đơn đặt thành công sẽ vượt xa con số 10 (ví dụ bán được 100 đơn), trong khi tồn kho cập nhật sai lệch.
2. **Trường hợp 2 (PostgreSQL Có Lock - `FOR UPDATE`):** Chỉ đúng 10 đơn đặt thành công, 90 đơn thất bại. Tồn kho về 0. Đảm bảo toàn vẹn dữ liệu. Tuy nhiên, do các luồng phải xếp hàng chờ đợi nhau để lấy Lock, thời gian thực thi (Latency) sẽ cao hơn và TPS thấp hơn.
3. **Trường hợp 3 (MongoDB Atomic):** Sử dụng `findOneAndUpdate`. Tốc độ xử lý (TPS) sẽ cực kỳ ấn tượng nhờ cơ chế Document-level locking của WiredTiger. Đảm bảo bán đúng 10 sản phẩm.