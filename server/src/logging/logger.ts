import pino, { Logger } from 'pino';
import 'dotenv/config';

let logger: Logger;

if (process.env.NODE_ENV !== 'production') {
  logger = pino({
    level: process.env.PINO_LOG_LEVEL || 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
      },
    },
  });
} else {
  logger = pino();
}

export default logger;
