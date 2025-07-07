import { useEffect, useState } from 'react';
import './app.css';
import NewTaskForm from './components/new-task-form';
import TaskTable from './components/task-table';
import Header from './components/header';

function App() {
  const [newTaskToggle, setNewTaskToggle] = useState<boolean>(false);

  useEffect(() => {
    console.log('newTaskToggle', newTaskToggle);
  }, [newTaskToggle]);

  return (
    <div className="w-full bg-background text-foreground">
      <div className="w-full border-b border-border">
        <div className="container mx-auto px-4 border-x border-border">
          <Header handleNewTaskToggle={() => setNewTaskToggle((prev) => !prev)} />
        </div>
      </div>
      <main className="container mx-auto px-4 border-x border-border h-full-20 max-w-5xl">
        <div
          className={`w-96 mx-auto transition-all duration-500 ease-in-out ${
            newTaskToggle ? 'max-h-40 opacity-100' : 'overflow-hidden opacity-0 max-h-0'
          }`}
        >
          <NewTaskForm />
        </div>
        <div>
          <TaskTable />
        </div>
      </main>
    </div>
  );
}

export default App;
