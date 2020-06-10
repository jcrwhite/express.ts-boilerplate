import { RoutesConfig, Route } from '../models/routes';
import { Express } from 'express';
export declare const parse: (configs: RoutesConfig[]) => Route[];
export declare const sort: (routes: Route[]) => Route[];
export declare const bind: (app: Express, routes: Route[]) => void;
