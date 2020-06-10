import { RoutesConfig } from '../models/routes';

export const HelloWorld: RoutesConfig = {
  'GET /hello': {
    policies: ['MiddleWare'],
    controller: 'HelloWorld.hello',
  },
  'GET /world': {
    controller: 'HelloWorld.world',
  },
};
