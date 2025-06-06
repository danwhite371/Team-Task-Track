import pino, { Logger } from 'pino';
import stream from 'stream';
import fs from 'fs';
import path from 'path';

const logFilePath = path.join(__dirname, '../../server.log');
// const passThrough = new stream.PassThrough();
// passThrough.pipe(process.stdout);
// passThrough.pipe(fs.createWriteStream(logFilePath, { flags: 'a' }));
// const dest = pino.destination(passThrough);
// const dest = pino.destination(logFilePath);

let logger: Logger;

const transport = pino.transport({
  targets: [
    {
      level: process.env.PINO_LOG_LEVEL || 'info',
      target: 'pino/file',
      options: {
        destination: logFilePath,
      },
    },
    {
      level: process.env.PINO_LOG_LEVEL || 'info',
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        destination: 1,
      },
    },
  ],
});

logger = pino(transport);

// if (process.env.NODE_ENV !== 'production') {
//   logger = pino(
//     {
//       level: process.env.PINO_LOG_LEVEL || 'info',
//       transport: {
//         target: 'pino-pretty',
//         options: {
//           colorize: true,
//           translateTime: 'SYS:standard',
//         },
//       },
//     },
//     dest
//   );
// } else {
//   logger = pino({}, dest);
// }

logger.info('Writing to ' + logFilePath);

export default logger;
