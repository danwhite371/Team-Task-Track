import type DataApi from '../data/dataApi';
import type { Task, TaskTime } from '../types';
import { nullToZero, formatDatetime } from '../until';

type TimeRowProps = {
  taskTime: TaskTime;
};
function TimeRow({ taskTime }: TimeRowProps) {
  console.log('TimeRow', taskTime.id);
  return (
    <tr key={taskTime.id}>
      <td>{formatDatetime(taskTime.start)}</td>
      <td>{formatDatetime(taskTime.stop)}</td>
      <td>{taskTime.secondsDuration}</td>
    </tr>
  );
}

type TTCProps = {
  task: Task;
  dataApi: DataApi | undefined;
};
export default function TaskTimerCard({ task, dataApi }: TTCProps) {
  return (
    <div className="card">
      <div>{task.name}</div>
      <div>
        {!task.active && (
          <button onClick={() => dataApi?.startTask(task.id)} className="mv">
            Start
          </button>
        )}
        {task.active && (
          <button onClick={() => dataApi?.stopTask(task.id)} className="mv">
            Stop
          </button>
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
}
