import { Sequelize } from 'sequelize';
import logger from '../logging/logger';
import getDataApi from './data-api';
import defineModel from './model';
import setupSequelize from './setup-sequelize';
import { Data } from '../types';

async function initData(): Promise<Data> {
  const sequelize = await setupSequelize();
  const model = defineModel(sequelize);
  await syncSequelize(sequelize);
  const dataApi = getDataApi(model, sequelize);
  return { sequelize, dataApi };
}

async function syncSequelize(sequelize: Sequelize) {
  const dbName = process.env.DATABASE_NAME;
  const reset = process.env.RESET;
  if (dbName == 'task_track_test' && reset == 'true') {
    logger.info('[InitDate] Dropping and Recreating all tables!');
    await sequelize.sync({ force: true });
  } else {
    await sequelize.sync();
  }
}

export default initData;
