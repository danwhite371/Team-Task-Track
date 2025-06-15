import { useEffect, useState } from 'react';
import './app.css';
import type { Task, OperationResult } from './types';
import NewTaskForm from './components/new-task-form';
import DataApi from './data/data-api';
import TaskTable from './components/task-table';
import Header from './components/header';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dataApi, setDataApi] = useState<DataApi>();
  const [operationResult, setOperationResult] = useState<OperationResult>();
  const [newTaskToggle, setNewTaskToggle] = useState<boolean>(false);

  useEffect(() => {
    const createDataApi = async () => {
      const dataApi = await DataApi.create(
        updateTaskData,
        updateOperationResult
      );
      setDataApi(dataApi);
    };
    createDataApi();
  }, []);

  useEffect(() => {
    console.log('newTaskToggle', newTaskToggle);
  }, [newTaskToggle]);

  const updateOperationResult = (operationResult: OperationResult) => {
    setOperationResult(operationResult);
  };

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
          <Header
            handleNewTaskToggle={() => setNewTaskToggle((prev) => !prev)}
            operationResult={operationResult}
          />
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
        <div>{tasks && <TaskTable tasks={tasks} dataApi={dataApi} />}</div>
      </main>
    </div>
  );
}

export default App;
