# Kịch bản 1
Chạy lệnh sau khi database hoàn tất, dùng extension PostgreSQL

```sql
EXPLAIN ANALYZE
SELECT i.productID,
       i.productName,
       SUM(i.quantity) AS total_sold,
       SUM(i.quantity * i.unitPrice) AS total_revenue
FROM ITEMS i
JOIN ORDERS o ON o.orderID = i.orderID
WHERE o.status IN ('DELIVERED', 'SHIPPED')
GROUP BY i.productID, i.productName
ORDER BY total_sold DESC
LIMIT 10;
```