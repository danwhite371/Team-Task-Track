import logger from '../logging/logger';
import getDataApi from './data-api';
import defineModel from './model';
import sequelize from './sequelize';

async function initData() {
  const model = defineModel(sequelize);
  await syncSequelize();
  const dataApi = getDataApi(model, sequelize);
  return dataApi;
}

async function syncSequelize() {
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
