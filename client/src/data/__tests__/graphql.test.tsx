import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createTask, fetchTasks, fetchTaskTimes } from '../graphql';
import { dataUtils } from '../data-utils';
import { tasks, newTaskData, allTaskTimes } from './data-test-util';
import mockFetch from '../__mocks__/fetch';
import { CONSTANTS } from '@/constants';
import type { TaskTime } from '@/types';

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

  // need to redo this
  // it('should get task times for a task', async () => {
  //   for (const task of tasks) {
  //     console.log('task id:', task.id);
  //     const taskResult: TaskTime[] = await fetchTaskTimes(task.id);
  //     expect(global.fetch).toHaveBeenCalledWith(
  //       CONSTANTS.GRAPHQL_URL,
  //       expect.objectContaining({
  //         method: 'POST',
  //         body: JSON.stringify(requests.getTaskTimes(task.id)),
  //       })
  //     );
  //     console.log('taskResult', taskResult);
  //     const taskTimes: TaskTime[] = allTaskTimes.filter((tt) => tt.taskId == task.id);
  //     console.log('taskTimes', taskTimes);
  //     expect(taskResult).toEqual(taskTimes);
  //     if (!task.active && task.duration == null) {
  //       expect(taskResult).toHaveLength(0);
  //     } else {
  //       expect(taskResult.length).toBeGreaterThan(0);
  //     }

  //     for (const [index, taskTime] of taskTimes.entries()) {
  //       const last = taskTimes.length - 1;
  //       if (task.active && index == last) {
  //         expect(taskTime.start).not.toBeNull();
  //         expect(taskTime.stop).toBeNull();
  //         expect(taskTime.secondsDuration).toBeNull();
  //       } else {
  //         expect(taskTime.start).not.toBeNull();
  //         expect(taskTime.stop).not.toBeNull();
  //         expect(taskTime.secondsDuration).not.toBeNull();
  //       }
  //     }
  //     jest.clearAllMocks();
  //   }
  // });

  // it('should throw an error when starting a task with a no existing task id', async () => {});
});
