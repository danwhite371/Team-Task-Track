import type { RequestProps, RequestPropsName } from '@/types';
import { dataUtils } from '../data-utils';

const tasks = [
  {
    id: 1,
    name: 'Test 1',
    active: false,
    lastTime: '1749859937940',
    duration: null,
    secondsDuration: null,
    createdAt: '1749859937940',
    updatedAt: '1749859937940',
  },
  {
    id: 2,
    name: 'Test 2',
    active: false,
    lastTime: '1749860245001',
    duration: null,
    secondsDuration: null,
    createdAt: '1749860245001',
    updatedAt: '1749860245001',
  },
  {
    id: 3,
    name: 'Test 3',
    active: false,
    lastTime: '1749860552948',
    duration: null,
    secondsDuration: null,
    createdAt: '1749860552948',
    updatedAt: '1749860552948',
  },
  {
    id: 4,
    name: 'Test 4',
    active: false,
    lastTime: '1749860557254',
    duration: null,
    secondsDuration: null,
    createdAt: '1749860557254',
    updatedAt: '1749860557254',
  },
  {
    id: 5,
    name: 'Test 5',
    active: false,
    lastTime: '1749860561056',
    duration: null,
    secondsDuration: null,
    createdAt: '1749860561056',
    updatedAt: '1749860561056',
  },
  {
    id: 6,
    name: 'Test 6',
    active: false,
    lastTime: '1749860638561',
    duration: null,
    secondsDuration: null,
    createdAt: '1749860638561',
    updatedAt: '1749860638561',
  },
  {
    id: 7,
    name: 'Test 7',
    active: false,
    lastTime: '1749860663966',
    duration: null,
    secondsDuration: null,
    createdAt: '1749860663966',
    updatedAt: '1749860663966',
  },
  {
    id: 8,
    name: 'Test 8',
    active: false,
    lastTime: '1749860667921',
    duration: null,
    secondsDuration: null,
    createdAt: '1749860667921',
    updatedAt: '1749860667921',
  },
  {
    id: 9,
    name: 'Test 9',
    active: false,
    lastTime: '1749860673799',
    duration: null,
    secondsDuration: null,
    createdAt: '1749860673799',
    updatedAt: '1749860673799',
  },
  {
    id: 10,
    name: 'Test 10',
    active: false,
    lastTime: '1749860676682',
    duration: null,
    secondsDuration: null,
    createdAt: '1749860676682',
    updatedAt: '1749860676682',
  },
];

const createResponseData = (name: string, data: unknown) => {
  return {
    data: {
      [name]: data,
    },
  };
};

const createTaskResponse = createResponseData('createTask', tasks[0]);
const { requests } = dataUtils;
const createTaskRequest: RequestPropsName = requests.createTask(tasks[0].name);

const getAllTasksResponse = createResponseData('getAllTasks', tasks);
const getAllTasksRequest: RequestProps = requests.getAllTasks;

export {
  createTaskResponse,
  createTaskRequest,
  getAllTasksResponse,
  getAllTasksRequest,
  tasks,
};
