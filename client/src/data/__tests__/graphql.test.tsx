import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createTask, fetchTasks } from '../graphql';
import {
  createTaskRequest,
  getAllTasksRequest,
  tasks,
} from '../__fixtures__/test_data';
import mockFetch from '../__mocks__/fetch';
import { CONSTANTS } from '@/constants';

global.fetch = mockFetch;
const taskResponse = tasks[0];

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
      CONSTANTS.GRAPHQL_URL,
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
      CONSTANTS.GRAPHQL_URL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(createTaskRequest),
      })
    );
  });

  it('should get all Tasks', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: { getAllTasks: tasks } }),
    });
    const resultTasks = await fetchTasks();
    expect(resultTasks).toEqual(tasks);

    expect(global.fetch).toHaveBeenCalledWith(
      CONSTANTS.GRAPHQL_URL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(getAllTasksRequest),
      })
    );
  });
});
