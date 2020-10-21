export interface RoutesConfig {
  [propName: string]: {
    policies?: string[];
    controller?: string;
    proxy?: {
      host: string;
      port?: number;
      path?: string;
      https?: boolean;
    };
  };
}

export interface Route {
  method: 'all' | 'get' | 'put' | 'patch' | 'post' | 'delete' | 'trace' | 'options' | 'connect' | 'head';
  path: string;
  policies?: string[];
  controller?: string;
  handler?: string;
  proxy?: {
    host: string;
    port?: number;
    path?: string;
    https?: boolean;
  };
}
