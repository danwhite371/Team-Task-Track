import { cleanup, render, screen, within, waitFor } from '@testing-library/react';
import { dataUtils } from '@/data/data-utils';
import TimeTable from '../time-table';
import { durationToString, formatDatetime, timeDuration } from '@/util';
import { tasks, allTaskTimes } from '../../data/__tests__/data-test-util';
import mockFetch from '@/data/__mocks__/fetch';
import { AppDataProvider } from '@/contexts/app-data-context';
import { TestComponent } from '@/test-util';

const { results } = dataUtils;
global.fetch = mockFetch;

const mockUpdateTasks = jest.fn();
const mockUpdateOperationResult = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  cleanup();
});

function expectTimeRow(testId: string, cellsData: string[]) {
  console.log('expectTimeRow', testId);
  if (cellsData.length != 3) {
    throw new Error('expectTimeRow cellsData need to have length of 3');
  }
  const timeRow = screen.getByTestId(testId);
  const cells: HTMLTableCellElement[] = within(timeRow).getAllByRole('cell');
  for (const [index, cellData] of cellsData.entries()) {
    if (!cellData) {
      console.log('expectTimeRow', 'empty');
      expect(cells[index]).toBeEmptyDOMElement();
    } else {
      console.log('expectTimeRow', cellData);
      expect(cells[index]).toHaveTextContent(cellData);
    }
  }
}

describe('TimeTable', () => {
  it('should Render a TimeTable with active == false', async () => {
    const taskIdsToTest = [95, 94, 92, 91, 90, 10];
    for (const taskId of taskIdsToTest) {
      const task = tasks.find((t) => t.id === taskId);
      render(
        <AppDataProvider>
          <div data-testid="test-div">
            <TimeTable taskId={taskId} />
            <TestComponent updateTasks={mockUpdateTasks} updateOperationResult={mockUpdateOperationResult} />
          </div>
        </AppDataProvider>
      );
      await waitFor(() => {
        expect(mockUpdateOperationResult).toHaveBeenCalledTimes(2);
        expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(1, expect.objectContaining(results.loadingLoading));
        expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining(results.taskTimesLoadingSuccess)
        );
      });
      const taskTimes = allTaskTimes.filter((tt) => tt.taskId === taskId);
      if (taskTimes && taskTimes.length > 0) {
        console.log('Testing task times');
        if (task?.active == undefined) {
          throw new Error('Task in undefined');
        }
        for (const [index, taskTime] of taskTimes.entries()) {
          if (task.active && index === taskTimes.length - 1) {
            expectTimeRow(`time-${taskId}-${index}`, [formatDatetime(taskTime.start)!, '', '']);
          } else {
            expectTimeRow(`time-${taskId}-${index}`, [
              formatDatetime(taskTime.start)!,
              formatDatetime(taskTime.stop!)!,
              durationToString(timeDuration(taskTime.secondsDuration! * 1000)),
            ]);
          }
        }
      }
      jest.clearAllMocks();
      cleanup();
    }
  });
});
