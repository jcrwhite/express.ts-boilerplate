export interface RoutesConfig {
    [propName: string]: {
        policies?: string[];
        controller: string;
    };
}
export interface Route {
    method: 'all' | 'get' | 'put' | 'patch' | 'post' | 'delete' | 'trace' | 'options' | 'connect' | 'head';
    path: string;
    policies?: string[];
    controller: string;
    handler: string;
}
