### PHẦN 1: AUTHENTICATION & USER (Quản lý người dùng)

#### Tình huống 1: Đăng ký tài khoản kèm địa chỉ mặc định

*Mục tiêu: Kiểm tra API Register*

1. **Hành động:** Người dùng điền Form đăng ký: Email, Pass, Tên, SĐT và **Địa chỉ nhà**.
2. **FE:** Gọi `POST /auth/register` với body.
3. **BE (Logic):**
* Hash mật khẩu.
* Insert vào Postgres bảng `Users`.


1. **Kết quả mong đợi:** Response trả về thông tin User, không lộ Password. Database Postgres có dữ liệu ở bảng `Users`.

#### Tình huống 2: Đăng nhập và Cơ chế Refresh Token

*Mục tiêu: Kiểm tra bảo mật và duy trì phiên đăng nhập.*

1. **Hành động:** Người dùng đăng nhập. Sau 15 phút, Access Token hết hạn khi user đang lướt web.
2. **FE:**
* Gọi `POST /auth/login` -> Nhận `accessToken` (hạn 15p) và `refreshToken` (hạn 7 ngày). Lưu `refreshToken` vào Cookie/Storage.
* Sau 15p, User bấm vào trang Profile (`GET /users/profile`).
* API trả về `401 Unauthorized`.


3. **FE (Auto-handling):** Bắt lỗi 401 -> Gọi ngầm `POST /auth/refresh-token` gửi `refreshToken` cũ lên.
4. **BE:** Kiểm tra `refreshToken` trong Postgres (`auth_tokens`). Nếu hợp lệ -> Trả về cặp token mới.
5. **Kết quả mong đợi:** User không bị văng ra trang login, trải nghiệm mượt mà.

#### Tình huống 3: Quản lý Sổ địa chỉ (Address Book)

*Mục tiêu: Kiểm tra logic `isDefault` trong Postgres.*

1. **Hành động:** User thêm địa chỉ mới (Cty) và set làm mặc định.
2. **FE:** Gọi `POST /users/addresses` với body `{..., "isDefault": true}`.
3. **BE:**
* Start Transaction Postgres.
* Update tất cả địa chỉ cũ của user này thành `isDefault: false`.
* Insert địa chỉ mới với `isDefault: true`.
* Commit Transaction.


4. **Kết quả mong đợi:** Khi gọi `GET /users/addresses`, chỉ có duy nhất địa chỉ mới có cờ `true`.

---

### PHẦN 2: PRODUCT & DISCOVERY (MongoDB + Hybrid)

#### Tình huống 4: Tìm kiếm nâng cao với thuộc tính động (MongoDB)

*Mục tiêu: Kiểm tra sức mạnh Schema-less của MongoDB.*

1. **Hành động:** User tìm "Laptop Gaming", RAM 16GB, Card RTX 4060.
2. **FE:** Gọi `GET /products?keyword=Gaming&attrs[ram]=16GB&attrs[gpu]=RTX4060`.
3. **BE:** Query MongoDB collection `Products`. Dùng Index trên field `attributes`.
4. **Kết quả mong đợi:** Trả về danh sách JSON các laptop đúng cấu hình. Không lẫn lộn với sản phẩm "Áo thun" (dù áo thun cũng nằm chung collection nhưng khác attribute structure).

#### Tình huống 5: Xem chi tiết sản phẩm (Hybrid Data Fetching)

*Mục tiêu: Kiểm tra việc ghép dữ liệu từ 2 nguồn DB.*

1. **Hành động:** User bấm vào xem chi tiết "iPhone 15".
2. **FE:** Gọi `GET /products/mongo_id_iphone_15`.
3. **BE:**
* Query 1 (Mongo): Lấy tên, mô tả, thông số kỹ thuật, hình ảnh.
* Query 2 (Postgres): Lấy `stockQuantity` từ bảng `Inventories` dựa trên `sku` (VD: "IP15-PINK", "IP15-BLACK").
* Merge dữ liệu.


4. **Kết quả mong đợi:** JSON trả về có đủ thông tin hiển thị + số lượng tồn kho thực tế cho từng màu/dung lượng.

#### Tình huống 6: Admin thêm sản phẩm mới

*Mục tiêu: Kiểm tra tính năng quản lý sản phẩm Dynamic.*

1. **Hành động:** Admin thêm sản phẩm "Giày thể thao" (Category mới chưa từng có).
2. **FE:** Gửi `POST /admin/products` với attributes `{ "size": 42, "material": "Da thật", "sole": "Cao su" }`.
3. **BE:** Insert thẳng vào MongoDB mà không cần chạy lệnh `ALTER TABLE` nào cả.
4. **Kết quả mong đợi:** Sản phẩm được tạo thành công ngay lập tức.

