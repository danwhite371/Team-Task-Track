import { render, cleanup, waitFor } from '@testing-library/react';
import { AppDataProvider, useAppData } from '@/contexts/app-data-context';
import mockFetch from '@/data/__mocks__/fetch';
import { TestComponent } from '@/test-util';
import { CONSTANTS } from '@/constants';
import { dataUtils } from '@/data/data-utils';
import { useEffect } from 'react';
import { tasks } from '@/data/__tests__/data-test-util';

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
});
