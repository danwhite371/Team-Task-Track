const { gql } = require('apollo-server');

const gqlTypeDefs = gql`
  type Task {
    id: Int!
    name: String!
    createdAt: String!
    updatedAt: String!
    taskTimes: [TaskTime]
    secondsDuration: Float
    active: Boolean!
  }

  type TaskTime {
    id: Int!
    start: String!
    stop: String
    createdAt: String!
    updatedAt: String!
    taskId: Int!
    secondsDuration: Float
  }

  type Query {
    getTaskTimes(taskId: Int): [TaskTime]
    getAllTasks: [Task!]!
  }

  type Mutation {
    createTask(name: String!): Task
    startTask(id: Int!): Task
    stopTask(id: Int!): Task
    deleteTask(id: Int!): Int
  }
`;

module.exports = gqlTypeDefs;
