"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sample_controllers_1 = require("../controllers/sample.controllers");
const sample_middlewares_1 = require("../middlewares/sample.middlewares");
const handlers_1 = require("../utils/handlers");
const sampleRouter = (0, express_1.Router)();
/**
 * Description: Get all samples
 * Path: /
 * Method: GET
 */
sampleRouter.get('/', (0, handlers_1.wrapRequestHandler)(sample_controllers_1.getSamplesController));
/**
 * Description: Create a new sample
 * Path: /
 * Method: POST
 * Body: { name: string, description?: string }
 */
sampleRouter.post('/', sample_middlewares_1.createSampleValidator, // Validate dữ liệu trước tiên
(0, handlers_1.wrapRequestHandler)(sample_controllers_1.createSampleController) //
);
/**
 * Description: Generate a mock access token for testing protected routes
 * Path: /auth/mock-token
 * Method: GET
 */
sampleRouter.get('/auth/mock-token', (0, handlers_1.wrapRequestHandler)(sample_controllers_1.getMockTokenController));
/**
 * Description: Get a sample with authentication
 * Path: /auth
 * Method: GET
 * Header: Authorization: Bearer <access_token>
 */
sampleRouter.get('/auth', sample_middlewares_1.accessTokenValidator, (0, handlers_1.wrapRequestHandler)(sample_controllers_1.getAuthSampleController));
/**
 * Description: Create a new sample with authentication
 * Path: /auth
 * Method: POST
 * Header: Authorization: Bearer <access_token>
 * Body: { name: string, description?: string }
 */
sampleRouter.post('/auth', sample_middlewares_1.accessTokenValidator, sample_middlewares_1.createSampleValidator, (0, handlers_1.wrapRequestHandler)(sample_controllers_1.postAuthSampleController));
exports.default = sampleRouter;
