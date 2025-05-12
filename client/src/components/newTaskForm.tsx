import { useState, type ChangeEvent, type FormEvent } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

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
      <Card className="gap-2">
        <CardContent className="flex flex-col gap-y-2">
          <Label htmlFor="taskNameInput">Task name </Label>

          <Input
            id="taskNameInput"
            type="text"
            required
            minLength={1}
            value={newTaskName}
            placeholder="New task name"
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setNewTaskName(event.target.value)
            }
          />
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit">Submit</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
