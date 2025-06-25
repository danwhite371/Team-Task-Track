import type { OperationResult, Task } from '../types';
import { dataUtils } from './data-utils';
import {
  createTask,
  fetchTasks,
  startTask as startTaskRequest,
  stopTask as stopTaskRequest,
  fetchTaskTimes as fetchTaskTimesRequest,
} from './graphql';
const { results } = dataUtils;

interface UpdateTaskData {
  (tasks: Task[]): void;
}

interface UpdateOperationResult {
  (operationResult: OperationResult): void;
}

export default class DataApi {
  updateTaskData: UpdateTaskData;
  updateOperationResult: UpdateOperationResult;
  tasks: Task[] = [];

  private constructor(
    updateTaskData: UpdateTaskData,
    updateOperationResult: UpdateOperationResult
  ) {
    this.updateTaskData = updateTaskData;
    this.updateOperationResult = updateOperationResult;
  }

  static async create(
    updateTaskData: UpdateTaskData,
    updateOperationResult: UpdateOperationResult
  ): Promise<DataApi> {
    const dataApi = new DataApi(updateTaskData, updateOperationResult);
    await dataApi.sendTasks();
    return dataApi;
  }

  async createNewTask(name: string) {
    this.updateOperationResult(results.loadingConnection);
    try {
      const task = await createTask(name);
      console.log('createNewTask', JSON.stringify(task, null, 2));
      this.tasks.unshift(task);
      this.tasks = [...this.tasks];
      this.updateTaskData([...this.tasks]);
      this.updateOperationResult(results.taskCreatedSuccess);
    } catch (error: unknown) {
      this.updateOperationResult(results.taskCreatedError);
    }
  }

  async sendTasks() {
    this.updateOperationResult(results.loadingLoading);
    try {
      const tasks = await fetchTasks();
      this.tasks = tasks;
      this.updateTaskData([...tasks]);
      this.updateOperationResult(results.taskLoadingSuccess);
    } catch (error: any) {
      this.updateOperationResult({
        status: 'error',
        message: error.message,
      });
    }
  }

  // Get a new Task item with, replace current item with it, sort items by last time
  async startTask(id: number) {
    console.log('[DataApi] startTask', id);
    this.updateOperationResult(results.loadingConnection);
    try {
      const task = await startTaskRequest(id);
      this.replaceTask(id, task);
      this.sortTasks();
      this.tasks = [...this.tasks];
      this.updateTaskData(this.tasks);
      this.updateOperationResult(results.startTaskSuccess);
      console.log('after startTask updateOperationResult');
    } catch (error: unknown) {
      this.updateOperationResult({
        status: 'error',
        message: (error as Error).message,
      });
    }
  }

  async stopTask(id: number) {
    console.log('[DataApi] stopTask', id);
    this.updateOperationResult(results.loadingConnection);
    try {
      const task = await stopTaskRequest(id);
      console.log('[DataApi] stopTask', JSON.stringify(task, null, 2));
      this.replaceTask(id, task);
      this.sortTasks();
      this.tasks = [...this.tasks];
      this.updateTaskData(this.tasks);
      this.updateOperationResult(results.stopTaskSuccess);
      console.log('after stopTask updateOperationResult');
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
    this.updateOperationResult(results.loadingLoading);
    try {
      const task = this.tasks.find((task) => task.id == taskId);
      if (!task) throw new Error('[sendTaskTimes] Task id mismatch');
      const taskTimes = await fetchTaskTimesRequest(taskId);
      task.taskTimes = taskTimes;
      this.tasks = [...this.tasks];
      this.updateTaskData(this.tasks);
      this.updateOperationResult(results.taskTimesLoadingSuccess);
    } catch (error: unknown) {
      this.updateOperationResult({
        status: 'error',
        message: (error as Error).message,
      });
    }
  }
}
