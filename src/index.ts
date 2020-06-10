import { App } from './app';
import { normalizePort } from './utils/port';
import http from 'http';
import logger from './services/logger';

// define our port or fall back
const PORT = normalizePort(process.env.PORT || 1337);

/**
 * catch errors thrown when trying to bind server to port
 * @param error Node HTTP error
 */
const onError = (error: any) => {
  switch (error.code) {
    case 'EACCES': {
      logger.error(`${PORT} requires elevated privileges`);
      process.exit(1);
      break;
    }
    case 'EADDRINUSE': {
      logger.error(`${PORT} is already in use`);
      process.exit(1);
      break;
    }
    default: {
      logger.error('Uncaught error thrown');
      throw error;
    }
  }
};

/**
 * log server info once we have successfully bound to a port and are listening
 */
const onListening = () => {
  logger.info(`Running in ${process.env.NODE_ENV || 'development'} mode`);
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
  logger.info(`Listening on ${bind}`);
};

/**
 * express instance
 */
App.set('port', PORT);

/**
 * Bind expresso the Node http server
 */
const server = http.createServer(App);

/**
 * Listen to some events on the http server itself
 */
server.on('error', onError);
server.on('listening', onListening);

/**
 * Attempt to gracefully shutdown when asked, commit suicide after 10 seconds
 */
const onExit = () => {
  if (!server) {
    process.exit(1);
  }
  server.close(() => {
    // gracefully close things here such as DB connection, redis connection, socket.io connections, etc
    logger.info('Closed remaining connections... shutting down');
    process.exit();
  });
  // if cannot gracefulyl shutdown in 10 seconds, kill proccess
  setTimeout(() => {
    logger.warn('Could not close connections in 10 seconds... forcing shutdown');
    process.exit(1);
  }, 10000);
};

/**
 * Be polite and react to sigterm and sigint
 */
process.on('SIGINT', onExit);
process.on('SIGTERM', onExit);

/**
 * start server
 */
server.listen(PORT);
