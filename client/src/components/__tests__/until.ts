import type { Task, TaskTime } from '@/types';
import tasksWithTimesData from './__fixtures__/GetTasksWithTimes.json';

function getTasksAndTaskTimes() {
  const tasks = tasksWithTimesData as Task[];
  const taskTimesData: TaskTime[] = []; // Initialize as an array of TaskTime
  for (const task of tasks) {
    const taskTimes = task.taskTimes;
    if (taskTimes && taskTimes.length > 0) {
      for (const taskTime of taskTimes) {
        taskTime.taskId = task.id;
        taskTimesData.push(taskTime);
        task.taskTimes = [];
      }
    }
  }
  return { tasks, allTaskTimes: taskTimesData };
}

const { tasks, allTaskTimes } = getTasksAndTaskTimes();

export { tasks, allTaskTimes };
