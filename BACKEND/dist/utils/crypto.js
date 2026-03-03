"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha256 = sha256;
exports.hashPassword = hashPassword;
const crypto_1 = require("crypto");
const config_1 = require("../constants/config");
function sha256(content) {
    return (0, crypto_1.createHash)('sha256').update(content).digest('hex');
}
function hashPassword(password) {
    return sha256(password + config_1.envConfig.passwordSecret);
}
