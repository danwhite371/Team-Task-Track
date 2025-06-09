import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

type NewTaskFormProps = {
  createNewTask: (name: string) => void;
};
export default function NewTaskForm({ createNewTask }: NewTaskFormProps) {
  const [newTaskName, setNewTaskName] = useState<string>('');
  const [validationError, setValidationError] = useState<boolean>(false);

  function newTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError(false);
    if (newTaskName && newTaskName.length > 0) {
      createNewTask(newTaskName);
      setNewTaskName('');
    } else {
      setValidationError(true);
    }
  }

  return (
    <form className="mt-2" onSubmit={newTask}>
      <Card className="gap-2">
        <CardContent className="flex flex-col gap-y-2">
          <div
            className={`flex ${
              validationError ? 'justify-between' : 'justify-start'
            }`}
          >
            <Label htmlFor="taskNameInput">Task name</Label>
            {validationError && (
              <Label className="text-destructive">Task name required</Label>
            )}
          </div>

          <Input
            id="taskNameInput"
            type="text"
            value={newTaskName}
            placeholder="New task name"
            autoComplete="off"
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
