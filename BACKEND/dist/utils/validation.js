"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const httpStatus_1 = __importDefault(require("../constants/httpStatus"));
const Errors_1 = require("../models/Errors");
const validate = (validation) => {
    return async (req, res, next) => {
        if (Array.isArray(validation)) {
            for (const validator of validation) {
                await validator.run(req);
            }
        }
        else {
            await validation.run(req);
        }
        const errors = (0, express_validator_1.validationResult)(req);
        // if (!errors.isEmpty()) {
        // console.log(errors.array())
        // }
        if (errors.isEmpty()) {
            return next();
        }
        const errorsObject = errors.mapped();
        const entityError = new Errors_1.EntityError({ errors: {} });
        for (const key in errorsObject) {
            const { msg } = errorsObject[key];
            if (msg instanceof Errors_1.ErrorWithStatus && msg.status !== httpStatus_1.default.UNPROCESSABLE_ENTITY) {
                return next(msg);
            }
            entityError.errors[key] = errorsObject[key];
        }
        next(entityError);
    };
};
exports.validate = validate;
