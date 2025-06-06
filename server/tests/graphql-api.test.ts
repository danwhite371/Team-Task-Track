import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { ApolloServer } from 'apollo-server';
import { Sequelize } from 'sequelize';
import defineModel from '../src/data/model';
import setupSequelize from '../src/data/setup-sequelize';
import getDataApi from '../src/data/data-api';
import { Task, DataApi, TaskTime } from '../src/types';
import { range, sleep, stringify } from '../src/util';
import { getResolvers, gqlTypeDefs } from '../src/graphql';
import { mockPino } from './test-util';
import {
  createTaskQuery,
  getAllTasksQuery,
  getTaskQuery,
  startTaskQuery,
  stopTaskQuery,
  getTaskTimesQuery,
  deleteTaskQuery,
  changeTaskNameQuery,
} from './queries';

const user = process.env.DATABASE_USER;
const host = process.env.DATABASE_HOST;
const dbName = process.env.DATABASE_NAME;
const reset = process.env.RESET;

console.log('[env] ' + JSON.stringify({ user, host, dbName, reset }));

let model: any;
let sequelize: Sequelize;
let server: ApolloServer;

async function finalHandler(err: any, evt: string): Promise<number> {
  console.log('finalHandler', err, evt);
  if (err) {
    console.log(err, 'fatal error');
  }
  console.log({ event: evt }, 'Exiting process');
  await sequelize.close();

  console.log('Sequelize closed.');
  console.log('Stopping Apollo server.');
  await server.stop();
  return err ? 1 : 0;
}
async function checkTask(
  task: Task,
  name: string,
  id?: number | undefined
): Promise<void> {
  console.log(JSON.stringify(task));
  if (task == undefined) throw new Error('Data is undefined');
  id != undefined && expect(task.id).toBe(id);
  expect(task.name).toBe(name);
  expect(task.active).toBe(false);
  expect(task.duration).toBe(null);
  expect(task.secondsDuration).toBe(null);
}

async function createTask(name: string): Promise<Task> {
  const {
    data: { createTask },
  }: any = await server.executeOperation({
    query: createTaskQuery,
    variables: { name },
  });
  return createTask;
}

async function getAllTasks(): Promise<Task[]> {
  const {
    data: { getAllTasks: tasks },
  }: any = await server.executeOperation({
    query: getAllTasksQuery,
  });
  return tasks;
}

async function getTask(id: number): Promise<Task> {
  const {
    data: { getTask: task },
  }: any = await server.executeOperation({
    query: getTaskQuery,
    variables: { id },
  });
  return task;
}

async function startTask(id: number): Promise<Task> {
  const {
    data: { startTask: task },
  }: any = await server.executeOperation({
    query: startTaskQuery,
    variables: { id },
  });
  return task;
}

async function stopTask(id: number): Promise<Task> {
  const {
    data: { stopTask: task },
  }: any = await server.executeOperation({
    query: stopTaskQuery,
    variables: { id },
  });
  return task;
}

async function deleteTask(id: number): Promise<number> {
  console.log('deleteTask - id', id);
  const {
    data: { deleteTask },
  }: any = await server.executeOperation({
    query: deleteTaskQuery,
    variables: { id },
  });
  console.log('deleteTask', deleteTask);
  return deleteTask;
}

async function changeTaskName(id: number, name: string): Promise<Task> {
  console.log(`changeTaskName - id = '${id}', name = '${name}'`);
  const {
    data: { changeTaskName: task },
  }: any = await server.executeOperation({
    query: changeTaskNameQuery,
    variables: { id, name },
  });
  console.log('task', JSON.stringify(task, null, 2));
  return task;
}

async function createAndStartTask(): Promise<Task> {
  const name = 'Test ' + new Date().getTime();
  const task = await createTask(name);
  await checkTask(task, name);
  const startedTask = await startTask(task.id);
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

async function getTaskTimes(taskId: number): Promise<TaskTime[]> {
  const {
    data: { getTaskTimes: taskTimes },
  }: any = await server.executeOperation({
    query: getTaskTimesQuery,
    variables: { taskId },
  });
  return taskTimes;
}

beforeEach(async () => {
  mockPino();
  sequelize = await setupSequelize();
  model = defineModel(sequelize);
  if (dbName === 'task_track_test') {
    await sequelize.sync({ force: true });
  } else {
    await sequelize.sync();
  }
  const dataApi = getDataApi(model, sequelize);
  const resolvers = getResolvers(dataApi, finalHandler);
  server = new ApolloServer({
    typeDefs: gqlTypeDefs,
    resolvers,
    stopOnTerminationSignals: false,
  });
});

afterEach(async () => {
  await sequelize.close();
  await server.stop();
  jest.clearAllMocks();
});

describe('GraphQLApi', () => {
  it('should create a Task', async () => {
    const name = 'Test ' + new Date().getTime();
    const task = await createTask(name);
    await checkTask(task, name, 1);
  });

  it('should get a task', async () => {
    const name = 'Test ' + new Date().getTime();
    const task = await createTask(name);
    await checkTask(task, name, 1);
    const taskRetrieved = await getTask(task.id);
    await checkTask(taskRetrieved, task.name, task.id);
  });

  it('should get all tasks', async () => {
    const names: string[] = range(10).map((i) => `Test-${i}`);
    const createdTasks: Task[] = [];
    for (const name of names) {
      const task = await createTask(name);
      createdTasks.push(task);
    }

    let i = 0;
    for (const task of createdTasks) {
      await checkTask(task, names[i], i++ + 1);
    }

    const tasks = await getAllTasks();
    tasks?.sort((a: Task, b: Task) => a.id - b.id);
    i = 0;
    for (const task of tasks!) {
      await checkTask(task, createdTasks[i].name, createdTasks[i++].id);
    }
  });

  it('should create a task and start the timer', async () => {
    await createAndStartTask();
  });

  it('should create a task, start and stop the timer', async () => {
    const startTime = new Date();
    const startedTask = await createAndStartTask();
    await sleep(10);
    const stoppedTask = await stopTask(startedTask.id);
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
    const stoppedTask = await stopTask(startedTask.id);
    if (stoppedTask == null) throw new Error('Null task');
    expect(stoppedTask.active).toBe(false);
    const taskTimes = await getTaskTimes(startedTask.id);
    expect(taskTimes!.length).toBe(1);
    expect(Number(stoppedTask.secondsDuration) * 1000).toBe(
      stoppedTask.duration?.milliseconds
    );
    const lastTime = new Date(stoppedTask.lastTime!).getTime();
    const stopTime = new Date(taskTimes![0].stop!).getTime();
    expect(lastTime).toBe(stopTime);
  });

  it('should create and delete a task', async () => {
    const name = 'Test ' + new Date().getTime();
    const task = await createTask(name);
    await checkTask(task, name, 1);

    const result = await deleteTask(task.id);
    console.log('result', result);

    const getResult: any = await server.executeOperation({
      query: getTaskQuery,
      variables: { id: task.id },
    });

    expect(getResult.data).toBeNull();
    expect(getResult.errors[0]).toBeTruthy();
  });

  it('should create a task and change the name', async () => {
    const name = 'Test 1';
    const task = await createTask(name);
    await checkTask(task, name, 1);
    const name2 = 'Test 2';
    const changedTask = await changeTaskName(task.id, name2);
    await checkTask(changedTask, name2, 1);
  });
});
