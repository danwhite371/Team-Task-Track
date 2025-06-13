import { createTaskQuery } from '../queries';

const createTaskResponse = {
  data: {
    createTask: {
      id: 79,
      name: 'Test for mock',
      active: false,
      lastTime: '1749644017745',
      duration: null,
      secondsDuration: null,
      createdAt: '1749644017745',
      updatedAt: '1749644017745',
    },
  },
};

const createTaskRequest = {
  operationName: 'CreateTask',
  query: createTaskQuery,
  variables: {
    name: createTaskResponse.data.createTask.name,
  },
};

export { createTaskResponse, createTaskRequest };