---

### PHẦN 3: SHOPPING & TRANSACTION (PostgreSQL Core)

#### Tình huống 7: Đặt hàng tranh chấp (Concurrency Control) - Quan trọng nhất

*Mục tiêu: Kiểm tra Transaction và Inventory Lock.*

1. **Bối cảnh:** Sản phẩm "MacBook M3" chỉ còn **1 chiếc** trong kho (Postgres).
2. **Hành động:** User A và User B cùng bấm "Thanh toán" một lúc.
3. **FE:** Cả 2 máy gửi `POST /orders` gần như đồng thời.
4. **BE:**
* Request A đến trước 1ms: Start Transaction -> Lock dòng Inventory -> Check `quantity > 0` (True) -> Trừ kho về 0 -> Tạo Order -> Commit.
* Request B đến sau: Start Transaction -> Lock dòng Inventory (phải đợi A xong) -> Đọc lại thấy `quantity = 0` -> **Rollback**.

    **Quy trình**
- Backend nhận danh sách items từ Client.
- Query MongoDB: Lấy giá tiền (`base_price`) của từng sản phẩm để tính tổng tiền (`Server-side calculation`) nhằm tránh việc Client gian lận sửa giá.
- `Transaction PostgreSQL`: Kiểm tra và trừ tồn kho trong bảng inventories -> Tạo `record` trong orders với tổng tiền đã tính ở bước 2 -> Lưu `snapshot` tên sản phẩm và giá vào `items`.

1. **Kết quả mong đợi:** User A nhận thông báo "Đặt hàng thành công". User B nhận thông báo "Sản phẩm vừa hết hàng". Kho không bị âm.

#### Tình huống 8: Quy trình thanh toán (Payment)

*Mục tiêu: Kiểm tra trạng thái đơn hàng.*

1. **Hành động:** User chọn thanh toán chuyển khoản (Banking).
2. **FE:** Gọi `POST /orders` -> Nhận về `orderID` và trạng thái `PENDING`. Sau đó gọi `POST /payments/process`.
3. **BE:** Update bảng `Payments` thành `COMPLETED` và update bảng `Orders` thành `PAID` (hoặc `PROCESSING`).
4. **Kết quả mong đợi:** Lịch sử đơn hàng cập nhật trạng thái mới.

---

### PHẦN 4: POST-PURCHASE (Sau bán hàng)

#### Tình huống 9: Viết đánh giá (Review) có kiểm tra mua hàng

*Mục tiêu: Kiểm tra Logic nghiệp vụ.*

1. **Hành động:** User cố gắng đánh giá 1 sao cho sản phẩm mình chưa mua.
2. **FE:** Gọi `POST /products/:id/reviews`.
3. **BE:**
* Query Postgres: Check bảng `Orders` join `OrderItems` xem `userID` này đã mua `productID` này chưa và `status` có phải `DELIVERED` không.
* Nếu chưa -> Trả lỗi 403 Forbidden.
* Nếu rồi -> Insert Review vào MongoDB.


4. **Kết quả mong đợi:** Ngăn chặn spam review ảo.

#### Tình huống 10: Xem lịch sử đơn hàng

*Mục tiêu: Kiểm tra truy xuất dữ liệu quan hệ.*

1. **Hành động:** User vào xem "Lịch sử mua hàng".
2. **FE:** Gọi `GET /orders`.
3. **BE:** Join bảng `Orders`, `OrderItems` trong Postgres.
4. **Kết quả mong đợi:** Hiển thị danh sách đơn hàng kèm tổng tiền và trạng thái hiện tại.

---

### PHẦN 5: SYSTEM & ANALYTICS

#### Tình huống 11: Hệ thống ghi Log hành vi (Logging)

*Mục tiêu: Kiểm tra hiệu năng ghi (Write-heavy) của Mongo.*

1. **Hành động:** User lướt qua 10 sản phẩm liên tục trong 5 giây.
2. **FE:** Mỗi lần view, gọi ngầm `POST /logs` (Fire & Forget - không cần chờ response quá lâu).
3. **BE:** Insert cực nhanh vào MongoDB collection `Logs`.
4. **Kết quả mong đợi:** Không làm chậm trải nghiệm lướt web của user. Dữ liệu log tích lũy để phân tích sau này.

#### Tình huống 12: Thống kê doanh thu (Aggregation)

*Mục tiêu: Kiểm tra khả năng tổng hợp dữ liệu của Postgres.*

