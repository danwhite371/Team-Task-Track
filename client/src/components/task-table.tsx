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
import type DataApi from '@/data/data_api';
import { useEffect, useState } from 'react';
import { formatDatetime, timeDuration } from '@/until';

type TableRowProps = {
  task: Task;
  dataApi: DataApi;
};
function TimeTable({ task, dataApi }: TableRowProps) {
  useEffect(() => {
    // if (!dataApi) return;
    console.log('[TimeTable] task.name', task.name);
    dataApi.fetchTaskTimes(task.id);
  }, [task]);

  if (!task.taskTimes || task.taskTimes.length == 0) return;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Start</TableHead>
          <TableHead>Stop</TableHead>
          <TableHead>Duration</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {task.taskTimes &&
          task.taskTimes.length > 0 &&
          task.taskTimes.map((time, index) => (
            <TableRow key={time.id} data-testid={`time-${task.id}-${index}`}>
              <TableCell>{formatDatetime(time.start)}</TableCell>
              <TableCell>{formatDatetime(time.stop)}</TableCell>
              <TableCell className="text-right">
                {time.secondsDuration && (
                  <Duration
                    duration={timeDuration(time.secondsDuration * 1000)}
                  />
                )}

                {/* {task.active && task.lastTime && (
                  <ActiveDuration
                    lastTime={new Date(Number(task.lastTime))}
                    secondsDuration={task.secondsDuration}
                  />
                )}
                {!task.active && <Duration duration={task.duration} />} */}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

type TaskTableRowProps = {
  task: Task;
  dataApi: DataApi;
};
function TaskTableRow({ task, dataApi }: TaskTableRowProps) {
  const [showTimes, setShowTimes] = useState<boolean>(false);
  // useEffect(() => {
  //   if (!task.taskTimes || task.taskTimes.length == 0) {
  //     setShowTimes(false);
  //   }
  // }, [task]);
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
              onClick={() => {
                console.log('[TaskTableRow] Start onClick', task.name, task.id);
                dataApi?.startTask(task.id);
              }}
            >
              Start
            </Button>
          )}
          {task.active && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                console.log('[TaskTableRow] Stop onClick', task.name, task.id);
                dataApi?.stopTask(task.id);
              }}
            >
              Stop
            </Button>
          )}
        </TableCell>
      </TableRow>
      {task.duration != null && showTimes && (
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
    <Table className="w-4xl">
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
