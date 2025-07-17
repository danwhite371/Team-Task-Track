import { render, cleanup, waitFor, screen } from '@testing-library/react';
import { AppDataProvider, useAppData } from '@/contexts/app-data-context';
import mockFetch from '@/data/__mocks__/fetch';
import { TestComponent } from '@/test-util';
import { CONSTANTS } from '@/constants';
import { dataUtils } from '@/data/data-utils';
import { useEffect, useState } from 'react';
import { tasks, allTaskTimes } from '@/data/__tests__/data-test-util';
import type { TaskTime } from '@/types';

global.fetch = mockFetch;

const mockUpdateTasks = jest.fn();
const mockUpdateOperationResult = jest.fn();

const { results, requests } = dataUtils;

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  cleanup();
});

function setFetchToFail() {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status: 500,
    json: () =>
      Promise.resolve({
        errors: [{ message: CONSTANTS.messages.noServerError }],
      }),
  });
}

const TestCreateTask: React.FC<{ name: string }> = ({ name }) => {
  const { createNewTask } = useAppData();
  useEffect(() => {
    async function createTask() {
      await createNewTask(name);
    }
    createTask();
  }, [name]);
  return null;
};

const TestGetAllTasks: React.FC = () => {
  const { getAllTasks } = useAppData();
  useEffect(() => {
    getAllTasks();
  }, []);
  return null;
};

const TestGetTaskTimes: React.FC<{ id: number }> = ({ id }) => {
  const { fetchTaskTimes } = useAppData();
  const [taskTimes, setTaskTimes] = useState<TaskTime[]>();
  useEffect(() => {
    const getTaskTimes = async () => {
      const taskTimes = await fetchTaskTimes(id);
      setTaskTimes(taskTimes);
    };
    getTaskTimes();
  }, []);

  if (!taskTimes) {
    return null;
  } else {
    return (
      <div data-testid="testTaskTimes">
        {taskTimes.map((tt) => (
          <>
            <div data-testid={`tt-${tt.id}-start`}>{tt.start}</div>
            <div data-testid={`tt-${tt.id}-stop`}>{tt.stop}</div>
            <div data-testid={`tt-${tt.id}-dur`}>{tt.secondsDuration}</div>
          </>
        ))}
      </div>
    );
  }
};

const TestStartTask: React.FC<{ id: number }> = ({ id }) => {
  const { startTask } = useAppData();
  useEffect(() => {
    async function doStartTask() {
      await startTask(id);
    }
    doStartTask();
  }, []);
  return null;
};

const TestStopTask: React.FC<{ id: number }> = ({ id }) => {
  const { stopTask } = useAppData();
  useEffect(() => {
    async function doStopTask() {
      await stopTask(id);
    }
    doStopTask();
  }, []);
  return null;
};

