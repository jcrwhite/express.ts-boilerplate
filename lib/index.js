"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const port_1 = require("./utils/port");
const http_1 = __importDefault(require("http"));
const logger_1 = __importDefault(require("./services/logger"));
const PORT = port_1.normalizePort(process.env.PORT || 1337);
const onError = (error) => {
    switch (error.code) {
        case 'EACCES': {
            logger_1.default.error(`${PORT} requires elevated privileges`);
            process.exit(1);
            break;
        }
        case 'EADDRINUSE': {
            logger_1.default.error(`${PORT} is already in use`);
            process.exit(1);
            break;
        }
        default: {
            logger_1.default.error('Uncaught error thrown');
            throw error;
        }
    }
};
const onListening = () => {
    logger_1.default.info(`Running in ${process.env.NODE_ENV || 'development'} mode`);
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr === null || addr === void 0 ? void 0 : addr.port}`;
    logger_1.default.info(`Listening on ${bind}`);
};
app_1.App.set('port', PORT);
const server = http_1.default.createServer(app_1.App);
server.on('error', onError);
server.on('listening', onListening);
const onExit = () => {
    if (!server) {
        process.exit(1);
    }
    server.close(() => {
        // gracefully close things here such as DB connection, redis connection, socket.io connections, etc
        logger_1.default.info('Closed remaining connections... shutting down');
        process.exit();
    });
    // if cannot gracefulyl shutdown in 10 seconds, kill proccess
    setTimeout(() => {
        logger_1.default.warn('Could not close connections in 10 seconds... forcing shutdown');
        process.exit(1);
    }, 10000);
};
process.on('SIGINT', onExit);
process.on('SIGTERM', onExit);
// start server
server.listen(PORT);
