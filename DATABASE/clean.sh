#!/bin/bash

echo "🗑️  Đang dọn dẹp hệ thống..."

# 1. Dừng và xóa containers, volumes
echo "🛑 Dừng Docker containers và xóa Volumes dữ liệu..."
docker compose down -v

# 2. Xóa dữ liệu rác/nặng
echo "📄 Xóa các file dữ liệu SQL/CSV đã sinh ra để giải phóng bộ nhớ..."
if [ -f "./postgres/scripts/05_insert_data.sql" ]; then
    rm ./postgres/scripts/05_insert_data.sql
    echo "✔️ Đã xóa 05_insert_data.sql"
fi

# Xóa thêm các file csv nếu bạn dùng phương pháp COPY
rm -f ./postgres/scripts/*.csv

echo "✨ Hệ thống đã sạch sẽ như lúc ban đầu!"