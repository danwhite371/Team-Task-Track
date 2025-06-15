import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import DataApi from '../data-api';
import {
  createTaskRequest,
  getAllTasksRequest,
  tasks,
} from '../__fixtures__/test-data';
import mockFetch from '../__mocks__/fetch';
import { CONSTANTS } from '@/constants';
import { dataUtils } from '../data-utils';

const { results } = dataUtils;

global.fetch = mockFetch;
const mockUpdateTaskData = jest.fn();
const mockUpdateOperationResult = jest.fn();
const taskResponse = tasks[0];

// let dataApi: DataApi;

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

function setGetAllTasksMock() {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ data: { getAllTasks: tasks } }),
  });
}

describe('dataApi', () => {
  it('should create a new Task', async () => {
    const dataApi = await DataApi.create(
      mockUpdateTaskData,
      mockUpdateOperationResult
    );
    await dataApi.createNewTask(taskResponse.name);

    expect(global.fetch).toHaveBeenCalledWith(
      CONSTANTS.GRAPHQL_URL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(createTaskRequest),
      })
    );
    expect(mockUpdateTaskData).toHaveBeenCalledWith(
      expect.objectContaining([taskResponse])
    );
    expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining(results.loadingLoading)
    );
    expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining(results.taskLoadingSuccess)
    );
    expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining(results.loadingConnection)
    );
    expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining(results.taskCreatedSuccess)
    );
  });

  it('should call updateOperationResult with an error when the task has an empty name.', async () => {
    const dataApi = await DataApi.create(
      mockUpdateTaskData,
      mockUpdateOperationResult
    );
    await dataApi.createNewTask('');
    createTaskRequest.variables.name = '';
    expect(global.fetch).toHaveBeenCalledWith(
      CONSTANTS.GRAPHQL_URL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(createTaskRequest),
      })
    );

    expect(mockUpdateTaskData).toHaveBeenCalledWith(
      expect.objectContaining([])
    );

    expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining(results.loadingLoading)
    );
    expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining(results.taskLoadingSuccess)
    );
    expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining(results.loadingConnection)
    );
    expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining(results.taskCreatedError)
    );
  });

  it('should get all Tasks from DataApi', async () => {
    setGetAllTasksMock();
    const dataApi = await DataApi.create(
      mockUpdateTaskData,
      mockUpdateOperationResult
    );
    setGetAllTasksMock();
    await dataApi.sendTasks();

    expect(global.fetch).toHaveBeenCalledWith(
      CONSTANTS.GRAPHQL_URL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(getAllTasksRequest),
      })
    );
    expect(mockUpdateTaskData).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining([])
    );
    expect(mockUpdateTaskData).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining(tasks)
    );
    expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining(results.loadingLoading)
    );
    expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining(results.taskLoadingSuccess)
    );
    expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining(results.loadingLoading)
    );
    expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining(results.taskLoadingSuccess)
    );
  });

  it('should return an error when there is no connection to the server, or an internal server error', async () => {
    setFetchToFail();
    await DataApi.create(mockUpdateTaskData, mockUpdateOperationResult);
    console.log('mockUpdateTaskData');

    mockUpdateTaskData.mock.calls.forEach((call, index) => {
      console.log(`Call ${index + 1}:`, call);
    });
    console.log('mockUpdateOperationResult');
    mockUpdateOperationResult.mock.calls.forEach((call, index) => {
      console.log(`Call ${index + 1}:`, call);
    });

    expect(mockUpdateTaskData).not.toHaveBeenCalled();
    expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining(results.loadingLoading)
    );
    expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining(results.failedFetchError)
    );
  });
});
