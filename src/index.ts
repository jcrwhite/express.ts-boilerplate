import { App } from './app';
import { normalizePort } from './utils/port';
import http from 'http';
import logger from './services/logger';

const PORT = normalizePort(process.env.PORT || 1337);

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

const onListening = () => {
  logger.info(`Running in ${process.env.NODE_ENV || 'development'} mode`);
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
  logger.info(`Listening on ${bind}`);
};

App.set('port', PORT);

const server = http.createServer(App);

server.on('error', onError);
server.on('listening', onListening);

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

process.on('SIGINT', onExit);
process.on('SIGTERM', onExit);

// start server
server.listen(PORT);