describe('appDataContext', () => {
  it('should create a task', async () => {
    const name = 'Context test';
    render(
      <AppDataProvider>
        <TestCreateTask name={name} />
        <TestComponent updateTasks={mockUpdateTasks} updateOperationResult={mockUpdateOperationResult} />
      </AppDataProvider>
    );
    await waitFor(() => {
      expect(mockUpdateTasks).toHaveBeenCalledTimes(1);
      expect(mockUpdateTasks).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ name: name })]));
      expect(mockUpdateOperationResult).toHaveBeenCalledTimes(2);
      expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(1, expect.objectContaining(results.loadingConnection));
      expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(2, expect.objectContaining(results.taskCreatedSuccess));
    });

    expect(global.fetch).toHaveBeenCalledWith(
      CONSTANTS.GRAPHQL_URL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(requests.createTask(name)),
      })
    );
  });

  it('should throw an error if task name is empty', async () => {
    const name = '';
    render(
      <AppDataProvider>
        <TestCreateTask name={name} />
        <TestComponent updateTasks={mockUpdateTasks} updateOperationResult={mockUpdateOperationResult} />
      </AppDataProvider>
    );
    await waitFor(() => {
      expect(mockUpdateOperationResult).toHaveBeenCalledTimes(2);
      expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(1, expect.objectContaining(results.loadingConnection));
      expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(2, expect.objectContaining(results.taskCreatedError));
    });
    expect(mockUpdateTasks).not.toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith(
      CONSTANTS.GRAPHQL_URL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(requests.createTask('')),
      })
    );
  });

  it('should get all tasks', async () => {
    render(
      <AppDataProvider>
        <TestGetAllTasks />
        <TestComponent updateTasks={mockUpdateTasks} updateOperationResult={mockUpdateOperationResult} />
      </AppDataProvider>
    );
    await waitFor(() => {
      expect(mockUpdateTasks).toHaveBeenCalledTimes(1);
      expect(mockUpdateTasks).toHaveBeenCalledWith(tasks);
      expect(mockUpdateOperationResult).toHaveBeenCalledTimes(2);
      expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(1, expect.objectContaining(results.loadingLoading));
      expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(2, expect.objectContaining(results.taskLoadingSuccess));
    });
    expect(global.fetch).toHaveBeenCalledWith(
      CONSTANTS.GRAPHQL_URL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(requests.getAllTasks),
      })
    );
  });

  it('should return an error when there is no connection to the server, or an internal server error', async () => {
    setFetchToFail();
    render(
      <AppDataProvider>
        <TestGetAllTasks />
        <TestComponent updateTasks={mockUpdateTasks} updateOperationResult={mockUpdateOperationResult} />
      </AppDataProvider>
    );
    await waitFor(() => {
      expect(mockUpdateOperationResult).toHaveBeenCalledTimes(2);
      expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(1, expect.objectContaining(results.loadingLoading));
      expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(2, expect.objectContaining(results.failedFetchError));
    });
    expect(mockUpdateTasks).not.toHaveBeenCalled();
  });

  it('should fetch task times', async () => {
    for (const task of tasks) {
      const taskTimes = allTaskTimes.filter((tt) => tt.taskId == task.id);
      if (taskTimes.length == 0) {
        continue;
      }
      render(
        <AppDataProvider>
          <TestGetTaskTimes id={task.id} />
          <TestComponent updateTasks={mockUpdateTasks} updateOperationResult={mockUpdateOperationResult} />
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
      expect(mockUpdateTasks).not.toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith(
        CONSTANTS.GRAPHQL_URL,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requests.getTaskTimes(task.id)),
        })
      );

      for (const taskTime of taskTimes) {
        const start = screen.getByTestId(`tt-${taskTime.id}-start`).textContent;
        const stop = screen.getByTestId(`tt-${taskTime.id}-stop`).textContent;
        const dur = screen.getByTestId(`tt-${taskTime.id}-dur`).textContent;
        expect(start).toBe(taskTime.start);
        if (taskTime.stop === null) {
          expect(stop).toBe('');
        } else {
          expect(stop).toBe(taskTime.stop);
        }
        if (taskTime.secondsDuration === null) {
          expect(dur).toBe('');
        } else {
          expect(Number(dur)).toBe(taskTime.secondsDuration);
        }
      }
      jest.clearAllMocks();
      cleanup();
    }
  });

  it('should return an empty array when getting taskTimes for a task with no taskTimes', async () => {
    const task = tasks.find((t) => t.id === 1);
    if (task == undefined) {
      throw new Error('Task is undefined');
    }
    render(
      <AppDataProvider>
        <TestGetTaskTimes id={task.id} />
        <TestComponent updateTasks={mockUpdateTasks} updateOperationResult={mockUpdateOperationResult} />
      </AppDataProvider>
    );
    await waitFor(() => {
      expect(mockUpdateOperationResult).toHaveBeenCalledTimes(2);
      expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(1, expect.objectContaining(results.loadingLoading));
      expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining(results.taskTimesReturnedEmpty)
      );
    });
    expect(mockUpdateTasks).not.toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith(
      CONSTANTS.GRAPHQL_URL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(requests.getTaskTimes(task.id)),
      })
    );
    const testTaskTimes = screen.queryByTestId('testTaskTimes');
    expect(testTaskTimes).toBeNull();
  });

  it('should start a Task', async () => {
    // Add a get all tasks, or don't check that, because the task isn't changing anyways
    const task = tasks.find((t) => t.id === 85);
    if (task == undefined) {
      throw new Error('Task is undefined');
    }
    render(
      <AppDataProvider>
        <TestStartTask id={task.id} />
        <TestComponent updateTasks={mockUpdateTasks} updateOperationResult={mockUpdateOperationResult} />
      </AppDataProvider>
    );
    await waitFor(() => {
      // I'm not checking mockUpdateTasks because start and stop tasks update
      // existing data, so I would need to call getAllTasks, but then the mock
      // stop and stop tasks return the task unaltered, so there would be no way to check it.
      expect(mockUpdateOperationResult).toHaveBeenCalledTimes(2);
      expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(1, expect.objectContaining(results.loadingConnection));
      expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(2, expect.objectContaining(results.startTaskSuccess));
    });
    expect(global.fetch).toHaveBeenCalledWith(
      CONSTANTS.GRAPHQL_URL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(requests.startTask(task.id)),
      })
    );
  });

  it('should not start a Task with an invalid taskId', async () => {
    const taskId = 500;
    render(
      <AppDataProvider>
        <TestStartTask id={taskId} />
        <TestComponent updateTasks={mockUpdateTasks} updateOperationResult={mockUpdateOperationResult} />
      </AppDataProvider>
    );
    await waitFor(() => {
      expect(mockUpdateOperationResult).toHaveBeenCalledTimes(2);
      expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(1, expect.objectContaining(results.loadingConnection));
      expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ status: 'error', message: `Task was not found for id: ${taskId}` })
      );
    });
    expect(global.fetch).toHaveBeenCalledWith(
      CONSTANTS.GRAPHQL_URL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(requests.startTask(taskId)),
      })
    );
  });

  it('should stop a Task', async () => {
    // Add a get all tasks, or don't check that, because the task isn't changing anyways
    const task = tasks.find((t) => t.id === 95);
    if (task == undefined) {
      throw new Error('Task is undefined');
    }
    render(
      <AppDataProvider>
        <TestStopTask id={task.id} />
        <TestComponent updateTasks={mockUpdateTasks} updateOperationResult={mockUpdateOperationResult} />
      </AppDataProvider>
    );
    await waitFor(() => {
      // I'm not checking mockUpdateTasks because start and stop tasks update
      // existing data, so I would need to call getAllTasks, but then the mock
      // stop and stop tasks return the task unaltered, so there would be no way to check it.
      expect(mockUpdateOperationResult).toHaveBeenCalledTimes(2);
      expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(1, expect.objectContaining(results.loadingConnection));
      expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(2, expect.objectContaining(results.stopTaskSuccess));
    });
    expect(global.fetch).toHaveBeenCalledWith(
      CONSTANTS.GRAPHQL_URL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(requests.stopTask(task.id)),
      })
    );
  });

  it('should not stop a Task with an invalid taskId', async () => {
    const taskId = 500;
    render(
      <AppDataProvider>
        <TestStopTask id={taskId} />
        <TestComponent updateTasks={mockUpdateTasks} updateOperationResult={mockUpdateOperationResult} />
      </AppDataProvider>
    );
    await waitFor(() => {
      expect(mockUpdateOperationResult).toHaveBeenCalledTimes(2);
      expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(1, expect.objectContaining(results.loadingConnection));
      expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ status: 'error', message: `Task was not found for id: ${taskId}` })
      );
    });
    expect(global.fetch).toHaveBeenCalledWith(
      CONSTANTS.GRAPHQL_URL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(requests.stopTask(taskId)),
      })
    );
  });
});
