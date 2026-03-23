const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()

const BASE_URL = 'http://localhost:4000/api/v1'

// --- State and Helpers ---
let testCount = 0
let userToken = ''
let adminToken = ''
let refreshToken = ''
let categoryId = ''
let categorySlug = ''
let productId = ''
let inventoryId = ''
let orderId = ''
let addressId = ''

const apiClient = axios.create({
  baseURL: BASE_URL,
  validateStatus: () => true // Handle statuses manually
})

function logResult(name, res, expectedStatus = 200) {
  testCount++
  if (res.status === expectedStatus) {
    console.log(`[PASS] [TEST ${testCount}] [${res.config.method.toUpperCase()} ${res.config.url}] - ${name}`)
  } else {
    console.error(`[FAIL] [TEST ${testCount}] [${res.config.method.toUpperCase()} ${res.config.url}] - ${name}`)
    console.error(`       Expected ${expectedStatus}, got ${res.status}. Error:`, JSON.stringify(res.data, null, 2))
  }
}

async function runAllTests() {
  console.log('🚀 Starting Comprehensive 50-Test Suite spanning TEST_PLAN.md\n')

  // ============================================================
  // PART 1: AUTHENTICATION & USER (Scenario 1, 2, 3)
  // ============================================================
  console.log('--- PART 1: AUTHENTICATION & USER ---')
  const testEmail = `testuser_${Date.now()}@example.com`
  const testPassword = 'Password123!'

  // 1. Register
  let res = await apiClient.post('/auth/register', {
    email: testEmail,
    password: testPassword,
    fullName: 'Test User 50',
    phoneNum: '0987654321'
  })
  logResult('User Registration', res, 201)
  const userId = res.data.data?.user_id

  // 2. Register Duplicate
  res = await apiClient.post('/auth/register', {
    email: testEmail,
    password: testPassword,
    fullName: 'Duplicate User',
    phoneNum: '0000000000'
  })
  logResult('Register Duplicate Email (Expected 400)', res, 400)

  // 3. Register Validation Error (Short pass)
  res = await apiClient.post('/auth/register', {
    email: 'bad@email.com',
    password: '123'
  })
  logResult('Register Validation Check (Short Password)', res, 422)

  // 4. Login (User)
  res = await apiClient.post('/auth/login', {
    email: testEmail,
    password: testPassword
  })
  logResult('User Login', res, 200)
  userToken = res.data.data?.accessToken
  refreshToken = res.data.data?.refreshToken

  // 5. Login (Admin - Using seeded account from .env)
  res = await apiClient.post('/auth/login', {
    email: 'example@example.com',
    password: 'admin_password'
  })
  logResult('Admin Login', res, 200)
  adminToken = res.data.data?.accessToken
  if (!adminToken) console.error('      [CRITICAL] Admin Token is missing. Admin tests will fail.')

  // 6. Login Wrong Password
  res = await apiClient.post('/auth/login', {
    email: testEmail,
    password: 'WrongPassword'
  })
  logResult('Login Wrong Password (Expected 401)', res, 401) 

  // 7. Get Profile (Success)
  res = await apiClient.get('/users/profile', { headers: { Authorization: `Bearer ${userToken}` } })
  logResult('Get User Profile', res, 200)

  // 8. Get Profile (No Token)
  res = await apiClient.get('/users/profile')
  logResult('Get Profile No Token (Expected 401)', res, 401)

  // 9. Add Address
  res = await apiClient.post('/users/addresses', 
    { addressLine: '123 New St', city: 'HCM', district: 'Q1', isDefault: true },
    { headers: { Authorization: `Bearer ${userToken}` } }
  )
  logResult('Add User Address', res, 201)
  addressId = res.data.data?.addressID

  // 10. Set Default Address
  res = await apiClient.patch(`/users/addresses/${addressId}/set-default`, {}, { headers: { Authorization: `Bearer ${userToken}` } })
  logResult('Set Default Address', res, 200)


  // ============================================================
  // PART 2: PRODUCT & DISCOVERY (Scenario 4, 5, 6)
  // ============================================================
  console.log('\n--- PART 2: PRODUCT & DISCOVERY ---')

  // 11. Get Categories
  res = await apiClient.get('/categories')
  logResult('Get All Categories', res, 200)

  // 12. Admin Create Category
  categorySlug = 'test-cat-' + Date.now()
  res = await apiClient.post('/admin/categories', {
    name: 'Test Category',
    slug: categorySlug,
    description: 'Unit Testing Category',
    isActive: true,
    dynamicAttributes: [{ key: 'color', label: 'Color', dataType: 'string', isRequired: true, options: ['Red', 'Blue'] }]
  }, { headers: { Authorization: `Bearer ${adminToken}` } })
  logResult('Admin Create Category', res, 201)
  categoryId = res.data.data?._id
  if (!categoryId) console.error('      [CRITICAL] Category ID is missing.')

  // 13. Search Products (Empty Query)
  res = await apiClient.get('/products')
  logResult('Get All Products (Public)', res, 200)

  // 14. Create Product (Admin)
  const productSlug = 'test-prod-' + Date.now()
  res = await apiClient.post('/admin/products', {
    name: 'Test Product 50',
    slug: productSlug,
    categoryID: categoryId,
    basePrice: 1000000,
    description: 'High performance testing unit',
    attributes: { color: 'Blue' }
  }, { headers: { Authorization: `Bearer ${adminToken}` } })
  logResult('Admin Create Product', res, 201)
  productId = res.data.data?._id
  if (!productId) console.error('      [CRITICAL] Product ID is missing.')

  // 15. Create Product - Negative Price
  res = await apiClient.post('/admin/products', { name: 'Bad Price', categoryID: categoryId, basePrice: -1 }, { headers: { Authorization: `Bearer ${adminToken}` } })
  logResult('Create Product Negative Price (Expected 422)', res, 422)

  // 16. Search by Keyword
  res = await apiClient.get('/products?keyword=Test')
  logResult('Search Products by Keyword', res, 200)

  // 17. Search by Category Slug
  res = await apiClient.get(`/products?category=${categorySlug}`)
  logResult('Filter Products by Category', res, 200)

  // 18. Search by Price Range
  res = await apiClient.get('/products?priceMin=500000&priceMax=2000000')
  logResult('Filter Products by Price Range', res, 200)

  // 19. Search by Dynamic Attribute
  res = await apiClient.get('/products?attrs[color]=Blue')
  logResult('Filter Products by Attribute (Mongo Schema-less)', res, 200)

  // 20. Pagination Check (Limit 1)
  res = await apiClient.get('/products?limit=1')
  logResult('Search Pagination Check', res, 200)

  // 21. Update Product (Admin)
  res = await apiClient.put(`/admin/products/${productId}`, { name: 'Updated Product Name' }, { headers: { Authorization: `Bearer ${adminToken}` } })
  logResult('Admin Update Product', res, 200)

  // 22. Get Product Detail (Hybrid: Mongo + Postgres Stock)
  res = await apiClient.get(`/products/${productId}`)
  logResult('Get Product Detail (Hybrid Fetching)', res, 200)

  // 23. Get Non-existent Product Detail
  res = await apiClient.get('/products/507f1f77bcf86cd799439011')
  logResult('Get Non-existent Product (Expected 404)', res, 404)

  // 24. Delete Product (Soft Delete)
  res = await apiClient.delete(`/admin/products/${productId}`, { headers: { Authorization: `Bearer ${adminToken}` } })
  logResult('Admin Soft Delete Product', res, 200)

  // 25. Create another product for Checkout Testing
  res = await apiClient.post('/admin/products', {
    name: 'Check-out Product',
    slug: 'checkout-' + Date.now(),
    categoryID: categoryId,
    basePrice: 500000,
    attributes: { color: 'Red' }
  }, { headers: { Authorization: `Bearer ${adminToken}` } })
  logResult('Create Checkout Product', res, 201)
  productId = res.data.data?._id


  // ============================================================
  // PART 3: SHOPPING & TRANSACTION (Scenario 7)
  // ============================================================
  console.log('\n--- PART 3: SHOPPING & TRANSACTION ---')

  // 26. Create Inventory for Product
  const sku = 'SKU-' + Date.now()
  res = await apiClient.post('/admin/inventories', {
    product_id: productId,
    sku,
    stock_quantity: 10
  }, { headers: { Authorization: `Bearer ${adminToken}` } })
  logResult('Admin Add Product to Inventory (Postgres)', res, 200)
  inventoryId = res.data.result?.inventory_id

  // 27. Create Inventory Duplicate SKU
  res = await apiClient.post('/admin/inventories', { product_id: productId, sku, stock_quantity: 5 }, { headers: { Authorization: `Bearer ${adminToken}` } })
  logResult('Add Duplicate SKU (Expected 409)', res, 409)

  // 28. Checkout Order (Scenario 7)
  res = await apiClient.post('/orders', {
    shippingAddressId: addressId,
    paymentMethod: 'COD',
    items: [{ productId: productId, productName: 'Check-out Product', sku, quantity: 2, unitPrice: 500000 }]
  }, { headers: { Authorization: `Bearer ${userToken}` } })
  logResult('Order Checkout (ACID Transaction)', res, 201)
  orderId = res.data.data?.orderID

  // 29. Verify Stock Deduction
  res = await apiClient.get(`/inventories/sku/${sku}`)
  const currentStock = res.data.result?.[0]?.stock_quantity
  logResult('Verify Stock Deduction (Postgres Logic)', res, 200)
  if (currentStock !== 8) {
    console.error(`      [FAIL] [LOGIC] Stock deduction failed. Expected 8, got ${currentStock}`)
  }

  // 30. Checkout Out of Stock (Buy 10 more when 8 left)
  res = await apiClient.post('/orders', {
    shippingAddressId: addressId,
    paymentMethod: 'COD',
    items: [{ productId: productId, productName: 'Check-out Product', sku, quantity: 10, unitPrice: 500000 }]
  }, { headers: { Authorization: `Bearer ${userToken}` } })
  logResult('Order Checkout Out of Stock (Expected 400)', res, 400) 

  // 31. Order with Invalid Address
  res = await apiClient.post('/orders', { shippingAddressId: 9999, paymentMethod: 'COD', items: [] }, { headers: { Authorization: `Bearer ${userToken}` } })
  logResult('Order with Invalid Address (Expected 422)', res, 422)

  // 32. Get Inventories by Product ID
  res = await apiClient.get(`/inventories/product/${productId}`)
  logResult('Query Inventory by Product ID', res, 200)

  // 33. Update Inventory Quantity Manual
  res = await apiClient.put(`/admin/inventories/${inventoryId}`, { stock_quantity: 20 }, { headers: { Authorization: `Bearer ${adminToken}` } })
  logResult('Admin Update Inventory Quantity', res, 200)


  // ============================================================
  // PART 4: POST-PURCHASE (Scenario 8, 9, 10)
  // ============================================================
  console.log('\n--- PART 4: POST-PURCHASE ---')

  // 34. Process Payment (Scenario 8)
  res = await apiClient.post('/payments/process', { orderID: orderId, paymentMethod: 'COD' }, { headers: { Authorization: `Bearer ${userToken}` } })
  logResult('Process Payment (Mock)', res, 200)

  // 35. Get Order History (Scenario 10)
  res = await apiClient.get('/orders', { headers: { Authorization: `Bearer ${userToken}` } })
  logResult('Get Order History', res, 200)

  // 36. Get Order Detail
  res = await apiClient.get(`/orders/${orderId}`, { headers: { Authorization: `Bearer ${userToken}` } })
  logResult('Get Order Detail', res, 200)

  // 37. Admin Update Order Status (to DELIVERED)
  res = await apiClient.put(`/admin/orders/${orderId}/status`, { status: 'DELIVERED' }, { headers: { Authorization: `Bearer ${adminToken}` } })
  logResult('Admin Set Order to DELIVERED', res, 200)

  // 38. Write Review (Scenario 9 - Verified Purchase)
  res = await apiClient.post(`/products/${productId}/reviews`, {
    rating: 5,
    comment: 'Great product, verified buyer!',
    images: []
  }, { headers: { Authorization: `Bearer ${userToken}` } })
  logResult('Post Review (Verified Purchase)', res, 201)

  // 39. Write Review for Non-purchased Product
  const dummyProdId = '507f1f77bcf86cd799439011'
  res = await apiClient.post(`/products/${dummyProdId}/reviews`, { rating: 1, comment: 'Spam' }, { headers: { Authorization: `Bearer ${userToken}` } })
  logResult('Post Review Non-purchased (Expected 403)', res, 403)

  // 40. Review Validation Error (Rating 10)
  res = await apiClient.post(`/products/${productId}/reviews`, { rating: 10, comment: 'Too high' }, { headers: { Authorization: `Bearer ${userToken}` } })
  logResult('Review Validation (Rating > 5)', res, 422)

  // 41. Get Product Reviews
  res = await apiClient.get(`/products/${productId}/reviews`)
  logResult('Get Product Reviews', res, 200)


  // ============================================================
  // PART 5: SYSTEM & ANALYTICS (Scenario 11, 12)
  // ============================================================
  console.log('\n--- PART 5: SYSTEM & ANALYTICS ---')

  // 42. Post Log (Scenario 11)
  res = await apiClient.post('/logs', { actionType: 'VIEW_PRODUCT', targetID: productId, metadata: { device: 'PC' } })
  logResult('System Logging (View Product)', res, 200)

  // 43. Post Log (Search)
  res = await apiClient.post('/logs', { actionType: 'SEARCH', targetID: categoryId, metadata: { keyword: 'test' } })
  logResult('System Logging (Search)', res, 200)

  // 44. Log Validation Error
  res = await apiClient.post('/logs', { actionType: 'HACK' })
  logResult('Log Validation Error (Invalid Type)', res, 422)

  // 45. Admin Revenue Stats (Scenario 12)
  res = await apiClient.get('/admin/stats/revenue?startDate=2023-01-01&endDate=2026-12-31', { headers: { Authorization: `Bearer ${adminToken}` } })
  logResult('Get Admin Revenue Stats', res, 200)

  // 46. Stats Validation Error (Missing Date)
  res = await apiClient.get('/admin/stats/revenue', { headers: { Authorization: `Bearer ${adminToken}` } })
  logResult('Stats Validation (Missing Dates)', res, 422)

  // 47. Logout
  res = await apiClient.post('/auth/logout', { refreshToken }, { headers: { Authorization: `Bearer ${userToken}` } })
  logResult('User Logout', res, 200)

  // 48. Token Profile Check after Logout
  res = await apiClient.get('/users/profile', { headers: { Authorization: `Bearer ${userToken}` } })
  logResult('Access Profile After Logout (Expected 401)', res, 401)

  // 49. Token Refresh Check after Logout
  res = await apiClient.post('/auth/refresh-token', { refreshToken })
  logResult('Refresh Token After Logout (Expected 401)', res, 401)

  // 50. Final Cleanup - Delete Category
  res = await apiClient.delete(`/admin/categories/${categoryId}`, { headers: { Authorization: `Bearer ${adminToken}` } })
  logResult('Cleanup: Soft Delete Category', res, 200)


  console.log(`\n--- Finished ${testCount} tests ---`)
}

runAllTests().catch(err => {
  console.error('Fatal Error during test execution:', err)
})
