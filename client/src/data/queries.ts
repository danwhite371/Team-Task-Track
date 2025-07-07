const taskQL = `id
      name
      active
      lastTime
      duration {
        milliseconds
        seconds
        minutes
        hours
        days
        years
      }
      secondsDuration
      createdAt
      updatedAt`;

const createTaskQuery = `
  mutation CreateTask($name: String!) {
    createTask(name: $name) {
      ${taskQL}
    }
  }
`;

const getTaskQuery = `
  query GetTask($id: Int!) {
    getTask(id: $id) {
      ${taskQL}
    }
  }
`;

const getAllTasksQuery = `query GetAllTasks {
  getAllTasks {
    ${taskQL}
  }
}`;

const startTaskQuery = `
  mutation StartTask($id: Int!) {
    startTask(id: $id) {
      ${taskQL}
    }
  }`;

const stopTaskQuery = `
  mutation StopTask($id: Int!) {
    stopTask(id: $id) {
      ${taskQL}
    }
  }`;

const deleteTaskQuery = `
  mutation DeleteTask($id: Int!) {
    deleteTask(id: $id) 
  }`;

const getTaskTimesQuery = `query GetTaskTimes($taskId: Int!){
    getTaskTimes(taskId: $taskId) {
      id
      start
      stop
      secondsDuration
    }
  }`;

const changeTaskNameQuery = `mutation ChangeTaskName($id: Int!, $name: String!) {
  changeTaskName(id: $id, name: $name) {
   name
    id
    id
    name
    active
    lastTime
    duration {
      milliseconds
      seconds
      minutes
      hours
      days
      years
    }
    secondsDuration
    createdAt
    updatedAt
  }
}`;

const queries = {
  createTaskQuery,
  getTaskQuery,
  getAllTasksQuery,
  startTaskQuery,
  stopTaskQuery,
  getTaskTimesQuery,
  deleteTaskQuery,
  changeTaskNameQuery,
};

export default queries;
