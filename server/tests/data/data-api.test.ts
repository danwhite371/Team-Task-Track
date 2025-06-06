import { Sequelize } from 'sequelize';
import defineModel from '../../src/data/model';
import setupSequelize from '../../src/data/setup-sequelize';
import getDataApi from '../../src/data/data-api';
import { DataApi, Task } from '../../src/types';
import { mockPino } from '../test-util';
import { range, sleep, stringify } from '../../src/util';

const user = process.env.DATABASE_USER;
const host = process.env.DATABASE_HOST;
const dbName = process.env.DATABASE_NAME;
const reset = process.env.RESET;

const logAll = true;

console.log('[env] ' + JSON.stringify({ user, host, dbName, reset }));

let model: any;
let sequelize: Sequelize;
let dataApi: DataApi;

beforeEach(async () => {
  mockPino();
  sequelize = await setupSequelize();
  model = defineModel(sequelize);
  if (dbName === 'task_track_test') {
    await sequelize.sync({ force: true });
  } else {
    await sequelize.sync();
  }
  dataApi = getDataApi(model, sequelize);
});

afterEach(async () => {
  await sequelize.close();
  jest.clearAllMocks();
});

async function checkTask(
  name: string,
  task: Task,
  id?: number | undefined
): Promise<void> {
  logAll && console.log('[Test] ' + JSON.stringify(task));
  if (task?.updatedAt == null || task?.lastTime == null) {
    throw new Error('null dates');
  }
  const updatedAt = new Date(task.updatedAt);
  const lastTime = new Date(task.lastTime!);
  id != undefined && expect(id).toBe(task.id);
  expect(task?.name).toBe(name);
  expect(task?.active).toBe(false);
  expect(updatedAt.getTime()).toBe(lastTime.getTime());
}

async function createAndStartTask(): Promise<Task> {
  const name = 'Test ' + new Date().getTime();
  const task = await createTask(name);
  await checkTask(name, task);
  const startedTask = await dataApi.startTask(task.id);
  if (startedTask == null) throw new Error('Null task');
  console.log(stringify(startedTask));
  const updatedAt = new Date(task.updatedAt);
  const lastTime = new Date(task.lastTime!);
  expect(startedTask.id).toBe(task.id);
  expect(startedTask.name).toBe(task.name);
  expect(startedTask.active).toBe(true);
  expect(updatedAt.getTime()).toBe(lastTime.getTime());
  return task;
}

async function createTask(name: string): Promise<Task> {
  const task = await dataApi.createTask(name);
  if (task == null) {
    throw new Error('createTask returned null');
  }
  return task;
}

async function getTask(id: number): Promise<Task> {
  const task = await dataApi.getTask(id);
  if (task == null) {
    throw new Error('getTask returned null');
  }
  return task;
}

describe('DataApi', () => {
  it('should create a Task', async () => {
    const name = 'Test ' + new Date().getTime();
    const task = await createTask(name);
    await checkTask(name, task);
  });

  it('should get one Task', async () => {
    const name = 'Test ' + new Date().getTime();
    const createdTask = await createTask(name);
    await checkTask(name, createdTask);
    const retrievedTask = await getTask(createdTask.id);
    await checkTask(name, retrievedTask, createdTask.id);
  });

  it('should get all Tasks', async () => {
    const names: string[] = range(10).map((i) => `Test-${i}`);
    const createdTasks: Task[] = [];
    for (const name of names) {
      const task = await createTask(name);
      createdTasks.push(task);
    }
    const tasks = await dataApi.getAllTasks();
    tasks?.sort((a, b) => a.id - b.id);
    let i = 0;
    for (const task of tasks!) {
      await checkTask(createdTasks[i].name, task, createdTasks[i++].id);
    }
  });

  it('should start the time, create a TaskTime entry for that task with a start of now()', async () => {
    await createAndStartTask();
  });

  it('should stop the time, adding a stop to the last time entry', async () => {
    const startTime = new Date();
    const startedTask = await createAndStartTask();
    await sleep(10);
    const stoppedTask = await dataApi.stopTask(startedTask.id);
    if (stoppedTask == null) throw new Error('Null task');
    const stopTime = new Date();
    expect(startedTask.id).toBe(stoppedTask.id);
    expect(stoppedTask.active).toBe(false);
    expect(Number(stoppedTask.secondsDuration) * 1000).toBe(
      stoppedTask.duration?.milliseconds
    );
    const interval = (stopTime.getTime() - startTime.getTime()) / 1000;
    expect(Number(stoppedTask.secondsDuration)).toBeLessThanOrEqual(interval);
  });

  it('should get takeTimes for a Task', async () => {
    const startedTask = await createAndStartTask();
    await sleep(10);
    const stoppedTask = await dataApi.stopTask(startedTask.id);
    if (stoppedTask == null) throw new Error('Null task');
    expect(stoppedTask.active).toBe(false);
    const taskTimes = await dataApi.getTaskTimes(startedTask.id);
    expect(taskTimes!.length).toBe(1);
    expect(Number(stoppedTask.secondsDuration) * 1000).toBe(
      stoppedTask.duration?.milliseconds
    );
    const lastTime = new Date(stoppedTask.lastTime!).getTime();
    const stopTime = new Date(taskTimes![0].stop!).getTime();
    expect(lastTime).toBe(stopTime);
  });

  it('should delete a Task', async () => {
    const name = 'Test ' + new Date().getTime();
    const task = await createTask(name);
    await checkTask(name, task, 1);

    const result = await dataApi.deleteTask(task.id);
    console.log('result', result);

    const getResult: any = await dataApi.getTask(task.id);
    console.log('delete - getResult', getResult);
    expect(getResult).toBeNull();
  });

  it('should change the name of a Task', async () => {
    const name = 'Test 1';
    const task = await createTask(name);
    await checkTask(name, task, 1);
    const name2 = 'Test 2';
    const changedTask = await dataApi.changeTaskName(task.id, name2);
    await checkTask(name2, changedTask!, 1);
  });
});
