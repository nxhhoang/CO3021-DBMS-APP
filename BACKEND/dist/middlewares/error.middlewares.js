"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultErrorHandler = void 0;
const lodash_1 = require("lodash");
const httpStatus_1 = __importDefault(require("../constants/httpStatus"));
const Errors_1 = require("../models/Errors");
const defaultErrorHandler = (err, req, res, _next) => {
    try {
        if (err instanceof Errors_1.ErrorWithStatus) {
            return res.status(err.status).json((0, lodash_1.omit)(err, ['status']));
        }
        const finalError = {};
        if (typeof err === 'object' && err !== null) {
            Object.getOwnPropertyNames(err).forEach((key) => {
                const descriptor = Object.getOwnPropertyDescriptor(err, key);
                if (!descriptor?.configurable || !descriptor?.writable)
                    return;
                finalError[key] = err[key];
            });
        }
        res.status(httpStatus_1.default.INTERNAL_SERVER_ERROR).json({
            message: finalError.message || 'Internal server error',
            errorInfo: (0, lodash_1.omit)(finalError, ['stack'])
        });
    }
    catch (error) {
        res.status(httpStatus_1.default.INTERNAL_SERVER_ERROR).json({
            message: 'Internal server error',
            errorInfo: (0, lodash_1.omit)(error, ['stack'])
        });
    }
};
exports.defaultErrorHandler = defaultErrorHandler;
