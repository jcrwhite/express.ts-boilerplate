"use strict";
/**
 * Define routes here.
 *
 *  - method can be upper or lowercase
 *  - path fully supports express path format
 *  - policies are applied in the order they are listed
 *  - controller syntax is `[controller exported name].[fuction to run name]`
 */
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
    'GET /greet/:id': {
        controller: 'HelloWorld.greet',
    },
};
