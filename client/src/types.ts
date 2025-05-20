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

export type { Task, TaskTime, Duration };
