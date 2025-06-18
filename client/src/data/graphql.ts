import { lowercaseFirstChar } from '@/until';
import { CONSTANTS } from '@/constants';
import { dataUtils } from './data-utils';
const GRAPHQL_URL = CONSTANTS.GRAPHQL_URL;
const { requests } = dataUtils;

type graphqlFetchProps = {
  query: string;
  operationName: string;
  variables?: any;
};
async function graphqlFetch(props: graphqlFetchProps) {
  console.log(`graphqlFetch\n${JSON.stringify(props, null, 2)}`);
  let responseData;
  try {
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(props),
    });
    // console.log('Response\n', response);
    responseData = await response.json();
    if (responseData.errors) {
      const message = responseData.errors[0].message;
      throw new Error(message);
    }
  } catch (error) {
    throw error;
  }

  // console.log(`responseData\n${JSON.stringify(responseData, null, 2)}`);
  return responseData.data[lowercaseFirstChar(props.operationName)];
}

async function fetchTasks() {
  return await graphqlFetch(requests.getAllTasks);
}

async function fetchTaskTimes(taskId: number) {
  return await graphqlFetch(requests.getTaskTimes(taskId));
}

async function createTask(name: string) {
  return await graphqlFetch(requests.createTask(name));
}

async function startTask(id: number) {
  return await graphqlFetch(requests.startTask(id));
}

async function stopTask(id: number) {
  return await graphqlFetch(requests.stopTask(id));
}

export { fetchTasks, fetchTaskTimes, createTask, startTask, stopTask };
