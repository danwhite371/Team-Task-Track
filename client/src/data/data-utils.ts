import type { DataUtils } from '@/types';
import queries from './queries';

const { createTaskQuery, getAllTasksQuery, getTaskTimesQuery, startTaskQuery, stopTaskQuery } = queries;

export const dataUtils: DataUtils = {
  results: {
    loadingLoading: {
      status: 'loading',
      message: 'Loading...',
    },
    taskLoadingSuccess: {
      status: 'success',
      message: 'Tasks loaded.',
    },
    taskTimesLoadingSuccess: {
      status: 'success',
      message: 'Task times loaded.',
    },
    loadingConnection: {
      status: 'loading',
      message: 'Connecting...',
    },
    taskCreatedSuccess: {
      status: 'success',
      message: 'Task created.',
    },
    startTaskSuccess: {
      status: 'success',
      message: 'Task timer starter.',
    },
    stopTaskSuccess: {
      status: 'success',
      message: 'Task timer stopped.',
    },
    taskCreatedError: {
      status: 'error',
      message: 'Task name cannot be empty.',
    },
    failedFetchError: {
      status: 'error',
      message: 'Failed to fetch',
    },
  },
  requests: {
    getAllTasks: {
      operationName: 'GetAllTasks',
      query: getAllTasksQuery,
    },
    createTask: (name) => ({
      operationName: 'CreateTask',
      query: createTaskQuery,
      variables: { name },
    }),
    getTaskTimes: (taskId) => ({
      operationName: 'GetTaskTimes',
      query: getTaskTimesQuery,
      variables: { taskId },
    }),
    startTask: (id) => ({
      operationName: 'StartTask',
      query: startTaskQuery,
      variables: { id },
    }),
    stopTask: (id) => ({
      operationName: 'StopTask',
      query: stopTaskQuery,
      variables: { id },
    }),
  },
};
