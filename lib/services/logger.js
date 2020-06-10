"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const myFormat = winston_1.default.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});
const options = {
    format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp(), myFormat),
    transports: [
        new winston_1.default.transports.Console({
            level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
        }),
    ],
};
const logger = winston_1.default.createLogger(options);
if (process.env.NODE_ENV !== 'production') {
    logger.debug('Logging initialized at debug level');
}
// for morgan
logger.morgan = {
    write: message => logger.info(message),
};
exports.default = logger;
