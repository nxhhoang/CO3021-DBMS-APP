"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class UserActivityLog {
    _id;
    user_id;
    action_type;
    target_id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata;
    timestamp;
    constructor(log) {
        this._id = log._id || new mongodb_1.ObjectId();
        this.user_id = log.user_id || null;
        this.action_type = log.action_type;
        this.target_id = log.target_id;
        this.metadata = log.metadata || {};
        this.timestamp = log.timestamp || new Date();
    }
}
exports.default = UserActivityLog;
