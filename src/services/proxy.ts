import { Request, Response } from 'express';
import { request as http } from 'http';
import { request as https, RequestOptions } from 'https';

export const proxy = (req: Request, res: Response, host: string, path = req.path, port = 80, secure = false): void => {
  const options: RequestOptions = {
    hostname: host,
    port: port || (secure ? 443 : 80),
    path,
    method: req.method,
    headers: req.headers,
  };

  const request = (secure ? https : http)(options, response => {
    response.pipe(res);
  });

  req.pipe(request);
};
