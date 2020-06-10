import { RoutesConfig, Route } from '../models/routes';
import { Express } from 'express';
import { Controllers } from '../controllers';
import { Policies } from '../policies';
import logger from '../services/logger';

const pattern = /^\s*(all|get|put|patch|post|delete|trace|options|connect|head)\s+/i;

const normalizePath = (key: string): { method: Route['method']; path: string } => {
  let verb: any = key.match(pattern) || [''];
  verb = verb[verb.length - 1];
  const normalized: any = {};

  if (verb) {
    normalized.path = key.replace(verb, '').trim();
  } else {
    normalized.path = key.trim();
  }
  normalized.method = (verb || 'all').toLowerCase();
  return normalized;
};

const normalizeHandlers = (config: { controller: string; policies?: string[] }): Partial<Route> => {
  const [controller, handler] = config.controller.split('.').filter(Boolean);
  return {
    controller,
    handler,
    policies: config.policies,
  };
};

const initHandlers = (route: Route): (() => any)[] => {
  const handlers: (() => any)[] = [];
  if (route.policies) {
    route.policies.forEach(p => {
      handlers.push(Policies[p]);
    });
  }
  handlers.push(Controllers[route.controller][route.handler]);
  return handlers;
};

export const parse = (configs: RoutesConfig[]): Route[] =>
  configs.reduce(
    (routes: Route[], conf) =>
      routes.concat(
        Object.keys(conf).reduce((accu: Route[], key) => {
          accu.push({
            ...normalizePath(key),
            ...(normalizeHandlers(conf[key]) as any),
          });
          return accu;
        }, [])
      ),
    []
  );

export const sort = (routes: Route[]): Route[] =>
  routes.sort((a: Route, b: Route) => Number(a.path.includes(':')) - Number(b.path.includes(':')));

export const bind = (app: Express, routes: Route[]): void => {
  if (!app) {
    throw new Error('No Express instance provided');
  }
  if (!routes || routes.length < 1) {
    throw new Error('Route config empty or not provided');
  }
  logger.info(`Attempting to bind ${routes.length} routes...`);
  routes.forEach(route => {
    app[route.method](route.path, ...initHandlers(route));
  });
  logger.info(`${routes.length} routes bound`);
};
