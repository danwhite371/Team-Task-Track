import { useState, type ChangeEvent, type FormEvent } from 'react';

type NewTaskFormProps = {
  createNewTask: (name: string) => void;
};
export default function NewTaskForm({ createNewTask }: NewTaskFormProps) {
  const [newTaskName, setNewTaskName] = useState<string>('');

  function newTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (newTaskName && newTaskName.length > 0) {
      createNewTask(newTaskName);
      setNewTaskName('');
    }
  }

  return (
    <form onSubmit={newTask}>
      <label>
        Task
        <input
          type="text"
          required
          minLength={1}
          value={newTaskName}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setNewTaskName(event.target.value)
          }
        />
      </label>
      <button>Submit</button>
    </form>
  );
}
