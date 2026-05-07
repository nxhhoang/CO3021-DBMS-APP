# Kịch bản 2
Chạy lệnh trong `create new playgroud` sau khi database hoàn tất

```js
use('hybrid_db')

db.products.explain("executionStats").aggregate([
  {
    $match: {
      isActive: true,
      "attributes.brand": "Apple",
      "attributes.screenSize": { $gte: 14 }
    }
  },
  {
    $project: {
      name: 1,
      basePrice: 1,
      attributes: 1
    }
  },
  { $sort: { basePrice: 1 } }
],
  {hint: { $natural: 1 }}
);

```