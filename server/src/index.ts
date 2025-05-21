import { ApolloServer } from 'apollo-server';
import { initData } from './data/index';
import { getResolvers, gqlTypeDefs } from './graphql';
// import 'dotenv/config';
import logger from './logging/logger';
import apolloLoggingPlugin from './logging/apollo-logging-plugin';

async function main() {
  const dataApi = await initData();
  const resolvers = getResolvers(dataApi);

  const server = new ApolloServer({
    typeDefs: gqlTypeDefs,
    resolvers,
    plugins: [apolloLoggingPlugin],
  });
  server.listen().then(({ url }) => {
    logger.info(`Server ready at ${url}`);
  });
}

main();
