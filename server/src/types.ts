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
  getAllTasks: () => Promise<Task[] | null>;
  getTask: (id: number) => Promise<Task | null>;
  getTaskTimes: (taskId: number) => Promise<TaskTime[] | null>;
  createTask: (name: string) => Promise<Task | null>;
  startTask: (id: number) => Promise<Task | null>;
  stopTask: (id: number) => Promise<Task | null>;
  deleteTask: (id: number) => Promise<number | null>;
  changeTaskName: (id: number, name: string) => Promise<Task | null>;
};

export type { Interval, TaskTime, Task, DataApi };
