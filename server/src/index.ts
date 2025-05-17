import { ApolloServer } from 'apollo-server';
import { initData } from './data';
import { getResolvers, gqlTypeDefs } from './graphql';
import 'dotenv/config';

async function main() {
  const dataApi = await initData();
  const resolvers = getResolvers(dataApi);

  const server = new ApolloServer({ typeDefs: gqlTypeDefs, resolvers });
  server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
  });
}

main();
