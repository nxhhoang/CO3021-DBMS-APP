"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSampleController = exports.getSamplesController = void 0;
const httpStatus_1 = __importDefault(require("../constants/httpStatus"));
const sample_services_1 = __importDefault(require("../services/sample.services"));
const getSamplesController = async (req, res) => {
    const result = await sample_services_1.default.getSamples();
    res.status(httpStatus_1.default.OK).json({
        message: 'Get samples successfully',
        data: result
    });
};
exports.getSamplesController = getSamplesController;
const createSampleController = async (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
req, res) => {
    const result = await sample_services_1.default.createSample(req.body);
    res.status(httpStatus_1.default.CREATED).json({
        message: 'Create sample successfully',
        data: result
    });
};
exports.createSampleController = createSampleController;
