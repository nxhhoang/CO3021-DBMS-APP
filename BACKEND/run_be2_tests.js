const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const axios = require('axios')
dotenv.config()

const BASE_URL = 'http://localhost:4000/api/v1'
const token = jwt.sign(
  {
    user_id: '123e4567-e89b-12d3-a456-426614174000',
    role: 'ADMIN',
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
  },
  process.env.JWT_SECRET_ACCESS_TOKEN
)

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
})

// Helper to catch expected API errors
async function expectError(promise, expectedStatus, testName) {
  try {
    await promise
    console.error(`[FAIL] ${testName} - Expected error ${expectedStatus} but request succeeded.`)
    return false
  } catch (err) {
    if (err.response && err.response.status === expectedStatus) {
      console.log(`[PASS] ${testName} - Got expected ${expectedStatus} error.`)
      return true
    } else {
      console.error(`[FAIL] ${testName} - Expected error ${expectedStatus} but got ${err.response?.status || err.message}`)
      return false
    }
  }
}

async function runTests() {
  try {
    let testCount = 0

    console.log('--- SCENARIO 1: Category Management ---')
    // 1. Get Active Categories
    let res = await apiClient.get('/categories?isActive=true')
    console.log(`[TEST ${++testCount}] [GET /categories]`, res.data.message)

    // 2. Get Inactive Categories
    res = await apiClient.get('/categories?isActive=false')
    console.log(`[TEST ${++testCount}] [GET /categories?isActive=false]`, res.data.message)

    // 3. Invalid Category Creation (missing name)
    await expectError(
      apiClient.post('/admin/categories', { slug: 'no-name' }),
      422,
      `[TEST ${++testCount}] POST /admin/categories with missing name`
    )

    // 4. Invalid Category Creation (empty name)
    await expectError(
      apiClient.post('/admin/categories', { name: '', slug: 'empty-name' }),
      422,
      `[TEST ${++testCount}] POST /admin/categories with empty name`
    )

    // 5. Create Category
    const categorySlug = 'laptop-test-' + Date.now()
    res = await apiClient.post('/admin/categories', {
      name: 'Laptop Test',
      slug: categorySlug,
      description: 'Laptop Test',
      isActive: true,
      dynamicAttributes: [
        { key: 'ram', label: 'RAM', dataType: 'string', isRequired: true, options: ['8GB', '16GB', '32GB'] }
      ]
    })
    console.log(`[TEST ${++testCount}] [POST /admin/categories]`, res.data.message)
    const categoryId = res.data.data._id

    // 6. Update Category
    res = await apiClient.put(`/admin/categories/${categoryId}`, {
      name: 'Laptop Test (Updated)',
      description: 'Laptop Test Updated'
    })
    console.log(`[TEST ${++testCount}] [PUT /admin/categories/:id]`, res.data.message)

    console.log('\n--- SCENARIO 2: Product Management ---')
    
    // 7. Invalid Product Creation (Negative Price)
    await expectError(
      apiClient.post('/admin/products', {
        name: 'Bad Product',
        categoryID: categoryId,
        basePrice: -500 // Invalid
      }),
      422,
      `[TEST ${++testCount}] POST /admin/products with negative price`
    )

    // 8. Create Product 1
    res = await apiClient.post('/admin/products', {
      name: 'MacBook Pro M3 Test',
      categoryID: categoryId,
      basePrice: 20000000,
      slug: 'macbook-pro-m3-test-' + Date.now(),
      description: 'Apple MacBook Pro M3',
      images: ['url1'],
      attributes: { ram: '16GB' }
    })
    console.log(`[TEST ${++testCount}] [POST /admin/products] (1)`, res.data.message)
    const productId1 = res.data.data._id

    // 9. Create Product 2
    res = await apiClient.post('/admin/products', {
      name: 'Dell XPS 15 Test',
      categoryID: categoryId,
      basePrice: 15000000,
      slug: 'dell-xps-15-test-' + Date.now(),
      description: 'Dell XPS 15 Laptop',
      attributes: { ram: '32GB' }
    })
    console.log(`[TEST ${++testCount}] [POST /admin/products] (2)`, res.data.message)

    console.log('\n--- SCENARIO 3: Product Search & Queries ---')

    // 10. Search Products (Keyword)
    res = await apiClient.get(`/products?keyword=MacBook&limit=10&page=1`)
    console.log(`[TEST ${++testCount}] [GET /products?keyword...]`, res.data.message, `(Total items: ${res.data.data?.pagination?.totalItems || 0})`)

    // 11. Search Products (Sorting by Price DESC)
    res = await apiClient.get(`/products?category=${categorySlug}&sort=priceDESC`)
    console.log(`[TEST ${++testCount}] [GET /products?sort=priceDESC]`, res.data.message)

    // 12. Search Products (Pagination: limit=1, page=2)
    res = await apiClient.get(`/products?limit=1&page=2`)
    console.log(`[TEST ${++testCount}] [GET /products?limit=1&page=2]`, res.data.message)

    // 13. Search Products by Attributes (attrs[ram]=32GB)
    res = await apiClient.get(`/products?attrs[ram]=32GB`)
    console.log(`[TEST ${++testCount}] [GET /products?attrs...]`, res.data.message, `(Total items: ${res.data.data?.pagination?.totalItems || 0})`)

    // 14. Complex Search (Multiple Filters)
    res = await apiClient.get(`/products?category=${categorySlug}&priceMin=100000&priceMax=30000000&attrs[ram]=16GB`)
    console.log(`[TEST ${++testCount}] [GET /products?priceMin&priceMax&attrs...]`, res.data.message)

    // 15. Invalid Pagination (page = string)
    await expectError(
      apiClient.get(`/products?page=invalid`),
      422,
      `[TEST ${++testCount}] GET /products?page=invalid`
    )

    // 16. Invalid Pagination (limit = 200 > 100 max)
    await expectError(
      apiClient.get(`/products?limit=200`),
      422,
      `[TEST ${++testCount}] GET /products?limit=200`
    )

    // 17. Get Product Detail
    res = await apiClient.get(`/products/${productId1}`)
    console.log(`[TEST ${++testCount}] [GET /products/${productId1}]`, res.data.message)

    // 18. Get Product Detail (Invalid Mongo ID format)
    await expectError(
      apiClient.get(`/products/invalid-id-format`),
      422,
      `[TEST ${++testCount}] GET /products/:id with invalid ID format`
    )

    // 19. Get Product Detail (Valid format but non-existent ID)
    const fakeObjectId = '5f8d04f3b54764421b7156e0'
    await expectError(
      apiClient.get(`/products/${fakeObjectId}`),
      404,
      `[TEST ${++testCount}] GET /products/:id with non-existent ID`
    )

    // 20. Update Product with Invalid Data (basePrice = string)
    await expectError(
      apiClient.put(`/admin/products/${productId1}`, { basePrice: 'free' }),
      422,
      `[TEST ${++testCount}] PUT /admin/products/:id with basePrice as string`
    )

    // 21. Update Product Successfully
    res = await apiClient.put(`/admin/products/${productId1}`, {
      name: 'MacBook Pro M3 Test (Updated)',
      basePrice: 25000000,
      attributes: { ram: '32GB' }
    })
    console.log(`[TEST ${++testCount}] [PUT /admin/products/:id]`, res.data.message)

    // 22. Soft Delete Product (Non-existent ID)
    await expectError(
      apiClient.delete(`/admin/products/${fakeObjectId}`),
      404,
      `[TEST ${++testCount}] DELETE /admin/products/:id with non-existent ID`
    )

    // 23. Soft Delete Product Successfully
    res = await apiClient.delete(`/admin/products/${productId1}`)
    console.log(`[TEST ${++testCount}] [DELETE /admin/products/:id]`, res.data.message)

    console.log('\n--- SCENARIO 4: Reviews ---')
    
    // 24. Invalid Review Submit (Missing fields)
    await expectError(
      apiClient.post(`/products/${productId1}/reviews`, { images: [] }),
      422,
      `[TEST ${++testCount}] POST /reviews with missing fields`
    )

    // 25. Invalid Review Submit (Rating > 5)
    await expectError(
      apiClient.post(`/products/${productId1}/reviews`, { rating: 10, comment: 'Fake' }),
      422,
      `[TEST ${++testCount}] POST /reviews with invalid rating`
    )

    // 26. Valid Review Submit
    res = await apiClient.post(`/products/${productId1}/reviews`, {
      rating: 5,
      comment: 'Excellent product',
      images: []
    })
    console.log(`[TEST ${++testCount}] [POST /reviews]`, res.data.message)

    // 27. Get Reviews
    res = await apiClient.get(`/products/${productId1}/reviews`)
    console.log(`[TEST ${++testCount}] [GET /reviews]`, res.data.message, `(Count: ${res.data.data.length})`)

    console.log('\n--- SCENARIO 5: User Activity Logs ---')

    // 28. Invalid Log Action Type
    await expectError(
      apiClient.post('/logs', { actionType: 'INVALID_TYPE', targetID: categoryId }),
      422,
      `[TEST ${++testCount}] POST /logs with invalid action type`
    )

    // 29. Invalid Log Submit (Missing targetID)
    await expectError(
      apiClient.post('/logs', { actionType: 'SEARCH' }),
      422,
      `[TEST ${++testCount}] POST /logs with missing targetID`
    )

    // 30. Valid Log Submit
    res = await apiClient.post('/logs', {
      actionType: 'VIEW_PRODUCT',
      targetID: productId1,
      metadata: { device: 'Mobile' }
    })
    console.log(`[TEST ${++testCount}] [POST /logs]`, res.data.message)

    // Soft Delete Category
    console.log('\n--- CLEANUP ---')
    res = await apiClient.delete(`/admin/categories/${categoryId}`)
    console.log(`[TEST ${++testCount}] [DELETE /admin/categories/:id]`, res.data.message)

    console.log('\n--- SCENARIO 6: Inventory Management ---')
    // 32. Create Inventory Successfully
    const testSku = 'SKU-TEST-' + Date.now()
    res = await apiClient.post('/admin/inventories', {
      product_id: productId1,
      sku: testSku,
      stock_quantity: 100
    })
    console.log(`[TEST ${++testCount}] [POST /admin/inventories]`, res.data.message)
    const inventoryId = res.data.result.inventory_id

    // 33. Create Inventory - Duplicate SKU (Wait, SKU is unique)
    await expectError(
      apiClient.post('/admin/inventories', {
        product_id: productId1,
        sku: testSku,
        stock_quantity: 50
      }),
      409,
      `[TEST ${++testCount}] POST /admin/inventories with duplicate SKU`
    )

    // 34. Create Inventory - Invalid Product ID
    await expectError(
      apiClient.post('/admin/inventories', {
        product_id: 'invalid-id',
        sku: 'SKU-FAIL',
        stock_quantity: 10
      }),
      422,
      `[TEST ${++testCount}] POST /admin/inventories with invalid product_id`
    )

    // 35. Update Inventory Quantity Successfully
    res = await apiClient.put(`/admin/inventories/${inventoryId}`, {
      stock_quantity: 150
    })
    console.log(`[TEST ${++testCount}] [PUT /admin/inventories/:id]`, res.data.message)

    // 36. Update Inventory - Negative Quantity
    await expectError(
      apiClient.put(`/admin/inventories/${inventoryId}`, {
        stock_quantity: -10
      }),
      422,
      `[TEST ${++testCount}] PUT /admin/inventories/:id with negative stock_quantity`
    )

    // 37. Get Inventories by Product ID
    res = await apiClient.get(`/inventories/product/${productId1}`)
    console.log(`[TEST ${++testCount}] [GET /inventories/product/:productId]`, res.data.message, `(Count: ${res.data.result.length})`)

    // 38. Get Inventories by SKU
    res = await apiClient.get(`/inventories/sku/${testSku}`)
    console.log(`[TEST ${++testCount}] [GET /inventories/sku/:sku]`, res.data.message, `(Count: ${res.data.result.length})`)

    console.log(`\n--- All ${testCount} tests finished smoothly ---`)
  } catch (err) {
    if (err.response) {
      console.error('\n--- API Error ---', err.response.status, JSON.stringify(err.response.data, null, 2))
    } else {
      console.error('\n--- Error ---', err.message)
    }
  }
}

runTests()
