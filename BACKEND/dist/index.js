"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const error_middlewares_1 = require("./middlewares/error.middlewares");
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
// import initSocket from './utils/socket'
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// import YAML from 'yaml'
// import fs from 'fs'
// import path from 'path'
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const config_1 = require("./constants/config");
const postgres_1 = require("./utils/postgres");
const mongodb_1 = require("./utils/mongodb");
//  Routers
const sample_routes_1 = __importDefault(require("./routes/sample.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const order_routes_1 = require("./routes/order.routes");
const category_routes_1 = require("./routes/category.routes");
const product_routes_1 = require("./routes/product.routes");
const log_routes_1 = __importDefault(require("./routes/log.routes"));
const inventory_routes_1 = __importDefault(require("./routes/inventory.routes"));
// const file = fs.readFileSync(path.resolve('twitter-swagger.yaml'), 'utf8')
// const swaggerDocument = YAML.parse(file)
//  Swagger
const options = {
    definition: {
        openapi: '3.0.0',
        info: { title: 'E-commerce API', version: '1.0.0' },
        servers: [{ url: '/api/v1', description: 'API v1' }],
        components: {
            securitySchemes: {
                BearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
            }
        },
        security: [{ BearerAuth: [] }],
        persistAuthorization: true
    },
    apis: ['./openapi/*.yaml']
};
const openapiSpecification = (0, swagger_jsdoc_1.default)(options);
//  App Setup
const app = (0, express_1.default)();
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    // Dev: allow 1000 req/window so test suites are not throttled.
    // Production: enforce strict 100 req/15min.
    max: config_1.isProduction ? 100 : 1000,
    standardHeaders: true,
    legacyHeaders: false
});
app.use(limiter);
const httpServer = (0, http_1.createServer)(app);
app.use((0, helmet_1.default)());
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
}));
const corsOptions = {
    origin: config_1.isProduction ? config_1.envConfig.clientUrl : '*'
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
//  Swagger UI
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapiSpecification));
//  Routes
const BASE = '/api/v1';
app.use(`${BASE}/samples`, sample_routes_1.default);
app.use(`${BASE}/auth`, auth_routes_1.default);
app.use(`${BASE}/users`, user_routes_1.default);
app.use(`${BASE}/orders`, order_routes_1.orderRouter);
app.use(`${BASE}/payments`, order_routes_1.paymentRouter);
app.use(`${BASE}/admin`, order_routes_1.adminRouter);
app.use(`${BASE}/admin/categories`, category_routes_1.adminCategoryRouter);
app.use(`${BASE}/admin/products`, product_routes_1.adminProductRouter);
app.use(`${BASE}/categories`, category_routes_1.categoryRouter);
app.use(`${BASE}/products`, product_routes_1.productRouter);
app.use(`${BASE}/logs`, log_routes_1.default);
app.use(`${BASE}/admin/inventories`, inventory_routes_1.default);
app.use(`${BASE}/inventories`, inventory_routes_1.default);
//  Error Handler
app.use(error_middlewares_1.defaultErrorHandler);
//  Start
const port = config_1.envConfig.port;
Promise.all([(0, postgres_1.connectPostgres)(), (0, mongodb_1.connectMongo)()])
    .then(() => {
    httpServer.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
})
    .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1);
});
