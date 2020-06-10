"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const http_1 = require("http");
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = require("./routes");
const logger_1 = __importDefault(require("./services/logger"));
const routes_2 = require("./utils/routes");
/**
 * Initialize express
 */
const app = express_1.default();
/**
 * Init access log
 */
app.use(morgan_1.default(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', { stream: logger_1.default.morgan }));
/**
 * Global server configuration
 */
app.use(express_1.default.json({ limit: '10mb' })); // set json body parsing
app.use(express_1.default.urlencoded({ extended: false, limit: '100mb' })); // allow form parsing and file upload
app.use(cors_1.default({
    origin: '*',
    credentials: true,
}));
app.use(helmet_1.default()); // enable other common security policies
/**
 * Handle client request timeout's gracefully
 *
 * @note defaults to 1 minute if no TIMEOUT env is set
 */
app.use((req, res, next) => {
    res.setTimeout(Number(process.env.TIMEOUT) || 60000, () => {
        if (!res.headersSent) {
            return res.status(408).send(http_1.STATUS_CODES[408]);
        }
    });
    next();
});
/**
 * Main server init is done here:
 * 1. Bind all routes
 * 2. Register Middleware (Policies)
 * 3. Map Controllers
 */
routes_2.bind(app, routes_2.sort(routes_2.parse(routes_1.Routes)));
/**
 * Catch 404 and forward error to handler
 */
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.statusCode = 404;
    err.method = req.method;
    err.path = req.path;
    err.statusMessage = http_1.STATUS_CODES[404];
    next(err);
});
/**
 * Error handler
 */
app.use((err, req, res, next) => {
    if (!res.headersSent) {
        res.status(err.statusCode).send(err.statusMessage);
    }
});
exports.App = app;
