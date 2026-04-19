"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INVENTORY_MESSAGES = exports.LOG_MESSAGES = exports.REVIEW_MESSAGES = exports.PRODUCT_MESSAGES = exports.CATEGORY_MESSAGES = exports.LIKE_MESSAGES = exports.BOOKMARK_MESSAGES = exports.USERS_MESSAGES = exports.STAT_MESSAGES = exports.PAYMENT_MESSAGES = exports.ORDER_MESSAGES = exports.USER_MESSAGES = exports.AUTH_MESSAGES = void 0;
exports.AUTH_MESSAGES = {
    // Register
    REGISTER_SUCCESS: 'Đăng ký thành công',
    EMAIL_ALREADY_EXISTS: 'Email đã tồn tại',
    // Login
    LOGIN_SUCCESS: 'Đăng nhập thành công',
    EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email hoặc mật khẩu không đúng',
    // Token
    ACCESS_TOKEN_IS_REQUIRED: 'Access token là bắt buộc',
    ACCESS_TOKEN_IS_INVALID: 'Access token không hợp lệ',
    REFRESH_TOKEN_IS_REQUIRED: 'Refresh token là bắt buộc',
    REFRESH_TOKEN_IS_INVALID: 'Refresh token không hợp lệ hoặc đã được sử dụng',
    REFRESH_TOKEN_SUCCESS: 'Cấp lại token thành công',
    // Logout
    LOGOUT_SUCCESS: 'Đăng xuất thành công',
    // Validation
    VALIDATION_ERROR: 'Validation error',
    EMAIL_IS_REQUIRED: 'Email là bắt buộc',
    EMAIL_IS_INVALID: 'Email không hợp lệ',
    PASSWORD_IS_REQUIRED: 'Mật khẩu là bắt buộc',
    PASSWORD_MUST_BE_STRONG: 'Mật khẩu phải từ 6-50 ký tự và có ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt',
    FULL_NAME_IS_REQUIRED: 'Họ tên là bắt buộc',
    PHONE_NUM_IS_REQUIRED: 'Số điện thoại là bắt buộc',
    PHONE_NUM_IS_INVALID: 'Số điện thoại không hợp lệ'
};
exports.USER_MESSAGES = {
    GET_PROFILE_SUCCESS: 'Lấy thông tin thành công',
    UPDATE_PROFILE_SUCCESS: 'Cập nhật hồ sơ thành công',
    USER_NOT_FOUND: 'Người dùng không tồn tại',
    FORBIDDEN: 'Bạn không có quyền thực hiện hành động này',
    // Address
    GET_ADDRESSES_SUCCESS: 'Lấy danh sách địa chỉ thành công',
    CREATE_ADDRESS_SUCCESS: 'Thêm địa chỉ thành công',
    UPDATE_ADDRESS_SUCCESS: 'Cập nhật địa chỉ thành công',
    DELETE_ADDRESS_SUCCESS: 'Đã xóa địa chỉ',
    SET_DEFAULT_ADDRESS_SUCCESS: 'Đã đặt làm địa chỉ mặc định',
    ADDRESS_NOT_FOUND: 'Địa chỉ không tồn tại',
    ADDRESS_LINE_IS_REQUIRED: 'Địa chỉ cụ thể là bắt buộc',
    CITY_IS_REQUIRED: 'Thành phố là bắt buộc',
    DISTRICT_IS_REQUIRED: 'Quận/Huyện là bắt buộc'
};
exports.ORDER_MESSAGES = {
    CHECKOUT_SUCCESS: 'Đặt hàng thành công',
    GET_ORDERS_SUCCESS: 'Danh sách đơn hàng',
    GET_ORDER_DETAIL_SUCCESS: 'Chi tiết đơn hàng',
    UPDATE_ORDER_STATUS_SUCCESS: 'Cập nhật trạng thái đơn hàng thành công',
    ORDER_NOT_FOUND: 'Đơn hàng không tồn tại',
    OUT_OF_STOCK: 'OUT_OF_STOCK',
    INVALID_PAYMENT_METHOD: 'Phương thức thanh toán không hợp lệ',
    INVALID_ORDER_STATUS: 'Trạng thái đơn hàng không hợp lệ',
    ITEMS_ARE_REQUIRED: 'Danh sách sản phẩm là bắt buộc',
    SHIPPING_ADDRESS_IS_REQUIRED: 'Địa chỉ giao hàng là bắt buộc'
};
exports.PAYMENT_MESSAGES = {
    PROCESS_SUCCESS: 'Thanh toán thành công',
    PAYMENT_NOT_FOUND: 'Thanh toán không tồn tại',
    ORDER_ALREADY_PAID: 'Đơn hàng đã được thanh toán'
};
exports.STAT_MESSAGES = {
    GET_REVENUE_SUCCESS: 'Thống kê doanh thu',
    START_DATE_IS_REQUIRED: 'startDate là bắt buộc',
    END_DATE_IS_REQUIRED: 'endDate là bắt buộc'
};
// Keep for backward compat with sample
exports.USERS_MESSAGES = {
    VALIDATION_ERROR: 'Validation error',
    ACCESS_TOKEN_IS_REQUIRED: 'Access token là bắt buộc'
};
exports.BOOKMARK_MESSAGES = {
    BOOKMARK_SUCCESSFULLY: 'Bookmark successfully',
    UNBOOKMARK_SUCCESSFULLY: 'Unbookmark successfully'
};
exports.LIKE_MESSAGES = {
    LIKE_SUCCESSFULLY: 'Like successfully',
    UNLIKE_SUCCESSFULLY: 'Unlike successfully'
};
exports.CATEGORY_MESSAGES = {
    CATEGORIES_FETCHED: 'Get categories successfully',
    CATEGORY_FETCHED: 'Get category successfully',
    CATEGORY_CREATED: 'Category created successfully',
    CATEGORY_UPDATED: 'Category updated successfully',
    CATEGORY_DELETED: 'Category deleted successfully (hidden)',
    CATEGORY_NOT_FOUND: 'Category not found',
    CATEGORY_SLUG_ALREADY_EXISTS: 'Category slug already exists',
    CATEGORY_ID_INVALID: 'Category id is invalid'
};
exports.PRODUCT_MESSAGES = {
    PRODUCTS_FETCHED: 'Get products successfully',
    PRODUCT_FETCHED: 'Get product detail successfully',
    PRODUCT_CREATED: 'Product created successfully',
    PRODUCT_UPDATED: 'Product updated successfully',
    PRODUCT_DELETED: 'Product deleted successfully (inactive)',
    PRODUCT_NOT_FOUND: 'Product not found',
    PRODUCT_ID_INVALID: 'Product id is invalid',
    CATEGORY_NOT_ACTIVE: 'Category does not exist or is inactive'
};
exports.REVIEW_MESSAGES = {
    REVIEWS_FETCHED: 'Get reviews successfully',
    REVIEW_CREATED: 'Review submitted successfully',
    REVIEW_RATING_INVALID: 'Rating must be an integer between 1 and 5',
    REVIEW_COMMENT_REQUIRED: 'Comment is required',
    TARGET_ID_REQUIRED: 'Target ID is required'
};
exports.LOG_MESSAGES = {
    LOG_CREATED: 'Log recorded',
    LOG_ACTION_TYPE_INVALID: 'action_type is invalid'
};
exports.INVENTORY_MESSAGES = {
    PRODUCT_ID_IS_REQUIRED: 'Product ID is required',
    PRODUCT_ID_MUST_BE_A_STRING: 'Product ID must be a string',
    PRODUCT_ID_IS_INVALID: 'Product ID is invalid',
    SKU_IS_REQUIRED: 'SKU is required',
    SKU_MUST_BE_A_STRING: 'SKU must be a string',
    STOCK_QUANTITY_IS_REQUIRED: 'Stock quantity is required',
    STOCK_QUANTITY_MUST_BE_A_POSITIVE_INTEGER: 'Stock quantity must be a positive integer',
    CREATE_INVENTORY_SUCCESS: 'Create inventory successfully',
    UPDATE_INVENTORY_SUCCESS: 'Update inventory quantity successfully',
    GET_INVENTORY_SUCCESS: 'Get inventory successfully',
    INVENTORY_SKU_ALREADY_EXISTS: 'Inventory for this SKU already exists',
    INVENTORY_NOT_FOUND: 'Inventory record not found',
    INSUFFICIENT_STOCK: 'Insufficient stock for the requested item'
};
