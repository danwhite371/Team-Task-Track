import type { TaskTime } from '@/types';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { formatDatetime, timeDuration } from '@/util';
import Duration from './duration';
import { useAppData } from '@/contexts/app-data-context';

interface TimeTableProps {
  taskId: number;
}

export default function TimeTable({ taskId }: TimeTableProps) {
  const [taskTimes, setTaskTimes] = useState<TaskTime[]>([]);
  const { fetchTaskTimes } = useAppData();
  useEffect(() => {
    const loadTaskTimes = async () => {
      const taskTimesResult = await fetchTaskTimes(taskId);
      setTaskTimes(taskTimesResult);
      console.log('[TimeTable] taskId', taskId);
    };
    loadTaskTimes();
  }, [taskId]);

  if (!taskTimes || taskTimes.length == 0) return;

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
        {taskTimes &&
          taskTimes.length > 0 &&
          taskTimes.map((time, index) => (
            <TableRow key={time.id} data-testid={`time-${taskId}-${index}`}>
              <TableCell>{formatDatetime(time.start)}</TableCell>
              <TableCell>{formatDatetime(time.stop!)}</TableCell>
              <TableCell className="text-right">
                {time.secondsDuration && <Duration duration={timeDuration(time.secondsDuration * 1000)} />}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