1. **Hành động:** Admin vào Dashboard xem doanh thu tháng 1/2026.
2. **FE:** Gọi `GET /admin/stats/revenue?startDate=2026-01-01&endDate=2026-01-31`.
3. **BE:** Thực hiện query `SUM(totalAmount)` và `GROUP BY date` trên bảng `Orders` (chỉ tính đơn thành công).
4. **Kết quả mong đợi:** Trả về biểu đồ doanh thu chính xác đến từng đồng.



# CÁC TÌNH HUỐNG CẦN THAO TÁC GIỮA HAI DATABASE

### 1. Tình huống 5: Xem chi tiết sản phẩm (Product Detail View)

Đây là tình huống điển hình nhất của việc "Read" từ hai nguồn.

* **MongoDB:** Chứa thông tin mô tả, thông số kỹ thuật (Attributes), hình ảnh, và giá niêm yết (`base_price`).


* **PostgreSQL:** Chứa thông tin tồn kho (`stockQuantity`) trong bảng `inventories`. Dữ liệu này biến động liên tục và cần độ chính xác cao.


* **Luồng xử lý của Backend:**
1. Nhận `productID` (dạng chuỗi Mongo ID) từ Client.
2. Query **MongoDB** để lấy thông tin hiển thị static (Tên, Ảnh, Cấu hình).
3. Dùng `productID` đó query sang bảng `inventories` trong **PostgreSQL** để lấy số lượng tồn kho hiện tại.
4. Gộp (Merge) hai kết quả này thành một JSON duy nhất trả về cho Frontend.


### 2. Tình huống 7: Đặt hàng (Checkout & Order Creation)

Đây là tình huống phức tạp nhất vì liên quan đến tính đúng đắn của dữ liệu (Data Integrity). Mặc dù Transaction chính nằm ở Postgres, nhưng cần dữ liệu từ Mongo để tính toán.

* **Tại sao cần cả hai?**
* **MongoDB:** Chứa giá bán hiện tại (`base_price`) và thông tin sản phẩm để validation.


* **PostgreSQL:** Chứa logic trừ kho (`inventories`), tạo đơn hàng (`orders`), và chi tiết đơn (`items`).




* **Luồng xử lý của Backend (Theo chiến lược trong plan.txt):**
1. Backend nhận danh sách items từ Client.
2. **Query MongoDB:** Lấy giá tiền (`base_price`) của từng sản phẩm để tính tổng tiền (Server-side calculation) nhằm tránh việc Client gian lận sửa giá.


3. **Transaction PostgreSQL:**
* Kiểm tra và trừ tồn kho trong bảng `inventories`.
* Tạo record trong `orders` với tổng tiền đã tính ở bước 2.
* Lưu snapshot tên sản phẩm và giá vào `items`.






### 3. Tình huống 9: Viết đánh giá (Product Review)

Đây là tình huống logic nghiệp vụ yêu cầu sự ràng buộc chéo (Cross-verification).

* **PostgreSQL:** Chứa lịch sử mua hàng (`Orders`, `OrderItems`). Backend cần kiểm tra xem user này đã thực sự mua sản phẩm đó hay chưa và đơn hàng đã giao thành công (`DELIVERED`) hay chưa.

* **MongoDB:** Là nơi lưu trữ nội dung review, rating và ảnh feedback.




* **Luồng xử lý của Backend:**
1. Nhận request đánh giá từ User.
2. **Query PostgreSQL:** Kiểm tra bảng `Orders` JOIN `Items` với điều kiện: `userID` + `productID` + `status = 'DELIVERED'`.
3. Nếu kết quả trả về **True** (Đã mua):
* **Write MongoDB:** Insert document mới vào collection `Reviews`.




4. Nếu kết quả **False**: Trả về lỗi 403 Forbidden.



### Tóm tắt các điểm chạm Hybrid:

| Tình huống | Hành động chính | PostgreSQL (SQL) | MongoDB (NoSQL) | Mục đích kết hợp |
| --- | --- | --- | --- | --- |
| **Xem chi tiết** | Read | Lấy số lượng tồn kho (Inventory) | Lấy thông tin, cấu hình (Product Info) | Hiển thị đầy đủ thông tin + Tồn kho thực tế. |
| **Đặt hàng** | Read + Write | Trừ kho, Lưu đơn hàng (Transaction) | Lấy giá tiền (Price check) | Bảo đảm tính tiền đúng và trừ kho chuẩn ACID. |
| **Đánh giá** | Read + Write | Kiểm tra lịch sử mua (Validation) | Lưu nội dung Review | Chống spam review ảo (Verified Purchase). |

Các tình huống còn lại (như Đăng ký, Đăng nhập, Thống kê doanh thu, Log hành vi) thường chỉ làm việc cục bộ trên 1 loại Database để tối ưu hiệu năng.