import { gql } from 'apollo-server';

const gqlTypeDefs = gql`
  type Interval {
    milliseconds: Float
    seconds: Int
    minutes: Int
    hours: Int
    days: Int
    years: Int
  }
  type Task {
    id: Int!
    name: String!
    createdAt: String!
    updatedAt: String!
    duration: Interval
    active: Boolean!
    lastTime: String
    secondsDuration: Float
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
    getTask(id: Int!): Task!
    getAllTasks: [Task!]!
  }

  type Mutation {
    createTask(name: String!): Task
    startTask(id: Int!): Task
    stopTask(id: Int!): Task
    deleteTask(id: Int!): Int
    changeTaskName(id: Int!, name: String!): Task
  }
`;

/*
type Task {
    id: Int!
    name: String!
    createdAt: String!
    updatedAt: String!
    taskTimes: [TaskTime]
    duration: Interval
    active: Boolean!
    lastTime: String
    secondsDuration: Float
*/

export default gqlTypeDefs;
