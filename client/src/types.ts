type Duration = {
  milliseconds: number | null;
  seconds: number | null;
  minutes: number | null;
  hours: number | null;
  days: number | null;
  years: number | null;
};

type TaskTime = {
  id: number;
  start: string;
  stop?: string | null;
  secondsDuration?: number | null;
  taskId?: number;
};

type Task = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  taskTimes?: TaskTime[];
  duration?: Duration | null;
  active: boolean;
  lastTime: string;
  secondsDuration: number | null;
};

type OperationResultStatus = 'success' | 'error' | 'loading';

interface OperationResult {
  status: OperationResultStatus;
  message: string;
}

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

interface OperationResultResults {
  loadingLoading: OperationResult;
  taskLoadingSuccess: OperationResult;
  taskTimesLoadingSuccess: OperationResult;
  taskTimesReturnedEmpty: OperationResult;
  loadingConnection: OperationResult;
  taskCreatedSuccess: OperationResult;
  startTaskSuccess: OperationResult;
  stopTaskSuccess: OperationResult;
  taskCreatedError: OperationResult;
  failedFetchError: OperationResult;
}

interface AppDataType {
  getAllTasks(): Promise<void>;
  createNewTask(name: string): Promise<void>;
  startTask(id: number): Promise<void>;
  stopTask(id: number): Promise<void>;
  fetchTaskTimes(taskId: number): Promise<TaskTime[]>;
  tasks: Task[];
  operationResult?: OperationResult;
}

type DataUtils = {
  results: OperationResultResults;
  requests: AppRequests;
};

interface DurationValueType {
  value: number;
  type: string;
}

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
  DurationValueType,
  AppDataType,
};
