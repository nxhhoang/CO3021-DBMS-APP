"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionType = exports.PaymentMethod = exports.PaymentStatus = exports.OrderStatus = exports.UserRole = exports.TokenType = void 0;
var TokenType;
(function (TokenType) {
    TokenType[TokenType["AccessToken"] = 0] = "AccessToken";
    TokenType[TokenType["RefreshToken"] = 1] = "RefreshToken";
})(TokenType || (exports.TokenType = TokenType = {}));
var UserRole;
(function (UserRole) {
    UserRole["CUSTOMER"] = "CUSTOMER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["PROCESSING"] = "PROCESSING";
    OrderStatus["SHIPPED"] = "SHIPPED";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["CANCELLED"] = "CANCELLED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["COMPLETED"] = "COMPLETED";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["COD"] = "COD";
    PaymentMethod["BANKING"] = "BANKING";
    PaymentMethod["E_WALLET"] = "E_WALLET";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var ActionType;
(function (ActionType) {
    ActionType["VIEW_PRODUCT"] = "VIEW_PRODUCT";
    ActionType["SEARCH"] = "SEARCH";
    ActionType["ADD_TO_CART"] = "ADD_TO_CART";
})(ActionType || (exports.ActionType = ActionType = {}));
