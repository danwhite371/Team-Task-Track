function getResolvers(dataApi) {
  const resolvers = {
    Query: {
      getAllTasks: async () => await dataApi.getAllTasks(),
      getTaskTimes: async (parent, { taskId }) => {
        return await dataApi.getTaskTimes(taskId);
      },
    },
    Mutation: {
      createTask: async (parent, { name }) => {
        console.log('createTask', name);
        return await dataApi.createTask(name);
      },
      startTask: async function (parent, { id }) {
        console.log('[resolvers - startTask]', id);
        return await dataApi.startTask(id);
      },
      // startTask: async (parent, { taskId }) => {
      //   console.log('[resolvers - startTask]', taskId);
      //   return await dataApi.startTask(taskId);
      // },
      stopTask: async (parent, { id }) => await dataApi.stopTask(id),
      deleteTask: async (parent, { id }) => await dataApi.deleteTask(id),
    },
  };
  return resolvers;
}

module.exports = getResolvers;
