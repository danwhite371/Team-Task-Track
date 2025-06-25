import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createTask, fetchTasks } from '../graphql';
import { dataUtils } from '../data-utils';
import { tasks, newTaskData } from './data-test-util';
import mockFetch from '../__mocks__/fetch';
import { CONSTANTS } from '@/constants';

const { requests } = dataUtils;
global.fetch = mockFetch;

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  cleanup();
});

describe('graphql', () => {
  it('should create a task', async () => {
    const task = await createTask(newTaskData.name);
    expect(task).toEqual(newTaskData);
    expect(global.fetch).toHaveBeenCalledWith(
      CONSTANTS.GRAPHQL_URL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(requests.createTask(newTaskData.name)),
      })
    );
  });

  it('should throw an error when name is empty', async () => {
    expect(async () => await createTask('')).rejects.toThrow();
    expect(global.fetch).toHaveBeenCalledWith(
      CONSTANTS.GRAPHQL_URL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(requests.createTask('')),
      })
    );
  });

  it('should get all Tasks', async () => {
    const resultTasks = await fetchTasks();
    expect(resultTasks).toEqual(tasks);

    expect(global.fetch).toHaveBeenCalledWith(
      CONSTANTS.GRAPHQL_URL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(requests.getAllTasks),
      })
    );
  });

  // it('should get task times for a task', async () => {});
});
