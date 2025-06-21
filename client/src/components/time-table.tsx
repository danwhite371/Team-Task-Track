import type DataApi from '@/data/data-api';
import type { Task } from '@/types';
import { useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { formatDatetime, timeDuration } from '@/until';
import Duration from './duration';

interface TimeTableProps {
  task: Task;
  dataApi: DataApi;
}

export default function TimeTable({ task, dataApi }: TimeTableProps) {
  useEffect(() => {
    const fetchTaskTimes = async () => {
      await dataApi.fetchTaskTimes(task.id);
      console.log('[TimeTable] task.name', task.name);
    };
    fetchTaskTimes();
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
              <TableCell>{formatDatetime(time.stop!)}</TableCell>
              <TableCell className="text-right">
                {time.secondsDuration && (
                  <Duration
                    duration={timeDuration(time.secondsDuration * 1000)}
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
