"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSampleValidator = void 0;
const express_validator_1 = require("express-validator");
const validation_1 = require("../utils/validation");
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
