import { Sequelize } from 'sequelize';
import logger from '../logging/logger';

const user = process.env.DATABASE_USER;
const host = process.env.DATABASE_HOST;
const name = process.env.DATABASE_NAME;
const password = process.env.DATABASE_PASSWORD;
const port = process.env.DATABASE_PORT;
const reset = process.env.RESET;

logger.info(`[Setup] db-name=${name} reset=${reset}`);

const sequelize = new Sequelize(
  `postgres://${user}:${password}@${host}:${port}/${name}`,
  {
    logging: (msg) => {
      logger.debug(msg);
    },
  }
);

process.on('SIGINT', () => {
  logger.info('[SIGINT] Ctrl+C pressed. Executing cleanup...');
  sequelize.close();
  process.exit(); // Exit the process after cleanup
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();

export default sequelize;
