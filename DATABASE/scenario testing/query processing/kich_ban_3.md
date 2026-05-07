# Kịch bản 3
Chạy lệnh sau khi database hoàn tất, sử dụng create new playground của mongoDB extension

```js
use('hybrid_db')
db.products.explain("executionStats").aggregate([
  { $match: { isActive: true } },
  {
    $group: {
      _id: "$attributes.brand",
      totalProducts: { $sum: 1 },
      avgPrice: { $avg: "$basePrice" }
    }
  },
  { $sort: { totalProducts: -1 } },
  { $limit: 10 }
], {hint: {$natural: 1}});
```