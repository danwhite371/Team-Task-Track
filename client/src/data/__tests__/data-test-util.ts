import type { Task, TaskTime } from '@/types';
import tasksWithTimesData from './__fixtures__/GetTasksWithTimesV1.json';
import newTaskData from './__fixtures__/newTaskV1.json';

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

// add a newTask, tasksWithNew
const newTask = newTaskData as Task;
const { tasks, allTaskTimes } = getTasksAndTaskTimes();
const tasksWithNew = [...tasks];
tasksWithNew.unshift(newTask);

export { tasks, allTaskTimes, newTaskData, tasksWithNew };
