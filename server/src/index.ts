import { ApolloServer } from 'apollo-server';
import { initData } from './data/index';
import { getResolvers, gqlTypeDefs } from './graphql';
import logger from './logging/logger';
import apolloLoggingPlugin from './logging/apollo-logging-plugin';
import pino from 'pino';
// import 'dotenv/config'; // Currently pre-loading from package.json

async function main() {
  const data = await initData();
  const { dataApi, sequelize } = data;
  const resolvers = getResolvers(dataApi, finalHandler);

  const server = new ApolloServer({
    typeDefs: gqlTypeDefs,
    resolvers,
    stopOnTerminationSignals: false,
    plugins: [apolloLoggingPlugin],
  });

  const { url } = await server.listen();
  logger.info(`Server ready at ${url}`);

  async function finalHandler(err: any, evt: string): Promise<number> {
    logger.info('finalHandler', err, evt);
    if (err) {
      logger.error(err, 'fatal error');
    }
    logger.info({ event: evt }, 'Exiting process');
    await sequelize.close();

    logger.info('Sequelize closed.');
    logger.info('Stopping Apollo server.');
    logger.flush();
    await server.stop();
    return err ? 1 : 0;
  }

  process.on('uncaughtException', async (err) => {
    await finalHandler(err, 'uncaughtException');
  });
  process.on('SIGTERM', async () => {
    await finalHandler(null, 'SIGTERM');
  });
  process.on('SIGINT', async () => {
    await finalHandler(null, 'SIGINT');
  });
}

main();
