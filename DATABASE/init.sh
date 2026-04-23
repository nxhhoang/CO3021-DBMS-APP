#!/bin/bash

echo "🚀 Bắt đầu quá trình khởi tạo hệ thống Hybrid Database..."

# 1. Cài đặt thư viện Python
echo "📦 1. Cài đặt các thư viện cần thiết từ requirements.txt..."
pip install -r requirements.txt

# 2. Sinh dữ liệu PostgreSQL (Tạo file CSV để COPY vào PostgreSQL)
echo "📝 2. Chạy postgre_seeder.py để chuẩn bị dữ liệu khởi tạo..."
python3 postgre_seeder.py

# 3. Khởi chạy Docker Containers
echo "🐳 3. Khởi chạy Docker Compose (PostgreSQL & MongoDB)..."
docker compose up -d

# 4. Kiểm tra trạng thái sẵn sàng của PostgreSQL
echo "⏳ 4. Đang chờ PostgreSQL sẵn sàng nhận kết nối TCP (Quá trình này có thể mất tới 10 phút)..."
until docker exec postgres_db pg_isready -h 127.0.0.1 -p 5432 -U postgres -d hybrid_db >/dev/null 2>&1; do
  echo -n "."
  sleep 5
done
echo -e "\n✅ PostgreSQL đã sẵn sàng!"

# 5. Seed dữ liệu cho MongoDB
echo "🍃 5. Chạy mongo_seeder.py để nạp dữ liệu cho MongoDB..."
python3 mongo_seeder.py

# 6. Đồng bộ Inventory
echo "🔄 6. Chạy sync_inventory.py để đồng bộ dữ liệu Inventory từ Mongo sang Postgres..."
python3 sync_inventory.py

echo "🎉 CHÚC MỪNG! Toàn bộ hệ thống đã được khởi tạo thành công."
echo "👉 Bạn có thể dùng Extension VS Code để kết nối ngay bây giờ."