"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = exports.numberEnumToArray = void 0;
const lodash_1 = require("lodash");
const config_1 = require("../constants/config");
const httpStatus_1 = __importDefault(require("../constants/httpStatus"));
const messages_1 = require("../constants/messages");
const Errors_1 = require("../models/Errors");
const jwt_1 = require("../utils/jwt");
const numberEnumToArray = (numberEnum) => {
    return Object.values(numberEnum).filter((value) => typeof value === 'number');
};
exports.numberEnumToArray = numberEnumToArray;
const verifyAccessToken = async (access_token, req) => {
    if (!access_token) {
        throw new Errors_1.ErrorWithStatus({
            message: messages_1.USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
            status: httpStatus_1.default.UNAUTHORIZED
        });
    }
    try {
        const decoded_authorization = await (0, jwt_1.verifyToken)({
            token: access_token,
            secretOrPublicKey: config_1.envConfig.jwtSecretAccessToken
        });
        if (req) {
            ;
            req.decoded_authorization = decoded_authorization;
            return true;
        }
        return decoded_authorization;
    }
    catch (error) {
        throw new Errors_1.ErrorWithStatus({
            message: (0, lodash_1.capitalize)(error.message),
            status: httpStatus_1.default.UNAUTHORIZED
        });
    }
};
exports.verifyAccessToken = verifyAccessToken;
