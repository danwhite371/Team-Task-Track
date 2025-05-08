const getDataApi = require('./dataApi');
const defineModel = require('./model');
const setUp = require('./setUp');

async function initData() {
  const sequelize = await setUp();
  const model = defineModel(sequelize);
  await sequelize.sync();
  const dataApi = getDataApi(model, sequelize);
  return dataApi;
}

module.exports = initData;
