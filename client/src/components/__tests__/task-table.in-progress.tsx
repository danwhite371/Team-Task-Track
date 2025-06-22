import type { Task, TaskTime } from '@/types';
import tasksWithTimesData from './__fixtures__/GetTasksWithTimes.json';

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

console.log(JSON.stringify(tasks, null, 2));
console.log(JSON.stringify(taskTimesData, null, 2));

// In progress
