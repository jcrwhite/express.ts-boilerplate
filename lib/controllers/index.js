"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controllers = void 0;
/**
 * DO NOT DEFINE CONTROLLERS HERE
 *
 * Controlelr files should me imported here and added to the Controlelrs object
 */
const hello_world_controller_1 = __importDefault(require("./hello-world.controller"));
exports.Controllers = { HelloWorld: hello_world_controller_1.default };
