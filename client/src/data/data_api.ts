import type { OperationResult, Task } from '../types';
import { loadingConnection, LoadingLoading } from './data_results';
import {
  createTask,
  fetchTasks,
  startTask as startTaskRequest,
  stopTask as stopTaskRequest,
  fetchTaskTimes as fetchTaskTimesRequest,
} from './graphql';

export default class DataApi {
  updateTaskData: (tasks: Task[]) => void;
  updateOperationResult: (operationResult: OperationResult) => void;
  tasks: Task[] = [];

  constructor(
    updateTaskData: (tasks: Task[]) => void,
    updateOperationResult: (operationResult: OperationResult) => void
  ) {
    this.updateTaskData = updateTaskData;
    this.updateOperationResult = updateOperationResult;
    this.sendTasks();
  }

  async createNewTask(name: string) {
    this.updateOperationResult(loadingConnection);
    try {
      const task = await createTask(name);
      console.log('createNewTask', JSON.stringify(task, null, 2));
      this.tasks.unshift(task);
      this.tasks = [...this.tasks];
      this.updateTaskData(this.tasks);
      this.updateOperationResult({
        status: 'success',
        message: 'Task created.',
      });
    } catch (error: unknown) {
      this.updateOperationResult({
        status: 'error',
        message: (error as Error).message,
      });
    }
  }

  async sendTasks() {
    this.updateOperationResult(LoadingLoading);
    try {
      const tasks = await fetchTasks();
      this.tasks = tasks;
      this.updateTaskData(tasks);
      this.updateOperationResult({
        status: 'success',
        message: 'Tasks loaded.',
      });
    } catch (error: unknown) {
      this.updateOperationResult({
        status: 'error',
        message: (error as Error).message,
      });
    }
  }

  // Get a new Task item with, replace current item with it, sort items by last time
  async startTask(id: number) {
    console.log('[DataApi] startTask', id);
    this.updateOperationResult(loadingConnection);
    try {
      const task = await startTaskRequest(id);
      this.replaceTask(id, task);
      this.sortTasks();
      this.tasks = [...this.tasks];
      this.updateTaskData(this.tasks);
      this.updateOperationResult({
        status: 'success',
        message: 'Task timer starter.',
      });
    } catch (error: unknown) {
      this.updateOperationResult({
        status: 'error',
        message: (error as Error).message,
      });
    }
  }

  async stopTask(id: number) {
    console.log('[DataApi] stopTask', id);
    this.updateOperationResult({ status: 'loading', message: 'Connecting...' });
    try {
      const task = await stopTaskRequest(id);
      console.log('[DataApi] stopTask', JSON.stringify(task, null, 2));
      this.replaceTask(id, task);
      this.sortTasks();
      this.tasks = [...this.tasks];
      this.updateTaskData(this.tasks);
      this.updateOperationResult({
        status: 'success',
        message: 'Task timer stopped.',
      });
    } catch (error: unknown) {
      this.updateOperationResult({
        status: 'error',
        message: (error as Error).message,
      });
    }
  }

  replaceTask(id: number, task: Task) {
    const i = this.tasks.findIndex((task) => task.id === id);
    console.log('[DataApi] replaceTask', this.tasks[i], task);
    this.tasks[i] = task;
  }

  sortTasks() {
    this.tasks.sort(
      (taskA, taskB) => Number(taskB.lastTime) - Number(taskA.lastTime)
    );
  }

  async fetchTaskTimes(taskId: number) {
    console.log('[DataApi] fetchTaskTimes');
    this.updateOperationResult({ status: 'loading', message: 'Loading...' });
    try {
      const task = this.tasks.find((task) => task.id == taskId);
      if (!task) throw new Error('[sendTaskTimes] Task id mismatch');
      const taskTimes = await fetchTaskTimesRequest(taskId);
      task.taskTimes = taskTimes;
      this.tasks = [...this.tasks];
      this.updateTaskData(this.tasks);
      this.updateOperationResult({
        status: 'success',
        message: 'Task times loaded.',
      });
    } catch (error: unknown) {
      this.updateOperationResult({
        status: 'error',
        message: (error as Error).message,
      });
    }
  }
}
