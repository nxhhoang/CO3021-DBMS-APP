#!/bin/bash

echo "🗑️  Đang dọn dẹp hệ thống..."

# 1. Dừng và xóa containers, volumes
echo "🛑 Dừng Docker containers và xóa Volumes dữ liệu..."
docker compose down -v

# Xóa thêm các file csv nếu bạn dùng phương pháp COPY
rm -f ./postgres/scripts/*.csv

echo "✨ Hệ thống đã sạch sẽ như lúc ban đầu!"