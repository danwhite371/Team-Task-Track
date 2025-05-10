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
    <div className="flex-col-center">
      <div className="mb mt">
        <NewTaskForm createNewTask={createNewTask} />
      </div>
      {tasks && (
        <div className="flex">
          {tasks.map((task) => (
            <TaskTimerCard key={task.id} task={task} dataApi={dataApi} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
