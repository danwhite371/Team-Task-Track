const { ApolloServer } = require('apollo-server');
const getResolvers = require('./graphql/resolvers');
const gqlTypeDefs = require('./graphql/schema');
const { initData } = require('./data');

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
