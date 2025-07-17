import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createTask, fetchTasks, fetchTaskTimes, startTask, stopTask } from '../graphql';
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

  it('should get task times for a task', async () => {
    for (const task of tasks) {
      console.log('task id:', task.id);
      const taskTimesResult: TaskTime[] = await fetchTaskTimes(task.id);
      expect(global.fetch).toHaveBeenCalledWith(
        CONSTANTS.GRAPHQL_URL,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requests.getTaskTimes(task.id)),
        })
      );
      console.log('taskTimesResult', taskTimesResult);
      const taskTimes: TaskTime[] = allTaskTimes.filter((tt) => tt.taskId == task.id);
      console.log('taskTimes', taskTimes);
      expect(taskTimesResult).toEqual(taskTimes);
      if (!task.active && task.duration == null) {
        expect(taskTimesResult).toHaveLength(0);
      } else {
        expect(taskTimesResult.length).toBeGreaterThan(0);
      }

      for (const [index, taskTime] of taskTimesResult.entries()) {
        const last = taskTimes.length - 1;
        if (task.active && index == last) {
          expect(taskTime.start).not.toBeNull();
          expect(taskTime.stop).toBeNull();
          expect(taskTime.secondsDuration).toBeNull();
        } else {
          expect(taskTime.start).not.toBeNull();
          expect(taskTime.stop).not.toBeNull();
          expect(taskTime.secondsDuration).not.toBeNull();
        }
      }
    }
    jest.clearAllMocks();
  });

  it('should return an empty array, when there are no task times for the taskId', async () => {
    const taskId = 500;
    const taskTimesResult: TaskTime[] = await fetchTaskTimes(taskId);
    expect(global.fetch).toHaveBeenCalledWith(
      CONSTANTS.GRAPHQL_URL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(requests.getTaskTimes(taskId)),
      })
    );
    expect(taskTimesResult).toHaveLength(0);
  });

  /* start tasks
    we want to call the graphql for starting a task
    we throw an error or we return a tank
    what happens if we try to start a task that is already started?
    Task not found for an task id that doesn't exist
    stopping a stopped task returns that task still stopped
    start and stop times, won't throw any error if the active state doesn't match what the action is
    but it won't start or stop. In the future it should throw an error
    currently mock fetch start and stop task, only returns the task, it doesn't change any part of the task.
    what about table and time table tests?
    we could hae the mock toggle active, but what is the point and wehat are we actual testing, and the data won't match the task time data

  */
  it('should call startTask', async () => {
    const taskId = 85;
    const task = tasks.find((t) => t.id === taskId);
    if (task === undefined) {
      throw new Error('Task is undefined');
    }
    if (task.active) {
      throw new Error('Trying to start an active task');
    }
    const resultTask = await startTask(taskId);
    expect(resultTask).toEqual(task);
    expect(global.fetch).toHaveBeenCalledWith(
      CONSTANTS.GRAPHQL_URL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(requests.startTask(taskId)),
      })
    );
  });

  it('should call stopTask', async () => {
    const taskId = 95;
    const task = tasks.find((t) => t.id === taskId);
    if (task === undefined) {
      throw new Error('Task is undefined');
    }
    if (!task.active) {
      throw new Error('Trying to stop an inactive task');
    }
    const resultTask = await stopTask(taskId);
    expect(resultTask).toEqual(task);
    expect(global.fetch).toHaveBeenCalledWith(
      CONSTANTS.GRAPHQL_URL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(requests.stopTask(taskId)),
      })
    );
  });

  // test no id
  it('should throw an error if there is no task for taskId when calling startTask', async () => {
    const taskId = 500;
    expect(async () => await startTask(taskId)).rejects.toThrow(`Task was not found for id: ${taskId}`);
    expect(global.fetch).toHaveBeenCalledWith(
      CONSTANTS.GRAPHQL_URL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(requests.startTask(taskId)),
      })
    );
  });
});
