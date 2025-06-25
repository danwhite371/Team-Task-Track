import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import type { Task } from '@/types';
import { Button } from './ui/button';
import type DataApi from '@/data/data-api';
import TimeTable from './time-table';
import ActiveDuration from './active-duration';
import Duration from './duration'; // import { durationToSecondsDuration } from '@/until';

type TaskTableRowProps = {
  task: Task;
  dataApi: DataApi;
};
function TaskTableRow({ task, dataApi }: TaskTableRowProps) {
  const [showTimes, setShowTimes] = useState<boolean>(false);
  // console.log('task in TaskTableTow', JSON.stringify(task, null, 2));
  return (
    <>
      <TableRow key={task.id} data-testid={task.id}>
        <TableCell onClick={() => setShowTimes((prev) => !prev)}>
          {task.name}
        </TableCell>
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
              onClick={async () => {
                console.log('[TaskTableRow] Start onClick', task.name, task.id);
                await dataApi?.startTask(task.id);
              }}
            >
              Start
            </Button>
          )}
          {task.active && (
            <Button
              variant="destructive"
              size="sm"
              onClick={async () => {
                console.log('[TaskTableRow] Stop onClick', task.name, task.id);
                await dataApi?.stopTask(task.id);
              }}
            >
              Stop
            </Button>
          )}
        </TableCell>
      </TableRow>
      {(task.duration != null || task.active) && showTimes && (
        <TableRow>
          <TableCell className="text-right w-full" colSpan={3}>
            <div className="flex mr-8">
              <TimeTable task={task} dataApi={dataApi} />
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

type TaskTableProps = {
  tasks: Task[];
  dataApi: DataApi | undefined;
};
export default function TaskTable({ tasks, dataApi }: TaskTableProps) {
  if (!dataApi) return;
  return (
    <Table className="w-4xl" data-testid="task-table">
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
          <TaskTableRow key={task.id} task={task} dataApi={dataApi} />
        ))}
      </TableBody>
    </Table>
  );
}
