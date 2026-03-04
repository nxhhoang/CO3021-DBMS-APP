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
exports.default = sampleRouter;
