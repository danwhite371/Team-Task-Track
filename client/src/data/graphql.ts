const GRAPHQL_URL = 'http://localhost:4000/';

async function fetchTasks() {
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query  {
          getAllTasks {
            id
            name
            createdAt
            updatedAt
            duration {
              milliseconds
              seconds
              minutes
              hours
              days
              years
            }
            active
            lastTime
          }
        }
      `,
    }),
  });
  const responseData = await response.json();
  if (responseData.errors) {
    for (const error of responseData.errors) {
      console.error(error);
    }
  }
  return responseData.data.getAllTasks;
}

async function fetchTaskTimes() {
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query GetTaskTimes($taskId: Int!){
          getTaskTimes(taskId: $taskId) {
            start
            stop
            secondsDuration
          }
        }
      `,
      variables: {
        taskId: 1,
      },
    }),
  });
  const responseData = await response.json();
  if (responseData.errors) {
    for (const error of responseData.errors) {
      console.error(error);
    }
  }
  return responseData.data.getTaskTimes;
}

async function createTask(name: string) {
  const mutation = `
    mutation CreateTask($name: String!) {
      createTask(name: $name) {
        id
        name
        createdAt
        updatedAt
      }
    }
  `;
  const variables = { name };
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: mutation,
      variables,
    }),
  });
  const responseData = await response.json();
  if (responseData.errors) {
    for (const error of responseData.errors) {
      console.error(error);
    }
  }
  return responseData.data.updateTaskData;
}

async function startTask(id: number) {
  const mutation = `
    mutation StartTask($id: Int!) {
      startTask(id: $id) {
        id
        name
        createdAt
        updatedAt
      }
    }
  `;
  const variables = { id };
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: mutation,
      variables,
    }),
  });
  const responseData = await response.json();
  if (responseData.errors) {
    for (const error of responseData.errors) {
      console.error(error);
    }
  }
  return responseData.data.startTask;
}

async function stopTask(id: number) {
  const mutation = `
    mutation StopTask($id: Int!) {
      stopTask(id: $id) {
        id
        name
        createdAt
        updatedAt
      }
    }
  `;
  const variables = { id };
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: mutation,
      variables,
    }),
  });
  const responseData = await response.json();
  if (responseData.errors) {
    for (const error of responseData.errors) {
      console.error(error);
    }
  }
  return responseData.data.stopTask;
}

export { fetchTasks, fetchTaskTimes, createTask, startTask, stopTask };
