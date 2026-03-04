"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class Review {
    _id;
    product_id;
    user_id;
    user_name;
    rating;
    comment;
    images;
    created_at;
    updated_at;
    constructor(review) {
        const date = new Date();
        this._id = review._id || new mongodb_1.ObjectId();
        this.product_id = review.product_id;
        this.user_id = review.user_id;
        this.user_name = review.user_name;
        this.rating = review.rating;
        this.comment = review.comment;
        this.images = review.images || [];
        this.created_at = review.created_at || date;
        this.updated_at = review.updated_at || date;
    }
}
exports.default = Review;
