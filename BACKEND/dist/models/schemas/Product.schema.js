"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class Product {
    _id;
    name;
    slug;
    categoryId;
    base_price;
    description;
    images;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    attributes;
    avg_rating;
    total_reviews;
    total_sold;
    is_active;
    created_at;
    updated_at;
    constructor(product) {
        const date = new Date();
        this._id = product._id || new mongodb_1.ObjectId();
        this.name = product.name;
        this.slug = product.slug || '';
        this.categoryId = product.categoryId;
        this.base_price = product.base_price;
        this.description = product.description || '';
        this.images = product.images || [];
        this.attributes = product.attributes || {};
        this.avg_rating = product.avg_rating ?? 0;
        this.total_reviews = product.total_reviews ?? 0;
        this.total_sold = product.total_sold ?? 0;
        this.is_active = product.is_active !== undefined ? product.is_active : true;
        this.created_at = product.created_at || date;
        this.updated_at = product.updated_at || date;
    }
}
exports.default = Product;
