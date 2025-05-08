import type { Task } from '../types';
import { createTask, fetchTasks, startTask, stopTask } from './graphql';

export default class DataApi {
  updateTaskData: (tasks: Task[]) => void;
  constructor(updateTaskData: (tasks: Task[]) => void) {
    this.updateTaskData = updateTaskData;
    this.sendTasks();
  }
  async createNewTask(name: string) {
    const task = await createTask(name);
    console.log('createNewTask', task);
    await this.sendTasks();
    // get all task data and send it to the UI
  }
  async sendTasks() {
    const tasks = await fetchTasks();
    this.updateTaskData(tasks);
  }
  async startTask(id: number) {
    const task = await startTask(id);
    await this.sendTasks();
  }

  async stopTask(id: number) {
    const task = await stopTask(id);
    await this.sendTasks();
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
