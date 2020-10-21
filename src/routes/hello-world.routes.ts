/**
 * Define routes here.
 *
 *  - method can be upper or lowercase
 *  - path fully supports express path format
 *  - policies are applied in the order they are listed
 *  - controller syntax is `[controller exported name].[fuction to run name]`
 */

import { RoutesConfig } from '../models/routes';

export const HelloWorld: RoutesConfig = {
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
  'GET /test': {
    proxy: {
      host: 'localhost',
      port: 3000,
      path: '/world',
    },
  },
};
