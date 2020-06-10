import winston from 'winston';

const myFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const options: winston.LoggerOptions = {
  format: winston.format.combine(winston.format.colorize(), winston.format.timestamp(), myFormat),
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
    }),
    // uncomment to log to file
    // new winston.transports.File({ filename: 'debug.log', level: 'debug', format: winston.format.logstash() }),
  ],
};

const logger = winston.createLogger(options);

if (process.env.NODE_ENV !== 'production') {
  logger.debug('Logging initialized at debug level');
}

// for morgan
(logger as any).morgan = {
  write: message => logger.info(message),
} as any;

export default logger;
