"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postAuthSampleController = exports.getAuthSampleController = exports.getMockTokenController = exports.createSampleController = exports.getSamplesController = void 0;
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
const getMockTokenController = async (req, res) => {
    const token = await sample_services_1.default.generateMockToken();
    res.status(httpStatus_1.default.OK).json({
        message: 'Tạo Mock Token thành công (Dùng token này để test các API bảo mật)',
        data: { access_token: token }
    });
};
exports.getMockTokenController = getMockTokenController;
const getAuthSampleController = async (req, res) => {
    res.status(httpStatus_1.default.OK).json({
        message: 'Bạn đã truy cập thành công vào GET API yêu cầu xác thực!',
        data: {
            user_payload_from_token: req.decoded_authorization
        }
    });
};
exports.getAuthSampleController = getAuthSampleController;
const postAuthSampleController = async (req, res) => {
    res.status(httpStatus_1.default.OK).json({
        message: 'Bạn đã truy cập thành công vào POST API yêu cầu xác thực!',
        data: {
            body_nhan_duoc: req.body,
            user_payload_from_token: req.decoded_authorization
        }
    });
};
exports.postAuthSampleController = postAuthSampleController;
