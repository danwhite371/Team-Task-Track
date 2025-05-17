import { ApolloServer, gql } from 'apollo-server';
import { initData } from './data';
import { getResolvers, gqlTypeDefs } from './graphql';

async function main() {
  const dataApi = await initData();
  const resolvers = getResolvers(dataApi);
  //await dataApi.startTask(1);

  const server = new ApolloServer({ typeDefs: gqlTypeDefs, resolvers });
  server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
  });
}

main();
