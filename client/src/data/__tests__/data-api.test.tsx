import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import DataApi from '../data-api';
import { tasks, newTaskData, tasksWithNew } from './data-test-util';
import mockFetch from '../__mocks__/fetch';
import { CONSTANTS } from '@/constants';
import { dataUtils } from '../data-utils';
import { expectNthCalledWith, logMockCalls } from '@/test-util';

const { results, requests } = dataUtils;

global.fetch = mockFetch;
const mockUpdateTaskData = jest.fn();
const mockUpdateOperationResult = jest.fn();

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
    const dataApi = await DataApi.create(mockUpdateTaskData, mockUpdateOperationResult);
    await dataApi.createNewTask(newTaskData.name);

    expect(global.fetch).toHaveBeenCalledWith(
      CONSTANTS.GRAPHQL_URL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(requests.createTask(newTaskData.name)),
      })
    );

    expectNthCalledWith(mockUpdateTaskData, 2, tasksWithNew);
    expectNthCalledWith(mockUpdateOperationResult, 1, results.loadingLoading);
    expectNthCalledWith(mockUpdateOperationResult, 2, results.taskLoadingSuccess);
    expectNthCalledWith(mockUpdateOperationResult, 3, results.loadingConnection);
    expectNthCalledWith(mockUpdateOperationResult, 4, results.taskCreatedSuccess);
  });

  it('should call updateOperationResult with an error when the task has an empty name.', async () => {
    const dataApi = await DataApi.create(mockUpdateTaskData, mockUpdateOperationResult);
    await dataApi.createNewTask('');
    expect(global.fetch).toHaveBeenCalledWith(
      CONSTANTS.GRAPHQL_URL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(requests.createTask('')),
      })
    );

    expectNthCalledWith(mockUpdateTaskData, 1, []);
    expectNthCalledWith(mockUpdateOperationResult, 1, results.loadingLoading);
    expectNthCalledWith(mockUpdateOperationResult, 2, results.taskLoadingSuccess);
    expectNthCalledWith(mockUpdateOperationResult, 3, results.loadingConnection);
    expectNthCalledWith(mockUpdateOperationResult, 4, results.taskCreatedError);
  });

  it('should get all Tasks from DataApi', async () => {
    setGetAllTasksMock();
    const dataApi = await DataApi.create(mockUpdateTaskData, mockUpdateOperationResult);
    setGetAllTasksMock();
    await dataApi.sendTasks();

    expect(global.fetch).toHaveBeenCalledWith(
      CONSTANTS.GRAPHQL_URL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(requests.getAllTasks),
      })
    );

    logMockCalls(mockUpdateTaskData, 'mockUpdateTaskData: 104');
    logMockCalls(mockUpdateOperationResult, 'mockUpdateOperationResult');

    expectNthCalledWith(mockUpdateTaskData, 1, tasks);
    expectNthCalledWith(mockUpdateTaskData, 2, tasks);
    expectNthCalledWith(mockUpdateOperationResult, 1, results.loadingLoading);
    expectNthCalledWith(mockUpdateOperationResult, 2, results.taskLoadingSuccess);
    expectNthCalledWith(mockUpdateOperationResult, 3, results.loadingLoading);
    expectNthCalledWith(mockUpdateOperationResult, 4, results.taskLoadingSuccess);
  });

  it('should return an error when there is no connection to the server, or an internal server error', async () => {
    setFetchToFail();
    await DataApi.create(mockUpdateTaskData, mockUpdateOperationResult);
    expect(mockUpdateTaskData).not.toHaveBeenCalled();
    expectNthCalledWith(mockUpdateOperationResult, 1, results.loadingLoading);
    expectNthCalledWith(mockUpdateOperationResult, 2, results.failedFetchError);
  });
});
