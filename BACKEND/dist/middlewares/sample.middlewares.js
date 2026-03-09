"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessTokenValidator = exports.createSampleValidator = void 0;
const express_validator_1 = require("express-validator");
const validation_1 = require("../utils/validation");
const commons_1 = require("../utils/commons");
const Errors_1 = require("../models/Errors");
const httpStatus_1 = __importDefault(require("../constants/httpStatus"));
const messages_1 = require("../constants/messages");
exports.createSampleValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    name: {
        notEmpty: {
            errorMessage: 'Name is required'
        },
        isString: {
            errorMessage: 'Name must be a string'
        },
        trim: true,
        isLength: {
            options: { min: 1, max: 100 },
            errorMessage: 'Name length must be from 1 to 100'
        }
    },
    description: {
        optional: true,
        isString: {
            errorMessage: 'Description must be a string'
        },
        trim: true
    }
}, ['body']));
const accessTokenValidator = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new Errors_1.ErrorWithStatus({
            message: messages_1.USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
            status: httpStatus_1.default.UNAUTHORIZED
        }));
    }
    const access_token = authHeader.split(' ')[1];
    try {
        await (0, commons_1.verifyAccessToken)(access_token, req);
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.accessTokenValidator = accessTokenValidator;
