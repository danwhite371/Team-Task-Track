type Duration = {
  milliseconds: number;
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
  years: number;
};

type TaskTime = {
  id: number;
  start: string;
  stop: string | undefined;
  createdAt: string;
  updatedAt: string;
  taskId: number;
  secondsDuration?: number;
};

type Task = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  taskTimes?: TaskTime[];
  duration?: Duration;
  active: boolean;
  lastTime: string;
  secondsDuration: number;
};

type OperationResultStatus = 'success' | 'error' | 'loading';

type OperationResult = {
  status: OperationResultStatus;
  message: string;
};

interface RequestProps {
  operationName: string;
  query: string;
}

interface RequestPropsName extends RequestProps {
  variables: { name: string };
}
interface RequestPropsTaskId extends RequestProps {
  variables: { taskId: number };
}
interface RequestPropsId extends RequestProps {
  variables: { id: number };
}

interface AppRequests {
  getAllTasks: RequestProps;
  createTask(name: string): RequestPropsName;
  getTaskTimes(taskId: number): RequestPropsTaskId;
  startTask(id: number): RequestPropsId;
  stopTask(id: number): RequestPropsId;
}

type DataUtils = {
  results: {
    [key: string]: OperationResult;
  };
  requests: AppRequests;
};

export type {
  Task,
  TaskTime,
  Duration,
  OperationResult,
  DataUtils,
  RequestPropsName,
  RequestPropsTaskId,
  RequestPropsId,
  RequestProps,
};
