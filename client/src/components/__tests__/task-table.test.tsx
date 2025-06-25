import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import TaskTable from '../task-table';
import { tasks, allTaskTimes } from '../../data/__tests__/data-test-util';
import DataApi from '@/data/data-api';
import mockFetch from '../../data/__mocks__/fetch';
import { dataUtils } from '@/data/data-utils';
import { expectNthCalledWith } from '@/test-util';

const { results } = dataUtils;
global.fetch = mockFetch;

const mockUpdateTaskData = jest.fn();
const mockUpdateOperationResult = jest.fn();

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
});

afterEach(() => {
  jest.useRealTimers();
  cleanup();
});

describe('TaskTable', () => {
  it('should render a task table', async () => {
    const DURATION = 1;
    const NAME = 0;
    const START_TIME = 0;
    const dataApi = await DataApi.create(mockUpdateTaskData, mockUpdateOperationResult);
    expect(tasks).toMatchSnapshot();
    const { rerender } = render(<TaskTable tasks={tasks} dataApi={dataApi} />);
    await waitFor(() => {
      expectNthCalledWith(mockUpdateOperationResult, 2, results.taskLoadingSuccess);
    });
    jest.clearAllMocks();

    for (const task of tasks) {
      const row = screen.getByTestId(`${task.id}`);
      const cells = within(row).getAllByRole('cell');
      expect(cells[NAME]).toHaveTextContent(task.name);
      if (task.active) {
        // check that the stop button is clicked and that fetch is called
        const button = within(row).queryByRole('button', { name: /stop/i });
        expect(button).not.toBeNull();
        act(() => {
          fireEvent.click(button!);
        });
        await waitFor(() => {
          expectNthCalledWith(mockUpdateOperationResult, 2, results.stopTaskSuccess);
        });
        jest.clearAllMocks();
      } else {
        // check that the start button is clicked and that fetch is called
        const button = within(row).queryByRole('button', { name: /start/i });
        expect(button).not.toBeNull();
        act(() => {
          fireEvent.click(button!);
        });
        await waitFor(() => {
          expectNthCalledWith(mockUpdateOperationResult, 2, results.startTaskSuccess);
        });
        jest.clearAllMocks();
      }
      // if we have at least one task time row for this task
      if (task.active || task.duration) {
        expect(cells[DURATION]).not.toBeEmptyDOMElement();
        // if we don't have task times for this task, throw an error
        // then click on task name to load time times
        const taskTimes = allTaskTimes.filter((tt) => tt.taskId == task.id);
        if (!taskTimes) throw new Error(`expected taskTimes not found for taskId ${task.id}`);
        task.taskTimes = taskTimes;
        act(() => {
          fireEvent.click(cells[NAME]);
        });

        await waitFor(() => {
          expectNthCalledWith(mockUpdateOperationResult, 2, results.taskTimesLoadingSuccess);
        });
        // logMockCalls(mockUpdateOperationResult, 'mockUpdateOperationResult: line 63');
        rerender(<TaskTable tasks={tasks} dataApi={dataApi} />);
        // check that we have a start time for each task time row
        const timeTestId = `time-${task.id}-${taskTimes.length - 1}`;
        console.log('timeTestId', timeTestId);
        const lastRow = await screen.findByTestId(timeTestId);
        const rowCells = within(lastRow).getAllByRole('cell');
        expect(rowCells[START_TIME]).not.toBeEmptyDOMElement();
        jest.clearAllMocks();
      } else {
        // This task should have no duration
        expect(cells[DURATION]).toBeEmptyDOMElement();
      }
    }
  }, 10000);
});
