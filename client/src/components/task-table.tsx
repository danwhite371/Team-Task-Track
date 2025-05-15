import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Task } from '@/types';
import { ActiveDuration, Duration } from './duration';
import { Button } from './ui/button';
import type DataApi from '@/data/dataApi';

type TaskTableProps = {
  tasks: Task[];
  dataApi: DataApi | undefined;
};
export default function TaskTable({ tasks, dataApi }: TaskTableProps) {
  if (!dataApi) return;
  return (
    <Table>
      <TableCaption>Tasks</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Timer</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow>
            <TableCell>{task.name}</TableCell>
            <TableCell>
              {task.active && task.lastTime && (
                <ActiveDuration
                  lastTime={new Date(Number(task.lastTime))}
                  secondsDuration={task.secondsDuration}
                />
              )}
              {!task.active && <Duration duration={task.duration} />}
            </TableCell>
            <TableCell>
              {!task.active && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => dataApi?.startTask(task.id)}
                >
                  Start
                </Button>
              )}
              {task.active && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => dataApi?.stopTask(task.id)}
                >
                  Stop
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
