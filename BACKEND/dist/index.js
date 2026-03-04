"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const error_middlewares_1 = require("./middlewares/error.middlewares");
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_1 = __importDefault(require("./utils/socket"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// import fs from 'fs'
// import path from 'path'
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const config_1 = require("./constants/config");
const sample_routes_1 = __importDefault(require("./routes/sample.routes"));
// const file = fs.readFileSync(path.resolve('twitter-swagger.yaml'), 'utf8')
// const swaggerDocument = YAML.parse(file)
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-commerce API',
            version: '1.0.0'
        },
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                BearerAuth: []
            }
        ],
        persistAuthorization: true
    },
    apis: ['./openapi/*.yaml'] // files containing annotations as above
};
const openapiSpecification = (0, swagger_jsdoc_1.default)(options);
// databaseService.connect().then(() => {
//   databaseService.indexUsers()
//   databaseService.indexRefreshTokens()
//   databaseService.indexVideoStatus()
//   databaseService.indexFollowers()
//   databaseService.indexTweets()
// })
const app = (0, express_1.default)();
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false // Disable the `X-RateLimit-*` headers
    // store: ... , // Use an external store for more precise rate limiting
});
app.use(limiter);
const httpServer = (0, http_1.createServer)(app);
app.use((0, helmet_1.default)());
const corsOptions = {
    origin: config_1.isProduction ? config_1.envConfig.clientUrl : '*'
};
app.use((0, cors_1.default)(corsOptions));
const port = config_1.envConfig.port;
app.use(express_1.default.json());
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapiSpecification));
app.use('/api/v1/samples', sample_routes_1.default);
app.use(error_middlewares_1.defaultErrorHandler);
(0, socket_1.default)(httpServer);
httpServer.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
