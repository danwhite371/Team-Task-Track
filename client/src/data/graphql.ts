import { lowercaseFirstChar } from '@/until';

const GRAPHQL_URL = 'http://localhost:4000/';

const taskQL = `id
      name
      active
      lastTime
      duration {
        milliseconds
        seconds
        minutes
        hours
        days
        years
      }
      secondsDuration
      createdAt
      updatedAt`;

type graphqlFetchProps = {
  query: string;
  operationName: string;
  variables?: any;
};
async function graphqlFetch(props: graphqlFetchProps) {
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(props),
  });
  const responseData = await response.json();
  if (responseData.errors) {
    for (const error of responseData.errors) {
      console.error(error);
    }
  }
  return responseData.data[lowercaseFirstChar(props.operationName)];
}

async function fetchTasks() {
  const query = `query GetAllTasks {
    getAllTasks {
      ${taskQL}
    }
  }`;
  console.log(query);
  return await graphqlFetch({ query, operationName: 'GetAllTasks' });
}

async function fetchTaskTimes(taskId: number) {
  const query = `query GetTaskTimes($taskId: Int!){
    getTaskTimes(taskId: $taskId) {
      start
      stop
      secondsDuration
    }
  }`;
  const variables = { taskId };
  return await graphqlFetch({
    operationName: 'GetTaskTimes',
    query,
    variables,
  });
}

async function createTask(name: string) {
  const mutation = `
    mutation CreateTask($name: String!) {
      createTask(name: $name) {
        ${taskQL}
      }
    }
  `;
  console.log(mutation);
  const variables = { name };
  return await graphqlFetch({
    operationName: 'CreateTask',
    query: mutation,
    variables,
  });
}

async function startTask(id: number) {
  const mutation = `
    mutation StartTask($id: Int!) {
      startTask(id: $id) {
        id
        name
        active
        lastTime
        duration {
          milliseconds
          seconds
          minutes
          hours
          days
          years
        }
        secondsDuration
        createdAt
        updatedAt
      }
    }
  `;
  const variables = { id };
  return await graphqlFetch({
    operationName: 'StartTask',
    query: mutation,
    variables,
  });
}

async function stopTask(id: number) {
  const mutation = `
    mutation StopTask($id: Int!) {
      stopTask(id: $id) {
        id
        name
        active
        lastTime
        duration {
          milliseconds
          seconds
          minutes
          hours
          days
          years
        }
        secondsDuration
        createdAt
        updatedAt
      }
    }
  `;
  const variables = { id };
  return await graphqlFetch({
    operationName: 'StopTask',
    query: mutation,
    variables,
  });
}

export { fetchTasks, fetchTaskTimes, createTask, startTask, stopTask };
