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

function getResolvers(dataApi: DataApi) {
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
    },
    Mutation: {
      createTask: async (_parent: any, { name }: Name) => {
        return await dataApi.createTask(name);
      },
      startTask: async function (_parent: any, { id }: Id) {
        return await dataApi.startTask(id);
      },
      // startTask: async (parent, { taskId }) => {
      //   console.log('[resolvers - startTask]', taskId);
      //   return await dataApi.startTask(taskId);
      // },
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
