import { Sequelize } from 'sequelize';

async function setup() {
  const user = process.env.DATABASE_USER;
  const host = process.env.DATABASE_HOST;
  const name = process.env.DATABASE_NAME;
  const password = process.env.DATABASE_PASSWORD;
  const port = process.env.DATABASE_PORT;

  console.log('[setup]', user, host, name, password, port);

  const sequelize = new Sequelize(
    `postgres://${user}:${password}@${host}:${port}/${name}`
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
