import getDataApi from './data-api';
import defineModel from './model';
import setup from './setup';

async function initData() {
  const sequelize = await setup();
  const model = defineModel(sequelize);
  await sequelize.sync();
  const dataApi = getDataApi(model, sequelize);
  return dataApi;
}

export default initData;
