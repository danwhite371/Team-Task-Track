import { useEffect, useState } from 'react';
import './App.css';
import type { Task } from './types';
import NewTaskForm from './components/newTaskForm';
import DataApi from './data/dataApi';
import TaskTimerCard from './components/taskTimerCard';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dataApi, setDataApi] = useState<DataApi>();

  useEffect(() => {
    setDataApi(new DataApi(updateTaskData));
  }, []);

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
          <header className="">Team Task Track</header>
        </div>
      </div>
      <main className="container mx-auto px-4 border-x border-border h-full-20 flex flex-col items-center">
        <NewTaskForm createNewTask={createNewTask} />
        <div>
          {tasks && (
            <div className="flex flex-wrap gap-6 mt-6">
              {tasks.map((task) => (
                <TaskTimerCard key={task.id} task={task} dataApi={dataApi} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
