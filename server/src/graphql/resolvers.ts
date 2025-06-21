import { DataApi } from '../types';

type Id = {
  id: number;
};
type TaskId = {
  taskId: number;
};
type Name = {
  name: string;
};

function getResolvers(
  dataApi: DataApi,
  finalHandler: (err: any, evt: string) => Promise<number>
) {
  const resolvers = {
    Query: {
      getAllTasks: async () => await dataApi.getAllTasks(),
      getTask: async (_parent: any, { id }: Id) => {
        const task = await dataApi.getTask(id);
        return task;
      },
      getTaskTimes: async (_parent: any, { taskId }: TaskId) => {
        return await dataApi.getTaskTimes(taskId);
      },
      getTasksWithTimes: async () => {
        const tasks = await dataApi.getAllTasks();
        for (const task of tasks) {
          task.taskTimes = await dataApi.getTaskTimes(task.id);
        }
        return tasks;
      },
    },
    Mutation: {
      stopServer: () => {
        finalHandler(null, 'stopServer endpoint');
        return 0;
      },
      createTask: async (_parent: any, { name }: Name) => {
        return await dataApi.createTask(name);
      },
      startTask: async function (_parent: any, { id }: Id) {
        return await dataApi.startTask(id);
      },
      stopTask: async (_parent: any, { id }: Id) => {
        const task = await dataApi.stopTask(id);
        return task;
      },
      deleteTask: async (_parent: any, { id }: Id) =>
        await dataApi.deleteTask(id),

      changeTaskName: async (
        _parent: any,
        { id, name }: { id: number; name: string }
      ) => await dataApi.changeTaskName(id, name),
    },
  };
  return resolvers;
}

export default getResolvers;
