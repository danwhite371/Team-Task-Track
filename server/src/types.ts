type Interval = {
  milliseconds?: number;
  seconds?: number;
  minutes?: number;
  hours?: number;
  days?: number;
  years?: number;
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
  duration?: Interval;
  active: boolean;
  lastTime?: string;
  secondsDuration: number;
};

type DataApi = {
  getAllTasks: () => Promise<Task[]>;
  getTaskTimes: (taskId: number) => Promise<TaskTime[]>;
  createTask: (name: string) => Promise<Task>;
  startTask: (id: number) => Promise<Task>;
  stopTask: (id: number) => Promise<Task>;
  deleteTask: (id: number) => Promise<number>;
  // changeTaskName: (id: number, name: string) => Task;
};

export type { Interval, TaskTime, Task, DataApi };
