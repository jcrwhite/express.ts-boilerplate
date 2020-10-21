import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { STATUS_CODES } from 'http';
import morgan from 'morgan';
import { Routes } from './routes';
import logger from './services/logger';
import { bind, parse, sort } from './utils/routes';

/**
 * Initialize express
 */
const app = express();

/**
 * Init access log
 */
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', { stream: (logger as any).morgan }));

/**
 * Global server configuration
 */
app.use(
  cors({
    origin: '*', // allow all hosts for CORS
    credentials: true, // allow passing credentials
  })
);
app.use(helmet()); // enable other common security policies

/**
 * Handle client request timeout's gracefully
 *
 * @note defaults to 1 minute if no TIMEOUT env is set
 */
app.use((req, res, next) => {
  res.setTimeout(Number(process.env.TIMEOUT) || 60000, () => {
    if (!res.headersSent) {
      return res.status(408).send(STATUS_CODES[408]);
    }
  });
  next();
});

/**
 * Main server init is done here:
 * 1. Bind all routes
 * 2. Register Middleware (Policies)
 * 3. Map Controllers
 */
bind(app, sort(parse(Routes)));

/**
 * Catch 404 and forward error to handler
 */
app.use((req, res, next) => {
  const err: any = new Error('Not Found');
  err.statusCode = 404;
  err.method = req.method;
  err.path = req.path;
  err.statusMessage = STATUS_CODES[404];
  next(err);
});

/**
 * Error handler
 */
app.use((err, req, res, next) => {
  logger.error(
    `ERROR: CODE: ${err.statusCode || 500} | MESSAGE: ${err.statusMessage || STATUS_CODES[err.statusCode || 500]}`
  );
  logger.error(err);
  if (!res.headersSent) {
    res.status(err.statusCode || 500).send(err.statusMessage || STATUS_CODES[500]);
  }
});

export const App = app;
