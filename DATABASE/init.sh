#!/bin/bash

echo "🚀 Bắt đầu quá trình khởi tạo hệ thống Hybrid Database..."

# 1. Cài đặt thư viện Python
echo "📦 1. Cài đặt các thư viện cần thiết từ requirements.txt..."
pip install -r requirements.txt

# 2. Sinh dữ liệu PostgreSQL (Tạo file 05_insert_data.sql)
echo "📝 2. Chạy postgre_seeder.py để chuẩn bị dữ liệu khởi tạo..."
python postgre_seeder.py

# 3. Khởi chạy Docker Containers
echo "🐳 3. Khởi chạy Docker Compose (PostgreSQL & MongoDB)..."
docker compose up -d

# 4. Kiểm tra trạng thái sẵn sàng của PostgreSQL
echo "⏳ 4. Đang chờ PostgreSQL khởi động và nạp dữ liệu (Quá trình này có thể mất tới 10 phút)..."
until docker logs postgres_db 2>&1 | grep -q "database system is ready to accept connections"; do
  echo -n "."
  sleep 5
done
echo -e "\n✅ PostgreSQL đã sẵn sàng!"

# 5. Seed dữ liệu cho MongoDB
echo "🍃 5. Chạy mongo_seeder.py để nạp dữ liệu cho MongoDB..."
python mongo_seeder.py

# 6. Đồng bộ Inventory
echo "🔄 6. Chạy sync_inventory.py để đồng bộ dữ liệu Inventory từ Mongo sang Postgres..."
python sync_inventory.py

# 7. Seed dữ liệu cho orders trong database PostgreSQL
echo "🔄 7. Chạy order_seeder.py để nạp dữ liệu cho orders..."
python order_seeder.py

echo "🎉 CHÚC MỪNG! Toàn bộ hệ thống đã được khởi tạo thành công."
echo "👉 Bạn có thể dùng Extension VS Code để kết nối ngay bây giờ."