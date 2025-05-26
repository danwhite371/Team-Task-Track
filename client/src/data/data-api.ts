import type { Task } from '../types';
import {
  createTask,
  fetchTasks,
  startTask,
  stopTask,
  fetchTaskTimes,
} from './graphql';

export default class DataApi {
  updateTaskData: (tasks: Task[]) => void;
  tasks: Task[] = [];

  constructor(updateTaskData: (tasks: Task[]) => void) {
    this.updateTaskData = updateTaskData;
    this.sendTasks();
  }

  async createNewTask(name: string) {
    const task = await createTask(name);
    console.log('createNewTask', JSON.stringify(task, null, 2));
    this.tasks.unshift(task);
    this.tasks = [...this.tasks];
    this.updateTaskData(this.tasks);
  }

  async sendTasks() {
    const tasks = await fetchTasks();
    this.tasks = tasks;
    this.updateTaskData(tasks);
  }

  // Get a new Task item with, replace current item with it, sort items by last time
  async startTask(id: number) {
    console.log('[DataApi] startTask', id);
    const task = await startTask(id);
    this.replaceTask(id, task);
    this.sortTasks();
    this.tasks = [...this.tasks];
    this.updateTaskData(this.tasks);
  }

  async stopTask(id: number) {
    console.log('[DataApi] stopTask', id);
    const task = await stopTask(id);
    console.log('[DataApi] stopTask', JSON.stringify(task, null, 2));
    this.replaceTask(id, task);
    this.sortTasks();
    this.tasks = [...this.tasks];
    this.updateTaskData(this.tasks);
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

  /*
    When updating task times, we want to get the data, update the task object, then send
    but we don't have the full list anymore as we just sent it.
  */
  async fetchTaskTimes(taskId: number) {
    console.log('[DataApi] fetchTaskTimes');
    const task = this.tasks.find((task) => task.id == taskId);
    if (!task) throw new Error('[sendTaskTimes] Task id mismatch');
    const taskTimes = await fetchTaskTimes(taskId);
    task.taskTimes = taskTimes;
    this.tasks = [...this.tasks];
    this.updateTaskData(this.tasks);
  }
}

/*
  We need a return object with status, error, message, data
  on init we begin sending tasks data to the UI and send a loading state to the UI

  Loading (status) a temp object
  data
  success message | error message - closable messages, and a message history

  On the UI we want to see the most recent messages and be able to see a message history
  So somewhere we have a list of message, that all have a read state

  We can have a separate message api to handle the messages, which is data coming in from the top level,
  and displayed somewhere in the UI. Let's start by passing everything down, then change is to a context.
*/
