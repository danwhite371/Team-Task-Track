import { cleanup, render, screen, within, act, waitFor } from '@testing-library/react';
import DataApi from '@/data/data-api';
import { dataUtils } from '@/data/data-utils';
import type { Task, TaskTime } from '@/types';
import TimeTable from '../time-table';
import { durationToString, formatDatetime, timeDuration } from '@/util';
import { tasks, allTaskTimes } from '../../data/__tests__/data-test-util';
import { expectNthCalledWith } from '@/test-util';

// Not using the mocked fetch, because tasks return after loading times for that task
// will be differ from what is return by the mocked fetch.
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

  const dataApi = await DataApi.create(mockUpdateTaskData, mockUpdateOperationResult);

  await waitFor(() => {
    expectNthCalledWith(mockUpdateTaskData, 1, [taskData]);
  });
  expectNthCalledWith(mockUpdateOperationResult, 1, results.loadingLoading);
  expectNthCalledWith(mockUpdateOperationResult, 2, results.taskLoadingSuccess);

  jest.clearAllMocks();

  jest.spyOn(global, 'fetch').mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ data: { getTaskTimes: taskTimes } }),
  } as Response);

  const newTaskData = JSON.parse(JSON.stringify(taskData));
  newTaskData.taskTimes = taskTimes;
  const { rerender } = render(
    <div data-testid="test-div">
      <TimeTable task={taskData} dataApi={dataApi} />
    </div>
  );

  await waitFor(() => {
    expectNthCalledWith(mockUpdateTaskData, 1, [newTaskData]);
  });

  expectNthCalledWith(mockUpdateOperationResult, 1, results.loadingLoading);
  expectNthCalledWith(mockUpdateOperationResult, 2, results.taskTimesLoadingSuccess);

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

function expectTimeRow(testId: string, cellsData: string[]) {
  if (cellsData.length != 3) {
    throw new Error('expectTimeRow cellsData need to have length of 3');
  }
  const timeRow = screen.getByTestId(testId);
  const cells: HTMLTableCellElement[] = within(timeRow).getAllByRole('cell');
  for (const [index, cellData] of cellsData.entries()) {
    if (!cellData) {
      expect(cells[index]).toBeEmptyDOMElement();
    } else {
      expect(cells[index]).toHaveTextContent(cellData);
    }
  }
}

describe('TimeTable', () => {
  it('should Render a TimeTable with active == false', async () => {
    const taskTimes91 = allTaskTimes.filter((tt) => tt.taskId === 91);
    await renderTaskTimes(91, taskTimes91);

    expectTimeRow('time-91-0', [
      formatDatetime(taskTimes91[0].start)!,
      formatDatetime(taskTimes91[0].stop!)!,
      durationToString(timeDuration(taskTimes91[0].secondsDuration! * 1000)),
    ]);

    expectTimeRow('time-91-1', [
      formatDatetime(taskTimes91[1].start)!,
      formatDatetime(taskTimes91[1].stop!)!,
      durationToString(timeDuration(taskTimes91[1].secondsDuration! * 1000)),
    ]);
  });

  it('should have empty content for stop and duration in the last row of an active Task', async () => {
    const taskTimes92 = allTaskTimes.filter((tt) => tt.taskId === 92);
    await renderTaskTimes(92, taskTimes92);

    expectTimeRow('time-92-0', [
      formatDatetime(taskTimes92[0].start)!,
      formatDatetime(taskTimes92[0].stop!)!,
      durationToString(timeDuration(taskTimes92[0].secondsDuration! * 1000)),
    ]);

    expectTimeRow('time-92-1', [formatDatetime(taskTimes92[1].start)!, '', '']);
  });
});
