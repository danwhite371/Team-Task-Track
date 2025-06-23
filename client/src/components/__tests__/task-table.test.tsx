import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import TaskTable from '../task-table';
import { tasks, allTaskTimes } from './until';
import DataApi from '@/data/data-api';
import mockFetch from '../__mocks__/fetch';
import { dataUtils } from '@/data/data-utils';

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
  it('should render a tak table', async () => {
    const dataApi = await DataApi.create(
      mockUpdateTaskData,
      mockUpdateOperationResult
    );
    const { rerender } = render(<TaskTable tasks={tasks} dataApi={dataApi} />);
    await waitFor(() => {
      expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining(results.taskLoadingSuccess)
      );
    });
    jest.clearAllMocks();

    for (const task of tasks) {
      const row = screen.getByTestId(`${task.id}`);
      const cells = within(row).getAllByRole('cell');
      expect(cells[0]).toHaveTextContent(task.name);
      if (task.active) {
        const button = within(row).queryByRole('button', { name: /stop/i });
        expect(button).not.toBeNull();
        act(() => {
          fireEvent.click(button!);
          // console.log('after fireEvent Click');
        });
        // console.log('after act');
        await waitFor(() => {
          expect(mockUpdateOperationResult).toHaveBeenLastCalledWith(
            expect.objectContaining(results.stopTaskSuccess)
          );
          // console.log('after expect(mockUpdateOperationResult)');
        });
        jest.clearAllMocks();
      } else {
        const button = within(row).queryByRole('button', { name: /start/i });
        expect(button).not.toBeNull();
        act(() => {
          fireEvent.click(button!);
          // console.log('after fireEvent Click');
        });
        // console.log('after act');
        await waitFor(() => {
          expect(mockUpdateOperationResult).toHaveBeenLastCalledWith(
            expect.objectContaining(results.startTaskSuccess)
          );
          // console.log('after expect(mockUpdateOperationResult)');
        });
        jest.clearAllMocks();
      }
      if (task.active || task.duration) {
        expect(cells[1]).not.toBeEmptyDOMElement();
        const taskTimes = allTaskTimes.filter((tt) => tt.taskId == task.id);
        if (!taskTimes)
          throw new Error(`expected taskTimes not found for taskId ${task.id}`);
        task.taskTimes = taskTimes;
        act(() => {
          fireEvent.click(cells[0]);
        });

        await waitFor(() => {
          expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining(results.taskTimesLoadingSuccess)
          );
        });

        rerender(<TaskTable tasks={tasks} dataApi={dataApi} />);

        const timeTestId = `time-${task.id}-${taskTimes.length - 1}`;
        console.log('timeTestId', timeTestId);
        const lastRow = await screen.findByTestId(timeTestId);
        const rowCells = within(lastRow).getAllByRole('cell');
        expect(rowCells[0]).not.toBeEmptyDOMElement();
        jest.clearAllMocks();
      } else {
        expect(cells[1]).toBeEmptyDOMElement();
      }
    }
  });
});
