"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePort = void 0;
exports.normalizePort = (port) => {
    const parsed = parseInt(port, 10);
    if (isNaN(parsed)) {
        return port;
    }
    if (parsed >= 0) {
        return parsed;
    }
    return port;
};
