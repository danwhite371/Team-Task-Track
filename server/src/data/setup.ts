import { Sequelize } from 'sequelize';

async function setup() {
  const sequelize = new Sequelize(
    'postgres://postgres:larry3712@localhost:5432/teamtasktrack'
  );

  process.on('SIGINT', () => {
    console.log('Ctrl+C pressed. Executing cleanup...');
    sequelize.close();
    process.exit(); // Exit the process after cleanup
  });

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  return sequelize;
}

export default setup;
