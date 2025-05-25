import {
  ApolloServerPlugin,
  GraphQLRequestListener,
} from 'apollo-server-plugin-base';
import { GraphQLRequestContext } from 'apollo-server-types';
import { stringify } from '../util';
import logger from './logger';

const apolloLoggingPlugin = {
  async serverWillStart() {
    logger.info('[Apollo] Server starting up!');
  },
  async requestDidStart(
    requestContext: GraphQLRequestContext
  ): Promise<GraphQLRequestListener | void> {
    const start = Date.now();
    const { query, variables, operationName } = requestContext.request;
    if (operationName === 'IntrospectionQuery') {
      logger.info({ operationName, variables }, '[Apollo] Request started:');
    } else {
      logger.info(
        { operationName, query, variables },
        '[Apollo] Request started:'
      );
    }

    return {
      async willSendResponse(context: GraphQLRequestContext): Promise<void> {
        const stop = Date.now();
        const duration = stop - start;
        const responseSize = JSON.stringify(context.response).length * 2;

        logger.info(
          { operationName, duration, responseSize },
          '[Apollo] Request finished:'
        );
      },
      async didEncounterErrors(context: GraphQLRequestContext): Promise<void> {
        logger.error(context.errors, '[Apollo] Request encountered errors:');
      },
    };
  },
};

export default apolloLoggingPlugin;
