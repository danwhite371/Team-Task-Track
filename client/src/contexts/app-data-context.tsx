import { dataUtils } from '@/data/data-utils';
import type { AppDataType, OperationResult, Task } from '@/types';
import { createContext, useCallback, useState, type ReactNode } from 'react';
import * as graphql from '@/data/graphql';
import React from 'react';

function sortTasks(tasks: Task[]) {
  return tasks.sort((taskA, taskB) => Number(taskB.lastTime) - Number(taskA.lastTime));
}

export const defaultContextValue: AppDataType = {
  tasks: [],
  operationResult: undefined,
  getAllTasks: () => {
    console.warn('getAllTasks placeholder');
    return Promise.resolve();
  },
  createNewTask: (name: string) => {
    console.warn('createNewTask placeholder', name);
    return Promise.resolve();
  },
  startTask: (id: number) => {
    console.warn('startTask placeholder', id);
    return Promise.resolve();
  },
  stopTask: (id: number) => {
    console.warn('stopTask placeholder', id);
    return Promise.resolve();
  },
  fetchTaskTimes: (taskId: number) => {
    console.warn('fetchTaskTimes placeholder', taskId);
    return Promise.resolve([]);
  },
};

export const AppDataContext = createContext<AppDataType>(defaultContextValue);

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { results } = dataUtils;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [operationResult, setOperationResult] = useState<OperationResult>();

  const getAllTasks = useCallback(async () => {
    console.log('AppData - getAllTasks');
    setOperationResult(results.loadingLoading);
    try {
      const tasksResult = await graphql.fetchTasks();
      console.log('AppData - getAllTasks, count: ', tasksResult.length);
      setTasks(tasksResult);
      setOperationResult(results.taskLoadingSuccess);
    } catch (error) {
      setOperationResult({
        status: 'error',
        message: (error as Error).message,
      });
    }
  }, []);

  const createNewTask = useCallback(async (name: string) => {
    setOperationResult(results.loadingConnection);
    try {
      const task = await graphql.createTask(name);
      setTasks((prevTasks) => {
        const newTasks = [task, ...prevTasks];
        return newTasks;
      });
      setOperationResult(results.taskCreatedSuccess);
    } catch (error) {
      console.error(error);
      setOperationResult(results.taskCreatedError);
    }
  }, []);

  const startTask = useCallback(async (id: number) => {
    setOperationResult(results.loadingConnection);
    try {
      const updatedTask = await graphql.startTask(id);
      setTasks((prevTasks) => {
        const newTasks = prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
        return sortTasks(newTasks);
      });
      setOperationResult(results.startTaskSuccess);
    } catch (error) {
      setOperationResult({
        status: 'error',
        message: (error as Error).message,
      });
    }
  }, []);

  const stopTask = useCallback(async (id: number) => {
    setOperationResult(results.loadingConnection);
    try {
      const updatedTask = await graphql.stopTask(id);
      setTasks((prevTasks) => {
        const newTasks = prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
        return sortTasks(newTasks);
      });
      setOperationResult(results.stopTaskSuccess);
    } catch (error) {
      setOperationResult({
        status: 'error',
        message: (error as Error).message,
      });
    }
  }, []);

  const fetchTaskTimes = useCallback(async (taskId: number) => {
    console.log('AppData - fetchTaskTimes');
    setOperationResult(results.loadingLoading);
    try {
      const taskTimes = await graphql.fetchTaskTimes(taskId);
      if (!taskTimes || taskTimes.length === 0) {
        setOperationResult(results.taskTimesReturnedEmpty);
        console.log('AppData - fetchTaskTimes - return undefined');
        return undefined;
      }
      setOperationResult(results.taskTimesLoadingSuccess);
      console.log('AppData - fetchTaskTimes - return taskTimes');
      return taskTimes;
    } catch (error) {
      setOperationResult({
        status: 'error',
        message: (error as Error).message,
      });
      console.log('AppData - fetchTaskTimes - error - return undefined');
    }
  }, []);

  const contextValue = {
    getAllTasks,
    createNewTask,
    startTask,
    stopTask,
    fetchTaskTimes,
    tasks,
    operationResult,
  };

  return <AppDataContext.Provider value={contextValue}>{children}</AppDataContext.Provider>;
};

export const useAppData = () => {
  const context = React.useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within a AppDataProvider');
  }
  return context;
};
