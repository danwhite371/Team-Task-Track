import { useEffect, useState } from 'react';
import type DataApi from '../data/dataApi';
import type { Task, TaskTime, Duration } from '../types';
import { nullToZero, formatDatetime, timeDuration } from '../until';
import { Button } from './ui/button';

type TimeRowProps = {
  taskTime: TaskTime;
};
function TimeRow({ taskTime }: TimeRowProps) {
  return (
    <tr key={taskTime.id}>
      <td>{formatDatetime(taskTime.start)}</td>
      <td>{formatDatetime(taskTime.stop)}</td>
      <td>{taskTime.secondsDuration}</td>
    </tr>
  );
}

type ActiveDurationProps = {
  lastTime: Date;
  secondsDuration: number;
};
function ActiveDuration({ lastTime, secondsDuration }: ActiveDurationProps) {
  const [dur, setDur] = useState<number>(
    secondsDuration * 1000 + (new Date().getTime() - lastTime.getTime())
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setDur((prev) => {
        return prev + 1000;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  console.log('[ActiveDuration]', lastTime, secondsDuration);

  return <Duration duration={timeDuration(dur)} />;
}

type DurationValueProps = {
  value: number | null | undefined;
  type: string;
};
function DurationValue({ value, type }: DurationValueProps) {
  if (value == null || value == 0) return;

  return (
    <>
      {value}
      <sup className="font-bold">{type}</sup>
    </>
  );
}

type Duration = {
  milliseconds: number;
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
  years: number;
};

type DurationProps = {
  duration: Duration | undefined;
};
function Duration({ duration }: DurationProps) {
  if (!duration) return;
  return (
    <>
      <DurationValue value={duration.years} type="y" />
      &nbsp;
      <DurationValue value={duration.days} type="d" />
      &nbsp;
      <DurationValue value={duration.hours} type="h" />
      &nbsp;
      <DurationValue value={duration.minutes} type="m" />
      &nbsp;
      <DurationValue value={duration.seconds} type="s" />
      &nbsp;
    </>
  );
}

type TTCProps = {
  task: Task;
  dataApi: DataApi | undefined;
};
export default function TaskTimerCard({ task, dataApi }: TTCProps) {
  return (
    <div className="bg-card text-card-foreground border border-border p-2 rounded-lg min-w-40">
      <div className="text-sm font-medium">{task.name}</div>
      <div className="text-center text-sm font-medium text-card-foreground">
        {task.active && task.lastTime && (
          <ActiveDuration
            lastTime={new Date(Number(task.lastTime))}
            secondsDuration={task.secondsDuration}
          />
        )}
        {!task.active && <Duration duration={task.duration} />}
      </div>
      <div className="text-center">
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
      </div>
    </div>
  );
  /*
  return (
    <div className="card">
      <div>{task.name}</div>
      <div>
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
      </div>
      <div>{nullToZero(task.secondsDuration)}</div>
      {task.taskTimes && task.taskTimes.length > 0 && (
        <div>
          <table>
            <tbody>
              {task.taskTimes?.map((tt) => (
                <TimeRow key={tt.id} taskTime={tt} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
  */
}
