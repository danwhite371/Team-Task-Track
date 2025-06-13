import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createTask } from '../graphql';
import {
  createTaskRequest,
  createTaskResponse,
} from '../__fixtures__/test_data';
import mockFetch from '../__mocks__/fetch';

global.fetch = mockFetch;
const taskResponse = createTaskResponse.data.createTask;

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  cleanup();
});

describe('graphql', () => {
  it('should create a task', async () => {
    const task = await createTask(taskResponse.name);
    expect(task).toEqual(taskResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:4000/',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(createTaskRequest),
      })
    );
  });

  it('should throw an error when name is empty', async () => {
    createTaskRequest.variables.name = '';
    expect(async () => await createTask('')).rejects.toThrow();
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:4000/',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(createTaskRequest),
      })
    );
  });
});
