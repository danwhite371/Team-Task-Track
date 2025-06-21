import {
  cleanup,
  render,
  screen,
  within,
  act,
  waitFor,
} from '@testing-library/react';
import allTasks from '@/__fixtures__/GetAllTasks.json';
import taskTimesData from '@/__fixtures__/GetTaskTimes-91.json';
import taskTimesData92 from '@/__fixtures__/GetTaskTimes-92.json';
import DataApi from '@/data/data-api';
import { dataUtils } from '@/data/data-utils';
import type { Task, TaskTime } from '@/types';
import TimeTable from '../time-table';
import { durationToString, formatDatetime, timeDuration } from '@/until';

const tasks = allTasks as Task[];
const taskTimes = taskTimesData as TaskTime[];
const taskTimes92 = taskTimesData92 as TaskTime[];

global.fetch = jest.fn();
const mockUpdateTaskData = jest.fn();
const mockUpdateOperationResult = jest.fn();
const { results } = dataUtils;

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  cleanup();
});

async function renderTaskTimes(taskId: number, taskTimes: TaskTime[]) {
  const taskData: Task | undefined = tasks.find((task) => task.id === taskId);
  if (taskData == null) throw new Error('taskData is null.');

  jest.spyOn(global, 'fetch').mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ data: { getAllTasks: [taskData] } }),
  } as Response);

  const dataApi = await DataApi.create(
    mockUpdateTaskData,
    mockUpdateOperationResult
  );

  expect(mockUpdateTaskData).toHaveBeenCalledWith(
    expect.objectContaining([taskData])
  );
  expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining(results.loadingLoading)
  );
  expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining(results.taskLoadingSuccess)
  );

  jest.spyOn(global, 'fetch').mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ data: { getTaskTimes: taskTimes } }),
  } as Response);

  jest.clearAllMocks();

  const { rerender } = render(
    <div data-testid="test-div">
      <TimeTable task={taskData} dataApi={dataApi} />
    </div>
  );

  taskData.taskTimes = taskTimes;

  await waitFor(() => {
    expect(mockUpdateTaskData).toHaveBeenCalledWith(
      expect.objectContaining([taskData])
    );
  });

  expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining(results.loadingLoading)
  );
  expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining(results.taskTimesLoadingSuccess)
  );

  await act(async () => {
    rerender(
      <div data-testid="test-div">
        <TimeTable task={taskData} dataApi={dataApi} />
      </div>
    );
  });

  let container = screen.getByTestId('test-div');
  expect(container).toMatchSnapshot();
}

describe('TimeTable', () => {
  it('should Render a TimeTable with active == false', async () => {
    await renderTaskTimes(91, taskTimes);

    const timeRow0 = screen.getByTestId('time-91-0');
    const timeRow1 = screen.getByTestId('time-91-1');
    const cells0 = within(timeRow0).getAllByRole('cell');
    const cells1 = within(timeRow1).getAllByRole('cell');
    expect(cells0[0]).toHaveTextContent(formatDatetime(taskTimes[0].start)!);
    expect(cells0[1]).toHaveTextContent(formatDatetime(taskTimes[0].stop!)!);
    let duration = durationToString(
      timeDuration(taskTimes[0].secondsDuration! * 1000)
    );
    expect(cells0[2]).toHaveTextContent(duration);
    expect(cells1[0]).toHaveTextContent(formatDatetime(taskTimes[1].start)!);
    expect(cells1[1]).toHaveTextContent(formatDatetime(taskTimes[1].stop!)!);
    duration = durationToString(
      timeDuration(taskTimes[1].secondsDuration! * 1000)
    );
    expect(cells1[2]).toHaveTextContent(duration);
  });

  it('should have empty content for stop and duration in the last row of an active Task', async () => {
    await renderTaskTimes(92, taskTimes92);
    const taskTimes = taskTimes92;
    const timeRow0 = screen.getByTestId('time-92-0');
    const timeRow1 = screen.getByTestId('time-92-1');
    const cells0 = within(timeRow0).getAllByRole('cell');
    const cells1 = within(timeRow1).getAllByRole('cell');
    expect(cells0[0]).toHaveTextContent(formatDatetime(taskTimes[0].start)!);
    expect(cells0[1]).toHaveTextContent(formatDatetime(taskTimes[0].stop!)!);
    let duration = durationToString(
      timeDuration(taskTimes[0].secondsDuration! * 1000)
    );
    expect(cells0[2]).toHaveTextContent(duration);
    expect(cells1[0]).toHaveTextContent(formatDatetime(taskTimes[1].start)!);
    expect(cells1[1]).toBeEmptyDOMElement();
    expect(cells1[2]).toBeEmptyDOMElement();
  });
});
