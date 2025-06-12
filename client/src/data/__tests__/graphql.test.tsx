import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createTask } from '../graphql';
import { createTaskQuery } from '../queries';
import { createTaskResponse } from '../__fixtures__/test_data';
import mockFetch from '../__mocks__/fetch';

global.fetch = mockFetch;

const createTaskRequest = {
  operationName: 'CreateTask',
  query: createTaskQuery,
  variables: {
    name: createTaskResponse.data.createTask.name,
  },
};

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  cleanup();
});

describe('graphql', () => {
  it('should create a task', async () => {
    const task = await createTask('Test for mock');
    expect(task).toEqual(createTaskResponse.data.createTask);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:4000/',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(createTaskRequest),
      })
    );
  });

  it('should throw an error when name is empty', async () => {
    expect(async () => await createTask('')).rejects.toThrow();
  });
});
