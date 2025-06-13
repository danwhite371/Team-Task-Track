import { lowercaseFirstChar } from '@/until';
import {
  createTaskQuery,
  getAllTasksQuery,
  startTaskQuery,
  stopTaskQuery,
  getTaskTimesQuery,
} from './queries';
const GRAPHQL_URL = 'http://localhost:4000/';

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
    console.log(`response\n${JSON.stringify(response, null, 2)}`);
    responseData = await response.json();
    if (responseData.errors) {
      const message = responseData.errors[0].message;
      throw new Error(message);
    }
  } catch (error) {
    throw error;
  }

  console.log(`responseData\n${JSON.stringify(responseData, null, 2)}`);
  return responseData.data[lowercaseFirstChar(props.operationName)];
}

async function fetchTasks() {
  return await graphqlFetch({
    query: getAllTasksQuery,
    operationName: 'GetAllTasks',
  });
}

async function fetchTaskTimes(taskId: number) {
  const variables = { taskId };
  return await graphqlFetch({
    operationName: 'GetTaskTimes',
    query: getTaskTimesQuery,
    variables,
  });
}

async function createTask(name: string) {
  const variables = { name };
  return await graphqlFetch({
    operationName: 'CreateTask',
    query: createTaskQuery,
    variables,
  });
}

async function startTask(id: number) {
  const variables = { id };
  return await graphqlFetch({
    operationName: 'StartTask',
    query: startTaskQuery,
    variables,
  });
}

async function stopTask(id: number) {
  const variables = { id };
  return await graphqlFetch({
    operationName: 'StopTask',
    query: stopTaskQuery,
    variables,
  });
}

export { fetchTasks, fetchTaskTimes, createTask, startTask, stopTask };
