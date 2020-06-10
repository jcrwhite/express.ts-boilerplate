"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bind = exports.sort = exports.parse = void 0;
const controllers_1 = require("../controllers");
const policies_1 = require("../policies");
const logger_1 = __importDefault(require("../services/logger"));
const pattern = /^\s*(all|get|put|patch|post|delete|trace|options|connect|head)\s+/i;
const normalizePath = (key) => {
    let verb = key.match(pattern) || [''];
    verb = verb[verb.length - 1];
    const normalized = {};
    if (verb) {
        normalized.path = key.replace(verb, '').trim();
    }
    else {
        normalized.path = key.trim();
    }
    normalized.method = (verb || 'all').toLowerCase();
    return normalized;
};
const normalizeHandlers = (config) => {
    const [controller, handler] = config.controller.split('.').filter(Boolean);
    return {
        controller,
        handler,
        policies: config.policies,
    };
};
const initHandlers = (route) => {
    const handlers = [];
    if (route.policies) {
        route.policies.forEach(p => {
            handlers.push(policies_1.Policies[p]);
        });
    }
    handlers.push(controllers_1.Controllers[route.controller][route.handler]);
    return handlers;
};
exports.parse = (configs) => configs.reduce((routes, conf) => routes.concat(Object.keys(conf).reduce((accu, key) => {
    accu.push(Object.assign(Object.assign({}, normalizePath(key)), normalizeHandlers(conf[key])));
    return accu;
}, [])), []);
exports.sort = (routes) => routes.sort((a, b) => Number(a.path.includes(':')) - Number(b.path.includes(':')));
exports.bind = (app, routes) => {
    if (!app) {
        throw new Error('No Express instance provided');
    }
    if (!routes || routes.length < 1) {
        throw new Error('Route config empty or not provided');
    }
    logger_1.default.info(`Attempting to bind ${routes.length} routes...`);
    routes.forEach(route => {
        app[route.method](route.path, ...initHandlers(route));
    });
    logger_1.default.info(`${routes.length} routes bound`);
};
