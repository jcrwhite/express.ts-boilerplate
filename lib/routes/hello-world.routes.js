"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelloWorld = void 0;
exports.HelloWorld = {
    'GET /hello': {
        policies: ['MiddleWare'],
        controller: 'HelloWorld.hello',
    },
    'GET /world': {
        controller: 'HelloWorld.world',
    },
};
