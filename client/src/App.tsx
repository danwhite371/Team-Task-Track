import { useEffect, useState } from 'react';
import './App.css';
import type { Task } from './types';
import NewTaskForm from './components/newTaskForm';
import DataApi from './data/dataApi';
import TaskTable from './components/task-table';
import { Toggle } from './components/ui/toggle';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dataApi, setDataApi] = useState<DataApi>();
  const [newTaskToggle, setNewTaskToggle] = useState<boolean>(false);

  useEffect(() => {
    setDataApi(new DataApi(updateTaskData));
  }, []);

  useEffect(() => {
    console.log('newTaskToggle', newTaskToggle);
  }, [newTaskToggle]);

  const updateTaskData = (tasks: Task[]) => {
    setTasks(tasks);
  };

  const createNewTask = (name: string) => {
    dataApi?.createNewTask(name);
  };

  return (
    <div className="w-full bg-background text-foreground">
      <div className="w-full border-b border-border">
        <div className="container mx-auto px-4 border-x border-border">
          <header className="h-10 flex items-center justify-between">
            <span className="font-bold text-slate-600 dark:text-slate-300 text-lg">
              Team Task Track
            </span>
            <div>
              <Toggle onClick={() => setNewTaskToggle((prev) => !prev)}>
                New Task
              </Toggle>
            </div>
            <div>Info</div>
          </header>
        </div>
      </div>
      <main className="container mx-auto px-4 border-x border-border h-full-20 max-w-5xl">
        <div
          className={`w-96 mx-auto transition-all duration-500 ease-in-out ${
            newTaskToggle
              ? 'max-h-40 opacity-100'
              : 'overflow-hidden opacity-0 max-h-0'
          }`}
        >
          <NewTaskForm createNewTask={createNewTask} />
        </div>
        {/* <div
          className={`overflow-hidden transition-all duration-100 ease-in-out max-h-40`}
        >
          <NewTaskForm createNewTask={createNewTask} />
        </div> */}
        <div>
          {tasks && <TaskTable tasks={tasks} dataApi={dataApi} />}
          {/* {tasks && (
            <div className="flex flex-wrap gap-6 mt-6">
              {tasks.map((task) => (
                <TaskTimerCard key={task.id} task={task} dataApi={dataApi} />
              ))}
            </div>
          )} */}
        </div>
      </main>
    </div>
  );
}

export default App;
